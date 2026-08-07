# 0003 — Contract-first API, Zod as a decoupled adapter, wrap don't fork

**Status:** Accepted (2026-08-07)

## Context

`@nestjs/microservices`' `ClientProxy.send()` returns `Observable<any>` — nothing checks that a payload sent by one service matches what another service expects. Three related design questions had to be settled before writing any code: how a contract is defined, how it relates to the validation library, and how it relates to `@nestjs/microservices` itself.

## Decision

- **Contract-first, not decorator-first.** A contract is a standalone object (`c.pattern('get_user', { payload, response })`), defined separately from the controller/client code that uses it, so it can be the single shared source of truth between the two sides of a call. This is the same pattern `ts-rest` and `tRPC` have already validated for REST/RPC contracts.
- **Zod lives in an adapter package, not in core.** `nestjs-wire-contracts-core` has no dependency on Zod; `nestjs-wire-contracts-zod` adapts Zod schemas to the core `Contract` type. Same Ports & Adapters approach used elsewhere — it keeps `core` testable in isolation and leaves room for `valibot`/`arktype` adapters later without touching the core API.
- **Wrap `@nestjs/microservices`, don't fork or replace it.** `@ContractPattern` registers a standard `@MessagePattern` internally. No new transport layer, no magic — it stays debuggable, and it works with any transport NestJS supports today or adds later.

## Consequences

- Contracts can be imported by both the emitting and the receiving service from a shared package — the mechanism [0004](./0004-structural-fingerprint-not-manual-versioning.md) through [0006](./0006-layered-contract-drift-defense.md) depend on this being a single shared definition, not two independently-written ones.
- Adds one layer of indirection (`@ContractPattern` wrapping `@MessagePattern`) developers need to understand, in exchange for type safety and runtime validation on both ends.
- Runtime validation is on by default on both payload and response, with a flag to disable it where raw performance matters more (same pattern `nestjs-zod` uses).
