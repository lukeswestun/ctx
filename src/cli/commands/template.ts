import { Command } from 'commander';

export const templateCommand = new Command('template')
  .description('Manage context templates (Pro)')
  .argument('[action]', 'Action: list, create, use')
  .argument('[name]', 'Template name')
  .action((action?: string) => {
    if (!action) {
      console.log('  Usage: ctx template <list|create|use> [name]');
      console.log('\n  Available templates:');
      console.log('    standard    Default context template');
      console.log('\n  Pro templates (coming soon):');
      console.log('    review      Code review context');
      console.log('    debug       Debugging context');
      console.log('    onboard     Onboarding context');
      return;
    }

    console.log(`  ✗ Template management is a Pro feature. Coming soon.`);
  });
