# Early Access runtime

Two production Go actors, one root module, NATS JetStream and MinIO. The Website
uses a Next.js Server Function with server-only Axios; there is no API Route.

## Development

Run `./cli/drift env setup` from the repository root. Development URLs are tracked
in `.env.development`. Put these private values in ignored sibling `.env` files:

| Component | Required private values |
| --- | --- |
| Website | `EMAIL_SERVICE_API_KEY` |
| email-store | `EMAIL_SERVICE_API_KEY`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` |
| MinIO | `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` |
| email-sender | `RESEND_API_KEY`, `RESEND_FROM` (verified sender) |

Use the same shared API key in Website and store. For local development, store's
MinIO keys match the local MinIO root credentials. Production must supply scoped
application credentials. No NATS authentication is configured in this local
single-node topology, and its ports are not published to the host.

```sh
docker compose -f messaging/runtime/early-access/containers/dev/docker-compose.yml up -d --build
pnpm website
```

Only `127.0.0.1:8080` is published. Named volumes retain JetStream and contacts.
`GET /healthz` returns `{"status":"ok"}`. `POST /v1/emails` returns 202 only after
JetStream confirms `email.received`. Neither MinIO nor Resend is in that HTTP path.

The separate composition in `containers/e2e/` has isolated named volumes, no host
ports and no test runner. Before raising it locally, provide that directory's
ignored `.env` with the private keys listed above. Use only a sandbox sender; no
production Resend credential belongs in CI.

CI now validates both Compose models and raises both topologies. The development
runtime smoke check waits for healthy services, verifies `/healthz`, confirms the
`EARLY_ACCESS` stream and both durable consumers, then stops the sender and posts
a synthetic Early Access registration. CI verifies the request is accepted, a
contact is persisted in MinIO, and the stream contains the received/stored
lifecycle messages. The isolated E2E composition is also raised to prove its
container/env wiring. This is runtime smoke coverage, not an automated delivery
E2E suite; CI does not call live Resend.

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
same event reuses its contact record. A later submission may replace the contact.

Ingress requires bearer authentication, JSON, one typed object, no unknown fields,
email syntax with a 254-character ceiling, locale `en|pt-BR|zh-Hant|ja`, and source
`landing|pricing`. It limits bodies to 1 KiB (4 KiB globally), headers to 16 KiB,
rate to 50 requests/second with burst 100, and in-flight work to 64 requests.
Header/read/write/idle timeouts are 2/5/5/30 seconds; shutdown allows ten seconds.
Overload returns 429 or 503. Logs contain categories and event identities, never
submitted addresses, credentials or provider error bodies.

## Production

Web apps run on Vercel. Go actors, NATS and MinIO require a separate runtime host.
The Website needs that host's real HTTPS origin in `EMAIL_SERVICE_URL`; no domain
is invented here. The edge must provide TLS, volumetric protection, connection
limits and request filtering. Local application limits are only defense in depth.

Set `MINIO_USE_SSL=true`, real NATS/MinIO endpoints and scoped credentials on the
runtime host. Set `RESEND_API_KEY` and the verified `RESEND_FROM` only on the sender.
The Website receives only its service origin and shared API key.
