import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Import modules
const { listFeatures } = await import('../../src/commands/list.js');

describe('List Command', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrinkl-list-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
    
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
    test('should exit with error when not initialized', async () => {
      await listFeatures({});

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('when .ai directory exists', () => {
    beforeEach(() => {
      // Create basic .ai directory structure
      fs.mkdirSync('.ai/ledgers/archived', { recursive: true });
    });

    describe('with no feature files', () => {
      test('should display no features message', async () => {
        await listFeatures({});

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('No active feature ledgers found')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Create your first feature with: wrinkl feature my-feature')
        );
      });
    });

    describe('with active feature files', () => {
      beforeEach(() => {
        // Create sample feature files
        const feature1 = `# User Authentication

**Summary:** Implement user login and registration
**Status:** In Progress
**Branch:** feat/user-auth
**Created:** 2024-01-15

## Description
User authentication system with JWT tokens.`;

        const feature2 = `# Payment Integration

**Summary:** Add payment processing with Stripe
**Status:** Complete
**Branch:** feat/payments
**Created:** 2024-01-10

## Description
Integration with Stripe for payment processing.`;

        const feature3 = `# Email Notifications

**Summary:** Send email notifications to users
**Status:** Blocked
**Branch:** feat/email
**Created:** 2024-01-20

## Description
Email notification system using SendGrid.`;

        fs.writeFileSync('.ai/ledgers/user-authentication.md', feature1);
        fs.writeFileSync('.ai/ledgers/payment-integration.md', feature2);
        fs.writeFileSync('.ai/ledgers/email-notifications.md', feature3);
      });

      test('should list all active features with correct information', async () => {
        await listFeatures({});

        // Verify header
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('📋 Active Features:')
        );

        // Verify feature names are displayed
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('User Authentication')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Payment Integration')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Email Notifications')
        );

        // Verify summaries are displayed
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Implement user login and registration')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Add payment processing with Stripe')
        );

        // Verify file names are displayed
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('user-authentication.md')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('payment-integration.md')
        );
      });

      test('should handle features without summary gracefully', async () => {
        const featureWithoutSummary = `# Incomplete Feature

**Status:** Planning
**Branch:** feat/incomplete
**Created:** 2024-01-25

## Description
A feature without a summary.`;

        fs.writeFileSync('.ai/ledgers/incomplete-feature.md', featureWithoutSummary);

        await listFeatures({});

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Incomplete Feature')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('No summary available')
        );
      });

      test('should handle features without status gracefully', async () => {
        const featureWithoutStatus = `# No Status Feature

**Summary:** A feature without status
**Branch:** feat/no-status
**Created:** 2024-01-25

## Description
A feature without a status.`;

        fs.writeFileSync('.ai/ledgers/no-status-feature.md', featureWithoutStatus);

        await listFeatures({});

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('No Status Feature')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Unknown')
        );
      });

      test('should ignore template and active files', async () => {
        // Create template and active files that should be ignored
        fs.writeFileSync('.ai/ledgers/_template.md', 'template content');
        fs.writeFileSync('.ai/ledgers/_active.md', 'active content');

        await listFeatures({});

        // Should not display template or active files
        expect(console.log).not.toHaveBeenCalledWith(
          expect.stringContaining('_template.md')
        );
        expect(console.log).not.toHaveBeenCalledWith(
          expect.stringContaining('_active.md')
        );
      });
    });

    describe('with archived features', () => {
      beforeEach(() => {
        // Create archived feature
        const archivedFeature = `# Archived Feature

**Summary:** This feature was completed and archived
**Status:** Archived (2024-01-30)
**Branch:** feat/archived
**Created:** 2024-01-01

## Description
An archived feature for testing.`;

        fs.writeFileSync('.ai/ledgers/archived/archived-feature.md', archivedFeature);
      });

      test('should not show archived features by default', async () => {
        await listFeatures({});

        expect(console.log).not.toHaveBeenCalledWith(
          expect.stringContaining('📦 Archived Features:')
        );
        expect(console.log).not.toHaveBeenCalledWith(
          expect.stringContaining('Archived Feature')
        );
      });

      test('should show archived features when --all flag is used', async () => {
        await listFeatures({ all: true });

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('📦 Archived Features:')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Archived Feature')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('archived/archived-feature.md')
        );
      });

      test('should handle empty archived directory', async () => {
        // Remove archived feature
        fs.unlinkSync('.ai/ledgers/archived/archived-feature.md');

        await listFeatures({ all: true });

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('No archived features found')
        );
      });

      test('should handle missing archived directory', async () => {
        // Remove archived directory
        fs.rmSync('.ai/ledgers/archived', { recursive: true, force: true });

        await listFeatures({ all: true });

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('No archived features found')
        );
      });
    });

    describe('error handling', () => {
      test('should handle missing ledgers directory', async () => {
        // Remove ledgers directory
        fs.rmSync('.ai/ledgers', { recursive: true, force: true });

        await listFeatures({});

        // Check that the warning message was logged (it's the second argument to console.log)
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('⚠️'),
          'No ledgers directory found.'
        );
      });

      test('should handle file read errors gracefully', async () => {
        // Create a file with restricted permissions (if possible)
        fs.writeFileSync('.ai/ledgers/test-feature.md', 'test content');
        
        // Mock fs.readFileSync to throw an error
        const originalReadFileSync = fs.readFileSync;
        jest.spyOn(fs, 'readFileSync').mockImplementation((filePath, encoding) => {
          if (filePath.includes('test-feature.md')) {
            throw new Error('Permission denied');
          }
          return originalReadFileSync(filePath, encoding);
        });

        await listFeatures({});

        expect(process.exit).toHaveBeenCalledWith(1);
        
        // Restore
        fs.readFileSync.mockRestore();
      });
    });
  });
});
