# LangDrift — Early Access Email Event Architecture Handoff

**Status:** Proposal for review
**Date:** 2026-09-20
**Scope:** LangDrift early-access email capture and acknowledgement flow

This document is the supplied architecture handoff for review. Its implementation
requirements describe a proposed future change; the flow is not implemented by
this document-only PR.

---

## 1. Objective

Implement the LangDrift early-access email flow as a deliberately small event-driven architecture.

The frontend must not own email persistence or email delivery.

The backend must remain intentionally narrow: receive an email, persist it, send the acknowledgement email, and emit lifecycle events.

The implementation must use:

- Next.js Server Actions;
- Axios;
- Zod;
- Go;
- NATS JetStream;
- MinIO;
- Resend.

Do not introduce a general LangDrift backend, ORM, framework-heavy Go service, or additional infrastructure beyond what this flow requires.

---

## 2. Canonical architecture

```text
Browser
  │
  │ submit early-access form
  ▼
Next.js Client Component
  │
  │ Server Action
  ▼
Next.js Server Action
  │
  ├─ validate with Zod
  │
  │ Axios
  ▼
Go Email Receiver / Storage Service
  │
  ├─ HTTP POST /v1/emails
  │
  └─ publish: email.received
               │
               ▼
          NATS JetStream
               │
               ▼
Go Email Receiver / Storage Service
  │
  ├─ consume: email.received
  ├─ persist contact in MinIO
  └─ publish: email.stored
               │
               ▼
          NATS JetStream
               │
               ▼
Go Email Sender Service
  │
  ├─ consume: email.stored
  ├─ send email through Resend
  └─ publish: email.sent
               │
               ▼
          NATS JetStream
```

There are exactly **two Go microservices** for this first version:

1. **Email Receiver / Storage Service**
2. **Email Sender Service**

Keep both services small enough to remain understandable as one-file Go services initially.


---

## 2.1 Shared event package

The two Go microservices must share one canonical event contract package.

Do not duplicate event structs inside each service.

Suggested structure:

```text
services/
  events/
    events.go

  email-receiver/
    main.go

  email-sender/
    main.go
```

If the repository uses a root Go module, both services import the same package:

```go
import "github.com/gojhonny/langdrift/services/events"
```

The shared package owns:

- the event envelope;
- event type constants;
- event version;
- payload structs;
- encoding/decoding helpers only if they remain small and deterministic.

It must not own:

- NATS connections;
- MinIO clients;
- Resend clients;
- service configuration;
- business orchestration.

### Canonical event envelope

Every event published to NATS uses the same envelope shape:

```json
{
  "id": "019...",
  "type": "email.received",
  "version": 1,
  "occurredAt": "2026-09-20T14:30:00Z",
  "payload": {}
}
```

Canonical Go shape:

```go
package events

import (
    "encoding/json"
    "time"
)

type Type string

const (
    TypeEmailReceived Type = "email.received"
    TypeEmailStored   Type = "email.stored"
    TypeEmailSent     Type = "email.sent"
)

const Version = 1

type Envelope struct {
    ID         string          `json:"id"`
    Type       Type            `json:"type"`
    Version    int             `json:"version"`
    OccurredAt time.Time       `json:"occurredAt"`
    Payload    json.RawMessage `json:"payload"`
}
```

The envelope is intentionally small.

Do not add generic metadata bags, tracing frameworks, actor models, aggregate IDs, causation chains, correlation graphs, or CloudEvents compatibility unless a concrete requirement appears later.

### Typed payloads

The payload remains strongly typed per event.

```go
type EmailReceivedPayload struct {
    Email  string `json:"email"`
    Locale string `json:"locale"`
    Source string `json:"source"`
}

type EmailStoredPayload struct {
    Email     string `json:"email"`
    Locale    string `json:"locale"`
    Source    string `json:"source"`
    ObjectKey string `json:"objectKey"`
}

type EmailSentPayload struct {
    Email             string `json:"email"`
    Provider          string `json:"provider"`
    ProviderMessageID string `json:"providerMessageId"`
}
```

### Publishing events

