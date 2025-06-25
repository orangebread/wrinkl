# Augment Context

This file provides context for Augment AI when working on this project.

<!--
🚨 ATTENTION AUGMENT USERS! 🚨

📋 COPY EVERYTHING BELOW THIS COMMENT INTO YOUR AUGMENT USER GUIDELINES

This template file contains project-specific context and guidelines that should be
added to your Augment User Guidelines to help the AI understand your project better.

After copying the content below to your User Guidelines, this file can be safely deleted.

✅ Steps:
1. Copy all content from "## Project Overview" down to the end of this file
2. Paste it into your Augment User Guidelines
3. Delete this file (src/templates/augment.md)

This will ensure Augment has the proper context for working on your project!
-->

## Project Overview

Read the complete project context in the `.ai/` directory:
- `.ai/project.md` - Core project information
- `.ai/patterns.md` - Coding conventions and patterns
- `.ai/architecture.md` - System architecture
- `.ai/context-rules.md` - Rules for AI assistants

## Current Work

Check the active features and their status:
- `.ai/ledgers/_active.md` - Dashboard of current features
- `.ai/ledgers/[feature-name].md` - Specific feature documentation

## Development Guidelines

### Code Quality
- Follow the patterns defined in `.ai/patterns.md`
- Write clean, maintainable code
- Implement proper error handling
- Add comprehensive tests

### Feature Development
- Always check for existing feature ledgers
- Update ledgers with progress and decisions
- Reference ledgers in commits and PRs
- Move features through proper status progression

### Documentation
- Keep documentation updated with changes
- Document technical decisions in feature ledgers
- Add meaningful code comments
- Update API documentation when needed

## Key Principles

1. **Context-Aware Development**: Always read the AI context files before starting work
2. **Pattern Consistency**: Follow established coding patterns and conventions
3. **Feature Tracking**: Use ledgers to track progress and decisions
4. **Quality First**: Prioritize code quality, testing, and documentation
5. **Security Minded**: Consider security implications in all changes

## Workflow

1. Read relevant context files (`.ai/` directory)
2. Check for existing feature ledger
3. Understand the requirements and constraints
4. Follow established patterns and conventions
5. Write tests and documentation
6. Update feature ledger with progress
7. Ensure code quality standards are met

## Common Tasks

### Starting a New Feature
1. Check if feature ledger exists in `.ai/ledgers/`
2. If not, create one using `wrinkl feature <name>`
3. Review the feature requirements and approach
4. Begin development following project patterns

### Making Changes
1. Understand the existing code and patterns
2. Follow the established conventions
3. Write or update tests
4. Update documentation as needed
5. Update feature ledger with decisions made

### Code Review
1. Verify code follows project patterns
2. Check that tests are comprehensive
3. Ensure documentation is updated
4. Validate security considerations
5. Confirm performance implications are considered

## Resources

- **Project Context**: `.ai/project.md`
- **Coding Patterns**: `.ai/patterns.md`
- **Architecture**: `.ai/architecture.md`
- **AI Rules**: `.ai/context-rules.md`
- **Active Features**: `.ai/ledgers/_active.md`

## Commands

```bash
# Create new feature ledger
wrinkl feature <feature-name>

# List active features
wrinkl list

# Archive completed feature
wrinkl archive <feature-name>
```

---

*This context system helps maintain consistency and quality across the project. Always reference these files when working on the codebase.*
