import type { JsonSchema } from "./json-schema.js";
import type { SchemaAdapter } from "./types.js";

// Marker property with no runtime meaning, used only to carry the generic type parameter.
export function fakeAdapter<T>(jsonSchema: JsonSchema): SchemaAdapter<T> {
  return {
    _output: undefined as T,
    toJsonSchema: () => jsonSchema,
    parse: (input) => input as T,
    safeParse: (input) => ({ success: true, data: input as T }),
  };
}
