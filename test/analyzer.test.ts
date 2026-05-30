import { describe, it, expect } from 'vitest';
import { analyzeProject } from '../src/analyzer/index.js';
import { ScannedFile } from '../src/scanner/index.js';

describe('analyzeProject', () => {
  it('should detect Node.js project type when package.json exists', () => {
    const files: ScannedFile[] = [
      { path: 'src/index.ts', size: 200, modified: new Date() },
    ];
    const result = analyzeProject(process.cwd(), files);
    expect(result.type).toBe('node');
  });

  it('should return project name from directory', () => {
    const files: ScannedFile[] = [];
    const result = analyzeProject('/test/my-app', files);
    expect(result.name).toBe('my-app');
  });

  it('should detect project type from real filesystem', () => {
    const files: ScannedFile[] = [
      { path: 'package.json', size: 100, modified: new Date() },
    ];
    const result = analyzeProject(process.cwd(), files);
    expect(result.type).toBe('node');
  });
});
