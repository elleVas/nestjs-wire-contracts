import { applyDecorators, UseInterceptors, UsePipes } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import type { Contract } from "nestjs-wire-contracts-core";
import { ContractResponseInterceptor } from "./contract-response.interceptor.js";
import { ContractValidationPipe } from "./contract-validation.pipe.js";

export function ContractPattern<Pattern extends string, Payload, Response>(
  contract: Contract<Pattern, Payload, Response>,
): MethodDecorator {
  return applyDecorators(
    MessagePattern({ cmd: contract.pattern }),
    UsePipes(new ContractValidationPipe(contract)),
    UseInterceptors(new ContractResponseInterceptor(contract)),
  );
}
