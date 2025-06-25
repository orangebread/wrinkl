import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Mock external dependencies
jest.unstable_mockModule('prompts', () => ({
  default: jest.fn()
}));

jest.unstable_mockModule('ora', () => ({
  default: jest.fn()
}));

// Import modules after mocking
const prompts = await import('prompts');
const ora = await import('ora');
const { config } = await import('../src/utils/config.js');
const { logger } = await import('../src/utils/logger.js');

describe('Config Utility', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrinkl-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);

    // Mock console methods to avoid noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original directory and cleanup
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  describe('isInitialized()', () => {
    test('should return false when .ai directory does not exist', () => {
      expect(config.isInitialized()).toBe(false);
    });

    test('should return true when .ai directory exists', () => {
      fs.mkdirSync('.ai');
      expect(config.isInitialized()).toBe(true);
    });
  });

  describe('toKebabCase()', () => {
    test('should convert camelCase by removing capitals (current implementation)', () => {
      expect(config.toKebabCase('myFeatureName')).toBe('myfeaturename');
    });

    test('should convert spaces to hyphens', () => {
      expect(config.toKebabCase('my feature name')).toBe('my-feature-name');
    });

    test('should handle mixed case and special characters', () => {
      expect(config.toKebabCase('My_Feature-Name')).toBe('myfeature-name');
    });

    test('should handle already kebab-case strings', () => {
      expect(config.toKebabCase('already-kebab-case')).toBe('already-kebab-case');
    });

    test('should remove special characters except hyphens', () => {
      expect(config.toKebabCase('my@feature#name!')).toBe('myfeaturename');
    });

    test('should trim whitespace', () => {
      expect(config.toKebabCase('  my feature  ')).toBe('my-feature');
    });
  });

  describe('validateFeatureName()', () => {
    test('should return null for valid feature names', () => {
      expect(config.validateFeatureName('valid-feature')).toBeNull();
      expect(config.validateFeatureName('valid_feature')).toBeNull();
      expect(config.validateFeatureName('valid feature')).toBeNull();
      expect(config.validateFeatureName('ValidFeature123')).toBeNull();
    });

    test('should return error for empty or null names', () => {
      expect(config.validateFeatureName('')).toBe('Feature name is required');
      expect(config.validateFeatureName('   ')).toBe('Feature name is required');
      expect(config.validateFeatureName(null)).toBe('Feature name is required');
      expect(config.validateFeatureName(undefined)).toBe('Feature name is required');
    });

    test('should return error for names longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(config.validateFeatureName(longName)).toBe('Feature name must be 50 characters or less');
    });

    test('should return error for names with invalid characters', () => {
      expect(config.validateFeatureName('feature@name')).toBe('Feature name can only contain letters, numbers, spaces, hyphens, and underscores');
      expect(config.validateFeatureName('feature#name')).toBe('Feature name can only contain letters, numbers, spaces, hyphens, and underscores');
      expect(config.validateFeatureName('feature.name')).toBe('Feature name can only contain letters, numbers, spaces, hyphens, and underscores');
    });

    test('should accept exactly 50 characters', () => {
      const exactlyFiftyChars = 'a'.repeat(50);
      expect(config.validateFeatureName(exactlyFiftyChars)).toBeNull();
    });
  });

  describe('getCurrentDate()', () => {
    test('should return date in YYYY-MM-DD format', () => {
      const date = config.getCurrentDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return current date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(config.getCurrentDate()).toBe(today);
    });
  });

  describe('getProjectConfig()', () => {
    test('should return null when project.md does not exist', () => {
      expect(config.getProjectConfig()).toBeNull();
    });

    test('should parse project information from project.md', () => {
      fs.mkdirSync('.ai', { recursive: true });
      const projectContent = `# My Test Project

**Type:** web app
**Stack:** React, Node.js

## Description
A test project for testing.`;

      fs.writeFileSync('.ai/project.md', projectContent);

      const projectConfig = config.getProjectConfig();
      expect(projectConfig).toEqual({
        name: 'My Test Project',
        type: 'web app',
        stack: 'React, Node.js'
      });
    });

    test('should handle malformed project.md gracefully', () => {
      fs.mkdirSync('.ai', { recursive: true });
      fs.writeFileSync('.ai/project.md', 'Invalid content');

      const projectConfig = config.getProjectConfig();
      expect(projectConfig).toEqual({
        name: null,
        type: null,
        stack: null
      });
    });
  });
});

describe('Logger Utility', () => {
  beforeEach(() => {
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should log info messages with blue icon', () => {
    logger.info('Test info message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('ℹ'),
      'Test info message'
    );
  });

  test('should log success messages with green icon', () => {
    logger.success('Test success message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('✅'),
      'Test success message'
    );
  });

  test('should log warning messages with yellow icon', () => {
    logger.warning('Test warning message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('⚠️'),
      'Test warning message'
    );
  });

  test('should log error messages with red icon', () => {
    logger.error('Test error message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('❌'),
      'Test error message'
    );
  });

  test('should log debug messages only when DEBUG env var is set', () => {
    const originalDebug = process.env.DEBUG;

    // Test without DEBUG
    delete process.env.DEBUG;
    logger.debug('Debug message');
    expect(console.log).not.toHaveBeenCalled();

    // Test with DEBUG
    process.env.DEBUG = '1';
    logger.debug('Debug message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('🐛'),
      'Debug message'
    );

    // Restore
    process.env.DEBUG = originalDebug;
  });

  test('should log header messages with rocket icon', () => {
    logger.header('Test header');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('🚀 Test header')
    );
  });

  test('should log step messages with step number', () => {
    logger.step(1, 'First step');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('1.'),
      'First step'
    );
  });

  test('should log code with gray formatting', () => {
    logger.code('npm install');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('npm install')
    );
  });
});


