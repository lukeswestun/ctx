import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanProject } from '../src/scanner/index.js';
import { analyzeProject } from '../src/analyzer/index.js';
import { formatOutput } from '../src/formatter/index.js';

describe('smoke test', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'ctx-smoke-'));
    writeFileSync(join(tmpDir, 'package.json'), JSON.stringify({
      name: 'test-project',
      dependencies: { next: '14.0.0', react: '18.0.0' },
      devDependencies: { typescript: '5.0.0' },
    }));
    writeFileSync(join(tmpDir, 'tsconfig.json'), '{}');
    writeFileSync(join(tmpDir, 'README.md'), '# Test');
    writeFileSync(join(tmpDir, 'index.js'), 'console.log("hello");');
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should detect Next.js project', async () => {
    const scanResult = await scanProject({
      cwd: tmpDir,
      maxDepth: 6,
      maxFiles: 1000,
      include: [],
      exclude: ['node_modules', '.git', 'dist'],
    });

    const info = analyzeProject(tmpDir, scanResult.files);
    expect(info.name).toBe(tmpDir.split('/').pop());
    expect(info.type).toBe('node');
    expect(info.framework).toBe('Next.js');
    expect(info.dependencies.production).toBe(2);
    expect(info.dependencies.dev).toBe(1);
    expect(info.dependencies.total).toBe(3);
  });

  it('should generate text output without errors', async () => {
    const scanResult = await scanProject({
      cwd: tmpDir,
      maxDepth: 6,
      maxFiles: 1000,
      include: [],
      exclude: ['node_modules', '.git', 'dist'],
    });

    const info = analyzeProject(tmpDir, scanResult.files);
    const output = formatOutput(info, 'text');

    expect(output).toContain('Next.js');
    expect(output).toContain('package.json');
    expect(output).toContain('README.md');
  });

  it('should generate JSON output', async () => {
    const scanResult = await scanProject({
      cwd: tmpDir,
      maxDepth: 6,
      maxFiles: 1000,
      include: [],
      exclude: ['node_modules', '.git', 'dist'],
    });

    const info = analyzeProject(tmpDir, scanResult.files);
    const output = formatOutput(info, 'json');

    const parsed = JSON.parse(output);
    expect(parsed.project).toBe(tmpDir.split('/').pop());
    expect(parsed.type).toBe('node');
    expect(parsed.framework).toBe('Next.js');
  });
});
