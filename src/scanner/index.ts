import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import fastGlob from 'fast-glob';
import ignore from 'ignore';

export interface ScanResult {
  files: ScannedFile[];
  totalFiles: number;
  ignoredFiles: number;
}

export interface ScannedFile {
  path: string;
  size: number;
  modified: Date;
}

export interface ScannerOptions {
  cwd: string;
  maxDepth: number;
  maxFiles: number;
  include: string[];
  exclude: string[];
}

export async function scanProject(options: ScannerOptions): Promise<ScanResult> {
  const { cwd, maxDepth, maxFiles, exclude } = options;

  const ig = ignore();
  ig.add(exclude);

  const gitignorePath = resolve(cwd, '.gitignore');
  if (existsSync(gitignorePath)) {
    const gitignore = readFileSync(gitignorePath, 'utf-8');
    ig.add(gitignore);
  }

  const ctxignorePath = resolve(cwd, '.ctxignore');
  if (existsSync(ctxignorePath)) {
    const ctxignore = readFileSync(ctxignorePath, 'utf-8');
    ig.add(ctxignore);
  }

  const patterns = ['**/*'];
  const entries = await fastGlob(patterns, {
    cwd,
    dot: true,
    followSymbolicLinks: false,
    deep: maxDepth,
    stats: true,
    ignore: exclude,
  });

  const filtered: ScannedFile[] = [];
  for (const entry of entries) {
    if (filtered.length >= maxFiles) break;

    const relativePath = entry.path;
    if (ig.ignores(relativePath)) continue;

    filtered.push({
      path: relativePath,
      size: entry.stats?.size ?? 0,
      modified: entry.stats?.mtime ?? new Date(),
    });
  }

  filtered.sort((a, b) => b.modified.getTime() - a.modified.getTime());

  return {
    files: filtered,
    totalFiles: entries.length,
    ignoredFiles: entries.length - filtered.length,
  };
}
