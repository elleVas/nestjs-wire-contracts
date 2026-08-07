import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";
import { map, type Observable } from "rxjs";
import type { Contract } from "nestjs-wire-contracts-core";

@Injectable()
export class ContractResponseInterceptor implements NestInterceptor {
  constructor(private readonly contract: Contract<string, unknown, unknown>) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((response: unknown) => this.contract.response.parse(response)));
  }
}
