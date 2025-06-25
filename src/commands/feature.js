import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export async function createFeature(name, options) {
  // Check if .ai directory exists
  if (!await config.isInitialized()) {
    logger.error('No .ai directory found. Run "wrinkl init" first.');
    process.exit(1);
  }
  
  // Validate feature name
  const nameError = config.validateFeatureName(name);
  if (nameError) {
    logger.error(nameError);
    process.exit(1);
  }
  
  const kebabName = config.toKebabCase(name);
  const ledgerPath = path.join(config.paths.ledgersDir, `${kebabName}.md`);
  
  // Check if ledger already exists
  if (await fs.pathExists(ledgerPath)) {
    logger.error(`Feature ledger "${kebabName}" already exists.`);
    process.exit(1);
  }
  
  // Get additional information
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'summary',
      message: 'Feature summary (1-2 sentences):',
      validate: input => input.length > 0 || 'Summary is required'
    },
    {
      type: 'input',
      name: 'owner',
      message: 'Owner:',
      default: options.owner || config.defaults.owner
    }
  ]);
  
  try {
    // Read template
    const template = await fs.readFile(config.paths.templateFile, 'utf-8');
    
    // Replace placeholders
    const content = template
      .replace(/\[Feature Name\]/g, name)
      .replace('feat/feature-name', `feat/${kebabName}`)
      .replace('[1-2 sentences: what this does and why it\'s needed]', answers.summary)
      .replace(/\[Human \| AI \| Pair\]/g, answers.owner)
      .replace(/YYYY-MM-DD/g, config.getCurrentDate());
    
    // Write ledger
    await fs.outputFile(ledgerPath, content);
    
    // Update _active.md
    await updateActiveFile(kebabName, answers.summary);
    
    logger.success(`Created feature ledger: ${ledgerPath}`);
    console.log(chalk.yellow('\nTo start working on this feature:'));
    logger.step(1, 'Move it to "In Progress" in .ai/ledgers/_active.md');
    logger.step(2, `Reference it in your AI prompts: "Working on ${kebabName} feature"`);
    
  } catch (error) {
    logger.error(`Failed to create feature ledger: ${error.message}`);
    process.exit(1);
  }
}

async function updateActiveFile(kebabName, summary) {
  const activePath = config.paths.activeFile;
  
  if (!await fs.pathExists(activePath)) {
    logger.warning('_active.md file not found. Feature created but not added to active list.');
    return;
  }
  
  let activeContent = await fs.readFile(activePath, 'utf-8');
  
  // Add to up next section
  const upNextMarker = '## 🔴 Up Next (Priority Order)';
  const upNextIndex = activeContent.indexOf(upNextMarker);
  
  if (upNextIndex !== -1) {
    const nextLineIndex = activeContent.indexOf('\n', upNextIndex) + 1;
    const beforeUpNext = activeContent.slice(0, nextLineIndex);
    const afterUpNext = activeContent.slice(nextLineIndex);
    
    activeContent = beforeUpNext + 
      `1. **[${kebabName}](${kebabName}.md)** - ${summary}\n` +
      afterUpNext;
    
    await fs.writeFile(activePath, activeContent);
    logger.info('Added feature to _active.md');
  } else {
    logger.warning('Could not find "Up Next" section in _active.md. Feature created but not added to active list.');
  }
}
