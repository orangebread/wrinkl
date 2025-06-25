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
const { createFeature } = await import('../../src/commands/feature.js');
const { config } = await import('../../src/utils/config.js');

describe('Feature Command', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrinkl-feature-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
    
    // Create basic .ai directory structure
    fs.mkdirSync('.ai/ledgers', { recursive: true });
    
    // Create template file
    const templateContent = `# [Feature Name]

**Summary:** [1-2 sentences: what this does and why it's needed]
**Status:** Planning
**Branch:** feat/feature-name
**Created:** YYYY-MM-DD

## Description
Detailed description of the feature.

## Tasks
- [ ] Task 1
- [ ] Task 2

## Notes
Development notes and decisions.`;
    
    fs.writeFileSync('.ai/ledgers/_template.md', templateContent);
    
    // Create active file
    const activeContent = `# Active Features

## 🟢 In Progress

## 🔴 Up Next (Priority Order)

## 🟡 Blocked

## 🔵 Under Review

## 📋 Backlog`;
    
    fs.writeFileSync('.ai/ledgers/_active.md', activeContent);
    
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

  describe('when .ai directory exists', () => {
    test('should create feature ledger with correct name and content', async () => {
      prompts.default.mockResolvedValue({
        summary: 'A test feature for testing purposes'
      });

      await createFeature('User Authentication');

      const expectedPath = '.ai/ledgers/user-authentication.md';
      expect(fs.existsSync(expectedPath)).toBe(true);
      
      const content = fs.readFileSync(expectedPath, 'utf-8');
      expect(content).toContain('# User Authentication');
      expect(content).toContain('feat/user-authentication');
      expect(content).toContain('A test feature for testing purposes');
      expect(content).toContain(config.getCurrentDate());
    });

    test('should handle feature names with special characters', async () => {
      prompts.default.mockResolvedValue({
        summary: 'A test feature with special characters'
      });

      await createFeature('My_Feature-Name!');

      const expectedPath = '.ai/ledgers/myfeature-name.md';
      expect(fs.existsSync(expectedPath)).toBe(true);
      
      const content = fs.readFileSync(expectedPath, 'utf-8');
      expect(content).toContain('# My_Feature-Name!');
      expect(content).toContain('feat/myfeature-name');
    });

    test('should update _active.md with new feature', async () => {
      prompts.default.mockResolvedValue({
        summary: 'A test feature for active list'
      });

      await createFeature('New Feature');

      const activeContent = fs.readFileSync('.ai/ledgers/_active.md', 'utf-8');
      expect(activeContent).toContain('[new-feature](new-feature.md)');
      expect(activeContent).toContain('A test feature for active list');
    });

    test('should handle existing feature files by overwriting', async () => {
      // Create existing feature file
      const existingPath = '.ai/ledgers/existing-feature.md';
      fs.writeFileSync(existingPath, 'existing content');

      prompts.default.mockResolvedValue({
        summary: 'Updated feature summary'
      });

      await createFeature('Existing Feature');

      const content = fs.readFileSync(existingPath, 'utf-8');
      expect(content).toContain('# Existing Feature');
      expect(content).toContain('Updated feature summary');
      expect(content).not.toContain('existing content');
    });

    test('should validate feature name', async () => {
      // Test with invalid feature name
      await createFeature('');

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('should handle very long feature names', async () => {
      const longName = 'a'.repeat(60); // Longer than 50 chars
      
      await createFeature(longName);

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('should handle feature names with invalid characters', async () => {
      await createFeature('feature@name#invalid');

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('when .ai directory does not exist', () => {
    beforeEach(() => {
      // Remove .ai directory
      fs.rmSync('.ai', { recursive: true, force: true });
    });

    test('should exit with error when not initialized', async () => {
      await createFeature('Test Feature');

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('error handling', () => {
    test('should handle template file not found', async () => {
      // Remove template file
      fs.unlinkSync('.ai/ledgers/_template.md');

      prompts.default.mockResolvedValue({
        summary: 'Test summary'
      });

      await createFeature('Test Feature');

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('should handle _active.md not found gracefully', async () => {
      // Remove active file
      fs.unlinkSync('.ai/ledgers/_active.md');

      prompts.default.mockResolvedValue({
        summary: 'Test summary'
      });

      await createFeature('Test Feature');

      // Should still create the feature file
      expect(fs.existsSync('.ai/ledgers/test-feature.md')).toBe(true);
    });

    test('should handle malformed _active.md gracefully', async () => {
      // Create malformed active file
      fs.writeFileSync('.ai/ledgers/_active.md', 'malformed content without up next section');

      prompts.default.mockResolvedValue({
        summary: 'Test summary'
      });

      await createFeature('Test Feature');

      // Should still create the feature file
      expect(fs.existsSync('.ai/ledgers/test-feature.md')).toBe(true);
    });

    test('should handle prompts cancellation', async () => {
      // Mock prompts returning undefined (user cancelled)
      prompts.default.mockResolvedValue(undefined);

      await createFeature('Test Feature');

      // Should handle cancellation gracefully and not create feature file
      expect(fs.existsSync('.ai/ledgers/test-feature.md')).toBe(false);
    });
  });

  describe('template variable substitution', () => {
    test('should replace all template variables correctly', async () => {
      prompts.default.mockResolvedValue({
        summary: 'Comprehensive test feature'
      });

      await createFeature('Template Test');

      const content = fs.readFileSync('.ai/ledgers/template-test.md', 'utf-8');
      
      // Verify all substitutions
      expect(content).toContain('# Template Test');
      expect(content).toContain('feat/template-test');
      expect(content).toContain('Comprehensive test feature');
      expect(content).toContain(config.getCurrentDate());
      
      // Verify no template placeholders remain
      expect(content).not.toContain('[Feature Name]');
      expect(content).not.toContain('feat/feature-name');
      expect(content).not.toContain('[1-2 sentences: what this does and why it\'s needed]');
      expect(content).not.toContain('YYYY-MM-DD');
    });
  });
});
