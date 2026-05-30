#!/usr/bin/env node
import { Command } from 'commander';
import { contextCommand } from './commands/context.js';
import { initCommand } from './commands/init.js';
import { watchCommand } from './commands/watch.js';
import { configCommand } from './commands/config.js';
import { templateCommand } from './commands/template.js';
import { doctorCommand } from './commands/doctor.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '../../package.json'), 'utf-8')
    );
    return pkg.version;
  } catch {
    return '0.1.0';
  }
}

const program = new Command();

program
  .name('ctx')
  .description('Project context for AI coding tools')
  .version(getVersion());

program.addCommand(contextCommand, { isDefault: true });
program.addCommand(initCommand);
program.addCommand(watchCommand);
program.addCommand(configCommand);
program.addCommand(templateCommand);
program.addCommand(doctorCommand);

program.parse();
