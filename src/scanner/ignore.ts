import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadIgnorePatterns(cwd: string): string[] {
  const patterns: string[] = [];

  const ctxignorePath = resolve(cwd, '.ctxignore');
  if (existsSync(ctxignorePath)) {
    const content = readFileSync(ctxignorePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        patterns.push(trimmed);
      }
    }
  }

  return patterns;
}
