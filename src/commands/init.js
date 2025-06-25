import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function init(options) {
  logger.header('AI Ledger - Context System Setup');

  // Check if already initialized
  if (await config.isInitialized()) {
    logger.warning('AI context system is already initialized in this directory.');
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: 'Do you want to overwrite the existing configuration?',
      default: false
    }]);
    
    if (!overwrite) {
      logger.info('Initialization cancelled.');
      return;
    }
  }

  // Gather project information
  const questions = [];

  // Only ask for project name if not provided
  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: path.basename(process.cwd()),
      validate: input => input.length > 0 || 'Project name is required'
    });
  }

  // Only ask for project type if not provided
  if (!options.type) {
    questions.push({
      type: 'input',
      name: 'projectType',
      message: 'Project type:',
      default: config.defaults.projectType
    });
  }

  // Only ask for stack if not provided
  if (!options.stack) {
    questions.push({
      type: 'input',
      name: 'stack',
      message: 'Technology stack:',
      default: config.defaults.stack
    });
  }

  // Fix: Check if cursor option was explicitly provided
  // Commander.js sets cursor to false for --no-cursor, true for --cursor, undefined if not specified
  const cursorOptionProvided = 'cursor' in options;
  if (!cursorOptionProvided) {
    questions.push({
      type: 'confirm',
      name: 'cursorrules',
      message: 'Create .cursorrules file?',
      default: true
    });
  }

  // Fix: Check if augment option was explicitly provided
  const augmentOptionProvided = options.withAugment === true;
  if (!augmentOptionProvided) {
    questions.push({
      type: 'confirm',
      name: 'augment',
      message: 'Create augment.md file?',
      default: config.defaults.createAugment
    });
  }

  // Fix: Check if copilot option was explicitly provided
  const copilotOptionProvided = options.withCopilot === true;
  if (!copilotOptionProvided) {
    questions.push({
      type: 'confirm',
      name: 'copilot',
      message: 'Create GitHub Copilot instructions?',
      default: config.defaults.createCopilot
    });
  }

  const promptAnswers = await inquirer.prompt(questions);

  // Combine provided options with prompted answers
  const answers = {
    projectName: options.name || promptAnswers.projectName,
    projectType: options.type || promptAnswers.projectType,
    stack: options.stack || promptAnswers.stack,
    cursorrules: cursorOptionProvided ? options.cursor : promptAnswers.cursorrules,
    augment: options.withAugment || promptAnswers.augment || false,
    copilot: options.withCopilot || promptAnswers.copilot || false
  };

  const spinner = ora('Creating AI context structure...').start();

  try {
    // Create directory structure
    await fs.ensureDir(config.paths.archivedDir);
    
    // Copy templates with variable substitution
    const templateDir = config.paths.templatesDir;
    
    // Copy AI directory templates
    await copyTemplate(
      path.join(templateDir, 'ai/README.md'),
      path.join(config.paths.aiDir, 'README.md')
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/project.md'),
      path.join(config.paths.aiDir, 'project.md'),
      {
        PROJECT_NAME: answers.projectName,
        PROJECT_TYPE: answers.projectType,
        STACK: answers.stack,
        DATE: config.getCurrentDate()
      }
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/patterns.md'),
      path.join(config.paths.aiDir, 'patterns.md')
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/architecture.md'),
      path.join(config.paths.aiDir, 'architecture.md')
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/context-rules.md'),
      path.join(config.paths.aiDir, 'context-rules.md')
    );
    
    // Copy ledger templates
    await copyTemplate(
      path.join(templateDir, 'ledgers/_template.md'),
      config.paths.templateFile
    );
    
    await copyTemplate(
      path.join(templateDir, 'ledgers/_active.md'),
      config.paths.activeFile,
      { DATE: config.getCurrentDate() }
    );
    
    // Copy optional files
    if (answers.cursorrules) {
      await copyTemplate(
        path.join(templateDir, 'cursorrules.md'),
        '.cursorrules'
      );
    }
    
    if (answers.augment) {
      await copyTemplate(
        path.join(templateDir, 'augment.md'),
        'augment.md'
      );
    }
    
    if (answers.copilot) {
      await fs.ensureDir('.github');
      await copyTemplate(
        path.join(templateDir, 'copilot-instructions.md'),
        '.github/copilot-instructions.md'
      );
    }
    
    spinner.succeed('AI context system initialized!');
    
    // Print next steps
    logger.success('Setup complete!');
    console.log(chalk.yellow('\nNext steps:'));
    logger.step(1, 'Review and customize .ai/project.md');
    logger.step(2, 'Add project-specific patterns to .ai/patterns.md');
    logger.step(3, 'Create your first feature ledger:');
    logger.code('wrinkl feature my-first-feature');
    logger.step(4, 'Start coding with AI assistance!');
    
  } catch (error) {
    spinner.fail('Failed to initialize AI context system');
    logger.error(error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

async function copyTemplate(src, dest, variables = {}) {
  // Check if source file exists
  if (!await fs.pathExists(src)) {
    throw new Error(`Template file not found: ${src}`);
  }
  
  let content = await fs.readFile(src, 'utf-8');
  
  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });
  
  await fs.outputFile(dest, content);
}
