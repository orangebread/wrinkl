import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export async function init(options) {
  logger.header('AI Ledger - Context System Setup');

  // Check if already initialized
  if (fs.existsSync(config.paths.aiDir)) {
    logger.warning('AI context system is already initialized in this directory.');
    const response = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Do you want to overwrite the existing configuration?',
      initial: false
    });

    if (!response.overwrite) {
      logger.info('Initialization cancelled.');
      return;
    }
  }

  // Gather missing information through prompts
  const promptAnswers = {};

  // Only ask for project name if not provided
  if (!options.name) {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: path.basename(process.cwd()),
      validate: value => value.length > 0 || 'Project name is required'
    });
    promptAnswers.projectName = response.projectName;
  }

  // Only ask for project type if not provided
  if (!options.type) {
    const response = await prompts({
      type: 'text',
      name: 'projectType',
      message: 'Project type:',
      initial: config.defaults.projectType
    });
    promptAnswers.projectType = response.projectType;
  }

  // Only ask for stack if not provided
  if (!options.stack) {
    const response = await prompts({
      type: 'text',
      name: 'stack',
      message: 'Technology stack:',
      initial: config.defaults.stack
    });
    promptAnswers.stack = response.stack;
  }

  // Check if cursor option was explicitly provided
  const cursorOptionProvided = 'cursor' in options;
  if (!cursorOptionProvided) {
    const response = await prompts({
      type: 'confirm',
      name: 'cursorrules',
      message: 'Create .cursorrules file?',
      initial: true
    });
    promptAnswers.cursorrules = response.cursorrules;
  }

  // Check if augment option was explicitly provided
  if (!options.withAugment) {
    const response = await prompts({
      type: 'confirm',
      name: 'augment',
      message: 'Create augment.md file?',
      initial: config.defaults.createAugment
    });
    promptAnswers.augment = response.augment;
  }

  // Check if copilot option was explicitly provided
  if (!options.withCopilot) {
    const response = await prompts({
      type: 'confirm',
      name: 'copilot',
      message: 'Create GitHub Copilot instructions?',
      initial: config.defaults.createCopilot
    });
    promptAnswers.copilot = response.copilot;
  }

  // Combine provided options with prompted answers
  const answers = {
    projectName: options.name || promptAnswers.projectName,
    projectType: options.type || promptAnswers.projectType,
    stack: options.stack || promptAnswers.stack,
    cursorrules: cursorOptionProvided ? options.cursor : promptAnswers.cursorrules,
    augment: options.withAugment || promptAnswers.augment || false,
    copilot: options.withCopilot || promptAnswers.copilot || false
  };

  console.log('Creating AI context structure...');

  try {
    // Create directory structure using synchronous operations
    fs.mkdirSync(config.paths.archivedDir, { recursive: true });

    // Copy templates with variable substitution
    const templateDir = config.paths.templatesDir;
    
    // Copy AI directory templates
    copyTemplate(
      path.join(templateDir, 'ai/README.md'),
      path.join(config.paths.aiDir, 'README.md')
    );

    copyTemplate(
      path.join(templateDir, 'ai/project.md'),
      path.join(config.paths.aiDir, 'project.md'),
      {
        PROJECT_NAME: answers.projectName,
        PROJECT_TYPE: answers.projectType,
        STACK: answers.stack,
        DATE: config.getCurrentDate()
      }
    );

    copyTemplate(
      path.join(templateDir, 'ai/patterns.md'),
      path.join(config.paths.aiDir, 'patterns.md')
    );

    copyTemplate(
      path.join(templateDir, 'ai/architecture.md'),
      path.join(config.paths.aiDir, 'architecture.md')
    );

    copyTemplate(
      path.join(templateDir, 'ai/context-rules.md'),
      path.join(config.paths.aiDir, 'context-rules.md')
    );

    // Copy ledger templates
    copyTemplate(
      path.join(templateDir, 'ledgers/_template.md'),
      config.paths.templateFile
    );

    copyTemplate(
      path.join(templateDir, 'ledgers/_active.md'),
      config.paths.activeFile,
      { DATE: config.getCurrentDate() }
    );

    // Copy optional files
    if (answers.cursorrules) {
      copyTemplate(
        path.join(templateDir, 'cursorrules.md'),
        '.cursorrules'
      );
    }

    if (answers.augment) {
      copyTemplate(
        path.join(templateDir, 'augment.md'),
        'augment.md'
      );
    }

    if (answers.copilot) {
      fs.mkdirSync('.github', { recursive: true });
      copyTemplate(
        path.join(templateDir, 'copilot-instructions.md'),
        '.github/copilot-instructions.md'
      );
    }

    logger.success('AI context system initialized!');

    // Print next steps
    logger.success('Setup complete!');
    console.log(chalk.yellow('\nNext steps:'));
    logger.step(1, 'Review and customize .ai/project.md');
    logger.step(2, 'Add project-specific patterns to .ai/patterns.md');
    logger.step(3, 'Create your first feature ledger:');
    logger.code('wrinkl feature my-first-feature');
    logger.step(4, 'Start coding with AI assistance!');
    
  } catch (error) {
    logger.error('Failed to initialize AI context system');
    logger.error(error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

function copyTemplate(src, dest, variables = {}) {
  // Check if source file exists
  if (!fs.existsSync(src)) {
    throw new Error(`Template file not found: ${src}`);
  }

  let content = fs.readFileSync(src, 'utf-8');

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });

  // Ensure destination directory exists
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });

  // Write the file
  fs.writeFileSync(dest, content);
}
