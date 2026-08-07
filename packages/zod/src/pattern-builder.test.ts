import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";
import type { ContractPayload, ContractResponse } from "nestjs-wire-contracts-core";
import { c } from "./pattern-builder.js";

describe("c.pattern", () => {
  it("builds a contract carrying the pattern name and a fingerprint", () => {
    const contract = c.pattern("get_user", {
      payload: z.object({ id: z.number() }),
      response: z.object({ id: z.number(), name: z.string() }),
    });

    expect(contract.pattern).toBe("get_user");
    expect(contract.fingerprint).toMatch(/^[0-9a-f]{12}$/);
  });

  it("validates payload and response through the contract's adapters", () => {
    const contract = c.pattern("get_user", {
      payload: z.object({ id: z.number() }),
      response: z.object({ id: z.number(), name: z.string() }),
    });

    expect(contract.payload.parse({ id: 1 })).toEqual({ id: 1 });
    expect(() => contract.response.parse({ id: 1 })).toThrow();
  });

  it("changes the fingerprint when the payload schema changes", () => {
    const before = c.pattern("get_user", {
      payload: z.object({ id: z.number() }),
      response: z.object({}),
    });
    const after = c.pattern("get_user", {
      payload: z.object({ id: z.string() }),
      response: z.object({}),
    });

    expect(before.fingerprint).not.toBe(after.fingerprint);
  });

  it("infers ContractPayload and ContractResponse from a real Zod contract", () => {
    const contract = c.pattern("get_user", {
      payload: z.object({ id: z.number() }),
      response: z.object({ name: z.string() }),
    });

    expect(contract.pattern).toBe("get_user");
    expectTypeOf<ContractPayload<typeof contract>>().toEqualTypeOf<{ id: number }>();
    expectTypeOf<ContractResponse<typeof contract>>().toEqualTypeOf<{ name: string }>();
  });
});