A service creates the typed payload, serializes it, then wraps it in the shared envelope.

Conceptually:

```go
payload, err := json.Marshal(events.EmailReceivedPayload{
    Email:  email,
    Locale: locale,
    Source: source,
})
if err != nil {
    return err
}

event := events.Envelope{
    ID:         eventID,
    Type:       events.TypeEmailReceived,
    Version:    events.Version,
    OccurredAt: time.Now().UTC(),
    Payload:    payload,
}
```

Then serialize the envelope once for NATS:

```go
body, err := json.Marshal(event)
```

### Consuming events

Consumers first decode the envelope:

```go
var envelope events.Envelope

if err := json.Unmarshal(msg.Data, &envelope); err != nil {
    return err
}
```

Then verify the expected event type and version before decoding the payload:

```go
if envelope.Type != events.TypeEmailStored {
    return fmt.Errorf("unexpected event type: %s", envelope.Type)
}

if envelope.Version != events.Version {
    return fmt.Errorf("unsupported event version: %d", envelope.Version)
}

var payload events.EmailStoredPayload

if err := json.Unmarshal(envelope.Payload, &payload); err != nil {
    return err
}
```

The sender service must never define its own copy of `EmailStoredPayload`.

The receiver/storage service must never define its own copy of `EmailReceivedPayload`.

The shared package is the single source of truth for the NATS event schema.

### Event identity

`Envelope.ID` identifies the event instance.

Do not reuse the same event ID for all three lifecycle events.

Example:

```text
email.received  -> event ID A
email.stored    -> event ID B
email.sent      -> event ID C
```

If later the system needs causation/correlation identifiers, add them deliberately as a schema evolution. They are not required in the first version.

### Schema evolution

Start with:

```text
version = 1
```

A breaking payload/envelope change must increment the version.

Do not silently change the meaning of an existing version.

For this first implementation, all services support only version `1`.


---

## 3. Event lifecycle

The canonical lifecycle is:

```text
email.received
      ↓
email.stored
      ↓
email.sent
```

### `email.received`

Published immediately after the Go receiver accepts and validates the request sufficiently to enqueue it.

This event means:

> The email registration request was accepted by the email service.

It does **not** mean the email has already been persisted.

### `email.stored`

Published only after the contact record is successfully persisted in MinIO.

This event means:

> The email registration is durably stored.

The email sender must listen to this event, not directly to `email.received`.

### `email.sent`

Published only after Resend successfully accepts the outbound email request.

This event means:

> The acknowledgement email was successfully handed to Resend.

It does not imply final inbox delivery unless a future Resend webhook flow adds explicit delivery events.

---

## 4. Next.js boundary

### Required

The Website must use a **Server Action**, not a Next.js API Route.

Canonical form:

```text
form.tsx
  ↓
form.action.ts
  ↓
Axios
  ↓
Go email service
```

The action file must begin with:

```ts
'use server'
```

Do not add:

```text
app/api/early-access/route.ts
```

for this flow.

The client component must never import Axios.

The browser must never call the Go service directly.

---

## 5. Zod validation

Validate the form before making the backend request.

Reuse the existing early-access Zod schema.

The Website currently validates:

- required email;
- valid email syntax;
- trimmed outer whitespace;
- maximum length of 254 characters.

The Server Action must validate again before sending the request.

Conceptually:

```ts
'use server'

import axios from 'axios'
import { earlyAccessFormSchema } from './form.validation'

export async function submitEarlyAccess(input: unknown) {
  const data = earlyAccessFormSchema.parse(input)

  // Axios call occurs only after successful validation.
}
```

Client-side validation remains useful for UX.

Server-side validation remains mandatory because client validation is not a trust boundary.

---

## 6. Axios

Axios is the canonical HTTP client between the Next.js Server Action and the Go email service.

Add Axios to the Website package.

The Axios call exists only in the Server Action/server-side code.

Conceptually:

