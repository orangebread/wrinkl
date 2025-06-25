module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code style
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // Best practices
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off', // Allow console in CLI tool
    'prefer-const': 'error',
    'no-var': 'error',
    
    // ES6+
    'arrow-spacing': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    
    // Async/await
    'require-await': 'error',
    'no-return-await': 'error',
    
    // Error handling
    'no-throw-literal': 'error',
    
    // Code complexity
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', 50],
    
    // Spacing and formatting
    'space-before-function-paren': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    
    // Import/export
    'no-duplicate-imports': 'error'
  },
  overrides: [
    {
      files: ['test/**/*.js', '**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        // Relax some rules for tests
        'max-lines-per-function': 'off',
        'no-unused-expressions': 'off'
      }
    }
  ]
};
