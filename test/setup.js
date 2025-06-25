// Jest setup file for global test configuration

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Helper to create temporary test directories
  createTempDir: () => {
    const os = require('os');
    const path = require('path');
    const fs = require('fs-extra');
    
    const tempDir = path.join(os.tmpdir(), `wrinkl-test-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    return tempDir;
  },
  
  // Helper to clean up test directories
  cleanupTempDir: (dir) => {
    const fs = require('fs-extra');
    if (fs.existsSync(dir)) {
      fs.removeSync(dir);
    }
  }
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DEBUG = ''; // Disable debug logging in tests
