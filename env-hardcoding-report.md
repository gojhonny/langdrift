# Environment inventory

This report is the audit for `RULE-018`. A missing environment value throws. Counts below were checked against the current tree after that rule was applied.

**Missing var** is `Yes` only when no owning `.env*` file declares the variable. A secret that belongs only in gitignored `.env` is not missing from `.env.development`.

**Missing value** is `Yes` when executable code still substitutes a literal if the variable is absent.

**Hardcoded count** counts configuration literals outside the owning `.env*` file. The path note says whether that occurrence is a CI or proof assignment, a test fixture, an allowlist, or documentation.

## Website · Turnstile

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `TURNSTILE_VERIFY_URL` | No | No | 4 | CI assignment, both blocks in `.github/workflows/ci.yml` (`http://127.0.0.1/siteverify` because that job sets `EARLY_ACCESS_MODE=test`). Proof assignment in `cli/src/commands/early-access.sh` (`http://127.0.0.1:18082/siteverify`). Allowlist constant in `apps/website/src/turnstile-verify-url.ts`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | No | 3 | CI assignment, both blocks in `.github/workflows/ci.yml`. Proof assignment in `cli/src/commands/early-access.sh`. Test fixture in `apps/website/src/components/early-access/form.test.tsx`. |
| `TURNSTILE_SECRET_KEY` | No | No | 4 | CI assignment, both blocks in `.github/workflows/ci.yml`. Proof bootstrap writes the public test secret into gitignored `apps/website/.env` from `cli/src/commands/early-access.sh` (create and append). Mock comparison in `messaging/runtime/early-access/containers/e2e/resend-mock/main.go`. |
| `TURNSTILE_EXPECTED_HOSTNAME` | No | No | 3 | CI assignment, both blocks in `.github/workflows/ci.yml` (`localhost`). Proof assignment in `cli/src/commands/early-access.sh` (`127.0.0.1`). |
| `EARLY_ACCESS_MODE` | No | No | 3 | CI assignment, both blocks in `.github/workflows/ci.yml` (`test`). Proof assignment in `cli/src/commands/early-access.sh` (`test`). Owning development files use `development`; `messaging/runtime/early-access/containers/e2e/.env.development` uses `test`. |

`TURNSTILE_VERIFY_URL` is declared in `apps/website/.env.development` as the Cloudflare siteverify URL. `apps/website/src/env.server.ts` requires it. Development and production accept only that Cloudflare URL. Test mode accepts only a loopback `/siteverify` URL. The verifier fetches the validated URL and does not substitute one.

The site key is required through `apps/website/src/env.ts`. The form no longer uses `?? ''`.

## Website · Early Access

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `EMAIL_SERVICE_URL` | No | No | 3 | CI assignment, both blocks in `.github/workflows/ci.yml` (`http://localhost:8080`). Proof assignment in `cli/src/commands/early-access.sh` (`http://127.0.0.1:18080`). Documentation in `apps/website/README.md`. |
| `EMAIL_SERVICE_API_KEY` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml` (`ci-placeholder`). Local value is generated into gitignored `.env` by `cli/src/commands/early-access.sh`. |

## Website · Navigation

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `NEXT_PUBLIC_DASHBOARD_URL` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml`. Documentation in `apps/website/README.md`. Owning files: `apps/website/.env.development`, `apps/sso/.env.development`. |
| `NEXT_PUBLIC_DOCS_URL` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml`. Documentation in `apps/website/README.md` and `apps/docs/content/decisions/2026-09-20-environment-variables-fail-fast.mdx`. |
| `NEXT_PUBLIC_SSO_URL` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml`. Documentation in `apps/website/README.md` and the fail-fast decision. Owning files: `apps/website/.env.development`, `apps/dashboard/.env.development`. |

## Docs

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `NEXT_PUBLIC_SITE_URL` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml`. Documentation in `apps/docs/README.md` and `apps/docs/content/decisions/2026-09-20-environment-file-convention.mdx`. |

## SSO

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `NEXT_PUBLIC_WEBSITE_URL` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml`. |
| `NEXT_PUBLIC_DASHBOARD_URL` | No | No | 2 | Same CI assignment as Website navigation. |
| `NEXT_PUBLIC_WORKOS_REDIRECT_URI` | No | No | 2 | CI assignment, both blocks in `.github/workflows/ci.yml`. |

