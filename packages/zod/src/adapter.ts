import type { JsonSchema, SchemaAdapter } from "nestjs-wire-contracts-core";
import type { z } from "zod";

// Marker property with no runtime meaning, used only to carry the generic type parameter.
export function zodAdapter<T>(schema: z.ZodType<T>): SchemaAdapter<T> {
  return {
    _output: undefined as T,
    toJsonSchema: () => schema.toJSONSchema() as JsonSchema,
    parse: (input) => schema.parse(input),
    safeParse: (input) => {
      const result = schema.safeParse(input);
      return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error };
    },
  };
}
