import { describe, expect, expectTypeOf, it } from "vitest";
import { defineContract } from "./contract-builder.js";
import { computeFingerprint } from "./fingerprint.js";
import type { ContractPayload, ContractResponse } from "./types.js";
import { fakeAdapter } from "./test-helpers.js";

describe("defineContract", () => {
  it("carries the pattern, payload, and response adapters through unchanged", () => {
    const payload = fakeAdapter<{ id: number }>({ type: "object" });
    const response = fakeAdapter<{ name: string }>({ type: "object" });

    const contract = defineContract({ pattern: "get_user", payload, response });

    expect(contract.pattern).toBe("get_user");
    expect(contract.payload).toBe(payload);
    expect(contract.response).toBe(response);
  });

  it("computes the fingerprint from the payload and response JSON Schemas", () => {
    const payload = fakeAdapter<{ id: number }>({
      type: "object",
      properties: { id: { type: "number" } },
    });
    const response = fakeAdapter<{ name: string }>({
      type: "object",
      properties: { name: { type: "string" } },
    });

    const contract = defineContract({ pattern: "get_user", payload, response });

    expect(contract.fingerprint).toBe(
      computeFingerprint(payload.toJsonSchema(), response.toJsonSchema()),
    );
  });

  it("infers ContractPayload and ContractResponse from the contract", () => {
    const contract = defineContract({
      pattern: "get_user",
      payload: fakeAdapter<{ id: number }>({}),
      response: fakeAdapter<{ name: string }>({}),
    });

    expect(contract.pattern).toBe("get_user");
    expectTypeOf<ContractPayload<typeof contract>>().toEqualTypeOf<{ id: number }>();
    expectTypeOf<ContractResponse<typeof contract>>().toEqualTypeOf<{ name: string }>();
  });
});
