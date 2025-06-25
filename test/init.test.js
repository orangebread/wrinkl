import { jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('inquirer');
jest.mock('ora');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the module after mocking
const { init } = await import('../src/commands/init.js');

describe('init command', () => {
  let mockInquirer;
  let mockOra;
  let mockSpinner;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock ora spinner
    mockSpinner = {
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
    };
    
    mockOra = jest.fn().mockReturnValue(mockSpinner);
    
    // Mock inquirer
    mockInquirer = {
      prompt: jest.fn()
    };
    
    // Mock fs-extra methods
    fs.pathExists.mockResolvedValue(false);
    fs.ensureDir.mockResolvedValue();
    fs.readFile.mockResolvedValue('template content [PROJECT_NAME]');
    fs.outputFile.mockResolvedValue();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'cwd').mockReturnValue('/test/project');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should initialize AI context system with default values', async () => {
    // Mock user responses
    mockInquirer.prompt.mockResolvedValue({
      projectName: 'test-project',
      projectType: 'web app',
      stack: 'TypeScript, Node.js',
      cursorrules: true,
      augment: false,
      copilot: false
    });

    // Mock the inquirer import
    const inquirerModule = await import('inquirer');
    inquirerModule.default.prompt = mockInquirer.prompt;

    // Mock the ora import
    const oraModule = await import('ora');
    oraModule.default = mockOra;

    await init({});

    // Verify inquirer was called
    expect(mockInquirer.prompt).toHaveBeenCalled();
    
    // Verify spinner was used
    expect(mockOra).toHaveBeenCalledWith('Creating AI context structure...');
    expect(mockSpinner.start).toHaveBeenCalled();
    expect(mockSpinner.succeed).toHaveBeenCalledWith('AI context system initialized!');

    // Verify directories were created
    expect(fs.ensureDir).toHaveBeenCalledWith('.ai/ledgers/archived');

    // Verify template files were copied
    expect(fs.outputFile).toHaveBeenCalledWith(
      '.ai/README.md',
      expect.any(String)
    );
    expect(fs.outputFile).toHaveBeenCalledWith(
      '.ai/project.md',
      expect.stringContaining('test-project')
    );
  });

  test('should handle existing AI directory', async () => {
    // Mock existing directory
    fs.pathExists.mockResolvedValue(true);
    
    mockInquirer.prompt
      .mockResolvedValueOnce({ overwrite: false })
      .mockResolvedValueOnce({
        projectName: 'test-project',
        projectType: 'web app',
        stack: 'TypeScript, Node.js',
        cursorrules: true,
        augment: false,
        copilot: false
      });

    const inquirerModule = await import('inquirer');
    inquirerModule.default.prompt = mockInquirer.prompt;

    await init({});

    // Should ask about overwriting
    expect(mockInquirer.prompt).toHaveBeenCalledWith([{
      type: 'confirm',
      name: 'overwrite',
      message: 'Do you want to overwrite the existing configuration?',
      default: false
    }]);
  });

  test('should use provided options', async () => {
    mockInquirer.prompt.mockResolvedValue({
      projectName: 'custom-project',
      projectType: 'mobile app',
      stack: 'React Native',
      cursorrules: false,
      augment: true,
      copilot: true
    });

    const inquirerModule = await import('inquirer');
    inquirerModule.default.prompt = mockInquirer.prompt;

    const oraModule = await import('ora');
    oraModule.default = mockOra;

    await init({
      name: 'custom-project',
      type: 'mobile app',
      stack: 'React Native',
      cursor: false,
      withAugment: true,
      withCopilot: true
    });

    // Verify the prompt was called with the provided defaults
    const promptCall = mockInquirer.prompt.mock.calls[0][0];
    expect(promptCall[0].default).toBe('custom-project');
    expect(promptCall[1].default).toBe('mobile app');
    expect(promptCall[2].default).toBe('React Native');
  });

  test('should handle template copying errors', async () => {
    mockInquirer.prompt.mockResolvedValue({
      projectName: 'test-project',
      projectType: 'web app',
      stack: 'TypeScript, Node.js',
      cursorrules: true,
      augment: false,
      copilot: false
    });

    // Mock file read error
    fs.readFile.mockRejectedValue(new Error('Template not found'));

    const inquirerModule = await import('inquirer');
    inquirerModule.default.prompt = mockInquirer.prompt;

    const oraModule = await import('ora');
    oraModule.default = mockOra;

    // Mock process.exit to prevent test from actually exiting
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await init({});

    // Verify error handling
    expect(mockSpinner.fail).toHaveBeenCalledWith('Failed to initialize AI context system');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('should create optional files based on user choices', async () => {
    mockInquirer.prompt.mockResolvedValue({
      projectName: 'test-project',
      projectType: 'web app',
      stack: 'TypeScript, Node.js',
      cursorrules: true,
      augment: true,
      copilot: true
    });

    const inquirerModule = await import('inquirer');
    inquirerModule.default.prompt = mockInquirer.prompt;

    const oraModule = await import('ora');
    oraModule.default = mockOra;

    await init({});

    // Verify optional files were created
    expect(fs.outputFile).toHaveBeenCalledWith('.cursorrules', expect.any(String));
    expect(fs.outputFile).toHaveBeenCalledWith('augment.md', expect.any(String));
    expect(fs.ensureDir).toHaveBeenCalledWith('.github');
    expect(fs.outputFile).toHaveBeenCalledWith('.github/copilot-instructions.md', expect.any(String));
  });
});
