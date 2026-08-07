import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";
import { describe, expect, it } from "vitest";
import { ContractResponseInterceptor } from "./contract-response.interceptor.js";
import { getUserContract } from "./test-helpers.js";

// The interceptor never reads `context`, so an empty stand-in is enough to satisfy the type.
const unusedContext = {} as ExecutionContext;

function handlerReturning(value: unknown): CallHandler {
  return { handle: () => of(value) };
}

describe("ContractResponseInterceptor", () => {
  it("parses a valid handler response through the contract's response adapter", async () => {
    const interceptor = new ContractResponseInterceptor(getUserContract());

    const result = await new Promise((resolve) => {
      interceptor.intercept(unusedContext, handlerReturning({ name: "Ada" })).subscribe(resolve);
    });

    expect(result).toEqual({ name: "Ada" });
  });

  it("propagates an error when the handler's response fails validation", async () => {
    const interceptor = new ContractResponseInterceptor(getUserContract());

    await expect(
      new Promise((resolve, reject) => {
        interceptor.intercept(unusedContext, handlerReturning({ name: 42 })).subscribe({
          next: resolve,
          error: reject,
        });
      }),
    ).rejects.toThrow();
  });
});
