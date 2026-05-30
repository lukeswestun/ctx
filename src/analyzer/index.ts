import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { ScannedFile } from '../scanner/index.js';

export interface ProjectInfo {
  name: string;
  type: ProjectType;
  framework: string;
  dependencies: DepInfo;
  configFiles: FoundConfig[];
  structure: TreeNode;
  gitInfo: GitInfo | null;
  keyFiles: ScannedFile[];
}

export type ProjectType = 'node' | 'python' | 'go' | 'rust' | 'unknown';
export type Framework =
  | 'next.js'
  | 'react'
  | 'express'
  | 'fastify'
  | 'django'
  | 'flask'
  | 'unknown';

export interface DepInfo {
  total: number;
  production: number;
  dev: number;
}

export interface FoundConfig {
  path: string;
  type: string;
  keyValues?: Record<string, string>;
}

export interface TreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  size?: number;
}

export interface GitInfo {
  branch: string;
  lastCommit: string;
  recentChanges: number;
}

export function analyzeProject(cwd: string, files: ScannedFile[]): ProjectInfo {
  const name = basename(cwd);
  const type = detectProjectType(cwd);
  const framework = detectFramework(cwd, type);
  const dependencies = analyzeDependencies(cwd, type);
  const configFiles = findConfigFiles(cwd, type);
  const gitInfo = getGitInfo(cwd);
  const keyFiles = getKeyFiles(cwd, files);

  return {
    name,
    type,
    framework,
    dependencies,
    configFiles,
    structure: buildTree(files),
    gitInfo,
    keyFiles,
  };
}

function detectProjectType(cwd: string): ProjectType {
  if (existsSync(resolve(cwd, 'package.json'))) return 'node';
  if (existsSync(resolve(cwd, 'pyproject.toml')) || existsSync(resolve(cwd, 'requirements.txt'))) return 'python';
  if (existsSync(resolve(cwd, 'go.mod'))) return 'go';
  if (existsSync(resolve(cwd, 'Cargo.toml'))) return 'rust';
  return 'unknown';
}

function detectFramework(cwd: string, type: ProjectType): Framework {
  if (type === 'node') {
    try {
      const pkg = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.next) return 'next.js';
      if (deps.react) return 'react';
      if (deps.express) return 'express';
      if (deps.fastify) return 'fastify';
    } catch { /* ignore */ }
  }
  return 'unknown';
}

function analyzeDependencies(cwd: string, type: ProjectType): DepInfo {
  if (type === 'node') {
    try {
      const pkg = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf-8'));
      const prod = Object.keys(pkg.dependencies ?? {}).length;
      const dev = Object.keys(pkg.devDependencies ?? {}).length;
      return { total: prod + dev, production: prod, dev };
    } catch { /* ignore */ }
  }
  return { total: 0, production: 0, dev: 0 };
}

function findConfigFiles(cwd: string, type: ProjectType): FoundConfig[] {
  const configs: FoundConfig[] = [];

  if (type === 'node') {
    checkConfig(configs, cwd, 'tsconfig.json', 'TypeScript config');
    checkConfig(configs, cwd, 'next.config.js', 'Next.js config');
    checkConfig(configs, cwd, 'next.config.mjs', 'Next.js config');
    checkConfig(configs, cwd, 'next.config.ts', 'Next.js config');
    checkConfig(configs, cwd, 'tailwind.config.js', 'Tailwind config');
    checkConfig(configs, cwd, 'eslint.config.js', 'ESLint config');
    checkConfig(configs, cwd, '.eslintrc.json', 'ESLint config');
    checkConfig(configs, cwd, 'vitest.config.ts', 'Vitest config');
    checkConfig(configs, cwd, 'jest.config.ts', 'Jest config');
  }

  return configs;
}

function checkConfig(configs: FoundConfig[], cwd: string, path: string, type: string): void {
  const fullPath = resolve(cwd, path);
  if (existsSync(fullPath)) {
    configs.push({ path: fullPath, type });
  }
}

function getGitInfo(cwd: string): GitInfo | null {
  try {
    const headPath = resolve(cwd, '.git', 'HEAD');
    if (!existsSync(headPath)) return null;

    const head = readFileSync(headPath, 'utf-8').trim();
    const branch = head.startsWith('ref: ')
      ? head.replace('ref: refs/heads/', '')
      : 'detached';

    return { branch, lastCommit: '', recentChanges: 0 };
  } catch {
    return null;
  }
}

function getKeyFiles(cwd: string, files: ScannedFile[]): ScannedFile[] {
  const priority = ['package.json', 'tsconfig.json', 'README.md', 'Dockerfile'];
  const result: ScannedFile[] = [];

  for (const name of priority) {
    const found = files.find(f => f.path === name || f.path.endsWith('/' + name));
    if (found) result.push(found);
  }

  result.push(...files.slice(0, 5));
  return [...new Set(result)];
}

function buildTree(files: ScannedFile[]): TreeNode {
  const root: TreeNode = { name: '', type: 'directory', children: [] };
  const dirMap = new Map<string, ScannedFile[]>();

  for (const file of files) {
    const parts = file.path.split('/');
    const topDir = parts[0];

    if (!dirMap.has(topDir)) {
      dirMap.set(topDir, []);
    }
    dirMap.get(topDir)!.push(file);
  }

  for (const [dir, dirFiles] of dirMap) {
    if (dirFiles.length === 1 && dirFiles[0].path === dir) {
      const file = dirFiles[0];
      root.children!.push({ name: dir, type: 'file' as const, size: file.size });
    } else {
      root.children!.push({ name: dir + '/', type: 'directory' as const });
    }
  }

  root.children?.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return root;
}
