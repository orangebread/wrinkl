# AI Ledger NPM Package Structure

## Directory Structure
```
wrinkl/
├── package.json
├── README.md
├── LICENSE
├── .gitignore
├── .npmignore
├── bin/
│   └── wrinkl.js          # CLI entry point
├── src/
│   ├── index.js              # Main logic
│   ├── commands/
│   │   ├── init.js           # Initialize AI context
│   │   ├── feature.js        # Create new feature ledger
│   │   ├── list.js           # List active features
│   │   └── archive.js        # Archive completed features
│   ├── templates/            # Template files
│   │   ├── ai/
│   │   │   ├── README.md
│   │   │   ├── project.md
│   │   │   ├── patterns.md
│   │   │   ├── architecture.md
│   │   │   └── context-rules.md
│   │   ├── ledgers/
│   │   │   ├── _template.md
│   │   │   └── _active.md
│   │   ├── cursorrules.md
│   │   └── augment.md
│   └── utils/
│       ├── logger.js         # Colored output
│       └── config.js         # Configuration handling
└── test/
    └── init.test.js

```

## package.json
```json
{
  "name": "wrinkl",
  "version": "1.0.0",
  "description": "A context management system for AI-assisted development using ledgers to track features and maintain coding patterns",
  "keywords": [
    "ai",
    "context",
    "ledger",
    "development",
    "cli",
    "scaffolding",
    "ai-tools",
    "cursor",
    "copilot",
    "claude"
  ],
  "homepage": "https://github.com/orangebread/wrinkl",
  "bugs": {
    "url": "https://github.com/orangebread/wrinkl/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/orangebread/wrinkl.git"
  },
  "license": "MIT",
  "author": "Jeff Lee",
  "main": "src/index.js",
  "bin": {
    "wrinkl": "./bin/wrinkl.js"
  },
  "files": [
    "bin/",
    "src/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "test": "jest",
    "lint": "eslint src/**/*.js",
    "prepublishOnly": "npm test && npm run lint"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^11.1.0",
    "fs-extra": "^11.2.0",
    "inquirer": "^9.2.12",
    "ora": "^7.0.1"
  },
  "devDependencies": {
    "eslint": "^8.55.0",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## bin/wrinkl.js
```javascript
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { init } from '../src/commands/init.js';
import { createFeature } from '../src/commands/feature.js';
import { listFeatures } from '../src/commands/list.js';
import { archiveFeature } from '../src/commands/archive.js';
import { version } from '../package.json' assert { type: 'json' };

const program = new Command();

program
  .name('wrinkl')
  .description('AI context management system with ledger-based feature tracking')
  .version(version);

