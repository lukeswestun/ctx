import { Command } from 'commander';
import { startWatching } from '../../watch/index.js';

export const watchCommand = new Command('watch')
  .description('Watch files and auto-update context')
  .option('--debounce <ms>', 'Debounce time in milliseconds', '1000')
  .option('--format <format>', 'Output format: text, markdown, json')
  .action(async (options) => {
    try {
      await startWatching({
        cwd: process.cwd(),
        debounceMs: parseInt(options.debounce, 10) || 1000,
        format: options.format,
      });
    } catch (error) {
      console.error('Error in watch mode:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
