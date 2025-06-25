# Coding Patterns & Conventions

This document outlines the coding patterns, conventions, and best practices for the Wrinkl CLI project.

## Code Style

### General Principles
- Write self-documenting code with clear function and variable names
- Prefer explicit over implicit behavior
- Keep functions small and focused (max 30-40 lines)
- Use meaningful names that describe intent, not implementation

### Naming Conventions
- **Variables**: camelCase (`projectName`, `kebabName`)
- **Functions**: camelCase (`createFeature`, `validateFeatureName`)
- **Constants**: UPPER_SNAKE_CASE (`MINIMATCH_OPTIONS`)
- **Files**: kebab-case.js (`feature.js`, `config.js`)
- **Feature Names**: kebab-case (`user-authentication`, `api-integration`)

### File Organization
```
src/
├── commands/       # CLI command implementations
│   ├── init.js     # Initialize AI context system
│   ├── feature.js  # Create feature ledgers
│   ├── list.js     # List features
│   └── archive.js  # Archive features
├── utils/          # Utility functions and configuration
│   ├── config.js   # Configuration and path management
│   └── logger.js   # Logging utilities
├── templates/      # Template files for generation
│   ├── ai/         # AI context templates
│   └── ledgers/    # Feature ledger templates
└── index.js        # Main exports for programmatic use
```

## CLI Command Patterns

### Command Structure
```javascript
// Standard command function pattern
export async function commandName(args, options) {
  // 1. Validate prerequisites
  if (!config.isInitialized()) {
    logger.error('No .ai directory found. Run "wrinkl init" first.');
    process.exit(1);
  }

  // 2. Validate input
  const validationError = validateInput(args);
  if (validationError) {
    logger.error(validationError);
    process.exit(1);
  }

  // 3. Interactive prompts if needed
  const answers = await prompts([...]);

  // 4. Perform operations with error handling
  try {
    // Main logic here
    logger.success('Operation completed!');
  } catch (error) {
    logger.error(`Operation failed: ${error.message}`);
    process.exit(1);
  }
}
```

### Error Handling Pattern
```javascript
// Consistent error handling across commands
try {
  // File operations
  const content = fs.readFileSync(filePath, 'utf-8');
  // Process content
  fs.writeFileSync(outputPath, processedContent);

  logger.success('File operation completed');
} catch (error) {
  logger.error(`Failed to process file: ${error.message}`);

  // Provide helpful suggestions
  if (error.code === 'ENOENT') {
    logger.info('Make sure the file exists and try again.');
  }

  process.exit(1);
}
```

## File Operations Patterns

### Template Processing
```javascript
// Standard template substitution pattern
function copyTemplate(sourcePath, targetPath, variables = {}) {
  let content = fs.readFileSync(sourcePath, 'utf-8');

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  });

  // Ensure target directory exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  // Write processed content
  fs.writeFileSync(targetPath, content);
}
```

### File System Safety
```javascript
// Check before operations
if (fs.existsSync(targetPath)) {
  const response = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: 'File exists. Overwrite?',
    initial: false
  });

  if (!response.overwrite) {
    logger.info('Operation cancelled.');
    return;
  }
}
```

## Logging Patterns

### Consistent Logging
```javascript
// Use logger utility for all output
import { logger } from '../utils/logger.js';

// Different log levels with appropriate emoji
logger.info('Processing feature...');      // ℹ️ blue
logger.success('Feature created!');        // ✅ green
logger.warning('File already exists');     // ⚠️ yellow
logger.error('Operation failed');          // ❌ red
logger.debug('Debug information');         // 🐛 gray (only if DEBUG=true)

// Structured output for user guidance
logger.header('AI Ledger - Context System Setup');
logger.step(1, 'Review and customize .ai/project.md');
logger.code('wrinkl feature my-first-feature');
```

## Testing Patterns

### Unit Tests
- Test one thing at a time
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```javascript
describe('config.validateFeatureName', () => {
  it('should return null for valid feature names', () => {
    // Arrange
    const validName = 'user-authentication';

    // Act
    const result = config.validateFeatureName(validName);

    // Assert
    expect(result).toBeNull();
  });

  it('should return error message for invalid characters', () => {
    // Arrange
    const invalidName = 'user@auth!';

    // Act
    const result = config.validateFeatureName(invalidName);

    // Assert
    expect(result).toContain('can only contain');
  });
});
```

## Common Anti-Patterns to Avoid

- ❌ Async operations in CLI commands (use sync for simplicity)
- ❌ Deep nesting (prefer early returns and validation)
- ❌ Magic strings (use constants for file paths and templates)
- ❌ Inconsistent error handling across commands
- ❌ Missing user feedback for long operations
- ❌ Not validating user input before file operations

## Configuration Patterns

### Path Management
```javascript
// Centralized path configuration
export const config = {
  paths: {
    aiDir: '.ai',
    ledgersDir: '.ai/ledgers',
    archivedDir: '.ai/ledgers/archived',
    templatesDir: getTemplatesDir(),
    activeFile: '.ai/ledgers/_active.md',
    templateFile: '.ai/ledgers/_template.md'
  },

  // Utility methods
  isInitialized() {
    return fs.existsSync(this.paths.aiDir);
  }
};
```

### Input Validation
```javascript
// Consistent validation patterns
validateFeatureName(name) {
  if (!name || name.trim().length === 0) {
    return 'Feature name is required';
  }

  if (name.length > 50) {
    return 'Feature name must be 50 characters or less';
  }

  if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
    return 'Feature name can only contain letters, numbers, spaces, hyphens, and underscores';
  }

  return null; // Valid
}
```

## ES Module Patterns

### Import/Export Structure
```javascript
// Named exports for utilities
export const logger = { ... };
export const config = { ... };

// Default exports for commands
export default async function init(options) { ... }

// Re-exports in index.js
export { init } from './commands/init.js';
export { createFeature } from './commands/feature.js';
```

### Dynamic Imports
```javascript
// Use static imports for better tree-shaking
import { Command } from 'commander';
import chalk from 'chalk';
import { init } from '../src/commands/init.js';

// Avoid dynamic imports unless necessary for lazy loading
```

## Documentation Patterns

### Function Documentation
```javascript
/**
 * Creates a new feature ledger from template
 * @param {string} name - Feature name (will be converted to kebab-case)
 * @returns {Promise<void>} Resolves when feature is created
 */
export async function createFeature(name) {
  // Implementation
}
```

### README Structure
- Clear installation instructions
- Quick start examples
- Command reference with options
- Architecture overview
- Contributing guidelines

## Notes

- Prefer synchronous operations for CLI simplicity
- Always provide user feedback for operations
- Use consistent emoji and colors across all output
- Validate all user input before file operations
- Keep dependencies minimal for fast installation