```ts
await axios.post(
  `${process.env.EMAIL_SERVICE_URL}/v1/emails`,
  {
    email,
    locale,
    source
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`
    },
    timeout: 5000
  }
)
```

Do not expose these variables through `NEXT_PUBLIC_*`.

Required server-only configuration:

```text
EMAIL_SERVICE_URL
EMAIL_SERVICE_API_KEY
```

---

## 7. Request payload

The Website sends:

```json
{
  "email": "person@example.com",
  "locale": "en",
  "source": "landing"
}
```

Supported `source` values initially:

```text
landing
pricing
```

Supported locales follow the existing Website locale contract:

```text
en
pt-BR
zh-Hant
ja
```

Do not add product-domain information to this contract.

---

## 8. Go service 1 — Email Receiver / Storage

This service owns two responsibilities that belong to the same narrow workflow:

1. HTTP ingress for new email registrations.
2. Persistence of `email.received` events into MinIO.

Keep it one-file initially, for example:

```text
services/email-receiver/main.go
```

No framework is required.

Use the Go standard HTTP server unless a concrete need appears for another router.

### HTTP responsibility

Expose:

```http
POST /v1/emails
```

The handler must:

1. authenticate the service request;
2. decode JSON;
3. perform basic backend validation;
4. normalize the email consistently;
5. create an event ID;
6. publish `email.received` to NATS JetStream;
7. return a narrow success response.

Example:

```json
{
  "ok": true
}
```

The HTTP handler must **not**:

- write directly to MinIO;
- call Resend;
- implement LangDrift product logic.

The event is the handoff boundary.

---

## 9. Go service 1 — NATS consumer

The same service also consumes:

```text
email.received
```

For each event:

1. deserialize the event;
2. compute the deterministic object key;
3. persist the contact in MinIO;
4. publish `email.stored`;
5. acknowledge the NATS message only after successful persistence and publish.

Failures must leave the message eligible for JetStream redelivery according to the configured consumer policy.

---

## 10. MinIO storage

MinIO is the canonical durable storage for this first version.

Use the official Go MinIO client.

Package:

```text
github.com/minio/minio-go/v7
```

Suggested bucket:

```text
langdrift-emails
```

Do not use the raw email address as the object key.

Normalize the email, hash it, and derive a deterministic key.

Example:

```text
contacts/<sha256(normalized-email)>.json
```

Example object:

```json
{
  "eventId": "019...",
  "email": "person@example.com",
  "locale": "en",
  "source": "landing",
  "receivedAt": "2026-09-20T14:30:00Z",
  "storedAt": "2026-09-20T14:30:01Z"
}
```

The deterministic object name provides simple idempotency for duplicate registrations.

A repeated registration for the same normalized email should overwrite or safely preserve the same logical contact object rather than create an unbounded set of duplicate contact files.

Do not enable object versioning for this bucket in the first version.

---

## 11. Email normalization

Keep normalization conservative.

Required:

```text
trim surrounding whitespace
```

Use a deterministic strategy for identity.

Do not:

- remove Gmail dots;
- strip `+aliases`;
- rewrite domains;
- infer company information;
- lowercase or transform local parts beyond an explicitly chosen canonical rule.

If lowercasing is used for the deterministic hash, preserve the originally accepted email value in the stored payload if needed.

---

## 12. `email.received` event

Use the shared event envelope.

```json
{
  "id": "019...",
  "type": "email.received",
  "version": 1,
  "occurredAt": "2026-09-20T14:30:00Z",
  "payload": {
    "email": "person@example.com",
    "locale": "en",
    "source": "landing"
  }
}
```

The payload type is `events.EmailReceivedPayload`.

---

## 13. `email.stored` event

Use the shared event envelope.

```json
{
  "id": "019...",
  "type": "email.stored",
  "version": 1,
  "occurredAt": "2026-09-20T14:30:01Z",
  "payload": {
    "email": "person@example.com",
    "locale": "en",
    "source": "landing",
    "objectKey": "contacts/abc123....json"
  }
}
```

The payload type is `events.EmailStoredPayload`.

This is the only event consumed by the sender service.

This guarantees:

```text
persist first
send second
```

---

## 14. Go service 2 — Email Sender

Keep it one-file initially:

```text
services/email-sender/main.go
```

Its responsibility is only:

```text
email.stored
    ↓
