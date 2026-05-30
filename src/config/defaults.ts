export interface CtxConfig {
  project: {
    name: string;
    type: string;
  };
  scan: {
    maxDepth: number;
    maxFiles: number;
    include: string[];
    exclude: string[];
  };
  output: {
    format: 'text' | 'markdown' | 'json';
    showDependencies: boolean;
    showGitInfo: boolean;
    showFileSizes: boolean;
    maxFiles: number;
  };
  templates: {
    default: string;
    custom: string[];
  };
}

export const DEFAULT_CONFIG: CtxConfig = {
  project: {
    name: '',
    type: 'auto',
  },
  scan: {
    maxDepth: 6,
    maxFiles: 10000,
    include: [],
    exclude: [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.env',
      '.env.*',
      '*.log',
      '.cache',
      '.turbo',
    ],
  },
  output: {
    format: 'text',
    showDependencies: true,
    showGitInfo: true,
    showFileSizes: false,
    maxFiles: 50,
  },
  templates: {
    default: 'standard',
    custom: [],
  },
};
