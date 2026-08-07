import { Injectable, type PipeTransform } from "@nestjs/common";
import type { Contract } from "nestjs-wire-contracts-core";

@Injectable()
export class ContractValidationPipe implements PipeTransform {
  constructor(private readonly contract: Contract<string, unknown, unknown>) {}

  transform(value: unknown): unknown {
    return this.contract.payload.parse(value);
  }
}
