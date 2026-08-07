import { defineContract } from "nestjs-wire-contracts-core";
import type { Contract } from "nestjs-wire-contracts-core";
import type { z } from "zod";
import { zodAdapter } from "./adapter.js";

export interface PatternDefinition<Payload, Response> {
  payload: z.ZodType<Payload>;
  response: z.ZodType<Response>;
}

function pattern<Pattern extends string, Payload, Response>(
  patternName: Pattern,
  definition: PatternDefinition<Payload, Response>,
): Contract<Pattern, Payload, Response> {
  return defineContract({
    pattern: patternName,
    payload: zodAdapter(definition.payload),
    response: zodAdapter(definition.response),
  });
}

export const c = { pattern };
