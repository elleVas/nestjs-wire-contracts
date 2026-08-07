import type { ClientProxy } from "@nestjs/microservices";
import { of } from "rxjs";
import { describe, expect, it } from "vitest";
import { ContractClientService } from "./contract-client.service.js";
import { getUserContract, type UserPayload } from "./test-helpers.js";

// Only `send` is exercised by ContractClientService; ClientProxy's other members are irrelevant here.
function fakeClient(response: unknown): ClientProxy {
  return { send: () => of(response) } as unknown as ClientProxy;
}

describe("ContractClientService", () => {
  it("sends the contract's pattern and validated payload, and returns the validated response", async () => {
    const service = new ContractClientService(fakeClient({ name: "Ada" }));

    const result = await service.send(getUserContract(), { id: 1 });

    expect(result).toEqual({ name: "Ada" });
  });

  it("throws before sending if the payload is invalid", async () => {
    const service = new ContractClientService(fakeClient({ name: "Ada" }));
    const invalidPayload = { id: "not a number" } as unknown as UserPayload;

    await expect(service.send(getUserContract(), invalidPayload)).rejects.toThrow();
  });

  it("throws if the response fails validation", async () => {
    const service = new ContractClientService(fakeClient({ name: 42 }));

    await expect(service.send(getUserContract(), { id: 1 })).rejects.toThrow();
  });
});
