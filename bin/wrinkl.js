#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { init } from '../src/commands/init.js';
import { createFeature } from '../src/commands/feature.js';
import { listFeatures } from '../src/commands/list.js';
import { archiveFeature } from '../src/commands/archive.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('wrinkl')
  .description('AI context management system with ledger-based feature tracking')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize AI context system in current directory')
  .option('-n, --name <n>', 'project name')
  .option('-t, --type <type>', 'project type', 'web app')
  .option('-s, --stack <stack>', 'technology stack', 'TypeScript, Node.js')
  .option('--no-cursor', 'skip .cursorrules file')
  .option('--with-augment', 'include augment.md file')
  .option('--with-copilot', 'include GitHub Copilot instructions')
  .action(init);

program
  .command('feature <name>')
  .alias('f')
  .description('Create a new feature ledger')
  .action(createFeature);

program
  .command('list')
  .alias('ls')
  .description('List active features')
  .option('-a, --all', 'include archived features')
  .action(listFeatures);

program
  .command('archive <name>')
  .description('Archive a completed feature')
  .action(archiveFeature);

program.parse();
