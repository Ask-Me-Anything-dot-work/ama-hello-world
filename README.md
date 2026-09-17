# ama-hello-world

Minimal end-to-end test plugin for the ama-mesh Orchestrator plugin system. See issue #1 for the full goal and acceptance criteria.

This repo exists to verify the full plugin chain — scaffold (via `create-ama-plugin`), build, install, enable/disable, console panel render, and public npm publish — works end-to-end for a real third-party-style plugin, before Agent Manager becomes the first production plugin.

## Quick Start

```bash
bun install
bun run dev
```

## Commands

| Command | Description |
|---|---|
| `bun run dev` | Start with hot-reload |
| `bun run build` | Compile to `dist/` |
| `bun run lint` | Typecheck + knip + eslint |
| `bun test` | Run tests |
| `bun run release` | Publish via semantic-release |

## Project Structure

```
src/
├── index.ts          # Plugin entry point (OrchestratorPlugin)
├── config/env.ts     # Zod-validated env config
├── panels/
│   ├── console.ts    # ConsolePanel definition
│   ├── index.ts      # Panel exports
│   └── hello-world.html  # Hello world panel template
tests/
└── plugin.test.ts    # MockBridge-based tests
```

## CI/CD

- **CI**: GitHub Actions runs lint, typecheck, and tests on push/PR to `main`.
- **Release**: semantic-release on `main` push. Publishes to Verdaccio.
