import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Mock external dependencies
jest.unstable_mockModule('prompts', () => ({
  default: jest.fn()
}));

// Import modules after mocking
const prompts = await import('prompts');
const { archiveFeature } = await import('../../src/commands/archive.js');
const { config } = await import('../../src/utils/config.js');

describe('Archive Command', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrinkl-archive-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
    
    // Create basic .ai directory structure
    fs.mkdirSync('.ai/ledgers/archived', { recursive: true });
    
    // Mock console methods to avoid noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
    
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original directory and cleanup
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  describe('when .ai directory does not exist', () => {
    beforeEach(() => {
      // Remove .ai directory
      fs.rmSync('.ai', { recursive: true, force: true });
    });

    test('should exit with error when not initialized', async () => {
      await archiveFeature('test-feature');

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('when feature exists', () => {
    beforeEach(() => {
      // Create a sample feature file
      const featureContent = `# User Authentication

**Summary:** Implement user login and registration
**Status:** Complete
**Branch:** feat/user-auth
**Created:** 2024-01-15

## Description
User authentication system with JWT tokens.

## Tasks
- [x] Create login form
- [x] Implement JWT tokens
- [x] Add password hashing

## Notes
Feature completed successfully.`;

      fs.writeFileSync('.ai/ledgers/user-authentication.md', featureContent);

      // Create _active.md with the feature listed
      const activeContent = `# Active Features

## 🟢 In Progress

## 🔴 Up Next (Priority Order)
1. **[user-authentication](user-authentication.md)** - Implement user login and registration

## 🟡 Blocked

## 🔵 Under Review

## 📋 Backlog`;

      fs.writeFileSync('.ai/ledgers/_active.md', activeContent);
    });

    test('should archive feature when user confirms', async () => {
      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('User Authentication');

      // Verify feature was moved to archived directory
      expect(fs.existsSync('.ai/ledgers/user-authentication.md')).toBe(false);
      expect(fs.existsSync('.ai/ledgers/archived/user-authentication.md')).toBe(true);

      // Verify content was updated with archive information
      const archivedContent = fs.readFileSync('.ai/ledgers/archived/user-authentication.md', 'utf-8');
      expect(archivedContent).toContain(`**Status:** Archived (${config.getCurrentDate()})`);
      expect(archivedContent).toContain('## Archive Notes');
      expect(archivedContent).toContain(`Archived on ${config.getCurrentDate()}`);
    });

    test('should remove feature from _active.md', async () => {
      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('User Authentication');

      const activeContent = fs.readFileSync('.ai/ledgers/_active.md', 'utf-8');
      expect(activeContent).not.toContain('[user-authentication]');
      expect(activeContent).not.toContain('(user-authentication.md)');
    });

    test('should not archive when user cancels', async () => {
      prompts.default.mockResolvedValue({ confirm: false });

      await archiveFeature('User Authentication');

      // Verify feature was not moved
      expect(fs.existsSync('.ai/ledgers/user-authentication.md')).toBe(true);
      expect(fs.existsSync('.ai/ledgers/archived/user-authentication.md')).toBe(false);
    });

    test('should handle feature names with special characters', async () => {
      // Create feature with special characters
      const specialFeatureContent = `# My_Special-Feature!

**Summary:** A feature with special characters
**Status:** Complete
**Branch:** feat/special
**Created:** 2024-01-15`;

      fs.writeFileSync('.ai/ledgers/myspecial-feature.md', specialFeatureContent);

      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('My_Special-Feature!');

      // Verify feature was archived with kebab-case filename
      expect(fs.existsSync('.ai/ledgers/myspecial-feature.md')).toBe(false);
      expect(fs.existsSync('.ai/ledgers/archived/myspecial-feature.md')).toBe(true);
    });

    test('should preserve existing archive notes', async () => {
      // Create feature with existing archive notes
      const featureWithNotes = `# Test Feature

**Summary:** A test feature
**Status:** Complete
**Branch:** feat/test
**Created:** 2024-01-15

## Archive Notes
Previous archive note.`;

      fs.writeFileSync('.ai/ledgers/test-feature.md', featureWithNotes);

      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('Test Feature');

      const archivedContent = fs.readFileSync('.ai/ledgers/archived/test-feature.md', 'utf-8');
      expect(archivedContent).toContain('Previous archive note.');
      expect(archivedContent).not.toContain(`Archived on ${config.getCurrentDate()}`);
    });
  });

  describe('when feature does not exist', () => {
    test('should exit with error for non-existent feature', async () => {
      await archiveFeature('non-existent-feature');

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('should suggest similar features when available', async () => {
      // Create some similar features
      fs.writeFileSync('.ai/ledgers/user-auth.md', 'content');
      fs.writeFileSync('.ai/ledgers/user-profile.md', 'content');

      await archiveFeature('user-authentication');

      expect(process.exit).toHaveBeenCalledWith(1);
      // The actual suggestion logic would be tested if implemented
    });
  });

  describe('when feature is already archived', () => {
    beforeEach(() => {
      // Create already archived feature
      const archivedContent = `# Already Archived

**Summary:** This feature is already archived
**Status:** Archived (2024-01-20)
**Branch:** feat/archived
**Created:** 2024-01-15`;

      fs.writeFileSync('.ai/ledgers/archived/already-archived.md', archivedContent);
    });

    test('should warn when feature is already archived', async () => {
      await archiveFeature('Already Archived');

      // Should not prompt for confirmation
      expect(prompts.default).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      // Create a feature to archive
      fs.writeFileSync('.ai/ledgers/test-feature.md', 'test content');
    });

    test('should handle file system errors gracefully', async () => {
      prompts.default.mockResolvedValue({ confirm: true });

      // Mock fs.writeFileSync to throw an error
      const originalWriteFileSync = fs.writeFileSync;
      jest.spyOn(fs, 'writeFileSync').mockImplementation((filePath, content) => {
        if (filePath.includes('archived/test-feature.md')) {
          throw new Error('Permission denied');
        }
        return originalWriteFileSync(filePath, content);
      });

      await archiveFeature('Test Feature');

      expect(process.exit).toHaveBeenCalledWith(1);
      
      // Restore
      fs.writeFileSync.mockRestore();
    });

    test('should handle missing _active.md gracefully', async () => {
      // Remove _active.md
      if (fs.existsSync('.ai/ledgers/_active.md')) {
        fs.unlinkSync('.ai/ledgers/_active.md');
      }

      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('Test Feature');

      // Should still archive the feature
      expect(fs.existsSync('.ai/ledgers/archived/test-feature.md')).toBe(true);
    });

    test('should handle malformed _active.md gracefully', async () => {
      // Create malformed _active.md
      fs.writeFileSync('.ai/ledgers/_active.md', 'malformed content');

      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('Test Feature');

      // Should still archive the feature
      expect(fs.existsSync('.ai/ledgers/archived/test-feature.md')).toBe(true);
    });

    test('should handle prompts cancellation', async () => {
      // Mock prompts returning undefined (user cancelled)
      prompts.default.mockResolvedValue(undefined);

      await archiveFeature('Test Feature');

      // Should handle cancellation gracefully and not archive the feature
      expect(fs.existsSync('.ai/ledgers/test-feature.md')).toBe(true);
      expect(fs.existsSync('.ai/ledgers/archived/test-feature.md')).toBe(false);
    });
  });

  describe('archive directory creation', () => {
    test('should create archived directory if it does not exist', async () => {
      // Remove archived directory
      fs.rmSync('.ai/ledgers/archived', { recursive: true, force: true });

      // Create a feature to archive
      fs.writeFileSync('.ai/ledgers/test-feature.md', 'test content');

      prompts.default.mockResolvedValue({ confirm: true });

      await archiveFeature('Test Feature');

      // Verify archived directory was created
      expect(fs.existsSync('.ai/ledgers/archived')).toBe(true);
      expect(fs.existsSync('.ai/ledgers/archived/test-feature.md')).toBe(true);
    });
  });
});
