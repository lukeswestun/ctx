import { Command } from 'commander';
import { listTemplates, getTemplate, createTemplate } from '../../template/index.js';

export const templateCommand = new Command('template')
  .description('Manage context templates')
  .argument('[action]', 'Action: list, create, use')
  .argument('[name]', 'Template name')
  .action((action?: string, name?: string) => {
    const cwd = process.cwd();

    if (!action || action === 'list') {
      const { builtIn, custom } = listTemplates(cwd);
      console.log('  Available templates:');
      for (const tmpl of builtIn) {
        console.log(`    ${tmpl.name.padEnd(12)} ${tmpl.description}`);
      }
      if (custom.length > 0) {
        console.log('\n  Custom templates:');
        for (const tmpl of custom) {
          console.log(`    ${tmpl.name.padEnd(12)} ${tmpl.description}`);
        }
      }
      return;
    }

    if (action === 'use') {
      if (!name) {
        console.log('  Usage: ctx template use <name>');
        return;
      }
      const tmpl = getTemplate(cwd, name);
      if (tmpl) {
        console.log(`  Using template: ${name}`);
        console.log(`  ${tmpl.description}`);
      } else {
        console.log(`  ✗ Template "${name}" not found.`);
        console.log('  Run "ctx template list" to see available templates.');
      }
      return;
    }

    if (action === 'create') {
      if (!name) {
        console.log('  Usage: ctx template create <name>');
        return;
      }
      createTemplate(cwd, name, {
        name,
        description: `Custom template: ${name}`,
      });
      console.log(`  ✓ Template "${name}" created in .ctx/templates/`);
      return;
    }

    console.log(`  Usage: ctx template <list|create|use> [name]`);
  });
