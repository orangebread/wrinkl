# Wrinkl

**Type:** CLI Tool / npm Package
**Stack:** JavaScript (ES Modules), Node.js 16+
**Created:** 2025-06-25
**Author:** Jeff Lee (@orangebread)
**Repository:** https://github.com/orangebread/wrinkl

## Project Overview

Wrinkl is a command-line tool for AI context management that creates structured `.ai/` directories in projects to help AI assistants understand codebases better. It uses a "ledger" system to track features and maintain coding patterns, providing context files, pattern documentation, feature ledgers, and architecture decisions to guide development.

Born from 2+ years of AI-assisted development experience, Wrinkl formalizes the patterns and processes that make AI coding truly effective by solving the context problem - ensuring AI assistants have the information they need to make decisions aligned with project goals, patterns, and constraints.

## Goals

- **Improve AI assistant effectiveness** by providing structured project context
- **Track feature development progress** through ledger-based documentation
- **Maintain coding consistency** across teams and projects
- **Create living documentation** that evolves with the project
- **Support multiple package managers** (npm, pnpm, yarn) for broad adoption
- **Provide excellent developer experience** with modern tooling and clear feedback

## Constraints

- **Cross-Platform**: Must work on Windows, macOS, and Linux
- **Package Manager Agnostic**: Auto-detect and support npm, pnpm, yarn
- **Zero Config**: Work out of the box with sensible defaults
- **Template Flexibility**: Support various project types and AI assistants
- **Safe Operations**: All file operations must be recoverable and non-destructive
- **Modern Node.js**: Require Node.js 16+ for ES modules and modern features
- **Minimal Dependencies**: Keep dependency tree small for fast installs
- **CLI Conventions**: Follow Unix CLI patterns and conventions

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
- **Node.js 16+** with ES Modules support
- **JavaScript** with modern syntax (async/await, destructuring, etc.)
- **Multi-Package Manager** support (npm, pnpm, yarn)

### CLI Framework
- **Commander.js 11.x** - Command parsing and argument handling
- **Chalk 5.x** - Colored terminal output and styling
- **Ora 8.x** - Loading spinners and progress indicators
- **Prompts 2.x** - Interactive user input and confirmations

### File Operations
- **Native Node.js fs** - File system operations with error handling
- **Path module** - Cross-platform path handling
- **Template system** - Variable substitution in template files

### Development Tools
- **Biome 2.x** - Modern linting and formatting (replaces ESLint + Prettier)
- **Jest 29.x** - Testing framework with ES module support
- **Package Manager Detection** - Auto-detects user's preferred PM

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
