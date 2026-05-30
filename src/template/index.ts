import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const TEMPLATES_DIR = '.ctx/templates';

export interface ContextTemplate {
  name: string;
  description: string;
  scan?: {
    maxDepth?: number;
    maxFiles?: number;
    include?: string[];
    exclude?: string[];
  };
  output?: {
    format?: 'text' | 'markdown' | 'json';
    showDependencies?: boolean;
    showGitInfo?: boolean;
    maxFiles?: number;
  };
}

const BUILT_IN_TEMPLATES: Record<string, ContextTemplate> = {
  standard: {
    name: 'standard',
    description: 'Default context template',
  },
  review: {
    name: 'review',
    description: 'Code review context — focuses on changed files and structure',
    scan: {
      maxFiles: 100,
    },
    output: {
      format: 'text',
      maxFiles: 20,
    },
  },
  debug: {
    name: 'debug',
    description: 'Debugging context — includes more config and dependency details',
    scan: {
      maxDepth: 8,
    },
    output: {
      format: 'markdown',
      showDependencies: true,
    },
  },
  onboard: {
    name: 'onboard',
    description: 'Onboarding context — comprehensive project overview',
    scan: {
      maxDepth: 8,
      maxFiles: 200,
    },
    output: {
      format: 'markdown',
      maxFiles: 100,
    },
  },
};

function getTemplatesDir(cwd: string): string {
  return resolve(cwd, TEMPLATES_DIR);
}

function getAllTemplates(cwd: string): Record<string, ContextTemplate> {
  const templates = { ...BUILT_IN_TEMPLATES };
  const dir = getTemplatesDir(cwd);

  if (existsSync(dir)) {
    const files = readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const content = readFileSync(resolve(dir, file), 'utf-8');
        const tmpl = JSON.parse(content) as ContextTemplate;
        templates[tmpl.name] = tmpl;
      } catch { /* skip invalid */ }
    }
  }

  return templates;
}

export function listTemplates(cwd: string): { builtIn: ContextTemplate[]; custom: ContextTemplate[] } {
  const all = getAllTemplates(cwd);
  const builtIn: ContextTemplate[] = [];
  const custom: ContextTemplate[] = [];

  for (const [name, tmpl] of Object.entries(all)) {
    if (BUILT_IN_TEMPLATES[name]) {
      builtIn.push(tmpl);
    } else {
      custom.push(tmpl);
    }
  }

  return { builtIn, custom };
}

export function getTemplate(cwd: string, name: string): ContextTemplate | null {
  const all = getAllTemplates(cwd);
  return all[name] || null;
}

export function createTemplate(cwd: string, name: string, template: ContextTemplate): void {
  const dir = getTemplatesDir(cwd);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(resolve(dir, `${name}.json`), JSON.stringify(template, null, 2), 'utf-8');
}
