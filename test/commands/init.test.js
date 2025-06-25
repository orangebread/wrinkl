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
const { init } = await import('../../src/commands/init.js');
const { config } = await import('../../src/utils/config.js');

describe('Init Command', () => {
  let tempDir;
  let originalCwd;
  let mockSpinner;

  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrinkl-init-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
    
    // Mock spinner
    mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    };
    
    ora.default.mockReturnValue(mockSpinner);
    
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
    test('should create directory structure and files', async () => {
      // Mock user responses
      prompts.default.mockResolvedValue({
        projectName: 'test-project',
        projectType: 'web app',
        stack: 'TypeScript, Node.js',
        cursorrules: true,
        augment: false,
        copilot: false
      });

      await init({});

      // Verify directory structure was created
      expect(fs.existsSync('.ai')).toBe(true);
      expect(fs.existsSync('.ai/ledgers')).toBe(true);
      expect(fs.existsSync('.ai/ledgers/archived')).toBe(true);
      
      // Verify core files were created
      expect(fs.existsSync('.ai/README.md')).toBe(true);
      expect(fs.existsSync('.ai/project.md')).toBe(true);
      expect(fs.existsSync('.ai/patterns.md')).toBe(true);
      expect(fs.existsSync('.ai/architecture.md')).toBe(true);
      expect(fs.existsSync('.ai/context-rules.md')).toBe(true);
      expect(fs.existsSync('.ai/ledgers/_template.md')).toBe(true);
      expect(fs.existsSync('.ai/ledgers/_active.md')).toBe(true);
      
      // Verify optional files
      expect(fs.existsSync('.cursorrules')).toBe(true);
      expect(fs.existsSync('augment.md')).toBe(false);
      expect(fs.existsSync('.github/copilot-instructions.md')).toBe(false);
    });

    test('should create optional files when requested', async () => {
      prompts.default.mockResolvedValue({
        projectName: 'test-project',
        projectType: 'web app',
        stack: 'TypeScript, Node.js',
        cursorrules: false,
        augment: true,
        copilot: true
      });

      await init({});

      // Verify optional files were created/not created correctly
      expect(fs.existsSync('.cursorrules')).toBe(false);
      expect(fs.existsSync('augment.md')).toBe(true);
      expect(fs.existsSync('.github/copilot-instructions.md')).toBe(true);
    });

    test('should substitute variables in project.md', async () => {
      prompts.default.mockResolvedValue({
        projectName: 'My Test Project',
        projectType: 'mobile app',
        stack: 'React Native, Node.js',
        cursorrules: false,
        augment: false,
        copilot: false
      });

      await init({});

      const projectContent = fs.readFileSync('.ai/project.md', 'utf-8');
      expect(projectContent).toContain('My Test Project');
      expect(projectContent).toContain('mobile app');
      expect(projectContent).toContain('React Native, Node.js');
    });

    test('should use provided options and skip prompts for those values', async () => {
      // Mock responses for the prompts that will still be called (cursor, augment, copilot)
      prompts.default
        .mockResolvedValueOnce({ cursorrules: true })
        .mockResolvedValueOnce({ augment: false })
        .mockResolvedValueOnce({ copilot: false });

      await init({
        name: 'custom-project',
        type: 'api',
        stack: 'Python, FastAPI'
      });

      // Verify that prompts was called 3 times (for cursor, augment, copilot)
      // but NOT for name, type, or stack since those were provided
      expect(prompts.default).toHaveBeenCalledTimes(3);

      // Verify the project.md contains the provided values
      const projectContent = fs.readFileSync('.ai/project.md', 'utf-8');
      expect(projectContent).toContain('custom-project');
      expect(projectContent).toContain('api');
      expect(projectContent).toContain('Python, FastAPI');
    });
  });

  describe('when .ai directory already exists', () => {
    beforeEach(() => {
      // Create existing .ai directory
      fs.mkdirSync('.ai', { recursive: true });
      fs.writeFileSync('.ai/existing.md', 'existing content');
    });

    test('should prompt for overwrite confirmation', async () => {
      prompts.default
        .mockResolvedValueOnce({ overwrite: false })
        .mockResolvedValueOnce({
          projectName: 'test-project',
          projectType: 'web app',
          stack: 'TypeScript, Node.js',
          cursorrules: true,
          augment: false,
          copilot: false
        });

      await init({});

      // Verify overwrite prompt was shown
      expect(prompts.default).toHaveBeenCalledWith({
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite the existing configuration?',
        initial: false
      });
    });

    test('should exit when user chooses not to overwrite', async () => {
      prompts.default.mockResolvedValue({ overwrite: false });

      await init({});

      // Verify existing file is still there
      expect(fs.existsSync('.ai/existing.md')).toBe(true);
      expect(fs.readFileSync('.ai/existing.md', 'utf-8')).toBe('existing content');
    });

    test('should proceed when user chooses to overwrite', async () => {
      prompts.default
        .mockResolvedValueOnce({ overwrite: true })
        .mockResolvedValueOnce({
          projectName: 'test-project',
          projectType: 'web app',
          stack: 'TypeScript, Node.js',
          cursorrules: true,
          augment: false,
          copilot: false
        });

      await init({});

      // Verify new files were created
      expect(fs.existsSync('.ai/project.md')).toBe(true);
      expect(fs.existsSync('.ai/README.md')).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should handle template file not found error', async () => {
      // Mock a scenario where template files don't exist
      const originalTemplatesDir = config.paths.templatesDir;
      config.paths.templatesDir = '/nonexistent/path';

      prompts.default.mockResolvedValue({
        projectName: 'test-project',
        projectType: 'web app',
        stack: 'TypeScript, Node.js',
        cursorrules: true,
        augment: false,
        copilot: false
      });

      await init({});

      // Verify error handling
      expect(process.exit).toHaveBeenCalledWith(1);
      
      // Restore
      config.paths.templatesDir = originalTemplatesDir;
    });
  });
});
