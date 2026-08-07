// Opaque on purpose: core stays adapter-agnostic, so it never assumes a specific JSON Schema shape.
export type JsonSchema = Record<string, unknown>;