Resend
    ↓
email.sent
```

It must:

1. connect to NATS JetStream;
2. consume `email.stored`;
3. construct the acknowledgement email;
4. send it through Resend;
5. publish `email.sent`;
6. acknowledge the NATS message only after successful Resend acceptance and event publication.

It must not:

- write contacts to MinIO;
- expose the public registration API;
- own LangDrift product behavior.

---

## 15. Resend

Resend is the canonical email delivery provider.

Use the official Go SDK:

```text
github.com/resend/resend-go/v4
```

Configuration:

```text
RESEND_API_KEY
RESEND_FROM
```

Example sender:

```text
LangDrift <hello@langdrift.md>
```

Do not place the Resend API key anywhere in Next.js.

Only the email sender service owns the Resend credential.

---

## 16. `email.sent` event

Use the shared event envelope.

```json
{
  "id": "019...",
  "type": "email.sent",
  "version": 1,
  "occurredAt": "2026-09-20T14:30:02Z",
  "payload": {
    "email": "person@example.com",
    "provider": "resend",
    "providerMessageId": "..."
  }
}
```

The payload type is `events.EmailSentPayload`.

This closes the initial event chain.

No additional consumer is required for `email.sent` in the first version.

The event exists for:

- observability;
- debugging;
- future projections;
- future delivery tracking.

Do not build those future consumers yet.

---

## 17. NATS JetStream

Use NATS JetStream rather than ephemeral Core NATS subscriptions.

The reason is simple:

```text
email registration must survive process restarts
```

Suggested subjects:

```text
email.received
email.stored
email.sent
```

Suggested stream:

```text
EMAILS
```

Subjects:

```text
email.*
```

Keep stream configuration intentionally minimal.

Each service uses its own durable consumer.

Conceptually:

```text
EMAILS stream
  ├─ email.received
  ├─ email.stored
  └─ email.sent
```

Do not introduce Kafka, BullMQ, RabbitMQ, Redis Streams, or another queue for this flow.

NATS is the event transport.

MinIO is the durable contact store.

---

## 18. Delivery semantics

Assume **at-least-once delivery**.

Therefore every consumer must be idempotent.

### Storage idempotency

Same normalized email:

```text
same deterministic MinIO object key
```

### Sender idempotency

The sender should avoid producing duplicate acknowledgement emails when JetStream redelivers the same `email.stored` event.

For the small first version, use the event ID as the delivery identity.

Persist or otherwise check a minimal send marker before/around email dispatch if required for strict duplicate prevention.

Do not claim exactly-once messaging.

The system is:

```text
at-least-once events
+
idempotent consumers
```

---

## 19. HTTP success semantics

The HTTP API acknowledges that the request was accepted into the event pipeline.

It does not synchronously wait for:

```text
MinIO persistence
Resend delivery
```

The initial API success therefore means:

> The registration was accepted and durably published to the JetStream-backed pipeline.

If the product later requires synchronous confirmation of durable MinIO storage, change the contract deliberately rather than hiding that synchronization inside the event flow.

---

## 20. Website form states

Replace the existing local-only `valid` success semantics.

Recommended states:

```text
idle
submitting
success
error
```

Field validation errors remain separate.

The form must:

1. validate locally;
2. enter `submitting`;
3. invoke the Server Action;
4. show success only when the Server Action returns success;
5. show a translated generic unavailable/error state on failure.

Do not put the email into:

- Jotai;
- URL parameters;
- analytics payloads;
- localStorage;
- sessionStorage;
- browser logs.

React local state + Immer remains canonical.

---

## 21. Suggested repository structure

Keep this small.

```text
apps/
  website/
    src/
      components/
        early-access/
          form.tsx
          form.action.ts
          form.types.ts
          form.data.ts
          form.handlers.ts
          form.mappers.ts
          form.validation.ts

services/
  events/
    events.go

  email-receiver/
    main.go

  email-sender/
    main.go

go.mod
go.sum
```

If repository conventions strongly prefer a dedicated Go module under `services/`, this is also acceptable:

```text
services/
  go.mod
  go.sum

  events/
    events.go

  email-receiver/
    main.go

  email-sender/
    main.go
