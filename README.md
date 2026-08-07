# nestjs-wire-contracts

Typed, validated contracts for `@nestjs/microservices` message patterns (TCP, Redis, NATS, Kafka, RabbitMQ, MQTT).

`ClientProxy.send()` returns `Observable<any>` today — nothing checks that the payload you send or the response you get back actually matches what the other service expects. A renamed field or a changed type on either side compiles cleanly and fails silently at runtime. `nestjs-wire-contracts` closes that gap: define a contract once, share it between services, and get compile-time types plus runtime validation on both ends, without changing transport.

## Status

🚧 Early design phase. Not yet published to npm. No stable API — everything below is a work-in-progress overview, not a promise.

## License

Apache 2.0 — see [LICENSE](./LICENSE).
