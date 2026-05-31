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

export type ProjectType = 'node' | 'deno' | 'bun' | 'python' | 'go' | 'rust' | 'unknown';

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

const FRAMEWORK_SIGNATURES: Record<string, { dep?: string; config?: string; label: string }[]> = {
  node: [
    { dep: 'next', label: 'Next.js' },
    { dep: 'nuxt', label: 'Nuxt' },
    { dep: 'sveltekit', label: 'SvelteKit' },
    { dep: 'svelte', label: 'Svelte' },
    { dep: 'vue', label: 'Vue' },
    { dep: 'react', label: 'React' },
    { dep: 'gatsby', label: 'Gatsby' },
    { dep: 'remix', label: 'Remix' },
    { dep: 'astro', label: 'Astro' },
    { dep: 'angular', label: 'Angular' },
    { dep: 'nest', label: 'NestJS' },
    { dep: 'express', label: 'Express' },
    { dep: 'fastify', label: 'Fastify' },
    { dep: 'hono', label: 'Hono' },
    { dep: 'trpc', label: 'tRPC' },
    { dep: 'solid-js', label: 'Solid' },
    { dep: 'solid-start', label: 'SolidStart' },
    { dep: '@11ty/eleventy', label: 'Eleventy' },
    { dep: 'docusaurus', label: 'Docusaurus' },
    { dep: 'vitepress', label: 'VitePress' },
    { dep: '@remix-run/react', label: 'Remix' },
    { dep: '@sveltejs/kit', label: 'SvelteKit' },
    { dep: '@nuxt/kit', label: 'Nuxt' },
    { dep: '@angular/core', label: 'Angular' },
    { dep: '@nestjs/core', label: 'NestJS' },
    { dep: 'electron', label: 'Electron' },
    { dep: 'expo', label: 'Expo' },
    { dep: 'react-native', label: 'React Native' },
    { dep: 'preact', label: 'Preact' },
    { dep: 'lit', label: 'Lit' },
    { config: 'astro.config.mjs', label: 'Astro' },
    { config: 'astro.config.ts', label: 'Astro' },
    { config: 'svelte.config.js', label: 'SvelteKit' },
    { config: 'vue.config.js', label: 'Vue' },
    { config: 'nuxt.config.ts', label: 'Nuxt' },
    { config: 'nuxt.config.js', label: 'Nuxt' },
    { config: 'remix.config.js', label: 'Remix' },
    { config: 'gatsby-config.js', label: 'Gatsby' },
    { config: 'next.config.js', label: 'Next.js' },
    { config: 'next.config.mjs', label: 'Next.js' },
    { config: 'next.config.ts', label: 'Next.js' },
  ],
  python: [
    { dep: 'django', label: 'Django' },
    { dep: 'flask', label: 'Flask' },
    { dep: 'fastapi', label: 'FastAPI' },
    { dep: 'tornado', label: 'Tornado' },
    { dep: 'aiohttp', label: 'aiohttp' },
    { dep: 'starlette', label: 'Starlette' },
    { dep: 'bottle', label: 'Bottle' },
    { dep: 'pyramid', label: 'Pyramid' },
    { dep: 'sanic', label: 'Sanic' },
    { config: 'manage.py', label: 'Django' },
    { config: 'app.py', label: 'Flask' },
  ],
  go: [
    { dep: 'gin', label: 'Gin' },
    { dep: 'echo', label: 'Echo' },
    { dep: 'fiber', label: 'Fiber' },
    { dep: 'chi', label: 'Chi' },
    { dep: 'mux', label: 'Mux' },
    { dep: 'negroni', label: 'Negroni' },
  ],
  rust: [
    { dep: 'axum', label: 'Axum' },
    { dep: 'actix-web', label: 'Actix' },
    { dep: 'rocket', label: 'Rocket' },
    { dep: 'tide', label: 'Tide' },
    { dep: 'warp', label: 'Warp' },
    { dep: 'salvo', label: 'Salvo' },
    { dep: 'poem', label: 'Poem' },
    { dep: 'leptos', label: 'Leptos' },
    { dep: 'yew', label: 'Yew' },
    { dep: 'dioxus', label: 'Dioxus' },
  ],
};

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
  if (existsSync(resolve(cwd, 'deno.json')) || existsSync(resolve(cwd, 'deno.jsonc'))) return 'deno';
  if (existsSync(resolve(cwd, 'bun.lock')) || existsSync(resolve(cwd, 'bun.lockb'))) return 'bun';
  if (existsSync(resolve(cwd, 'pyproject.toml')) || existsSync(resolve(cwd, 'requirements.txt')) || existsSync(resolve(cwd, 'Pipfile'))) return 'python';
  if (existsSync(resolve(cwd, 'go.mod'))) return 'go';
  if (existsSync(resolve(cwd, 'Cargo.toml'))) return 'rust';
  return 'unknown';
}

