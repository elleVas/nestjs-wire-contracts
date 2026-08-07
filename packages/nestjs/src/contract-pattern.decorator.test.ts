import "reflect-metadata";
import { PATTERN_METADATA } from "@nestjs/microservices/constants";
import { describe, expect, it } from "vitest";
import { ContractPattern } from "./contract-pattern.decorator.js";
import { getUserContract } from "./test-helpers.js";

describe("ContractPattern", () => {
  it("registers a standard @MessagePattern under the contract's pattern name", () => {
    class TestController {
      @ContractPattern(getUserContract())
      getUser() {
        return { name: "Ada" };
      }
    }

    const patterns = Reflect.getMetadata(PATTERN_METADATA, TestController.prototype.getUser);

    expect(patterns).toEqual([{ cmd: "get_user" }]);
  });
});
