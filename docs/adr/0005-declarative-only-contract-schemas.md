# 0005 — Wire contracts are restricted to a declarative Zod subset

**Status:** Accepted (2026-08-07)

## Context

[0004](./0004-structural-fingerprint-not-manual-versioning.md)'s fingerprint only works if a schema is fully representable as a structural, comparable JSON Schema. Zod allows constructs JSON Schema cannot represent: `.transform()` changes the output type relative to the input type, and `.refine()`/`.superRefine()` wrap arbitrary predicate functions. This isn't a gap in tooling — there is no general way to statically compare two arbitrary functions and know whether one is stricter or looser than the other (the same reason protobuf and Avro don't have this problem: they don't allow code in the schema at all, only declarative constraints).

## Decision

Payload/response schemas in a wire contract are restricted to a declarative Zod subset:

| Construct | Allowed in a contract? |
|---|---|
| Primitives, objects, arrays, enums, literals, unions (incl. discriminated), optional/nullable | Yes |
| `.min()`, `.max()`, `.email()`, `.regex()`, `.int()`, etc. (Zod's built-in declarative validators) | Yes — compile to clean JSON Schema constraints |
| `.transform()` | No |
| `.refine()` / `.superRefine()` | Only when necessary, tracked explicitly (see below) |

Enforcement uses Zod v4's `z.toJSONSchema()`, which throws by default on non-representable constructs (`unrepresentable: "any"` must be opted into explicitly to get the permissive, guessing behavior) — the contract builder in `nestjs-wire-contracts-zod` calls this at contract-definition time, so an unrepresentable schema fails to compile with an error pointing at the offending construct, rather than producing a silently wrong fingerprint.

For `.refine()` calls that are genuinely necessary (cross-field validation, business rules with no declarative equivalent): the fingerprint includes a second component, a hash of the refine function's source (`fn.toString()`). This doesn't classify whether a change to that function is breaking — that's not automatable — but it makes the change visible to [0006](./0006-layered-contract-drift-defense.md)'s drift detection instead of silently invisible. A lint rule additionally flags `.refine()` calls that duplicate an existing built-in validator, to keep how often the escape hatch is actually used as small as possible in practice.

## Consequences

- The risk on contract *structure* is fully closed, not just reduced — an unrepresentable construct fails to compile.
- The risk on `.refine()` *semantics* is narrowed to an explicit, small, named surface instead of being an unbounded "anything in Zod" risk, but isn't eliminated — this residual risk is documented publicly (see [0006](./0006-layered-contract-drift-defense.md)), not hidden.
- Adds an authoring constraint contributors need to learn: not everything valid in Zod is valid in a wire contract.
