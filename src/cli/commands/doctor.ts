import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const doctorCommand = new Command('doctor')
  .description('Check installation and project setup')
  .action(() => {
    const cwd = process.cwd();
    let allGood = true;

    console.log('  ctx doctor — System Check\n');

    const nodeVersion = process.version;
    console.log(`  Node.js:    ${nodeVersion}${nodeVersion >= 'v18' ? ' ✓' : ' ✗ (need >=18)'}`);
    if (nodeVersion < 'v18') allGood = false;

    const pkgPath = resolve(cwd, 'package.json');
    if (existsSync(pkgPath)) {
      console.log('  package.json:                  ✓');
    } else {
      console.log('  package.json:                  ✗ (not found)');
    }

    const ctxDir = resolve(cwd, '.ctx');
    if (existsSync(ctxDir)) {
      console.log('  .ctx/config:                   ✓');
    } else {
      console.log('  .ctx/config:                   — (run ctx init)');
    }

    const gitDir = resolve(cwd, '.git');
    if (existsSync(gitDir)) {
      console.log('  Git repository:                ✓');
    } else {
      console.log('  Git repository:                — (not a git repo)');
    }

    console.log('');
    if (allGood) {
      console.log('  ✓ System looks good. Ready to generate context.');
    } else {
      console.log('  ⚠ Some checks failed. See details above.');
    }
  });
