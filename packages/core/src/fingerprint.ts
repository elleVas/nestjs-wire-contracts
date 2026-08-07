import { createHash } from "node:crypto";
import type { JsonSchema } from "./json-schema.js";

const FINGERPRINT_LENGTH = 12;

export function computeFingerprint(payloadSchema: JsonSchema, responseSchema: JsonSchema): string {
  const canonical = JSON.stringify(
    sortKeysDeep({ payload: payloadSchema, response: responseSchema }),
  );
  return createHash("sha256").update(canonical).digest("hex").slice(0, FINGERPRINT_LENGTH);
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}
