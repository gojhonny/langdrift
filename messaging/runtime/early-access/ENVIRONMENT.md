# Early Access environment reconciliation

Audited on 2026-09-24 before editing, using executable environment reads, setup
generation, local private key names (values redacted), and resolved dev/E2E Compose
configuration. “Receives” below means resolved configuration, not an inspected
running container. Docker's daemon was unavailable during this audit.

## Ownership and loading

Paths below are relative to the repository root. Each listed component directory
owns `.env.development` and its ignored sibling `.env`.

| Component | Owning directory | Development loading | E2E loading |
| --- | --- | --- | --- |
| Website | `apps/website` | Next.js loads development config and private credentials | Website base, Website private, Compose E2E override, browser override |
| email-store | `messaging/runtime/early-access/microservices/email-store` | own development, then own private | own development, Compose E2E development, shared E2E private |
| email-sender | `messaging/runtime/early-access/microservices/email-sender` | own development, then own private | own development, Compose E2E development, shared E2E private |
| MinIO | `messaging/infrastructure/storage/minio` | own development, then own private | own development, shared E2E private |
| NATS | `messaging/infrastructure/broker/nats` | own development, then own empty private | inherits development loading |
| resend-mock | `messaging/runtime/early-access/containers/e2e/resend-mock` | no application environment required | Compose adds `GOCOVERDIR=/coverage` |
| runner | `messaging/runtime/early-access/containers/e2e/runner` | not started | shared E2E private; Compose adds `GOCOVERDIR=/coverage` |

Compose E2E owns `messaging/runtime/early-access/containers/e2e/.env.development`
and `.env`. Browser overrides belong to
`messaging/runtime/early-access/e2e/.env.development` and contain only three values
that differ from Website's base. No private browser file is needed.

## Reconciliation before changes

“Same” means equal to the owning development contract. Website entries describe
normal development loading; browser proof overrides are listed separately. The
public Turnstile site key is `1x00000000000000000000AA`.

| Component | Variable | `.env.development` | Private `.env` | Runtime receives | Status |
| --- | --- | --- | --- | --- | --- |
| Website | NEXT_PUBLIC_DASHBOARD_URL | http://localhost:3001 | — | same | match |
| Website | NEXT_PUBLIC_SSO_URL | http://localhost:3002 | — | same | match |
| Website | NEXT_PUBLIC_DOCS_URL | http://localhost:3004 | — | same | match |
| Website | EMAIL_SERVICE_URL | http://localhost:8080 | — | same | match |
| Website | NEXT_PUBLIC_TURNSTILE_SITE_KEY | public test key | — | same | match |
| Website | TURNSTILE_EXPECTED_HOSTNAME | localhost | — | same | match |
| Website | EARLY_ACCESS_MODE | development | — | same | match |
| Website | TURNSTILE_VERIFY_URL | absent | — | absent; code supplies Cloudflare URL | missing |
| Website | EMAIL_SERVICE_API_KEY | — | redacted | private value | private |
| Website | TURNSTILE_SECRET_KEY | — | redacted | private value | private |
| email-store | API_ADDR | :8080 | — | same | match |
| email-store | NATS_URL | nats://nats:4222 | — | same | match |
| email-store | MINIO_ENDPOINT | minio:9000 | — | same | match |
| email-store | MINIO_BUCKET | langdrift-emails | — | same | match |
| email-store | MINIO_USE_SSL | false | — | same | match |
| email-store | EARLY_ACCESS_MODE | development | — | development; E2E test | intentional override |
| email-store | EMAIL_SERVICE_API_KEY | — | redacted | private value | private |
| email-store | MINIO_ACCESS_KEY | — | redacted | private value | private |
| email-store | MINIO_SECRET_KEY | — | redacted | private value | private |
| email-sender | NATS_URL | nats://nats:4222 | — | same | match |
| email-sender | HEALTH_ADDR | :8081 | — | same | match |
| email-sender | RESEND_API_URL | http://resend-mock:8080/emails | — | same; repeated in E2E | duplicate |
| email-sender | EARLY_ACCESS_MODE | development | — | development; E2E test | intentional override |
| email-sender | RESEND_API_KEY | — | redacted | private value | private |
| email-sender | RESEND_FROM | — | redacted | private value | private |
| MinIO | MINIO_ROOT_USER | — | redacted | private value | private |
| MinIO | MINIO_ROOT_PASSWORD | — | redacted | private value | private |
| NATS | none required | comment only | empty | none configured | match |
| resend-mock | none required | absent | absent | none in dev | match |
| E2E actors, mock, runner | GOCOVERDIR | — | — | /coverage via Compose | intentional override |
| E2E runner | EMAIL_SERVICE_API_KEY | — | shared, redacted | private value | private |
| E2E runner | MINIO_ACCESS_KEY | — | shared, redacted | private value | private |
| E2E runner | MINIO_SECRET_KEY | — | shared, redacted | private value | private |
| E2E services | unused peer credential keys | — | shared, redacted | loaded but unused | unexpected |
| E2E email-store | RESEND_API_URL | E2E duplicate | — | loaded but unused | unexpected |
| Browser proof | EMAIL_SERVICE_URL | Website base | — | shell: http://127.0.0.1:18080 | intentional override |
| Browser proof | TURNSTILE_EXPECTED_HOSTNAME | Website base | — | shell: 127.0.0.1 | intentional override |
| Browser proof | TURNSTILE_VERIFY_URL | absent | — | shell: http://127.0.0.1:18082/siteverify | intentional override |
| Browser proof | EARLY_ACCESS_MODE | development | — | shell: test | intentional override |
| Browser proof | NEXT_PUBLIC_TURNSTILE_SITE_KEY | public test key | — | shell repeats the same value | duplicate |

