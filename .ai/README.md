# AI Context Directory

This directory contains context files to help AI assistants understand the wrinkl project better.

## Files Overview

- **project.md** - Core project information, goals, constraints, and technology stack
- **patterns.md** - Coding patterns, conventions, and best practices for wrinkl
- **architecture.md** - System architecture, design decisions, and component relationships
- **context-rules.md** - Specific rules and guidelines for AI assistants working on wrinkl

## Ledgers Directory

The `ledgers/` directory contains feature tracking files for the wrinkl project:

- **_active.md** - Current active features and their status (dashboard view)
- **_template.md** - Template for creating new feature ledgers
- **[feature-name].md** - Individual feature ledgers (e.g., config-management.md)
- **archived/** - Completed/cancelled feature ledgers
- **npm-publishing-preparation.md** - Recently completed npm publishing preparation

## How to Use

1. **Keep files updated** - These files should evolve with your project
2. **Reference in prompts** - Tell AI assistants to read these files for context
3. **Use feature ledgers** - Track progress and decisions for each feature
4. **Maintain patterns** - Document new patterns as they emerge

## AI Assistant Instructions

When working on this project:

1. Read the project.md file to understand the project goals and constraints
2. Review patterns.md for coding conventions and best practices
3. Check architecture.md for system design and technical decisions
4. Follow the rules in context-rules.md
5. Reference the appropriate feature ledger when working on specific features
6. Update documentation as you make changes

## Commands

Use the `wrinkl` CLI tool to manage this context system:

```bash
wrinkl feature <name>    # Create a new feature ledger
wrinkl list             # List active features
wrinkl archive <name>   # Archive a completed feature
```
