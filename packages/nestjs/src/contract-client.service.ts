import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import type { Contract, ContractPayload, ContractResponse } from "nestjs-wire-contracts-core";

@Injectable()
export class ContractClientService {
  constructor(private readonly client: ClientProxy) {}

  async send<C extends Contract<string, unknown, unknown>>(
    contract: C,
    payload: ContractPayload<C>,
  ): Promise<ContractResponse<C>> {
    const validatedPayload = contract.payload.parse(payload);
    const response = await firstValueFrom(
      this.client.send<unknown>({ cmd: contract.pattern }, validatedPayload),
    );
    // contract.response is only known here through its upper bound (SchemaAdapter<unknown>), not
    // C's actual Response type — TypeScript can't carry the concrete instantiation of a generic
    // parameter into its own method bodies. The cast just restores what the type helper already
    // proves to callers of send().
    return contract.response.parse(response) as ContractResponse<C>;
  }
}
