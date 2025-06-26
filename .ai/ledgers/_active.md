# Active Features

**Last Updated:** 2025-06-25

This file tracks all active features and their current status. Use this as a dashboard to see what's in progress and what's coming up next.

## ✅ Recently Completed

*Features completed in this development cycle*

1. **Multi-Package Manager Support** - Added auto-detection and support for npm, pnpm, and yarn
   - Package manager detection utility with fallback logic
   - Appropriate install/run commands for each package manager
   - User-friendly tips based on detected package manager

2. **Modern Tooling Migration** - Migrated from ESLint to Biome for better ES module support
   - Faster linting and formatting (10-100x performance improvement)
   - Native ES module support without configuration issues
   - Modern code formatting with `node:` protocol for built-ins

3. **NPM Publishing Preparation** - Fixed critical packaging issues and prepared for npm release
   - Fixed .npmignore to include essential template files
   - Updated documentation with multi-package manager installation instructions
   - Comprehensive pre-publish testing and validation

## 🟢 In Progress

*Features currently being worked on*

1. **[config-management](config-management.md)** - Add support for project-level and global configuration files to customize Wrinkl behavior and defaults

## 🔴 Up Next (Priority Order)

*Features ready to start, ordered by priority*

1. **[export-functionality](export-functionality.md)** - Add ability to export AI context and feature ledgers in various formats for sharing, backup, and integration with other tools

## 🟡 Blocked

*Features that are blocked and waiting for something*

1. **[status-management](status-management.md)** - Enhance feature status tracking with automated status updates, workflow transitions, and integration with git branches
   - *Blocked by*: Requires completion of config-management feature for workflow configuration

## 🔵 Under Review

*Features that are complete and under review*

<!-- Move features here when they're ready for review -->

## 📋 Backlog

*Features planned for future development*

1. **[template-customization](template-customization.md)** - Allow users to customize and extend Wrinkl templates for their specific project needs and organizational standards

---

## Status Definitions

- **🟢 In Progress**: Actively being developed
- **🔴 Up Next**: Ready to start, prioritized
- **🟡 Blocked**: Waiting for dependencies or decisions
- **🔵 Under Review**: Complete and awaiting review/approval
- **📋 Backlog**: Planned for future development

## Usage

1. **Starting a feature**: Move from "Up Next" to "In Progress"
2. **Blocked feature**: Move to "Blocked" with reason
3. **Completed feature**: Move to "Under Review"
4. **Approved feature**: Archive using `wrinkl archive <feature-name>`

## Commands

```bash
# Create a new feature (adds to "Up Next")
wrinkl feature my-new-feature

# List all features
wrinkl list

# Archive completed feature
wrinkl archive my-completed-feature
```

---

*Keep this file updated as features progress through different stages.*
