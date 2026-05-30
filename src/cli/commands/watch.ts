import { Command } from 'commander';

export const watchCommand = new Command('watch')
  .description('Watch files and auto-update context (Pro)')
  .option('--debounce <ms>', 'Debounce time in milliseconds', '1000')
  .action((options) => {
    console.log('  ✗ ctx watch is a Pro feature. Coming soon.');
    console.log('  Get notified: https://ctx.dev');
  });
