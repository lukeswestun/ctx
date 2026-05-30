import { Command } from 'commander';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_CONFIG } from '../../config/defaults.js';

export const initCommand = new Command('init')
  .description('Initialize ctx in this project')
  .argument('[directory]', 'Project directory', '.')
  .action((directory: string) => {
    const cwd = resolve(process.cwd(), directory);

    const ctxDir = resolve(cwd, '.ctx');
    if (!existsSync(ctxDir)) {
      mkdirSync(ctxDir, { recursive: true });
    }

    const configPath = resolve(ctxDir, 'config.json');
    if (!existsSync(configPath)) {
      const config = {
        ...DEFAULT_CONFIG,
        project: {
          ...DEFAULT_CONFIG.project,
          name: cwd.split('/').pop() || 'my-project',
        },
      };
      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
      console.log(`  ✓ Initialized ctx in ${cwd}`);
    } else {
      console.log(`  ✓ ctx already initialized in ${cwd}`);
    }
  });
