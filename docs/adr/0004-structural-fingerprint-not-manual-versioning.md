# 0004 — Contract identity is a structural fingerprint, not a manual version tag

**Status:** Accepted (2026-08-07)

## Context

The original design considered a manually assigned version per contract (a `version` field, bumped by hand to `get_user.v2` on breaking changes). This requires whoever changes a schema to _remember_ to bump the version when the change is breaking — exactly the kind of human error this project exists to eliminate. A drift-detection system that depends on human discipline at its most critical point defeats its own purpose.

## Decision

Contract identity is a hash computed automatically from the contract's structure — a canonical JSON Schema of `payload`/`response`, hashed and truncated (`computeFingerprint()` in `nestjs-wire-contracts-core`) — not a name chosen by a developer.

```typescript
export function computeFingerprint(contract: ZodContract): string {
  const jsonSchema = toCanonicalJsonSchema(contract.payload, contract.response);
  return sha256(stableStringify(jsonSchema)).slice(0, 12);
}
```

## Consequences

- It is structurally impossible to make a breaking change without the identifier changing — this is a property of the schema, not a process someone has to follow.
- Human-readable tags (`v1`, `v2`, semver) remain useful for changelogs and communication, but are metadata only, not the compatibility mechanism.
- This fingerprint is only meaningful if the schema is fully representable as a structural JSON Schema — see [0005](./0005-declarative-only-contract-schemas.md) for the constraint this places on contract authoring, and [0006](./0006-layered-contract-drift-defense.md) for how the fingerprint is actually used to catch drift between independently-deployed services.
