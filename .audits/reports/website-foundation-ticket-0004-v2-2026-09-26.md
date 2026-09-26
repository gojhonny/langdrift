# Website Foundation Alignment — Ticket 0004 version 2 audit

- **Ticket:** `.artifacts/tickets/0004-complete-root-nextjs-foundation.ticket.md`
- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 2, approved by owner on 2026-09-26)
- **Review:** `.audits/reviews/website-foundation-ticket-0004-v2-2026-09-26.md`
- **Resolved base:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **HEAD:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **Implementation snapshot:** the uncommitted product-source status recorded
  by the review; v2 contract and evidence metadata do not alter product source.

## Acceptance mapping

1. **Legacy Website source wrapper absent — pass.** `apps/website/src` does not
   exist, and active consumers do not resolve through it.
2. **Root Next.js ownership — pass.** The App Router and request proxy are
   Website-root owners. The production build discovers Proxy and the complete
   localized home/pricing route matrix.
3. **Localization under `app/lib/i18n` — pass.** Routing, navigation, request
   configuration, and messages have one root-App-Router localization owner;
   next-intl resolves that boundary.
4. **Private manifest metadata — pass.** The private Website package omits
   publication version metadata while preserving identity and dependencies.
5. **Root Turbo inheritance — pass.** The redundant Website-local Turbo file is
   absent and root task ownership remains intact.
6. **LangDrift build/start wrappers — pass.** Website scripts retain the
   restored established wrappers. Production build and standalone route,
   favicon, and emitted-CSS smoke pass with the wrapper-owned behavior.
7. **Relocation-sensitive consumers — pass.** TypeScript, Vitest, Biome,
   next-intl, build/runtime, messaging test discovery, and active documentation
   resolve the final structure without compatibility copies, catch-all aliases,
   or prohibited Website traversal.
8. **Complete behavioral equivalence — pass.** Locale routes, metadata,
   navigation integration, styles, assets, content, state-facing modules,
   environment boundaries, and all 42 Early Access unit tests pass. The exact
   Docker integration/browser harness also passes its durable messaging,
   outage/recovery, privacy, localization, accessibility-feedback, and browser
   assertions.
9. **Biome and promoted guardrails — pass.** Website Biome passed on 81 files,
   all 12 promoted guardrail fixtures passed, formatting/import organization
   pass, and the independent Standards review has zero findings.
10. **Repository-wide gate under version 2 AC-21 — pass with external failures
    still reported as failed.** Every agreed repository-wide command ran and
    initiative-scoped checks pass. Current lint reports 18 external errors:
    Docs 8, SSO 7, and shared React 3. The same 18 errors reproduce at the
    approved baseline with its configuration; none of their source files was
    changed by this initiative. Dashboard typecheck reports the same 37
    diagnostics at the final snapshot and baseline. Dashboard build reports
    the same 21 module-resolution errors at the final snapshot and baseline.
    Dashboard source, applicable manifests, lockfile, and root task
    configuration are unchanged. These checks remain failed; their proven
    external pre-existing status means they do not independently block under
    v2. No unresolved provenance or initiative-caused regression remains.
11. **Early Access evidence under unchanged AC-22 — pass.** Six unit
    files and all 42 tests pass. Coverage passes at 95.12% statements, 90.52%
    branches, 88.23% functions, and 95.72% lines. Docker server 29.8.0 and
    Compose v5.5.1 passed preflight. `./cli/drift test early-access e2e` exited
    0, collected integration coverage, completed both durable proof-runner
    passes around outage/restart recovery, and passed all three Playwright
    scenarios. No weaker proof substitutes for the agreed harness.
12. **Review and audit handoff — pass.** Independent v2 Standards and Spec
    reviews cover the fixed-base plus uncommitted delivery. This report keeps
    every external failure failed and records the exact Docker assertions that
    executed successfully.

## Repository-wide failure classification

