# 0001 — Explicit project name, unscoped flat packages

**Status:** Accepted (2026-08-07)

## Context

The library needs a name, and a decision on whether related packages live under a scope (`@nestjs-wire-contracts/core`) or as flat, prefixed package names (`nestjs-wire-contracts-core`).

Conceptually the project sits close to `ts-rest`/`tRPC`/oRPC — contract-first libraries that use neutral names plus framework adapters, anticipating multi-framework support. `nestjs-wire-contracts` is NestJS-only by design (it wraps `@nestjs/microservices` directly, see [0003](./0003-contract-first-wrapping-design.md)).

## Decision

Use an explicit, framework-named package: `nestjs-wire-contracts`, with related packages as flat, prefixed names (`nestjs-wire-contracts-core`, `nestjs-wire-contracts-zod`) rather than a scope. This follows the existing convention for this category of package (`nestjs-zod`, `nestjs-typed-events`), not the neutral-name-plus-adapters convention.

## Consequences

- A neutral name invites "does this work with Fastify RPC / Moleculer / etc.?" requests that have to be managed even just to decline them — community-management cost, not code cost, and this project is maintained by one person alongside other work. An explicit name narrows perceived scope from the first `npm view`.
- If a genuine, concrete demand for another framework appears later, this can be revisited — it isn't a decision to design around a hypothetical audience today.
- This does **not** change the internal architecture: `nestjs-wire-contracts-core` still has zero direct dependency on `@nestjs/common` (see [0003](./0003-contract-first-wrapping-design.md)). That separation is ordinary hygiene (testability, swappable validation library), not multi-framework support scaffolding — it costs nothing to keep even though the public name is NestJS-only.
