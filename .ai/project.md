# Wrinkl

**Type:** CLI Tool
**Stack:** JavaScript (ES Modules), Node.js
**Created:** 2025-06-25

## Project Overview

Wrinkl is a command-line tool for AI context management that creates structured `.ai/` directories in projects to help AI assistants understand codebases better. It uses a "ledger" system to track features and maintain coding patterns, providing context files, pattern documentation, feature ledgers, and architecture decisions to guide development.

## Goals

- Improve AI assistant effectiveness by providing structured project context
- Track feature development progress through ledger-based documentation
- Maintain coding consistency across teams and projects
- Create living documentation that evolves with the project

## Constraints

- Must work across different project types and technology stacks
- CLI interface should be intuitive and follow Unix conventions
- Templates must be flexible enough for various project needs
- File operations must be safe and recoverable

## Key Requirements

### Functional Requirements
- Initialize AI context system in any project directory
- Create and manage feature ledgers with progress tracking
- List and archive completed features
- Support customizable templates and project types
- Generate context files for different AI assistants (Cursor, Copilot, Augment)

### Non-Functional Requirements
- Fast CLI operations (< 1 second for most commands)
- Cross-platform compatibility (Windows, macOS, Linux)
- Minimal dependencies to reduce installation issues
- Clear error messages and user guidance

## Technology Stack

### Core Runtime
- Node.js (ES Modules)
- JavaScript with modern syntax
- NPM for package management

### CLI Framework
- Commander.js for command parsing and options
- Prompts for interactive user input
- Chalk for colored terminal output
- Ora for loading spinners

### File Operations
- Native Node.js fs module for file system operations
- Path module for cross-platform path handling
- Template substitution using string replacement

## Project Structure

```
wrinkl/
├── bin/
│   └── wrinkl.js              # CLI entry point
├── src/
│   ├── index.js               # Main exports
│   ├── commands/              # Command implementations
│   │   ├── init.js           # Initialize AI context
│   │   ├── feature.js        # Create feature ledgers
│   │   ├── list.js           # List features
│   │   └── archive.js        # Archive features
│   ├── utils/                # Utility modules
│   │   ├── config.js         # Configuration and paths
│   │   └── logger.js         # Logging utilities
│   └── templates/            # Template files
│       ├── ai/               # AI context templates
│       └── ledgers/          # Feature ledger templates
├── tests/                    # Test files
└── coverage/                 # Test coverage reports
```

## Development Workflow

1. **Feature Development**: Create feature ledger using `wrinkl feature <name>`
2. **Code Review**: Follow patterns documented in `.ai/patterns.md`
3. **Testing**: Run tests with `npm test`, maintain coverage above 80%
4. **Release**: Use semantic versioning, update CHANGELOG.md

## Important Notes

- Templates use placeholder substitution (e.g., `PROJECT_NAME`, `DATE`)
- File operations are synchronous for simplicity and error handling
- Kebab-case naming convention for feature files
- All user-facing text uses emoji and colored output for better UX
- Error handling includes helpful suggestions and similar name matching