| Check | Final result | Baseline reproduction | Version 2 classification |
| --- | --- | --- | --- |
| `pnpm lint` | failed: 18 errors in Docs, SSO, and shared React | same 18 errors; baseline full run also contained Website violations removed by this initiative | external pre-existing; failed but nonblocking |
| `pnpm typecheck` | failed: 37 Dashboard diagnostics | exact same diagnostics | external pre-existing; failed but nonblocking |
| `pnpm build` | failed: 21 Dashboard module-resolution errors | exact same errors | external pre-existing; failed but nonblocking |

The cycle changed Biome alias-group recognition, but the baseline configuration
already enforced the traversal rule producing the 18 remaining lint failures.
The cycle did not change the responsible source files or applicable dependency
contracts. Website typecheck, production build, scoped Biome, and runtime smoke
pass.

## Commands and results

| Check | Result |
| --- | --- |
| Website TypeScript | exit 0 |
| Default Turbopack production build through Website wrapper | exit 0; locale matrix plus Proxy generated |
| Standalone localized route/static-asset smoke | exit 0; 8 routes, favicon, and emitted CSS returned 200 |
| Early Access unit tests | exit 0; 6 files, 42 tests |
| Early Access coverage | exit 0; thresholds exceeded |
| Website Biome check | exit 0; 81 files |
| Promoted Biome guardrail fixtures | exit 0; 12 tests |
| `./cli/drift doctor --ci` | exit 0 |
| `git diff --check` | exit 0 |
| `pnpm lint` | exit 1; 18 external pre-existing errors, reproduced at baseline |
| `pnpm typecheck` | exit 2; 37 external pre-existing Dashboard diagnostics, reproduced at baseline |
| `pnpm build` | exit 1; 21 external pre-existing Dashboard errors, reproduced at baseline |
| `docker info --format 'server={{.ServerVersion}}'` | exit 0; server 29.8.0 |
| `docker compose version` | exit 0; v5.5.1 |
| `./cli/drift doctor early-access` | exit 0; credentials and Compose configurations valid |
| `./cli/drift test early-access e2e` | exit 0; full integration, outage/recovery, coverage, and browser harness passed |
| Playwright | exit 0; 3 of 3 scenarios passed |
| Integration coverage extraction | exit 0; 72.7% total statements |
| Compose post-run cleanup | exit 0; no remaining services |
| Standards review | 0 findings |
| Spec review | 0 findings after final AC-22 evidence |

## AC-22 observed behavior

The exact harness built all six required images and brought NATS, MinIO,
email-store, email-sender, and the Resend mock to healthy state. An additional
email-store replica ran during the first proof. The proof runner passed before
and after the outage/restart sequence, establishing the exact durable event
chain, concurrent and repeat registration behavior, canonical contact
preservation, settled consumers, one provider acknowledgement, deterministic
event/provider identity, and rejection when broker capacity was forced full.

The harness asserted NATS outage readiness and submission status `503`, MinIO
outage readiness `503` with durable submission acceptance `202`, then restarted
the store and sender and proved recovery. Integration coverage was collected
under `.audits/runs/early-access.N7iOMk`: total statement coverage is 72.7%,
with runner 85.1%, Resend mock 70.2%, event streaming 62.1%, email sender 67.4%,
email store 69.5%, and event envelopes 72.4%.

Playwright passed all three scenarios: landing/pricing registration deduplicates
to one provider record while preserving browser-to-storage/event/provider
identity and keeping email out of URL, localStorage, and sessionStorage; all
four supported locales show the expected challenge failure with polite live
feedback and visible legend; and no-JavaScript rendering keeps submission
disabled with no email-input `name` before hydration.

## Audit result

Version 2 AC-21 is satisfied without representing external failures as passes,
and the exact repository harness satisfies AC-22. All Ticket 0004 acceptance
criteria have final-snapshot evidence, so its delivery progress is
`gates-complete`.
