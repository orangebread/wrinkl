import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import prompts from 'prompts';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export async function createFeature(name) {
  // Check if .ai directory exists
  if (!config.isInitialized()) {
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
  if (fs.existsSync(ledgerPath)) {
    logger.error(`Feature ledger "${kebabName}" already exists.`);
    process.exit(1);
  }

  // Get additional information
  const summaryResponse = await prompts({
    type: 'text',
    name: 'summary',
    message: 'Feature summary (1-2 sentences):',
    validate: (value) => value.length > 0 || 'Summary is required'
  });

  if (!summaryResponse) {
    logger.info('Feature creation cancelled.');
    return;
  }

  const answers = {
    summary: summaryResponse.summary
  };

  try {
    // Read template
    const template = fs.readFileSync(config.paths.templateFile, 'utf-8');

    // Replace placeholders
    const content = template
      .replace(/\[Feature Name\]/g, name)
      .replace('feat/feature-name', `feat/${kebabName}`)
      .replace("[1-2 sentences: what this does and why it's needed]", answers.summary)
      .replace(/YYYY-MM-DD/g, config.getCurrentDate());

    // Write ledger
    fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
    fs.writeFileSync(ledgerPath, content);

    // Update _active.md
    updateActiveFile(kebabName, answers.summary);

    logger.success(`Created feature ledger: ${ledgerPath}`);
    console.log(chalk.yellow('\nTo start working on this feature:'));
    logger.step(1, 'Move it to "In Progress" in .ai/ledgers/_active.md');
    logger.step(2, `Reference it in your AI prompts: "Working on ${kebabName} feature"`);
  } catch (error) {
    logger.error(`Failed to create feature ledger: ${error.message}`);
    process.exit(1);
  }
}

function updateActiveFile(kebabName, summary) {
  const activePath = config.paths.activeFile;

  if (!fs.existsSync(activePath)) {
    logger.warning('_active.md file not found. Feature created but not added to active list.');
    return;
  }

  let activeContent = fs.readFileSync(activePath, 'utf-8');

  // Add to up next section
  const upNextMarker = '## 🔴 Up Next (Priority Order)';
  const upNextIndex = activeContent.indexOf(upNextMarker);

  if (upNextIndex !== -1) {
    const nextLineIndex = activeContent.indexOf('\n', upNextIndex) + 1;
    const beforeUpNext = activeContent.slice(0, nextLineIndex);
    const afterUpNext = activeContent.slice(nextLineIndex);

    activeContent = `${beforeUpNext}1. **[${kebabName}](${kebabName}.md)** - ${summary}\n${afterUpNext}`;

    fs.writeFileSync(activePath, activeContent);
    logger.info('Added feature to _active.md');
  } else {
    logger.warning(
      'Could not find "Up Next" section in _active.md. Feature created but not added to active list.'
    );
  }
}
