# ctx — Project Context for AI Coding Tools

**One command. Perfect context. Every AI tool.**

`ctx` is a CLI tool that gives every AI coding tool perfect project context with one command. Works with Cursor, Claude Code, GitHub Copilot, Continue.dev, Codex, and any LLM.

## Quick Start

```bash
# Install via npm
npm install -g ctxdotdev

# Then generate context in any project
cd my-project
ctx

# Context is copied to your clipboard. Paste into any AI tool.
```

## Why ctx?

**The problem:** Every time you use an AI coding tool, you have to re-explain your codebase. What framework is this? What's the project structure? What are the dependencies? You waste 15+ minutes per session setting up context.

**The solution:** `ctx` scans your project, analyzes its structure, dependencies, and configuration, and produces a compact context summary. One command. One second. Perfect context.

## Commands

| Command | Description |
|---------|-------------|
| `ctx` | Generate context and copy to clipboard |
| `ctx init` | Initialize ctx in this project |
| `ctx watch` | Watch files and auto-update context (Pro) |
| `ctx config` | View or edit project configuration |
| `ctx template` | Manage context templates (Pro) |
| `ctx doctor` | Check installation and setup |

## Features

- **Cross-platform** — Works with Cursor, Claude Code, Copilot, Codex, and any LLM
- **One command** — `ctx` generates context in under a second
- **Privacy-first** — All processing local. Nothing leaves your machine.
- **Smart prioritization** — Auto-detects what's most relevant
- **Project-aware** — Detects framework, dependencies, structure automatically

## Output Example

```
Project: my-app ── Node / Next.js

  Dependencies: 1,234 (312 production)
  Git branch: main

  Structure:
  ├── src/
  ├── public/
  ├── package.json
  ├── tsconfig.json
  └── next.config.js

  Config files:
  → tsconfig.json (TypeScript config)

  Key files:
  → package.json — 2h ago
  → src/app/layout.tsx — 3h ago

  ✓ Context copied to clipboard. Ready for AI.
```

## Configuration

Create a `.ctx/config.json` in your project root:

```json
{
  "scan": {
    "exclude": ["node_modules", ".git", "dist"]
  },
  "output": {
    "format": "text",
    "showDependencies": true
  }
}
```

Or use `.ctxignore` for additional file exclusions (same syntax as `.gitignore`).

## License

MIT — do whatever you want with it.
