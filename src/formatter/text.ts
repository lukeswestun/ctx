import { ProjectInfo, TreeNode } from '../analyzer/index.js';

export function formatText(info: ProjectInfo): string {
  const lines: string[] = [];

  lines.push(`Project: ${info.name} ── ${capitalize(info.type)} / ${capitalize(info.framework)}`);
  lines.push('');

  if (info.dependencies.total > 0) {
    lines.push(`  Dependencies: ${info.dependencies.total} (${info.dependencies.production} production)`);
  }

  if (info.gitInfo) {
    lines.push(`  Git branch: ${info.gitInfo.branch}`);
  }

  lines.push('');
  lines.push('  Structure:');
  lines.push(renderTree(info.structure, 4));

  if (info.configFiles.length > 0) {
    lines.push('');
    lines.push('  Config files:');
    for (const cfg of info.configFiles) {
      const shortPath = cfg.path.replace(/^.*\/([^/]+\/[^/]+)$/, '$1');
      lines.push(`  → ${shortPath}`);
    }
  }

  if (info.keyFiles.length > 0) {
    lines.push('');
    lines.push('  Key files:');
    for (const file of info.keyFiles.slice(0, 5)) {
      const relPath = file.path;
      const ago = timeAgo(file.modified);
      lines.push(`  → ${relPath}${file.size ? ` (${formatSize(file.size)})` : ''}${ago ? ` — ${ago}` : ''}`);
    }
  }

  return lines.join('\n');
}

function renderTree(node: TreeNode, indent: number): string {
  if (!node.children || node.children.length === 0) return '';

  const lines: string[] = [];
  const indentStr = ' '.repeat(indent);

  for (const child of node.children) {
    if (child.type === 'directory') {
      lines.push(`${indentStr}├── ${child.name}`);
    } else {
      lines.push(`${indentStr}├── ${child.name}`);
    }
  }

  return lines.join('\n');
}

function capitalize(s: string): string {
  if (!s) return 'Unknown';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
