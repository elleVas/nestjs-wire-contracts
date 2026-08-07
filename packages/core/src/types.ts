import type { JsonSchema } from "./json-schema.js";

export interface SchemaAdapter<T> {
  readonly _output: T;
  toJsonSchema(): JsonSchema;
  parse(input: unknown): T;
  safeParse(input: unknown): { success: true; data: T } | { success: false; error: unknown };
}

export interface Contract<Pattern extends string = string, Payload = unknown, Response = unknown> {
  readonly pattern: Pattern;
  readonly payload: SchemaAdapter<Payload>;
  readonly response: SchemaAdapter<Response>;
  readonly fingerprint: string;
}

export type ContractPayload<C> = C extends Contract<string, infer P, unknown> ? P : never;
export type ContractResponse<C> = C extends Contract<string, unknown, infer R> ? R : never;
