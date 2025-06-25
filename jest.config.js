export default {
  // ES modules configuration
  transform: {},

  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/test/**/*.test.js',
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  
  // Coverage thresholds (disabled for now)
  // coverageThreshold: {
  //   global: {
  //     branches: 70,
  //     functions: 70,
  //     lines: 70,
  //     statements: 70
  //   }
  // },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json'],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000
};