function detectFramework(cwd: string, type: ProjectType): string {
  const signatures = FRAMEWORK_SIGNATURES[type];
  if (!signatures) return 'Unknown';

  let deps: Record<string, string> = {};
  if (type === 'node' || type === 'bun' || type === 'deno') {
    try {
      const pkg = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf-8'));
      deps = { ...pkg.dependencies, ...pkg.devDependencies };
    } catch { /* ignore */ }
  }

  if (type === 'python') {
    try {
      const req = readFileSync(resolve(cwd, 'requirements.txt'), 'utf-8');
      for (const sig of signatures) {
        if (sig.dep && req.toLowerCase().includes(sig.dep)) return sig.label;
      }
    } catch { /* ignore */ }
    try {
      const toml = readFileSync(resolve(cwd, 'pyproject.toml'), 'utf-8');
      for (const sig of signatures) {
        if (sig.dep && toml.toLowerCase().includes(sig.dep)) return sig.label;
      }
    } catch { /* ignore */ }
  }

  if (type === 'go') {
    try {
      const mod = readFileSync(resolve(cwd, 'go.mod'), 'utf-8');
      for (const sig of signatures) {
        if (sig.dep && mod.includes(sig.dep)) return sig.label;
      }
    } catch { /* ignore */ }
  }

  if (type === 'rust') {
    try {
      const toml = readFileSync(resolve(cwd, 'Cargo.toml'), 'utf-8');
      for (const sig of signatures) {
        if (sig.dep && toml.includes(sig.dep)) return sig.label;
      }
    } catch { /* ignore */ }
  }

  for (const sig of signatures) {
    if (sig.config && existsSync(resolve(cwd, sig.config))) return sig.label;
    if (sig.dep && deps[sig.dep]) return sig.label;
  }

  if (type === 'node') return 'Node.js';
  if (type === 'deno') return 'Deno';
  if (type === 'bun') return 'Bun';
  return 'Unknown';
}

function analyzeDependencies(cwd: string, type: ProjectType): DepInfo {
  if (type === 'node' || type === 'deno' || type === 'bun') {
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

  const configChecks: [string, string][] = [
    ['tsconfig.json', 'TypeScript config'],
    ['jsconfig.json', 'JavaScript config'],
    ['next.config.js', 'Next.js config'],
    ['next.config.mjs', 'Next.js config'],
    ['next.config.ts', 'Next.js config'],
    ['tailwind.config.js', 'Tailwind config'],
    ['tailwind.config.ts', 'Tailwind config'],
    ['eslint.config.js', 'ESLint config'],
    ['eslint.config.mjs', 'ESLint config'],
    ['.eslintrc.json', 'ESLint config'],
    ['vitest.config.ts', 'Vitest config'],
    ['vitest.config.js', 'Vitest config'],
    ['jest.config.ts', 'Jest config'],
    ['jest.config.js', 'Jest config'],
    ['vite.config.ts', 'Vite config'],
    ['vite.config.js', 'Vite config'],
    ['astro.config.mjs', 'Astro config'],
    ['astro.config.ts', 'Astro config'],
    ['svelte.config.js', 'Svelte config'],
    ['nuxt.config.ts', 'Nuxt config'],
    ['nuxt.config.js', 'Nuxt config'],
    ['vue.config.js', 'Vue config'],
    ['remix.config.js', 'Remix config'],
    ['gatsby-config.js', 'Gatsby config'],
    ['gatsby-config.ts', 'Gatsby config'],
    ['playwright.config.ts', 'Playwright config'],
    ['playwright.config.js', 'Playwright config'],
    ['.prettierrc', 'Prettier config'],
    ['prettier.config.js', 'Prettier config'],
    ['.prettierrc.json', 'Prettier config'],
    ['biome.json', 'Biome config'],
    ['biome.jsonc', 'Biome config'],
    ['docker-compose.yml', 'Docker Compose'],
    ['docker-compose.yaml', 'Docker Compose'],
    ['.github/workflows', 'GitHub Actions'],
    ['.vscode', 'VS Code'],
    ['Makefile', 'Makefile'],
    ['.editorconfig', 'EditorConfig'],
  ];

  for (const [path, typeName] of configChecks) {
    checkConfig(configs, cwd, path, typeName);
  }

  if (type === 'python') {
    checkConfig(configs, cwd, 'pyproject.toml', 'Python project');
    checkConfig(configs, cwd, 'requirements.txt', 'Python deps');
    checkConfig(configs, cwd, 'manage.py', 'Django manage');
    checkConfig(configs, cwd, 'Dockerfile', 'Dockerfile');
  }

  if (type === 'go') {
    checkConfig(configs, cwd, 'go.mod', 'Go module');
    checkConfig(configs, cwd, 'Makefile', 'Makefile');
  }

  if (type === 'rust') {
    checkConfig(configs, cwd, 'Cargo.toml', 'Cargo');
    checkConfig(configs, cwd, 'Cargo.lock', 'Cargo lock');
    checkConfig(configs, cwd, 'rust-toolchain.toml', 'Rust toolchain');
    checkConfig(configs, cwd, 'rustfmt.toml', 'Rustfmt config');
    checkConfig(configs, cwd, 'clippy.toml', 'Clippy config');
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
  const priority = ['package.json', 'tsconfig.json', 'README.md', 'Dockerfile', '.env.example'];
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

  for (const file of files) {
    const parts = file.path.split('/');
    const topDir = parts[0];

    const existing = root.children?.find(c => c.name === topDir || c.name === topDir + '/');
    if (!existing) {
      if (parts.length === 1) {
        root.children!.push({ name: topDir, type: 'file', size: file.size });
      } else {
        root.children!.push({ name: topDir + '/', type: 'directory' });
      }
    }
  }

  root.children?.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return root;
}
