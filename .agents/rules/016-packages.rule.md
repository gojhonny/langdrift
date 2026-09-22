---
id: RULE-016
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: Packages conventions for matching LangDrift code
title: Packages
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Packages

Shared libraries live under `packages/`. Domain services import them as `@pack/<name>`. They do not copy kernel types into each API.

## 1 - Kernel owns the abstracts

```text
packages/kernel/src/primitives/   # ValueObject, entity, id, domain event, error
packages/kernel/src/application/  # UseCase
packages/kernel/src/events/       # event bus, handler, factory
packages/kernel/src/types/
```

A new abstract that every service would need belongs in kernel, not in `authority/domain`.

## 2 - One package, one job

| Package | Owns |
|---|---|
| `kernel` | Domain primitives and use-case base |
| `env-orchestration` | Required env reads |
| `event-inventory` | Event name enums shared across services |
| `nats-broker-messaging` | Broker connection and consumer decorators |
| `cache` | Cache port/adapter |
| `patterns` | Shared patterns such as `UniqueEntityId` |

Do not create `packages/utils` or `packages/common`.

## 3 - Services compose packages in the module

`AppModule` / `<context>.module.ts` imports `ConfigModule`, binds ports, and registers kernel-facing providers (`natsConnectionProvider`, event bus). The use case does not instantiate the broker.
