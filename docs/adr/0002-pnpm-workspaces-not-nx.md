# 0002 — pnpm workspaces + changesets + tsup, not Nx

**Status:** Accepted (2026-08-07)

## Context

The project needs 3-4 correlated npm packages: `core`, `zod`, `nestjs`, and later `examples/*`. Nx is a known quantity (used on another project) and would give build caching, a task graph, and generators. The alternative is pnpm workspaces + changesets + tsup + vitest — the de facto standard for small TypeScript OSS libraries today (Zod, tRPC's core packages, drizzle-orm all work this way).

## Decision

pnpm workspaces + changesets + tsup + vitest. No Nx.

## Consequences

- Zero ceremonial configuration: a `pnpm-workspace.yaml` and per-package `package.json` scripts, nothing else to learn.
- Lower barrier to entry for external contributors — someone opening a PR on a small OSS library expects `pnpm install && pnpm build`, not to learn `nx.json`, the project graph, or target inference. This project's primary goal is attracting outside contributors, so this outweighs Nx's build-graph benefits at this package count.
- No build caching / task graph — acceptable, and not needed, for 3-4 packages. `turbo.json` can be added later if build time becomes a real problem; it wasn't added preemptively.
- `ts-rest`, the closest comparable project, uses Nx — but it has many more packages and years of history. Not a reason to start there.
