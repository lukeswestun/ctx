import { ProjectInfo } from '../analyzer/index.js';
import { formatText } from './text.js';
import { formatMarkdown } from './markdown.js';
import { formatJson } from './json.js';

export type OutputFormat = 'text' | 'markdown' | 'json';

export function formatOutput(info: ProjectInfo, format: OutputFormat): string {
  switch (format) {
    case 'markdown':
      return formatMarkdown(info);
    case 'json':
      return formatJson(info);
    case 'text':
    default:
      return formatText(info);
  }
}