```

Prefer the smaller structure that works cleanly with CI.

Do not split the Go services into controllers, repositories, use-cases, entities, providers, and adapters at this stage.

---

## 22. Suggested Go dependencies

Keep the dependency surface small.

```text
github.com/nats-io/nats.go
github.com/minio/minio-go/v7
github.com/resend/resend-go/v4
```

Use the standard library for:

```text
net/http
encoding/json
crypto/sha256
context
log/slog
time
```

Do not add a Go web framework unless the standard library becomes insufficient.

---

## 23. Environment configuration

### Website

```text
EMAIL_SERVICE_URL
EMAIL_SERVICE_API_KEY
```

### Email Receiver / Storage

```text
PORT
EMAIL_SERVICE_API_KEY
NATS_URL
MINIO_ENDPOINT
MINIO_ACCESS_KEY
MINIO_SECRET_KEY
MINIO_BUCKET
MINIO_USE_SSL
```

### Email Sender

```text
NATS_URL
RESEND_API_KEY
RESEND_FROM
```

Do not commit secret values.

Fail fast at startup when required configuration is missing.

---

## 24. Service authentication

The Website Server Action and Go receiver communicate server-to-server.

Use a simple bearer credential initially:

```http
Authorization: Bearer <EMAIL_SERVICE_API_KEY>
```

This is sufficient for the first narrow internal service.

Do not introduce OAuth, JWT infrastructure, WorkOS, or user authentication into this acquisition endpoint.

---

## 25. Error behavior

### Next.js Server Action

Map backend/network failures into a narrow result:

```ts
type EarlyAccessActionResult =
  | { ok: true }
  | { ok: false; code: 'VALIDATION_ERROR' | 'UNAVAILABLE' }
```

Do not return Axios exceptions to the client.

### Go HTTP receiver

Return only narrow JSON responses.

Do not leak:

- NATS errors;
- MinIO credentials;
- stack traces;
- Resend details;
- internal service topology.

### Consumers

Log operational failures with:

```text
event ID
event type
service
error category
```

Avoid logging the raw email address unless explicitly required.

---

## 26. Acknowledgement email

Keep the first email intentionally simple.

It should confirm that the address has been added to early access.

Do not claim:

- trial activation;
- account creation;
- guaranteed launch date;
- plan entitlement;
- billing state.

The existing product rule remains:

> The 15-day trial starts when access is activated, not when the early-access email is submitted.

---

## 27. Explicit non-goals

Do not add:

- PostgreSQL;
- MySQL;
- MongoDB;
- Redis;
- BullMQ;
- Kafka;
- RabbitMQ;
- a general notification platform;
- generic event framework;
- CQRS framework;
- event sourcing framework;
- user accounts;
- billing;
- trial state;
- authentication flows;
- marketing automation;
- CRM synchronization;
- Resend contact storage as the source of truth;
- admin UI for contacts;
- email campaign functionality.

This is a small email registration pipeline.

---

## 28. Implementation order

Implement in this order:

```text
1. Go module / dependencies
2. NATS JetStream stream bootstrap
3. Email Receiver HTTP endpoint
4. email.received publication
5. Receiver email.received consumer
6. MinIO persistence
7. email.stored publication
8. Email Sender consumer
9. Resend integration
10. email.sent publication
11. Next.js Axios dependency
12. Next.js Server Action
13. Client form submission states
14. Tests
15. CI / local-run documentation
```

Do not wire the Website to an incomplete backend and fake success.

---

## 29. Minimum tests

### Website

Test:

- invalid email never calls the Server Action;
- valid email invokes the Server Action;
- action validates again with Zod;
- Axios is server-only;
- success state;
- unavailable/error state;
- email does not enter global state or URL.

### Receiver / Storage

Test:

- unauthorized request rejected;
- malformed payload rejected;
- valid request publishes `email.received`;
- duplicate email maps to the same MinIO key;
- successful MinIO persistence publishes `email.stored`;
- failed persistence does not acknowledge the event.

### Sender

Test:

- `email.stored` triggers Resend;
- Resend failure does not acknowledge the event;
- successful Resend call publishes `email.sent`;
- duplicate event handling does not intentionally send duplicate acknowledgements.

---

## 30. Local development

A minimal local environment should provide:

```text
NATS with JetStream enabled
MinIO
email-receiver
email-sender
Website
```

Docker Compose is acceptable for NATS and MinIO if useful, but do not containerize everything merely for appearance.

Example conceptual startup:

```text
nats-server -js

