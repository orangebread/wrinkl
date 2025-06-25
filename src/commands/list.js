import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export async function listFeatures(options) {
  // Check if .ai directory exists
  if (!config.isInitialized()) {
    logger.error('No .ai directory found. Run "wrinkl init" first.');
    process.exit(1);
  }
  
  try {
    logger.header('Feature Ledgers');

    // List active features
    listActiveFeatures();

    // List archived features if requested
    if (options.all) {
      console.log(); // Add spacing
      listArchivedFeatures();
    }
    
  } catch (error) {
    logger.error(`Failed to list features: ${error.message}`);
    process.exit(1);
  }
}

function listActiveFeatures() {
  const ledgersDir = config.paths.ledgersDir;

  if (!fs.existsSync(ledgersDir)) {
    logger.warning('No ledgers directory found.');
    return;
  }

  const files = fs.readdirSync(ledgersDir);
  const ledgerFiles = files.filter(file => 
    file.endsWith('.md') && 
    !file.startsWith('_') && 
    file !== 'archived'
  );
  
  if (ledgerFiles.length === 0) {
    console.log(chalk.gray('No active feature ledgers found.'));
    console.log(chalk.yellow('Create your first feature with: wrinkl feature my-feature'));
    return;
  }
  
  console.log(chalk.blue.bold('📋 Active Features:'));
  
  for (const file of ledgerFiles.sort()) {
    const filePath = path.join(ledgersDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract feature info from the markdown
    const nameMatch = content.match(/# (.+)/);
    const summaryMatch = content.match(/\*\*Summary:\*\* (.+)/);
    const statusMatch = content.match(/\*\*Status:\*\* (.+)/);

    const featureName = nameMatch ? nameMatch[1] : file.replace('.md', '');
    const summary = summaryMatch ? summaryMatch[1] : 'No summary available';
    const status = statusMatch ? statusMatch[1] : 'Unknown';
    
    // Color code by status
    let statusColor = chalk.gray;
    if (status.includes('In Progress')) statusColor = chalk.yellow;
    if (status.includes('Complete')) statusColor = chalk.green;
    if (status.includes('Blocked')) statusColor = chalk.red;
    
    console.log(`\n${chalk.cyan('•')} ${chalk.bold(featureName)}`);
    console.log(`  ${chalk.gray('File:')} ${file}`);
    console.log(`  ${chalk.gray('Summary:')} ${summary}`);
    console.log(`  ${chalk.gray('Status:')} ${statusColor(status)}`);
  }
}

function listArchivedFeatures() {
  const archivedDir = config.paths.archivedDir;

  if (!fs.existsSync(archivedDir)) {
    console.log(chalk.gray('No archived features found.'));
    return;
  }

  const files = fs.readdirSync(archivedDir);
  const archivedFiles = files.filter(file => file.endsWith('.md'));
  
  if (archivedFiles.length === 0) {
    console.log(chalk.gray('No archived features found.'));
    return;
  }
  
  console.log(chalk.blue.bold('📦 Archived Features:'));
  
  for (const file of archivedFiles.sort()) {
    const filePath = path.join(archivedDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract feature info
    const nameMatch = content.match(/# (.+)/);
    const summaryMatch = content.match(/\*\*Summary:\*\* (.+)/);
    
    const featureName = nameMatch ? nameMatch[1] : file.replace('.md', '');
    const summary = summaryMatch ? summaryMatch[1] : 'No summary available';
    
    console.log(`\n${chalk.gray('•')} ${chalk.dim(featureName)}`);
    console.log(`  ${chalk.gray('File:')} archived/${file}`);
    console.log(`  ${chalk.gray('Summary:')} ${chalk.dim(summary)}`);
  }
}
