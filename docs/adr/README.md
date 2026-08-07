# Architecture Decision Records

This directory records the significant architectural decisions made for `nestjs-wire-contracts`, in the lightweight [ADR](https://adr.github.io/) format: context, decision, consequences.

An ADR captures a decision that could reasonably have gone another way and that someone (including a future maintainer) might want to revisit. Routine or clearly-forced implementation details don't get one.

| ADR                                                              | Title                                                                   | Status   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- | -------- |
| [0001](./0001-explicit-project-name.md)                          | Explicit project name, unscoped flat packages                           | Accepted |
| [0002](./0002-pnpm-workspaces-not-nx.md)                         | pnpm workspaces + changesets + tsup, not Nx                             | Accepted |
| [0003](./0003-contract-first-wrapping-design.md)                 | Contract-first API, Zod as a decoupled adapter, wrap don't fork         | Accepted |
| [0004](./0004-structural-fingerprint-not-manual-versioning.md)   | Contract identity is a structural fingerprint, not a manual version tag | Accepted |
| [0005](./0005-declarative-only-contract-schemas.md)              | Wire contracts are restricted to a declarative Zod subset               | Accepted |
| [0006](./0006-layered-contract-drift-defense.md)                 | Layered defense against cross-service contract drift                    | Accepted |
| [0007](./0007-pin-typescript-below-typescript-eslint-support.md) | Pin TypeScript below the version typescript-eslint supports             | Accepted |