## Early Access · Email sender

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `RESEND_API_KEY` | No | No | 1 | Bootstrap writes `re_local_mock_only` into gitignored sender and e2e `.env` files from `cli/src/commands/early-access.sh`. |
| `RESEND_FROM` | No | No | 1 | Same bootstrap writes `local@example.invalid`. |
| `RESEND_API_URL` | No | No | 2 | Allowlist comparison in `messaging/runtime/early-access/microservices/email-sender/main.go` (`https://api.resend.com/emails`). Guard comparison in `messaging/runtime/early-access/containers/e2e/guard-sender.sh` (`http://resend-mock:8080/emails`), which matches the sender `.env.development`. Documentation in `messaging/runtime/early-access/README.md`. |

Go `required` returns an error when `RESEND_API_URL` is empty. It does not fill the production URL.

## Early Access · MinIO

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `MINIO_ROOT_USER` | No | No | 1 | Bootstrap uses `local-minio` only when the ignored MinIO `.env` has no user, then writes that into the ignored file. |
| `MINIO_ROOT_PASSWORD` | No | No | 0 | Generated with `openssl` into gitignored `.env`. |
| `MINIO_ACCESS_KEY` | No | No | 1 | Copied from the MinIO user, including the `local-minio` bootstrap above. Production store code rejects that access key. |
| `MINIO_SECRET_KEY` | No | No | 0 | Generated into gitignored `.env`. The e2e runner reads `os.Getenv` and does not substitute a literal. |
| `MINIO_ENDPOINT` | No | No | 0 | Declared in `messaging/runtime/early-access/microservices/email-store/.env.development`. |
| `MINIO_BUCKET` | No | No | 0 | Same development file. |
| `MINIO_USE_SSL` | No | No | 0 | Same development file. |

## Early Access · NATS

| Variable | Missing var | Missing value | Hardcoded count | Hardcoded paths |
| --- | ---: | ---: | ---: | --- |
| `NATS_URL` | No | No | 0 | Declared as `nats://nats:4222` in the email-store and email-sender `.env.development` files. Both services use `required` and return an error when it is empty. No proof export overrides it. `messaging/infrastructure/broker/nats/.env.development` states that JetStream does not need an environment variable. |

## Reviewed literals left unchanged

These rows are not a waiver. The consumer cannot load the owning `.env*` file, or the literal is not a missing-value fallback.

| Product / feature | Path | Variable / literal | Why it stays |
| --- | --- | --- | --- |
| CI build | `.github/workflows/ci.yml` | Public localhost origins, `ci-placeholder`, Cloudflare test Turnstile credentials, `EARLY_ACCESS_MODE=test` | `.dockerignore` excludes `.env` and `.env.*`. `next build` does not load `.env.development`. The image build only receives `/run/secrets/build_env`. |
| CI build | `.github/workflows/ci.yml` | `TURNSTILE_VERIFY_URL=http://127.0.0.1/siteverify` | The same job sets `EARLY_ACCESS_MODE=test`, which accepts only a loopback verifier. The build validates that string and does not call it. The development file keeps the Cloudflare URL for `EARLY_ACCESS_MODE=development`. |
| Early Access proof | `cli/src/commands/early-access.sh` | `EMAIL_SERVICE_URL=http://127.0.0.1:18080`, hostname `127.0.0.1`, verify URL `http://127.0.0.1:18082/siteverify`, mode `test` | The isolated proof is a different topology from `.env.development`. |
| Early Access proof | `cli/src/commands/early-access.sh` | `re_local_mock_only`, `local@example.invalid`, `local-minio`, generated API key and MinIO password | These seed gitignored `.env` files. They are not a second runtime default inside Go or TypeScript. |
| Documentation | `apps/website/README.md`, `apps/docs/README.md`, the two environment decisions, `messaging/runtime/early-access/README.md` | Local and intended production origins | Not loaded as configuration. |
| Email sender | `messaging/runtime/early-access/microservices/email-sender/main.go` | `https://api.resend.com/emails` | Validates an explicitly supplied production `RESEND_API_URL`. |
| E2E sender guard | `messaging/runtime/early-access/containers/e2e/guard-sender.sh` | `http://resend-mock:8080/emails` | Refuses to start unless the already supplied `RESEND_API_URL` matches the development file. |