minio server ./data

go run ./services/email-receiver

go run ./services/email-sender

pnpm --filter website dev
```

---

## 31. Acceptance criteria

The implementation is complete when all of the following are true:

- The Website uses a Server Action, not an API Route.
- The client component does not import Axios.
- The Server Action validates with Zod.
- The Server Action uses Axios.
- The browser never calls the Go service directly.
- There are exactly two small Go services.
- Both Go services import the same shared `events` package.
- Every NATS message uses the canonical `events.Envelope`.
- Event payload structs are defined once in the shared package.
- The receiver exposes `POST /v1/emails`.
- The receiver publishes `email.received`.
- The receiver consumes `email.received`.
- The receiver persists the contact in MinIO.
- Persistence is idempotent for duplicate email registrations.
- Successful persistence publishes `email.stored`.
- The sender consumes only `email.stored`.
- The sender uses Resend.
- Successful provider acceptance publishes `email.sent`.
- NATS JetStream is the only queue/event transport.
- MinIO is the source of truth for stored early-access contacts.
- Resend is used only for sending.
- No raw secrets reach the browser.
- No email address enters Jotai, URLs, browser persistence, or analytics.
- No PostgreSQL, Redis, BullMQ, Kafka, RabbitMQ, or ORM is introduced.
- The 15-day trial is not activated by email registration.
- CI/build/test instructions cover both Go services and the Website integration.

---

---

## 33. Runtime package

Create a very small runtime package responsible only for local orchestration.

Suggested structure:

```text
runtime/
  docker-compose.yml
  .env.template

  nats/
    Dockerfile
    .env.template

  minio/
    Dockerfile
    .env.template

  website/
    Dockerfile
    .env.template

  email-receiver/
    Dockerfile
    .env.template

  email-sender/
    Dockerfile
    .env.template
```

Keep this package operational only.

It must not contain:

- application business logic;
- copied application source beyond Docker build context needs;
- hardcoded credentials;
- production secret values;
- duplicate event schemas;
- generated secrets.

The purpose of `runtime/` is:

```text
local orchestration
+
container build definitions
+
environment-variable contracts
```

---

## 34. Docker Compose environment rule

The Docker Compose file must not contain environment-variable values.

Do not write:

```yaml
environment:
  NATS_URL: nats://nats:4222
  MINIO_ACCESS_KEY: minio
  MINIO_SECRET_KEY: minio123
```

Do not write:

```yaml
environment:
  - NATS_URL=nats://nats:4222
