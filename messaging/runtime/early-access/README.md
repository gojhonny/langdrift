# Early Access runtime

Two production Go actors, one root module, NATS JetStream and MinIO. The Website
uses a Next.js Server Function with server-only Axios; there is no API Route.

## Development

Run `./cli/drift early-access setup` from the repository root to create disposable local credentials without overwriting existing values. Development URLs are tracked in `.env.development`. Private values live in ignored sibling `.env` files:

| Component | Required private values |
| --- | --- |
| Website | `EMAIL_SERVICE_API_KEY`, `TURNSTILE_SECRET_KEY` |
| email-store | `EMAIL_SERVICE_API_KEY`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` |
| MinIO | `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` |
| email-sender | `RESEND_API_KEY`, `RESEND_FROM` (mock values locally) |

`RESEND_API_URL` points to the in-compose Go mock by default. Set `EARLY_ACCESS_MODE=production` and the real Resend endpoint only on a production sender.
Use the same shared API key in Website and store. For local development, store's
MinIO keys match the local MinIO root credentials. Production must supply scoped
application credentials. No NATS authentication is configured in this local
single-node topology, and its ports are not published to the host.

```sh
./cli/drift doctor early-access
./cli/drift runtime early-access up
pnpm website
```

`127.0.0.1:8080` and `127.0.0.1:8081` are published. Named volumes retain JetStream
and contacts. Both actors answer `GET /healthz` with `{"status":"ok"}`.
`POST /v1/emails` returns 202 only after JetStream confirms `email.received`.
Neither MinIO nor Resend is in that HTTP path.
Both actors expose `GET /readyz` for dependency-aware readiness. Normal `down` retains volumes; `reset` deletes them.

Run `./cli/drift test early-access unit`, `integration`, `e2e`, or `all` for progressively broader checks. `./cli/drift audit early-access` measures Go coverage and dependency findings. Browser tests need Playwright Chromium installed.

```sh
./cli/drift smoke early-access
```

That command curls the two dev health endpoints. It does not start Compose, run
Go tests, or prove delivery. `email-store` and `email-sender` select one endpoint;
the default is both.

The separate composition in `containers/e2e/` has isolated named volumes and loopback-only test ports. `drift early-access setup` prepares its ignored `.env`. Its tracked `.env.development` points
`RESEND_API_URL` at `http://resend-mock:8080/emails`. The sender refuses to start
in that composition when the effective URL is anything else. No production Resend
credential belongs in CI.

`go test` and `go test -race` cover envelopes, stream topology, ingress, storage,
and the sender, including `email.sent`. CI keeps the development storage smoke:
it checks both health endpoints, stops the sender, and proves acceptance, the
MinIO contact, and the received/stored messages without calling Resend.

CI then runs the Go runner against the isolated composition. It proves the stored contact through MinIO, correlated `received → stored → sent` events, the provider idempotency key, and repeat registration. Playwright exercises the Website form through the Server Function with a local challenge verifier and provider mock. No CI job sends live email.

## Contracts and limits

`EARLY_ACCESS` retains `email.*` for seven days, subject to a 256 MiB stream cap;
new events are rejected when full. JetStream uses disk storage and a 24-hour
deduplication window. Durable consumers:

- `early-access-email-store-v1` receives `email.received`.
- `early-access-email-sender-v1` receives `email.stored`.

No consumer is assigned to `email.sent`. Bootstrap updates this topology
idempotently. Consumers use explicit acknowledgements, a 30-second initial ack
window and backoff of 30 seconds, 1 minute, 5 minutes, 15 minutes, then 1 hour,
with at most ten delivery attempts. Exhausted inputs remain in the stream for
operator review; the runtime does not claim successful delivery.

Every transition has a distinct event ID, deterministically derived from its
input identity. Re-publishing the same transition retains that identity for NATS
deduplication and the Resend idempotency key. The envelope's `occurredAt` carries
the originating ingress time through this slice to preserve an absolute retry
horizon; contact `storedAt` records the actual storage time. The sender stops
attempts 23 hours after that origin, even after worker downtime, keeping retries
inside [Resend's 24-hour idempotency window](https://resend.com/docs/dashboard/emails/idempotency-keys).
Old events are terminated for operator review, never sent with a fresh key.
This is at-least-once delivery with idempotent side effects, not exactly-once.

Contacts are stored without object versioning in `langdrift-emails` at
`contacts/<sha256(trimmed-email)>.json`. Records contain `eventId`, `email`,
`locale`, `source`, `receivedAt`, and `storedAt`. Trimming outer whitespace is the
only normalization; aliases, dots and case are preserved. Repeat storage of the
same event reuses its contact record. A later submission with the same normalized email retains the first record and its event identity. The API still returns neutral 202 acceptance.

Ingress requires bearer authentication, JSON, one typed object, no unknown fields,
email syntax with a 254-character ceiling, locale `en|pt-BR|zh-Hant|ja`, and source
`landing|pricing`. It limits bodies to 1 KiB (4 KiB globally), headers to 16 KiB,
rate to 50 requests/second with burst 100, and in-flight work to 64 requests.
Header/read/write/idle timeouts are 2/5/5/30 seconds; shutdown allows ten seconds.
Overload returns 429 or 503. Logs contain categories and event identities, never
submitted addresses, credentials or provider error bodies.

## Production

Hosting is undecided. Go actors, NATS and MinIO require a protected runtime host.
The Website needs that host's real HTTPS origin in `EMAIL_SERVICE_URL`; no domain
is invented here. The edge must provide TLS, volumetric protection, connection
limits and request filtering. Local application limits are only defense in depth.

Set `MINIO_USE_SSL=true`, real NATS/MinIO endpoints and scoped credentials on the
runtime host. Set `RESEND_API_URL=https://api.resend.com/emails`, `RESEND_API_KEY`,
and the verified `RESEND_FROM` only on the sender.
The Website receives its service origin, shared API key, Turnstile site key, secret and expected hostname. Production must use real Turnstile keys and `EARLY_ACCESS_MODE=production`; the mock verifier is allowed only in test mode on loopback.

Before public signup, confirm TLS, private NATS and MinIO, scoped credentials, edge limits, backup/restore, credential rotation, operator handling of expired/exhausted deliveries, contact retention/deletion policy, and one controlled live-provider smoke. Track these in [the audit](AUDIT.md).
