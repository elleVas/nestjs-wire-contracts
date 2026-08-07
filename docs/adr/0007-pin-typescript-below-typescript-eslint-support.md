# 0007 — Pin TypeScript below the version typescript-eslint supports

**Status:** Accepted (2026-08-07)

## Context

While scaffolding Fase 0 tooling, `pnpm add -Dw typescript ... typescript-eslint ...` resolved `typescript` to the latest release, `7.0.2`. `typescript-eslint`'s latest stable release (`8.66.0`, confirmed also on its `canary` tag) declares `peerDependencies.typescript` as `>=4.8.4 <6.1.0` — it does not yet support TypeScript 7.x at all. Left unpinned, the project would lint and typecheck against a compiler version its own linting tool doesn't claim to support — an unmet peer dependency that `pnpm install` only warns about, not a hard failure, so it would have gone unnoticed without checking.

Separately, TypeScript 6.0 escalated `baseUrl` (implicitly set during `tsup`'s `.d.ts` bundling step) from a warning to a hard error (`TS5101`), breaking the declaration-file build; `ignoreDeprecations: "6.0"` in `tsconfig.base.json` is the TypeScript team's own sanctioned escape hatch for this transitional period, not a workaround.

## Decision

Pin `typescript` to the exact version `6.0.3` — the latest release still inside `typescript-eslint`'s supported range — using an exact version string (`"6.0.3"`, no `^`) rather than a caret range, so a future `pnpm update` can't silently drift back past `6.1.0` into unsupported territory.

## Consequences

- Linting and typechecking run against a compiler version the tooling actually claims to support.
- The project loses access to TypeScript 7.x language/compiler features until `typescript-eslint` catches up.
- This needs periodic revisiting — noted in the project plan (`piano-progetto-typed-nest-contracts.md`, Fase 0) as a point to check when `typescript-eslint` ships TS 7 support.
