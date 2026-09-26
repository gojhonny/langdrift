# Frontend Structure — final Audit

Approved spec0003v1; Tickets0009–0013. Final Review:
`../reviews/frontend-structure-final-2026-09-26.md`.

## Snapshot and evidence retention

Base/HEAD: `1cdede8a39f56c62a57b63e9933c85df5e7f8850`.
Actual pre-migration baseline is the completed N12 working source archive:
manifest `d060099961bc28494cf872eda7020f2f7d6b8bb475112af861720e22e1d37a0f`,
archive `084713b1e6ba404536435d66a398379f7158a932b10e67054d0b88af7c2f7d4e`.
Final574-path source identity:
`23bec95a784a7dd7da51cdaae312d3f792a8c1300ce63b7f3fce488e60c55dfa`.
The versioned `frontend-structure-final-snapshot-2026-09-26.json` records every
source hash and raw evidence hash. Logs below are retained under
`.audits/runs/frontend-structure-final/`; manifests/screenshots/archives remain
at their named local paths. They are ignored, not distributed by Git. Do not
discard them; a fresh clone needs the preserved baseline archive/runtime/images
to rerun visual comparison. No secrets or environment files are archived.

The integrated checks ran before six final changed paths: three Dashboard
comment-only files, its marker notes, Website test capture mechanics and README.
Independent delta review verified no executable production changes. Dashboard
build/browser/typechecks/scoped/unit/fixtures were repeated after retirement.
Website's final browser uses the corrected test; only its README changed afterward.
Early Access source, production Website, shared dependencies and runtime/harness
are byte-identical to the real integration run. Its evidence therefore applies
to the final snapshot without pretending it was rerun after documentation edits.

## Commands and outcomes

| Command / harness | Result / exit | Observed evidence |
| --- | --- | --- |
| `./cli/drift doctor` | passed / 0 | repository/tool prerequisites; doctor-final.log |
| `pnpm lint` | **failed / 1** | identical18 external traversal errors and1 info; lint.log |
| `pnpm typecheck` | passed / 0 | 13 tasks; final repeat retirement-typecheck.log |
| `pnpm build` | passed / 0 | all9 tasks; build.log; subsequent app harness production builds also0 |
| `pnpm test:web-quality` | passed / 0 | 8files/33tests, including shared public primitive contracts; retirement-web-quality.log |
| scoped `pnpm exec biome check` app production + new shared primitive/icon paths | passed / 0 | 242files; retirement-scoped.log; earlier broader250-file check scoped.log |
| `node --test .agents/guardrails/biome.test.mjs` | passed / 0 | 12fixtures; retirement-fixtures.log |
| `pnpm --filter dashboard test:browser` final retirement run | passed / 0 | all35tests; dashboard-retirement.log |
| `pnpm --filter website test:browser` corrected full repeat | passed / 0 | all11tests/26unchanged-image comparisons; website-capture-correction-repeat.log |
| original-source build + existing Website Playwright suite with corrected capture harness | passed / 0 each | all11tests/26comparisons; origin-repro-build.log, origin-repro-browser.log; all528source identities preserved except test-dependency metadata |
| `EARLY_ACCESS_AUDIT_DIR=… ./cli/drift test early-access all` | passed / 0 | real Go race/unit,42TypeScript coverage tests, Compose integration and3browser tests; early-access-all.log |
| `go tool covdata percent -i=…/early-access/combined` | passed / 0 | measured combined Go coverage below |
| `git diff --check` | passed / 0 | final whitespace check |

Dashboard build `qdbSrK0PeGoNAKk3TetkQ`, final manifest
`.audits/runs/dashboard-structure-retirement/manifest.json`, SHA
`dbe34c37e5b796bae184516ac90547f2a27e414406024bc3ec452c3c5501365c`.
Website build `QYRuwIUpXPoqcZeoWQbUf`, final manifest
`.audits/runs/website-structure-capture-correction-repeat/manifest.json`, SHA
`6e90dc7a29babcd898cfcec01d0a10f01e28ff56f79e01c7d131bf026a6a6693`.
Both report passing comparisons and unchanged source during execution.
Website additionally verifies unchanged expected-image hashes before/after.
Original Website v7 manifest SHA
`3c9db9a188150ae6487f987feb3e9f440e4080f55abc8e0b325dd7cde69fc226`.
No comparator tolerance change, masks or post-migration expected-image replacement.