All email-store and email-sender rows are required executable inputs. Website's
dashboard URL is safe configuration but is not currently read by its env module.
The runner reads only its three credential keys; its topology is fixed in proof
code. The mock requires no application environment variables. NATS uses
`config/server.json`; MinIO needs no additional safe environment configuration.

The shared E2E private file supplies seven credential keys to MinIO, both actors
and the runner. Unused keys are: five on MinIO (all except root credentials), four
on store and runner (root credentials plus Resend credentials), and five on sender
(all except Resend credentials). This existing shared-test-file arrangement is
retained. These keys are not read by the corresponding executables. It does not
replace any component's safe development base.

## Normalization and setup

Website now requires `TURNSTILE_VERIFY_URL`, supplied by its development contract.
The Cloudflare URL in validation code is an allowlist comparison, not a fallback.
Only test mode permits a loopback mock. Production must explicitly supply the
Cloudflare URL and real credentials. The container CI build supplies the new
required value, and Turbo passes the server environment variables through.

The E2E contract now contains only `EARLY_ACCESS_MODE=test`. The Resend URL comes
unchanged from email-sender's base. Browser proof loads the Website base and
private file before E2E overrides, without repeating the public site key in shell.
Development Compose already has the correct ownership and precedence and needs
no changes.

Setup's credential generation already satisfies private-file ownership:

| Private file | Generated/managed keys |
| --- | --- |
| Website | EMAIL_SERVICE_API_KEY, TURNSTILE_SECRET_KEY |
| email-store | EMAIL_SERVICE_API_KEY, MINIO_ACCESS_KEY, MINIO_SECRET_KEY |
| email-sender | RESEND_API_KEY, RESEND_FROM |
| MinIO | MINIO_ROOT_USER, MINIO_ROOT_PASSWORD |
| NATS | empty file only |
| E2E | EMAIL_SERVICE_API_KEY, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, RESEND_API_KEY, RESEND_FROM |

Setup generates a shared API key and storage password when absent, uses local
mock provider credentials and the public Turnstile test secret for disposable
development, and preserves existing nonempty files. Website/store API keys and
store/MinIO credentials remain equal. E2E copies those shared test credentials;
no safe component values are generated into private files. Existing private files
were inspected without printing credentials and required no edits.

`sh cli/tests/early-access-env.sh` verifies exact generated key sets, repeatable
setup, shared relationships, regeneration of a missing peer, mismatch rejection,
resolved Compose values and explicit private override precedence in a disposable
fixture. Website tests verify missing configuration, development and browser
contracts, and rejection of untrusted verifier URLs before any request.
