import { describe, it, expect } from 'vitest';
import { loadConfig, saveConfig } from '../src/config/index.js';
import { DEFAULT_CONFIG, CtxConfig } from '../src/config/defaults.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('config', () => {
  it('should return default config when no config exists', () => {
    const config = loadConfig('/nonexistent');
    expect(config.scan.maxDepth).toBe(DEFAULT_CONFIG.scan.maxDepth);
    expect(config.scan.exclude).toEqual(DEFAULT_CONFIG.scan.exclude);
  });

  it('should save and load config', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'ctx-test-'));
    try {
      const testConfig: CtxConfig = {
        ...DEFAULT_CONFIG,
        project: { name: 'test', type: 'node' },
      };
      saveConfig(tmpDir, testConfig);
      const loaded = loadConfig(tmpDir);
      expect(loaded.project.name).toBe('test');
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
