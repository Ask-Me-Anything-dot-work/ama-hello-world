# AGENTS.md

## 1. Purpose
This file defines the interaction protocol for both AI agents and human contributors to this repository. It is foundational and is always loaded into agent sessions to ensure a consistent set of expectations and workflows.

This is a plugin scaffold for the Orchestrator. It provides a baseline Bun/TS project with CI, release tooling, and architectural conventions for the ama-hello-world plugin.

## 2. Tech Stack
- **Bun**: Runtime, package manager, and test runner.
- **TypeScript**: Typed JavaScript in strict mode (`moduleResolution: bundler`).
- **Zod**: TypeScript-first schema validation with static type inference.
- **Linting**: `tsc --noEmit` for type checking and `knip` for identifying unused files, dependencies, and exports.
- **Testing**: `bun test` for unit and integration tests.
- **CI**: GitHub Actions (lint, typecheck, test on push/PR).
- **Release**: semantic-release with conventional commits.
- **Hooks**: Husky (commit-msg → commitlint, pre-commit → lint+test).

## 3. Project Structure
The repository follows a clean, predictable layout:
- `src/index.ts`: Entry point, named `plugin` export (OrchestratorPlugin), and panel exports.
- `src/plugin.route.ts`: Hono router serving plugin assets under `/plugins/@ama-work/ama-hello-world/`.
- `src/panels/console.ts`: ConsolePanel definition with absolute `templateUrl`.
- `src/panels/template.ts`: Panel template ("hello world") embedded as a TS string (tsc does not copy `.html` to `dist/`). Template is an HTML **fragment** — no `<!DOCTYPE>`/`<html>`/`<head>`/`<body>`/`<meta>`/`<title>` tags and no global `<style>` block (the console injects it via `innerHTML`, where `<style>` is global CSS and would restyle the entire shell).
- `tests/plugin.test.ts`: MockBridge-based tests for the plugin.

## 4. Standard Workflows
### Canonical Commands
- **Setup**: `bun install`
- **Development**: `bun run dev` (runs with hot-reload)
- **Linting**: `bun run lint` (runs `tsc --noEmit`, `knip`, and `eslint`)
- **Testing**: `bun test`
- **Build**: `bun run build` (produces `dist/`)

### Agentic Implementation Expectations
When performing implementation or bugfix work, agents MUST:
1. Always run `bun run lint` before `bun test`.
2. Fix all lint and test failures before opening a Pull Request.
3. If failures cannot be fixed within the session, post the complete failure output as a comment on the corresponding issue and stop — DO NOT open a PR.

## 5. MCP Usage
This project is designed to be used with global Model Context Protocol (MCP) servers.
- **Context7**: Use for broader codebase search, documentation retrieval, or understanding external libraries.
- **GitHub**: Use for managing issues, comments, pull requests, and repository metadata.

*Note: This repository does not bundle its own MCP servers; it serves as a backend designed to be interacted with by an orchestrator or gateway that exposes these tools.*

## 6. Coding Conventions
- **Modular Design**: Prefer small, focused modules over monolithic scripts.
- **Type Inference**: Always export types derived from Zod schemas using `z.infer<typeof schema>`.
- **Side Effects**: Avoid side effects at import time; prefer explicit initialization or `main()` functions.
- **Invariants**:
  - Use Zod schemas to validate all external inputs (env vars, request bodies, query params).

## 7. When Changing Protocols
- If a change affects public behavior (e.g., modifying routes, environment variable contracts, or response shapes), you MUST update `AGENTS.md` in the same Pull Request to reflect these changes.
- Always add or adjust tests that correspond to the documented behavior changes.

## 8. Release & Publishing (Canonical)
There is exactly ONE publish path: **semantic-release inside GitHub Actions on push to `main`, publishing to npmjs**. Verdaccio serves this package through its npmjs uplink proxy.

Rules for agents and maintainers:

1. **Never publish manually.** No `npm publish`, no `publish:verdaccio`, no Verdaccio credentials. There is no `VERDACCIO_PUBLISH_TOKEN` requirement — the premise of issue #14 was wrong. `publishConfig.registry = "https://registry.npmjs.org"` in `package.json` is intentional.
2. **PR titles decide releases.** This repo squash-merges, and semantic-release parses the **squash commit subject on `main`**. It must be conventional: `fix: ...`, `feat: ...` (type + colon). A subject without `type:` makes semantic-release skip — no release commit, no tag, no publish. This is exactly how `1.0.4` was never cut: PR #13's subject was `Fix export shape + mount console panel + plugin asset routes (#12) (#13)`.
3. **Never bump `version` in `package.json` manually.** semantic-release owns it and writes it in the `chore(release): x.y.z [skip ci]` commit.
4. **Verify after a release:**
   ```bash
   curl -s http://verdaccio.homelab/@ama-work/ama-hello-world/latest | jq '{version, main}'
   # expect new version, main: "dist/index.js"
   ```
5. The legacy `publish:npm` and `publish:verdaccio` scripts were exactly this trap — npm ≥ 9 applies `publishConfig.registry` over the `--registry` CLI flag, so `publish:verdaccio` would target npmjs anyway (or fail auth). They have been **removed from `package.json`** (issue #17); do not reintroduce them. The only release lever is a conventional PR title merged to `main` (rule 2).