program
  .command('init')
  .description('Initialize AI context system in current directory')
  .option('-n, --name <name>', 'project name')
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
  .option('-o, --owner <owner>', 'feature owner', 'Pair')
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
```

## src/commands/init.js
```javascript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function init(options) {
  console.log(chalk.blue.bold('\n🚀 AI Ledger - Context System Setup\n'));

  // Gather project information
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: options.name || path.basename(process.cwd()),
      validate: input => input.length > 0 || 'Project name is required'
    },
    {
      type: 'input',
      name: 'projectType',
      message: 'Project type:',
      default: options.type || 'web app'
    },
    {
      type: 'input',
      name: 'stack',
      message: 'Technology stack:',
      default: options.stack || 'TypeScript, Node.js'
    },
    {
      type: 'confirm',
      name: 'cursorrules',
      message: 'Create .cursorrules file?',
      default: options.cursor !== false
    },
    {
      type: 'confirm',
      name: 'augment',
      message: 'Create augment.md file?',
      default: options.withAugment || false
    },
    {
      type: 'confirm',
      name: 'copilot',
      message: 'Create GitHub Copilot instructions?',
      default: options.withCopilot || false
    }
  ]);

  const spinner = ora('Creating AI context structure...').start();

  try {
    // Create directory structure
    await fs.ensureDir('.ai/ledgers/archived');
    
    // Copy templates with variable substitution
    const templateDir = path.join(__dirname, '../../templates');
    
    // Copy AI directory templates
    await copyTemplate(
      path.join(templateDir, 'ai/README.md'),
      '.ai/README.md'
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/project.md'),
      '.ai/project.md',
      {
        PROJECT_NAME: answers.projectName,
        PROJECT_TYPE: answers.projectType,
        STACK: answers.stack,
        DATE: new Date().toISOString().split('T')[0]
      }
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/patterns.md'),
      '.ai/patterns.md'
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/architecture.md'),
      '.ai/architecture.md'
    );
    
    await copyTemplate(
      path.join(templateDir, 'ai/context-rules.md'),
      '.ai/context-rules.md'
    );
    
    // Copy ledger templates
    await copyTemplate(
      path.join(templateDir, 'ledgers/_template.md'),
      '.ai/ledgers/_template.md'
    );
    
    await copyTemplate(
      path.join(templateDir, 'ledgers/_active.md'),
      '.ai/ledgers/_active.md',
      { DATE: new Date().toISOString().split('T')[0] }
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
    console.log(chalk.green('\n✅ Setup complete!\n'));
    console.log(chalk.yellow('Next steps:'));
    console.log('1. Review and customize .ai/project.md');
    console.log('2. Add project-specific patterns to .ai/patterns.md');
    console.log('3. Create your first feature ledger:');
    console.log(chalk.cyan('   wrinkl feature my-first-feature'));
    console.log('4. Start coding with AI assistance!\n');
    
  } catch (error) {
    spinner.fail('Failed to initialize AI context system');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function copyTemplate(src, dest, variables = {}) {
  let content = await fs.readFile(src, 'utf-8');
  
  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });
  
  await fs.outputFile(dest, content);
}
```

## src/commands/feature.js
```javascript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function createFeature(name, options) {
  // Check if .ai directory exists
  if (!await fs.pathExists('.ai')) {
    console.error(chalk.red('No .ai directory found. Run "wrinkl init" first.'));
    process.exit(1);
  }
  
  const kebabName = name.toLowerCase().replace(/\s+/g, '-');
  const ledgerPath = path.join('.ai/ledgers', `${kebabName}.md`);
  
  // Check if ledger already exists
  if (await fs.pathExists(ledgerPath)) {
    console.error(chalk.red(`Feature ledger "${kebabName}" already exists.`));
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
      default: options.owner || 'Pair'
    }
  ]);
  
  // Read template
  const template = await fs.readFile('.ai/ledgers/_template.md', 'utf-8');
  
  // Replace placeholders
  const content = template
    .replace(/\[Feature Name\]/g, name)
    .replace('feat/feature-name', `feat/${kebabName}`)
    .replace('[1-2 sentences: what this does and why it\'s needed]', answers.summary)
    .replace(/\[Human \| AI \| Pair\]/g, answers.owner)
    .replace(/YYYY-MM-DD/g, new Date().toISOString().split('T')[0]);
  
  // Write ledger
  await fs.outputFile(ledgerPath, content);
  
  // Update _active.md
  const activePath = '.ai/ledgers/_active.md';
  let activeContent = await fs.readFile(activePath, 'utf-8');
  
  // Add to up next section
  const upNextMarker = '## 🔴 Up Next (Priority Order)';
  const upNextIndex = activeContent.indexOf(upNextMarker);
  
  if (upNextIndex !== -1) {
    const nextLineIndex = activeContent.indexOf('\n', upNextIndex) + 1;
    const beforeUpNext = activeContent.slice(0, nextLineIndex);
    const afterUpNext = activeContent.slice(nextLineIndex);
    
    activeContent = beforeUpNext + 
      `1. **[${kebabName}](${kebabName}.md)** - ${answers.summary}\n` +
      afterUpNext;
    
    await fs.writeFile(activePath, activeContent);
  }
  
  console.log(chalk.green(`\n✅ Created feature ledger: ${ledgerPath}`));
  console.log(chalk.yellow('\nTo start working on this feature:'));
  console.log(`1. Move it to "In Progress" in .ai/ledgers/_active.md`);
  console.log(`2. Reference it in your AI prompts: "Working on ${kebabName} feature"`);
}
```

## Publishing Steps
```bash
# 1. Create the package directory
mkdir wrinkl && cd wrinkl

# 2. Initialize git
git init

# 3. Create all the files from the templates above

# 4. Install dependencies
npm install

# 5. Test locally
npm link
wrinkl init

# 6. Login to npm (if not already)
npm login

# 7. Publish
npm publish

# Now anyone can install globally:
npm install -g wrinkl
```

## README.md for the package
```markdown
# AI Ledger

A context management system for AI-assisted development. Track features with ledgers, maintain coding patterns, and keep AI assistants aligned with your project.

## Installation

```bash
npm install -g wrinkl
```

## Quick Start

```bash
# Initialize in your project
cd my-project
wrinkl init

# Create a feature ledger
wrinkl feature user-authentication

# List active features
wrinkl list

# Archive completed features
wrinkl archive user-authentication
```

## What It Does

AI Ledger creates a `.ai/` directory in your project with:

- **Context files** for AI assistants to understand your project
- **Pattern documentation** to maintain consistency
- **Feature ledgers** to track work progress
- **Architecture decisions** to guide development

## Why Use This?

- 🤖 **Better AI Assistance** - AI tools understand your project context
- 📝 **Feature Tracking** - Ledgers document progress and decisions
- 🎯 **Pattern Consistency** - Maintain coding standards across the team
- 🔄 **Living Documentation** - Context evolves with your project

## Commands

- `wrinkl init` - Initialize the context system
- `wrinkl feature <name>` - Create a new feature ledger
- `wrinkl list` - Show active features
- `wrinkl archive <name>` - Archive completed features

## License

MIT
```