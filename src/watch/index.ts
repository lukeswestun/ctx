import { watch, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { scanProject, ScannedFile } from '../scanner/index.js';
import { analyzeProject } from '../analyzer/index.js';
import { formatOutput, OutputFormat } from '../formatter/index.js';
import { loadConfig } from '../config/index.js';
import { copyToClipboard } from '../utils/clipboard.js';
import type { CtxConfig } from '../config/defaults.js';

export interface WatchOptions {
  cwd: string;
  debounceMs: number;
  format?: OutputFormat;
  onChange?: (output: string) => void;
}

export async function startWatching(options: WatchOptions): Promise<void> {
  const { cwd, debounceMs, format } = options;
  const config = loadConfig(cwd);

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  const generate = async () => {
    if (running) return;
    running = true;
    try {
      const scanResult = await scanProject({
        cwd,
        maxDepth: config.scan.maxDepth,
        maxFiles: config.scan.maxFiles,
        include: config.scan.include,
        exclude: config.scan.exclude,
      });

      const projectInfo = analyzeProject(cwd, scanResult.files);
      const fmt = format || config.output.format;
      const output = formatOutput(projectInfo, fmt as OutputFormat);

      await copyToClipboard(output);
      console.clear();
      console.log(output);
      console.log('\n  ✓ Watching for changes... (Ctrl+C to stop)');
    } finally {
      running = false;
    }
  };

  const watchedDirs = new Set<string>();
  const dirsToWatch = [cwd];

  for (const dir of dirsToWatch) {
    if (watchedDirs.has(dir)) continue;
    if (!existsSync(dir)) continue;
    watchedDirs.add(dir);

    const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      const relativePath = filename.toString();

      const ignorePatterns = [
        'node_modules', '.git', 'dist', 'build', '.next',
        'coverage', '.cache', '.turbo', '.ctx',
      ];
      for (const pattern of ignorePatterns) {
        if (relativePath.includes(pattern)) return;
      }

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(generate, debounceMs);
    });

    process.on('SIGINT', () => {
      watcher.close();
      console.log('\n  ✗ Watch stopped.');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      watcher.close();
      process.exit(0);
    });
  }

  await generate();
}
