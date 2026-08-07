import { describe, expect, it } from "vitest";
import { z } from "zod";
import { zodAdapter } from "./adapter.js";

describe("zodAdapter", () => {
  it("parses valid input through the wrapped Zod schema", () => {
    const adapter = zodAdapter(z.object({ id: z.number() }));

    expect(adapter.parse({ id: 1 })).toEqual({ id: 1 });
  });

  it("throws on invalid input via parse", () => {
    const adapter = zodAdapter(z.object({ id: z.number() }));

    expect(() => adapter.parse({ id: "not a number" })).toThrow();
  });

  it("returns a discriminated result via safeParse", () => {
    const adapter = zodAdapter(z.object({ id: z.number() }));

    expect(adapter.safeParse({ id: 1 })).toEqual({ success: true, data: { id: 1 } });
    expect(adapter.safeParse({ id: "nope" })).toMatchObject({ success: false });
  });

  it("produces a JSON Schema reflecting the declarative shape", () => {
    const adapter = zodAdapter(z.object({ id: z.number(), name: z.string() }));

    const jsonSchema = adapter.toJsonSchema();

    expect(jsonSchema).toMatchObject({
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
    });
  });

  it("throws when the schema uses .transform(), per the declarative-only contract rule (ADR-0005)", () => {
    const adapter = zodAdapter(z.string().transform((s) => s.length));

    expect(() => adapter.toJsonSchema()).toThrow();
  });

  it("does not throw on .refine() — only its predicate is invisible to the fingerprint, not the schema itself (ADR-0005)", () => {
    const adapter = zodAdapter(z.string().refine((s) => s.length > 3));

    expect(() => adapter.toJsonSchema()).not.toThrow();
  });
});
