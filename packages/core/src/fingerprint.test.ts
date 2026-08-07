import { describe, expect, it } from "vitest";
import { computeFingerprint } from "./fingerprint.js";

describe("computeFingerprint", () => {
  it("is deterministic for the same schemas", () => {
    const payload = { type: "object", properties: { id: { type: "number" } } };
    const response = { type: "object", properties: { name: { type: "string" } } };

    expect(computeFingerprint(payload, response)).toBe(computeFingerprint(payload, response));
  });

  it("is independent of key order (canonicalization)", () => {
    const a = computeFingerprint(
      { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
      {},
    );
    const b = computeFingerprint(
      { properties: { name: { type: "string" }, id: { type: "number" } }, type: "object" },
      {},
    );

    expect(a).toBe(b);
  });

  it("changes when the payload schema changes", () => {
    const before = computeFingerprint(
      { type: "object", properties: { id: { type: "number" } } },
      {},
    );
    const after = computeFingerprint(
      { type: "object", properties: { id: { type: "string" } } },
      {},
    );

    expect(before).not.toBe(after);
  });

  it("changes when the response schema changes", () => {
    const before = computeFingerprint(
      {},
      { type: "object", properties: { ok: { type: "boolean" } } },
    );
    const after = computeFingerprint(
      {},
      { type: "object", properties: { ok: { type: "string" } } },
    );

    expect(before).not.toBe(after);
  });

  it("returns a 12-character lowercase hex string", () => {
    const fingerprint = computeFingerprint({ type: "string" }, { type: "number" });

    expect(fingerprint).toMatch(/^[0-9a-f]{12}$/);
  });
});
