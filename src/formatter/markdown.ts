import { ProjectInfo, TreeNode } from '../analyzer/index.js';

export function formatMarkdown(info: ProjectInfo): string {
  const lines: string[] = [];

  lines.push(`# Project: ${info.name}`);
  lines.push('');
  lines.push(`- **Type:** ${capitalize(info.type)} / ${capitalize(info.framework)}`);
  if (info.dependencies.total > 0) {
    lines.push(`- **Dependencies:** ${info.dependencies.total} (${info.dependencies.production} production, ${info.dependencies.dev} dev)`);
  }
  if (info.gitInfo) {
    lines.push(`- **Branch:** \`${info.gitInfo.branch}\``);
  }

  lines.push('');
  lines.push('## Structure');
  lines.push('```');
  lines.push(renderTree(info.structure));
  lines.push('```');

  if (info.configFiles.length > 0) {
    lines.push('');
    lines.push('## Config Files');
    for (const cfg of info.configFiles) {
      lines.push(`- \`${cfg.path.replace(/^.*\/([^/]+\/[^/]+)$/, '$1')}\` — ${cfg.type}`);
    }
  }

  if (info.keyFiles.length > 0) {
    lines.push('');
    lines.push('## Key Files');
    for (const file of info.keyFiles.slice(0, 5)) {
      lines.push(`- \`${file.path}\``);
    }
  }

  return lines.join('\n');
}

function renderTree(node: TreeNode): string {
  if (!node.children) return '';
  return node.children.map(c => c.name).join('\n');
}

function capitalize(s: string): string {
  if (!s) return 'Unknown';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
