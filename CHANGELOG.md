# Changelog

## 0.1.9 — 2026-05-31

- Added `main` and `exports` fields for Bundlephobia compatibility
- Updated vitest to v4 (requires Node 22+)
- Dropped c8 dev dependency

## 0.1.8 — 2026-05-31

- Migrated to npm Trusted Publishing with OIDC (no tokens needed)
- Published with signed provenance attestation
- Added CI/CD workflows: CI (push/PR) and Publish (tag)
- Removed npm classic token from publish pipeline

## 0.1.2 — 2026-05-30

- Improved framework detection (30+ frameworks)
- Added `ctx watch` command for live file watching
- Added `ctx template` command for context profiles
- Added `--format markdown` and `--format json` output
- Added `--max-depth` flag for scan depth control
- Added `--no-structure` flag to omit directory tree
- Fixed git ignore and dot-directory handling
- Internal refactor of scanner and analyzer modules

## 0.1.1 — 2026-05-30

- Improved terminal output formatting
- Dependency updates

## 0.1.0 — 2026-05-30

- Initial release
- `ctx` command scans project and copies context to clipboard
- Supports Node.js, Python, Go, Rust projects
- Auto-detects frameworks from config files
