import { defineContract } from "nestjs-wire-contracts-core";
import type { Contract, JsonSchema, SchemaAdapter } from "nestjs-wire-contracts-core";

// Marker property with no runtime meaning, used only to carry the generic type parameter.
export function fakeAdapter<T>(
  validate: (input: unknown) => T,
  jsonSchema: JsonSchema = {},
): SchemaAdapter<T> {
  return {
    _output: undefined as T,
    toJsonSchema: () => jsonSchema,
    parse: validate,
    safeParse: (input) => {
      try {
        return { success: true, data: validate(input) };
      } catch (error) {
        return { success: false, error };
      }
    },
  };
}

export interface UserPayload {
  id: number;
}

export interface UserResponse {
  name: string;
}

function isUserPayload(input: unknown): input is UserPayload {
  return (
    typeof input === "object" &&
    input !== null &&
    typeof (input as Record<string, unknown>).id === "number"
  );
}

function isUserResponse(input: unknown): input is UserResponse {
  return (
    typeof input === "object" &&
    input !== null &&
    typeof (input as Record<string, unknown>).name === "string"
  );
}

export function getUserContract(): Contract<"get_user", UserPayload, UserResponse> {
  return defineContract({
    pattern: "get_user",
    payload: fakeAdapter((input) => {
      if (!isUserPayload(input)) throw new Error("invalid payload");
      return input;
    }),
    response: fakeAdapter((input) => {
      if (!isUserResponse(input)) throw new Error("invalid response");
      return input;
    }),
  });
}
