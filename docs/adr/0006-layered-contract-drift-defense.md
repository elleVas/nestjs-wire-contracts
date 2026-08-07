# 0006 — Layered defense against cross-service contract drift

**Status:** Accepted (2026-08-07)

## Context

The risk this project actually needs to eliminate isn't "a schema is wrong inside one service" — TypeScript and Zod already solve that within a single process. It's that **two services, compiled and deployed independently at different times, end up talking to each other with incompatible contracts.** No compile-time check run in isolation inside one service can see this, because by definition each service only compiles against its own copy of the contract package.

Options considered ranged from a CI-only check, to CI plus a runtime check, to a full centralized registry that tracks what's actually deployed where and gates deploys (the pattern [Pact](https://docs.pact.io/) uses for consumer-driven contract testing, via a `can-i-deploy` check) — the only mechanism that answers "if I deploy this right now, will it break something already live," rather than "is this change structurally compatible."

## Decision

Three layers, the first two shipped for v1, the third explicitly deferred:

1. **Build-time (CI).** `contracts.lock.json`, versioned in the _consumer's_ repo (next to where it defines its contracts), holds the fingerprint history per pattern. `nestjs-wire-contracts diff <base> <head>` classifies each transition (field removed → breaking, optional field added → compatible, etc.) and fails the PR on an undeclared breaking change.
2. **Runtime.** Every message carries its fingerprint in the envelope (native headers on Kafka/NATS/RabbitMQ; an extended `{ pattern, data, id, meta }` wrapper on TCP). A service accepts its current fingerprint plus a window of previously-declared-compatible ones, and rejects a mismatch immediately with a diagnosable error naming both fingerprints — turning the silent runtime crash this project exists to prevent into a loud, first-contact failure instead.
3. **Deliberately out of scope for v1: a centralized registry with a `can-i-deploy` gate.** This is the only mechanism that knows what's _actually_ deployed where. It's also a genuinely different kind of commitment — hosting, auth, multi-tenancy — that turns the project from a library into a product, and contradicts the positioning in [0001](./0001-explicit-project-name.md)/[0003](./0003-contract-first-wrapping-design.md). Revisit only if the project gets real traction (see the plan's success metrics).

## Consequences

- v1 delivers real cross-service safety without asking anyone to run new infrastructure.
- The residual risk named in [0005](./0005-declarative-only-contract-schemas.md) — a `.refine()` becoming stricter without the wire shape changing — isn't caught by layer 1 or 2 automatically; it still surfaces as a loud, explicit Zod validation error on the first real message, not a silent crash, which is the project's original goal even without full prevention. This is documented publicly rather than sold as "can't happen," given what this project represents for its maintainer's public reputation.
- Layer 3 stays a live option, not a rejected one — worth a fresh ADR if and when it's actually pursued.
