import { Command } from 'commander';
import { scanProject } from '../../scanner/index.js';
import { analyzeProject } from '../../analyzer/index.js';
import { formatOutput, OutputFormat } from '../../formatter/index.js';
import { loadConfig } from '../../config/index.js';
import { copyToClipboard } from '../../utils/clipboard.js';

export const contextCommand = new Command('context')
  .aliases(['default'])
  .description('Generate project context for AI coding tools')
  .option('--no-clipboard', 'Print to stdout only')
  .option('--format <format>', 'Output format: text, markdown, json', 'text')
  .option('--profile <name>', 'Use a named context profile')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (options) => {
    const cwd = process.cwd();
    const config = loadConfig(cwd);

    try {
      const scanResult = await scanProject({
        cwd,
        maxDepth: config.scan.maxDepth,
        maxFiles: config.scan.maxFiles,
        include: config.scan.include,
        exclude: config.scan.exclude,
      });

      const projectInfo = analyzeProject(cwd, scanResult.files);

      const format = (options.format as OutputFormat) || config.output.format;
      const output = formatOutput(projectInfo, format);

      if (options.clipboard !== false) {
        await copyToClipboard(output);
        console.log(output);
        console.log('\n  ✓ Context copied to clipboard. Ready for AI.');
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error('Error generating context:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
