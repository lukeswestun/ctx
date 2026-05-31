# ctx — Project Context for AI Coding Tools

[![CI](https://github.com/lukeswestun/ctx/actions/workflows/ci.yml/badge.svg)](https://github.com/lukeswestun/ctx/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ctxdotdev)](https://www.npmjs.com/package/ctxdotdev)
[![npm downloads](https://img.shields.io/npm/dw/ctxdotdev)](https://www.npmjs.com/package/ctxdotdev)

**One command. Perfect context. Every AI tool.**

`ctx` scans your project, detects the framework (Next.js, React, Vue, Django, Express, Go, Rust — 30+), reads config files, analyzes dependencies, and copies a concise context summary to your clipboard. Paste into any AI coding tool.

## Quick Start

```bash
npm install -g ctxdotdev
cd your-project
ctx
```

That's it. Context is copied to your clipboard. Paste it into Cursor, Claude Code, Copilot, or any LLM.

## Why?

Every time you use an AI coding tool, you have to re-explain your codebase. *"This is a Next.js app with TypeScript, Prisma, and Tailwind..."* — 15 minutes gone.

`ctx` gives the AI the same context in one second. No more repeating yourself.

## Examples

### Next.js + TypeScript
```
$ ctx

Project: my-app ── Node / Next.js

  Dependencies: 312 (289 production)
  Git branch: main

  Structure:
    ├── src/
    ├── public/
    ├── prisma/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    └── tailwind.config.ts

  Config files:
  → my-app/tsconfig.json (TypeScript config)
  → my-app/next.config.ts (Next.js config)
  → my-app/tailwind.config.ts (Tailwind config)
  → my-app/vitest.config.ts (Vitest config)

  Key files:
  → package.json (2.3KB) — 1h ago
  → tsconfig.json (642B) — 1d ago
  → README.md (1.1KB) — 3d ago

  ✓ Context copied to clipboard. Ready for AI.
```

### Django (Python)
```
$ ctx

Project: blog ── Python / Django

  Dependencies: 0
  Git branch: main

  Structure:
    ├── blog/
    ├── manage.py
    ├── requirements.txt
    ├── pyproject.toml
    ├── Dockerfile
    └── docker-compose.yml

  Config files:
  → blog/manage.py (Django manage)
  → blog/requirements.txt (Python deps)
  → blog/pyproject.toml (Python project)
  → blog/Dockerfile (Dockerfile)
  → blog/docker-compose.yml (Docker Compose)

  ✓ Context copied to clipboard. Ready for AI.
```

### Go API
```
$ ctx

Project: api ── Go / Gin

  Dependencies: 0
  Git branch: main

  Structure:
    ├── cmd/
    ├── internal/
    ├── go.mod
    ├── go.sum
    ├── Dockerfile
    └── Makefile

  Config files:
  → api/go.mod (Go module)
  → api/Makefile (Makefile)

  ✓ Context copied to clipboard. Ready for AI.
```

## All Commands

| Command | Description |
|---------|-------------|
| `ctx` | Generate context and copy to clipboard |
| `ctx init` | Initialize ctx in this project |
| `ctx watch` | Watch files, auto-update context on changes |
| `ctx template` | List, create, and use context templates |
| `ctx config` | View project configuration |
| `ctx doctor` | Check installation and project setup |

## Watch Mode

Regenerate context automatically whenever a file changes:

```bash
ctx watch
```

The output updates in real-time. Great for long AI coding sessions where your project keeps changing.

## Templates

Use different context profiles for different tasks:

```bash
ctx template list
ctx template use review     # Focus on changed files
ctx template use debug      # Include dependency details
ctx template use onboard    # Full project overview
ctx template create my-custom
```

## Configuration

Create `.ctx/config.json` in your project root:

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

## Supported Frameworks

**Node.js**: Next.js, React, Vue, Svelte, SvelteKit, Nuxt, Angular, NestJS, Express, Fastify, Hono, Gatsby, Remix, Astro, Solid, tRPC, Electron, Expo, React Native, Preact, Lit, Docusaurus, VitePress, Eleventy

**Python**: Django, Flask, FastAPI, Tornado, aiohttp, Starlette

**Go**: Gin, Echo, Fiber, Chi

**Rust**: Axum, Actix, Rocket, Tide, Warp, Leptos, Yew

## Privacy

All processing is local. Your code never leaves your machine. No telemetry. No tracking. No cloud.

## License

MIT
