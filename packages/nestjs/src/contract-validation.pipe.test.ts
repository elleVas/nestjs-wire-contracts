import { describe, expect, it } from "vitest";
import { ContractValidationPipe } from "./contract-validation.pipe.js";
import { getUserContract } from "./test-helpers.js";

describe("ContractValidationPipe", () => {
  it("parses valid input through the contract's payload adapter", () => {
    const pipe = new ContractValidationPipe(getUserContract());

    expect(pipe.transform({ id: 1 })).toEqual({ id: 1 });
  });

  it("throws on invalid input", () => {
    const pipe = new ContractValidationPipe(getUserContract());

    expect(() => pipe.transform({ id: "not a number" })).toThrow();
  });
});
