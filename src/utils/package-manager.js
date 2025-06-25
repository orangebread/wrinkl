import fs from 'node:fs';
import path from 'node:path';

/**
 * Detect which package manager is being used in the current project
 * @returns {string} 'npm' | 'pnpm' | 'yarn' | 'unknown'
 */
export function detectPackageManager() {
  const cwd = process.cwd();

  // Check for lock files in order of preference
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }

  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }

  // Check for package.json with packageManager field
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.packageManager) {
        const pm = packageJson.packageManager.toLowerCase();
        if (pm.includes('pnpm')) return 'pnpm';
        if (pm.includes('yarn')) return 'yarn';
        if (pm.includes('npm')) return 'npm';
      }
    } catch (_error) {
      // Ignore parsing errors
    }
  }

  // Check environment variables
  if (process.env.npm_config_user_agent) {
    const userAgent = process.env.npm_config_user_agent.toLowerCase();
    if (userAgent.includes('pnpm')) return 'pnpm';
    if (userAgent.includes('yarn')) return 'yarn';
    if (userAgent.includes('npm')) return 'npm';
  }

  // Default fallback
  return 'npm';
}

/**
 * Get the appropriate install command for the detected package manager
 * @param {string} packageName - The package to install
 * @param {boolean} global - Whether to install globally
 * @returns {string} The install command
 */
export function getInstallCommand(packageName = 'wrinkl', global = true) {
  const pm = detectPackageManager();

  switch (pm) {
    case 'pnpm':
      return global ? `pnpm add -g ${packageName}` : `pnpm add ${packageName}`;
    case 'yarn':
      return global ? `yarn global add ${packageName}` : `yarn add ${packageName}`;
    default:
      return global ? `npm install -g ${packageName}` : `npm install ${packageName}`;
  }
}

/**
 * Get the appropriate run command for the detected package manager
 * @param {string} script - The script to run
 * @returns {string} The run command
 */
export function getRunCommand(script) {
  const pm = detectPackageManager();

  switch (pm) {
    case 'pnpm':
      return `pnpm ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    default:
      return `npm run ${script}`;
  }
}

/**
 * Get package manager specific messages and tips
 * @returns {object} Package manager specific information
 */
export function getPackageManagerInfo() {
  const pm = detectPackageManager();

  const info = {
    npm: {
      name: 'npm',
      displayName: 'npm',
      installGlobal: 'npm install -g wrinkl',
      runScript: 'npm run',
      tips: [
        'Use npm scripts in package.json for project automation',
        'Consider using npm workspaces for monorepos'
      ]
    },
    pnpm: {
      name: 'pnpm',
      displayName: 'pnpm',
      installGlobal: 'pnpm add -g wrinkl',
      runScript: 'pnpm',
      tips: [
        'pnpm is faster and more disk-efficient than npm',
        'Use pnpm workspaces for better monorepo support'
      ]
    },
    yarn: {
      name: 'yarn',
      displayName: 'Yarn',
      installGlobal: 'yarn global add wrinkl',
      runScript: 'yarn',
      tips: [
        'Yarn provides deterministic installs and better caching',
        'Use yarn workspaces for monorepo management'
      ]
    }
  };

  return info[pm] || info.npm;
}