```

Do not hardcode secret or non-secret runtime configuration in Compose.

The Compose file should describe:

- services;
- build contexts;
- Dockerfiles;
- ports;
- networks;
- health checks;
- dependencies;
- volumes where required.

Configuration values belong to `.env` files, not to `docker-compose.yml`.

---

## 35. `.env.template` rule

Every runtime component must expose its environment contract through a `.env.template`.

Templates contain keys only:

```env
NATS_URL=
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=
MINIO_USE_SSL=
```

Do not put example credentials into `.env.template`.

Do not put localhost defaults into `.env.template`.

Do not put production values into `.env.template`.

The template exists only to communicate:

```text
which variables are required
```

Each developer creates the ignored `.env` file locally.

Example:

```text
runtime/email-receiver/.env.template
runtime/email-receiver/.env
```

The `.env` file must remain ignored by Git.

---

## 36. Environment ownership by runtime component

Each component owns only the variables it needs.

### Website

```env
NEXT_PUBLIC_DASHBOARD_URL=
NEXT_PUBLIC_SSO_URL=
NEXT_PUBLIC_DOCS_URL=
EMAIL_SERVICE_URL=
EMAIL_SERVICE_API_KEY=
```

Important:

```text
EMAIL_SERVICE_URL
EMAIL_SERVICE_API_KEY
```

are server-only variables.

Never rename them to `NEXT_PUBLIC_*`.

### Email Receiver / Storage

```env
PORT=
EMAIL_SERVICE_API_KEY=
NATS_URL=
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=
MINIO_USE_SSL=
```

### Email Sender

```env
NATS_URL=
RESEND_API_KEY=
RESEND_FROM=
```

### NATS

Keep NATS configuration minimal.

If no custom runtime values are needed for the first local setup, its `.env.template` may be empty or contain only explicitly required NATS configuration keys.

Example:

```env
NATS_SERVER_NAME=
```

Do not invent NATS credentials unless authentication is actually enabled.

### MinIO

```env
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
```

Do not put their values into Compose or `.env.template`.

---

## 37. Dockerfile per runtime component

Every runtime component gets its own Dockerfile.

Required:

```text
runtime/nats/Dockerfile
runtime/minio/Dockerfile
runtime/website/Dockerfile
runtime/email-receiver/Dockerfile
runtime/email-sender/Dockerfile
```

The Dockerfiles should stay minimal.

### Go services

Use a multi-stage build.

Conceptually:

```dockerfile
FROM golang:<pinned-version> AS build

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/email-receiver ./services/email-receiver

FROM gcr.io/distroless/static-debian12

COPY --from=build /out/email-receiver /email-receiver

ENTRYPOINT ["/email-receiver"]
```

The sender follows the same pattern.

Do not install Node, pnpm, MinIO, or NATS inside a Go service image.

### Website

Use a dedicated Next.js image build.

The Website Dockerfile must build only the Website runtime and required workspace dependencies.

Do not include the Go services inside the Website image.

### NATS

Use the official NATS image as the base or direct runtime image.

JetStream must be enabled.

### MinIO

Use the official MinIO image as the base or direct runtime image.

One MinIO instance is enough for this initial architecture.

---

## 38. `.env` handling inside Docker

Canonical rule:

```text
.env.template -> committed contract
.env          -> ignored local values
Docker Compose -> no environment values
```

There is one important security constraint:

**Do not bake production secrets into reusable Docker image layers.**

Copying an ignored `.env` file during `docker build` places those values inside the image history/layers and can leak secrets if the image is pushed, cached, exported, or inspected.

Therefore:

### Local-only image rule

For purely local, throwaway Docker images that are never pushed or shared, a component-specific Dockerfile may copy its ignored `.env` file into the local image if the implementation deliberately chooses that workflow.

Example:

```dockerfile
COPY runtime/email-receiver/.env /app/.env
```

This is permitted only for local development images.

### Production rule

Production images must not contain `.env` secret files.

Production secrets must be injected by the deployment platform at runtime.

Examples:

```text
Vercel Environment Variables
container runtime secret injection
orchestrator secret/environment injection
```

The repository must not weaken this rule to make local Docker simpler.

---

## 39. Vercel environment variables

The Website is deployed independently from the local Docker runtime.

Vercel must contain all Website runtime variables required by the Server Action and existing Website configuration.

Required Website variables now include:

```text
NEXT_PUBLIC_DASHBOARD_URL
NEXT_PUBLIC_SSO_URL
NEXT_PUBLIC_DOCS_URL
EMAIL_SERVICE_URL
EMAIL_SERVICE_API_KEY
```

The NATS, MinIO, and Resend credentials do not belong in the Website Vercel project.

Do not add:

```text
NATS_URL
MINIO_ACCESS_KEY
MINIO_SECRET_KEY
RESEND_API_KEY
```

to the Website environment unless the Website directly owns those integrations, which it must not in this architecture.

The Website knows only the Go receiver endpoint and its service credential.

---

## 40. Runtime Docker Compose topology

The local runtime must contain exactly these runtime services:

```text
website
nats
minio
email-receiver
email-sender
```

Conceptually:

```text
website
   │
   │ Axios
   ▼
email-receiver
   │
   ▼
nats
   │
   ├───────────────┐
   │               │
   ▼               ▼