Early Access observed Docker build/healthy topology, multi-replica store,
durable event chain, concurrent/repeat registration, canonical contact identity,
single provider acknowledgement, NATS/MinIO outages and restart/recovery. Existing
browser checks cover registration/deduplication through storage/event/provider,
URL/localStorage/sessionStorage privacy, localized challenge failure, feedback,
disabled pre-hydration submission and unnamed email input. Passing unit tests
are not used as substitutes. Synthetic stack/volumes were cleaned by the harness.
TypeScript coverage: statements95.2%, branches90.52%, functions88.23%, lines95.79%.
Combined Go: resend-mock70.2%, runner84.0%, event-streaming100%, sender85.1%,
store83.2%, envelopes96.6%. These are measured results, not a claim every package
meets80% or that the separate stricter `audit` command ran.

## Failed attempts and provenance

Root lint remains failed, nonblocking only under AC-12: current-cycle baseline
independently reproduces Docs8, SSO7, untouched shared React3 errors. Computed
lint-provenance.json proves identical diagnostic locations/rules and unchanged
affected file/Biome/root-command hashes. No defect was caused or worsened here;
no out-of-scope fix was made. The additional info is unchanged noUselessFragments.

All initial browser failures remain failed: parallel Dashboard tooltip32pixels;
Website light header29pixels; serial Website dark header39/mobile pricing587;
first corrected candidate mobile dark chart158. Two Website actual images are
pixel-identical to pre-migration failed captures, and baseline development already
exhibited chart glyph variability. Classification: browser capture/environment
variability, not a demonstrated production regression. Geometry, font resources,
AST equivalence and fresh original/candidate passes support that conclusion.
Warm-up is not claimed to guarantee determinism. Successful full reruns provide
the required passing evidence but do not relabel those failed executions.
Ticket0012's earlier modified-link observer timeout is preserved with trace proof
of the distinct Japanese document HTTP200 and unchanged full retry, as its slice
Audit records. Baseline build-lock collision and pre-migration capture failures
remain documented in the execution record. No required check remains unexecuted.

## Acceptance disposition

| AC | Disposition / evidence |
| --- | --- |
| 01 | satisfied: archived actual N12 snapshot and both pre-migration browser baselines; Ticket0009 |
| 02–04 | satisfied: production component/props inventories, both hook extractions, independent AST/review, types/builds; Tickets0010–0012 |
| 05 | satisfied: direct Dashboard route composition; actual legacy mappings and useful navigation types preserved;35browser tests |
| 06 | satisfied: narrow shared primitives/icons, duplicate dependency removed, public API tests and unchanged conflict overrides |
| 07 | satisfied: intentional ownership/imports/server boundaries; scoped Biome, fixtures, typechecks and independent review |
| 08–09 | satisfied: final Dashboard35 and Website11/26 comparisons/interactions with original images and preserved locale/header/chart/demo/focus behavior |
| 10 | satisfied: actual Early Access all harness,42unit/coverage and3browser tests, durable integration evidence |
| 11 | satisfied: scoped lint, app/shared types/production builds,33web-quality tests and12fixtures |
| 12 | satisfied under approved contract: all root checks executed; lint remains failed external proven baseline debt, others pass; no unresolved provenance or initiative regression |
| 13 | satisfied: behavior/style/state/runtime preserved; excluded debt untouched and identifiable |
| 14 | satisfied: independent Standards0/Spec0; versioned source/log identities, slice reports and this final Audit |
| 15 | satisfied: accepted bounded Refinement; only validated canonical intent retired; unresolved evidence retained |

Tickets0009–0013 are gates-complete. Review/Audit and Refinement are complete;
no new initiative or universal policy is started. Later owner authorization
permits commit/PR after verification, not merge/release. Publishing the uncommitted
N12 prerequisite was subsequently explicitly approved by the owner for the same
PR as a separate first commit. The second commit contains Frontend Structure;
neither this publication authorization nor packaging changes the tested source.
