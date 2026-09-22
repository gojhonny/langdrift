# Early Access evidence and release gate

Status: **implementation in progress on PR #54; not merge-ready**. The measurements below are the last completed checks during implementation, not a final audit of the entire diff.

Baseline: `main` commit `c164eac38da3331a6435e3b06b19b01895b76db5`, audited 2026-09-21 with Go 1.27.1, pnpm 10.32.1, Node 24, and harness-score 1.5.2.

| Sensor | Baseline | Current working tree evidence |
| --- | --- | --- |
| Go statement coverage (`go test -race -coverprofile=... ./...`) | 41.9% across four packages | Last complete unit snapshot: 38.9% including new Go test tooling; further tests and instrumented integration collection added afterward |
| Website Early Access coverage | Unmeasured | Last completed Vitest run: 95.16% statements, 90.56% branches; final diff must be rerun |
| Production dependency audit (`pnpm audit --prod`) | 2 critical, 15 high, 4 moderate | Zero reported findings after upgrades |
| Go vulnerabilities (`govulncheck`) | Zero reachable | Re-run in CI on every change |
| Harness (`drift harness --json`) | 88%, L4 | L4 passed before the latest metadata cleanup; refresh required |
| Container proof | Green on baseline GitHub CI | Earlier Go chain and repeat registration passed locally; expanded concurrency/outage/coverage runner and browser proof remain unverified |

Run `./cli/drift audit early-access`, `pnpm coverage:early-access`, `./cli/drift test early-access all`, and `./cli/drift harness --min-level 4` to refresh evidence after implementation is complete. Docker became available during implementation. No final consolidated audit has been completed.

## Known failures and remaining implementation

- Conditional persistence now uses `SetMatchETagExcept("*")` to send the required `If-None-Match: *` header. Its S3 fixture includes `Last-Modified`; unit tests cover first creation, canonical reuse, a competing writer's 412 response, corruption and storage failures. The real concurrent-replica proof remains a separate integration gate.
- Browser runs failed before the local-origin, process-working-directory and readiness-selector corrections. Those corrections have not yet passed an end-to-end rerun.
- Instrumented integration coverage, concurrent replicas, dependency outages, restart checks and full-stream rejection have been added to the local runner and need execution and correction as necessary.
- CI still contains its older Python/count-only development smoke and duplicated orchestration. Finish moving it to the common POSIX runners and publish unit/integration/combined coverage artifacts and gates.
- Complete the browser abuse/recovery matrix, provider deterministic failure tests, scoped production NATS/MinIO configuration, image vulnerability scans, and private operational visibility/runbooks.
- Finish the consolidated audit and repository gates. Keep implementation commits scoped to one completed task and push each to the same PR.

## Release gates

- [ ] Go unit/integration combined coverage reaches 80% overall and per runtime package; envelopes reach 95%. Include startup, persistence and workers through instrumented integration execution.
- [ ] Website Early Access reaches 90% statements and 85% branches.
- [ ] Changed development and isolated E2E Compose images pass in CI, including concurrent repeat registration and browser proof.
- [ ] Production dependency and image scans have no unresolved high/critical findings. Record reachability and any exception with an expiry.
- [ ] Choose hosting and verify TLS, private network exposure, edge limits, backup/restore, secret rotation and operator alerts for backlog and exhausted deliveries.
- [ ] Configure real Turnstile credentials and a verified Resend sender; run one controlled live-provider smoke.
- [ ] Record contact retention/deletion policy and operator ownership.

`POST /v1/emails` 202 means the broker durably accepted a registration. `email.sent` means Resend accepted an email request. Neither implies inbox delivery.
