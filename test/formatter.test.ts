import { describe, it, expect } from 'vitest';
import { formatOutput } from '../src/formatter/index.js';
import { ProjectInfo } from '../src/analyzer/index.js';

const mockProject: ProjectInfo = {
  name: 'test-project',
  type: 'node',
  framework: 'react',
  dependencies: { total: 50, production: 30, dev: 20 },
  configFiles: [
    { path: '/project/tsconfig.json', type: 'TypeScript config' },
  ],
  structure: {
    name: '',
    type: 'directory',
    children: [
      { name: 'src/', type: 'directory' },
      { name: 'package.json', type: 'file', size: 100 },
    ],
  },
  gitInfo: { branch: 'main', lastCommit: 'abc123', recentChanges: 5 },
  keyFiles: [
    { path: 'package.json', size: 100, modified: new Date() },
    { path: 'src/index.ts', size: 200, modified: new Date() },
  ],
};

describe('formatOutput', () => {
  it('should return text format by default', () => {
    const output = formatOutput(mockProject, 'text');
    expect(output).toContain('test-project');
    expect(output).toContain('Dependencies');
  });

  it('should return markdown format', () => {
    const output = formatOutput(mockProject, 'markdown');
    expect(output).toContain('# Project');
    expect(output).toContain('test-project');
  });

  it('should return json format', () => {
    const output = formatOutput(mockProject, 'json');
    const parsed = JSON.parse(output);
    expect(parsed.project).toBe('test-project');
    expect(parsed.type).toBe('node');
  });

  it('should include key files in output', () => {
    const output = formatOutput(mockProject, 'text');
    expect(output).toContain('package.json');
  });
});