email-receiver   email-sender
   │               │
   ▼               ▼
minio            resend
```

Resend is external and does not run in Compose.

---

## 41. Minimal Docker Compose

The Compose file should remain intentionally small.

Conceptually:

```yaml
services:
  nats:
    build:
      context: ..
      dockerfile: runtime/nats/Dockerfile

  minio:
    build:
      context: ..
      dockerfile: runtime/minio/Dockerfile

  email-receiver:
    build:
      context: ..
      dockerfile: runtime/email-receiver/Dockerfile
    depends_on:
      - nats
      - minio

  email-sender:
    build:
      context: ..
      dockerfile: runtime/email-sender/Dockerfile
    depends_on:
      - nats

  website:
    build:
      context: ..
      dockerfile: runtime/website/Dockerfile
    depends_on:
      - email-receiver
```

Do not add environment-variable values here.

Keep networking on the default Compose network unless there is a concrete reason for more.

Do not introduce:

```text
Traefik
nginx
Redis
PostgreSQL
service mesh
extra message brokers
```

for this flow.

---

## 42. Compose volumes

Use persistent local volumes only where state must survive container recreation.

### NATS

JetStream needs persistent storage.

Use a named volume for:

```text
NATS JetStream data
```

### MinIO

Use a named volume for:

```text
MinIO object data
```

### Website

No persistent volume is required for runtime state.

### Go services

No persistent volume is required.

They are stateless workers.

---

## 43. Runtime dependency order

Local boot sequence:

```text
1. NATS
2. MinIO
3. Email Receiver
4. Email Sender
5. Website
```

Use health checks where useful so the receiver does not start consuming before NATS/MinIO are ready.

Do not rely only on container creation order as proof that a dependency is operational.

---

## 44. Updated repository structure

The resulting repository shape should remain approximately:

```text
apps/
  website/

services/
  events/
    events.go

  email-receiver/
    main.go

  email-sender/
    main.go

runtime/
  docker-compose.yml
  .env.template

  nats/
    Dockerfile
    .env.template

  minio/
    Dockerfile
    .env.template

  website/
    Dockerfile
    .env.template

  email-receiver/
    Dockerfile
    .env.template

  email-sender/
    Dockerfile
    .env.template

go.mod
go.sum
```

Do not turn `runtime/` into another application workspace.

It is infrastructure glue only.

---

## 45. Updated environment acceptance criteria

The runtime work is complete only when all of these are true:

- `docker-compose.yml` contains no hardcoded environment-variable values.
- Every runtime component has its own `.env.template`.
- Every `.env.template` contains only `KEY=` entries.
- Real `.env` files are ignored by Git.
- The Website's Vercel project contains only variables the Website actually owns.
- NATS credentials/configuration remain outside the Website.
- MinIO credentials remain outside the Website.
- Resend credentials remain outside the Website.
- Each runtime component has its own Dockerfile.
- NATS runs with JetStream enabled.
- NATS JetStream data uses persistent storage.
- MinIO uses persistent storage.
- The Go services remain stateless.
- Production images do not bake `.env` secrets into Docker layers.
- Local-only images may copy ignored `.env` files only when those images are never pushed or shared.
- The entire local stack starts through the single `runtime/docker-compose.yml`.


## 32. Canonical summary

```text
Client
  ↓
Next.js form
  ↓
Zod
  ↓
Server Action
  ↓
Axios
  ↓
Go Receiver
  ↓
email.received
  ↓
NATS JetStream
  ↓
Go Receiver / Storage Consumer
  ↓
MinIO
  ↓
email.stored
  ↓
NATS JetStream
  ↓
Go Sender
  ↓
Resend
  ↓
email.sent
  ↓
NATS JetStream
```

All NATS events use the shared package-level envelope:

```text
Envelope
  ├─ id
  ├─ type
  ├─ version
  ├─ occurredAt
  └─ payload
```

The architecture is intentionally small.

The purpose is not to build a generalized backend platform.

The purpose is to establish one clean event-driven vertical slice for LangDrift:

```text
receive
→ persist
→ send
→ record the lifecycle through events
```
