// Main entry point for the wrinkl package
// Exports the core functionality for programmatic use

export { archiveFeature } from './commands/archive.js';
export { createFeature } from './commands/feature.js';
export { init } from './commands/init.js';
export { listFeatures } from './commands/list.js';
export { config } from './utils/config.js';
export { logger } from './utils/logger.js';
export {
  detectPackageManager,
  getInstallCommand,
  getPackageManagerInfo,
  getRunCommand
} from './utils/package-manager.js';
