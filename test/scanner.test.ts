import { describe, it, expect } from 'vitest';
import { scanProject } from '../src/scanner/index.js';
import { resolve } from 'node:path';

describe('scanProject', () => {
  it('should scan files in a directory', async () => {
    const result = await scanProject({
      cwd: resolve('.'),
      maxDepth: 3,
      maxFiles: 100,
      include: [],
      exclude: ['node_modules', '.git', 'dist'],
    });
    expect(result.totalFiles).toBeGreaterThan(0);
    expect(Array.isArray(result.files)).toBe(true);
  });

  it('should respect maxFiles limit', async () => {
    const result = await scanProject({
      cwd: resolve('.'),
      maxDepth: 10,
      maxFiles: 5,
      include: [],
      exclude: ['node_modules', '.git'],
    });
    expect(result.files.length).toBeLessThanOrEqual(5);
  });

  it('should filter excluded patterns', async () => {
    const result = await scanProject({
      cwd: resolve('.'),
      maxDepth: 3,
      maxFiles: 1000,
      include: [],
      exclude: ['**/*'],
    });
    expect(result.files.length).toBe(0);
  });
});
