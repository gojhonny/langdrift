---
context: messaging-runtime-and-environment
status: current
source_branch: main
reviewed_at: 2026-09-21
sources:
  - messaging/runtime/early-access/README.md
  - messaging/runtime/early-access/microservices/email-store/main.go
  - messaging/runtime/early-access/microservices/email-sender/main.go
  - messaging/runtime/early-access/microservices/email-sender/.env.development
  - packages/events/envelopes/envelope.go
  - apps/website/src/env.ts
  - apps/website/src/env.server.ts
  - apps/website/README.md
  - .gitignore
  - .github/workflows/ci.yml
---

# Messaging runtime and environment

There is no general LangDrift backend workspace. The only backend-style runtime is the Early Access use case under `messaging/runtime/early-access`.

The Website path implemented today is:

```text
Zod validation
→ Next.js Server Function
→ server-only Axios
→ email-store
→ NATS JetStream email.received
→ MinIO contact object
→ email.stored
→ email-sender
→ Resend
```

Production actors are `email-store` and `email-sender`. Infrastructure lives at `messaging/infrastructure/broker/nats` and `messaging/infrastructure/storage/minio`. Shared envelopes live in `packages/events/envelopes`.

`email-store` requires `EMAIL_SERVICE_API_KEY`, `API_ADDR`, `NATS_URL`, `MINIO_ENDPOINT`, `MINIO_BUCKET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_USE_SSL`, and `EARLY_ACCESS_MODE`. `email-sender` requires `NATS_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_API_URL`, `HEALTH_ADDR`, and `EARLY_ACCESS_MODE`. Development points to an in-compose Resend mock. The Website also validates Turnstile server-side before forwarding to Go.

Both actors expose `GET /healthz` and `GET /readyz`. `POST /v1/emails` returns 202 only after JetStream accepts `email.received`. MinIO conditional create preserves the first contact and event identity across repeat submissions.

## Environment files

Tracked `.env.development` holds safe local values. Ignored `.env` holds private values. `.gitignore` ignores `.env`, `.env.local`, and `.env.*.local`, and keeps `.env.development`. Required website values throw when they are missing. There is no hardcoded runtime fallback in `apps/website/src/env.ts`.

## What CI proves

The `early-access-runtime` job validates the dev and e2e Compose files, starts the dev stack, checks store health and the `EARLY_ACCESS` stream, stops `email-sender`, posts a synthetic registration, and checks for a MinIO contact plus both durable consumers. A separate proof profile then runs the isolated chain against the in-compose test provider and requires exactly one send. CI does not call live Resend. The operational detail is in `messaging/runtime/early-access/README.md`.
