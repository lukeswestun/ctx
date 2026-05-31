import { Command } from 'commander';
import { loadConfig } from '../../config/index.js';

export const configCommand = new Command('config')
  .description('View or edit project configuration')
  .option('--show', 'Show current configuration')
  .action(() => {
    const config = loadConfig(process.cwd());
    console.log(JSON.stringify(config, null, 2));
  });
