import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import prompts from 'prompts';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export async function archiveFeature(name, _options) {
  // Check if .ai directory exists
  if (!config.isInitialized()) {
    logger.error('No .ai directory found. Run "wrinkl init" first.');
    process.exit(1);
  }

  const kebabName = config.toKebabCase(name);
  const ledgerPath = path.join(config.paths.ledgersDir, `${kebabName}.md`);
  const archivedPath = path.join(config.paths.archivedDir, `${kebabName}.md`);

  // Check if ledger exists
  if (!fs.existsSync(ledgerPath)) {
    logger.error(`Feature ledger "${kebabName}" not found.`);

    // Suggest similar names
    suggestSimilarFeatures(kebabName);
    process.exit(1);
  }

  // Check if already archived
  if (fs.existsSync(archivedPath)) {
    logger.warning(`Feature "${kebabName}" is already archived.`);
    return;
  }

  // Confirm archival
  const response = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Archive feature "${kebabName}"?`,
    initial: true
  });

  if (!response || !response.confirm) {
    logger.info('Archive cancelled.');
    return;
  }

  try {
    // Read the current ledger
    let content = fs.readFileSync(ledgerPath, 'utf-8');

    // Update the status to archived and add archive date
    const archiveDate = config.getCurrentDate();
    content = content.replace(/\*\*Status:\*\* (.+)/, `**Status:** Archived (${archiveDate})`);

    // Add archive note if not present
    if (!content.includes('## Archive Notes')) {
      content += `\n\n## Archive Notes\n\nArchived on ${archiveDate}.\n`;
    }

    // Ensure archived directory exists
    fs.mkdirSync(config.paths.archivedDir, { recursive: true });

    // Move to archived directory
    fs.writeFileSync(archivedPath, content);
    fs.unlinkSync(ledgerPath);

    // Remove from _active.md
    removeFromActiveFile(kebabName);

    logger.success(`Feature "${kebabName}" archived successfully.`);
    console.log(chalk.gray(`Moved to: ${archivedPath}`));
  } catch (error) {
    logger.error(`Failed to archive feature: ${error.message}`);
    process.exit(1);
  }
}

function removeFromActiveFile(kebabName) {
  const activePath = config.paths.activeFile;

  if (!fs.existsSync(activePath)) {
    return;
  }

  try {
    const activeContent = fs.readFileSync(activePath, 'utf-8');

    // Remove lines that reference this feature
    const lines = activeContent.split('\n');
    const filteredLines = lines.filter(
      (line) => !line.includes(`[${kebabName}]`) && !line.includes(`(${kebabName}.md)`)
    );

    if (filteredLines.length !== lines.length) {
      fs.writeFileSync(activePath, filteredLines.join('\n'));
      logger.info('Removed feature from _active.md');
    }
  } catch (error) {
    logger.warning(`Could not update _active.md: ${error.message}`);
  }
}

function suggestSimilarFeatures(searchName) {
  try {
    const ledgersDir = config.paths.ledgersDir;

    if (!fs.existsSync(ledgersDir)) {
      return;
    }

    const files = fs.readdirSync(ledgersDir);
    const ledgerFiles = files
      .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
      .map((file) => file.replace('.md', ''));

    if (ledgerFiles.length === 0) {
      console.log(chalk.gray('No feature ledgers found.'));
      return;
    }

    // Simple similarity check
    const similar = ledgerFiles.filter(
      (name) =>
        name.includes(searchName) ||
        searchName.includes(name) ||
        levenshteinDistance(name, searchName) <= 3
    );

    if (similar.length > 0) {
      console.log(chalk.yellow('\nDid you mean one of these?'));
      similar.forEach((name) => {
        console.log(chalk.cyan(`  • ${name}`));
      });
    } else {
      console.log(chalk.gray('\nAvailable features:'));
      ledgerFiles.forEach((name) => {
        console.log(chalk.gray(`  • ${name}`));
      });
    }
  } catch (_error) {
    // Silently fail suggestion
  }
}

// Simple Levenshtein distance implementation
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
