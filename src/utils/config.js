import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// More robust template path resolution
function getTemplatesDir() {
  // First try the relative path from utils directory
  let templatesDir = path.join(__dirname, '../templates');

  // If that doesn't exist, try from the project root
  if (!fs.existsSync(templatesDir)) {
    // Go up from src/utils to project root, then into src/templates
    templatesDir = path.join(__dirname, '../../src/templates');
  }

  // If still not found, try absolute path based on this file's location
  if (!fs.existsSync(templatesDir)) {
    // __dirname should be /path/to/project/src/utils
    // So go up two levels and then to src/templates
    const projectRoot = path.dirname(path.dirname(__dirname));
    templatesDir = path.join(projectRoot, 'src/templates');
  }

  return templatesDir;
}

export const config = {
  // Default configuration values
  defaults: {
    projectType: 'web app',
    stack: 'TypeScript, Node.js',
    createCursorRules: true,
    createAugment: false,
    createCopilot: false
  },

  // Paths
  paths: {
    aiDir: '.ai',
    ledgersDir: '.ai/ledgers',
    archivedDir: '.ai/ledgers/archived',
    templatesDir: getTemplatesDir(),
    activeFile: '.ai/ledgers/_active.md',
    templateFile: '.ai/ledgers/_template.md'
  },

  // Check if project is initialized
  isInitialized() {
    return fs.existsSync(this.paths.aiDir);
  },

  // Get project configuration if it exists
  getProjectConfig() {
    const projectFile = path.join(this.paths.aiDir, 'project.md');
    if (fs.existsSync(projectFile)) {
      try {
        const content = fs.readFileSync(projectFile, 'utf-8');
        // Parse basic project info from the markdown
        const nameMatch = content.match(/# (.+)/);
        const typeMatch = content.match(/\*\*Type:\*\* (.+)/);
        const stackMatch = content.match(/\*\*Stack:\*\* (.+)/);

        return {
          name: nameMatch ? nameMatch[1] : null,
          type: typeMatch ? typeMatch[1] : null,
          stack: stackMatch ? stackMatch[1] : null
        };
      } catch (_error) {
        return null;
      }
    }
    return null;
  },

  // Validate feature name
  validateFeatureName(name) {
    if (!name || name.trim().length === 0) {
      return 'Feature name is required';
    }

    if (name.length > 50) {
      return 'Feature name must be 50 characters or less';
    }

    if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
      return 'Feature name can only contain letters, numbers, spaces, hyphens, and underscores';
    }

    return null;
  },

  // Convert name to kebab case
  toKebabCase(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  },

  // Get current date in YYYY-MM-DD format
  getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }
};
