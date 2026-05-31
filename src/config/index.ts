import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { CtxConfig, DEFAULT_CONFIG } from './defaults.js';

const CTX_DIR = '.ctx';
const CONFIG_FILE = 'config.json';

function getConfigPath(cwd: string): string {
  return resolve(cwd, CTX_DIR, CONFIG_FILE);
}

export function loadConfig(cwd: string): CtxConfig {
  const configPath = getConfigPath(cwd);
  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, 'utf-8');
      const userConfig = JSON.parse(raw) as Partial<CtxConfig>;
      return deepMerge(DEFAULT_CONFIG, userConfig);
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }
  return { ...DEFAULT_CONFIG };
}

export function saveConfig(cwd: string, config: CtxConfig): void {
  const configDir = resolve(cwd, CTX_DIR);
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  writeFileSync(getConfigPath(cwd), JSON.stringify(config, null, 2), 'utf-8');
}

function deepMerge(base: CtxConfig, override: Partial<CtxConfig>): CtxConfig {
  return {
    ...base,
    ...override,
    project: { ...base.project, ...override.project },
    scan: { ...base.scan, ...override.scan },
    output: { ...base.output, ...override.output },
    templates: { ...base.templates, ...override.templates },
  };
}
