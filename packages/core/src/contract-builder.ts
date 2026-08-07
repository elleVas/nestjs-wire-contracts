import { computeFingerprint } from "./fingerprint.js";
import type { Contract, SchemaAdapter } from "./types.js";

export interface ContractDefinition<Pattern extends string, Payload, Response> {
  pattern: Pattern;
  payload: SchemaAdapter<Payload>;
  response: SchemaAdapter<Response>;
}

export function defineContract<Pattern extends string, Payload, Response>(
  definition: ContractDefinition<Pattern, Payload, Response>,
): Contract<Pattern, Payload, Response> {
  const fingerprint = computeFingerprint(
    definition.payload.toJsonSchema(),
    definition.response.toJsonSchema(),
  );
  return {
    pattern: definition.pattern,
    payload: definition.payload,
    response: definition.response,
    fingerprint,
  };
}
