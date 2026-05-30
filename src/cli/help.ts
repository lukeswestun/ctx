export function getHelpText(): string {
  return `
  ctx — Project context for AI coding tools

  Usage:
    ctx                  Generate context and copy to clipboard
    ctx init             Initialize ctx in this project
    ctx watch            Watch files and auto-update context
    ctx config           View or edit project configuration
    ctx template         Manage context templates (Pro)
    ctx doctor           Check installation and setup

  Options:
    --no-clipboard       Print to stdout only
    --format <format>    Output format: text (default), markdown, json
    --profile <name>     Use a named context profile
    -v, --verbose        Show detailed output
    -h, --help           Show this help

  Examples:
    ctx                  Generate and copy context
    ctx --no-clipboard   Print context to terminal
    ctx init             Set up ctx in current project
    ctx --format json    Get context as JSON

  Learn more: https://ctx.dev
`;
}
