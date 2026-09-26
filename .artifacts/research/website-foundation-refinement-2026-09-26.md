# Website Foundation Alignment — refinement record

**Status:** refinement complete; Website Foundation Alignment closed. The owner
accepted the completed validation and approved the bounded marker retirement
on 2026-09-26. No new policy was promoted; workflow refinement remains unpromoted.

## Source and cycle result

- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md`
  version 2, approved by the owner on 2026-09-26.
- **Tickets:** `0001` through `0004`, all `gates-complete`.
- **Resolved base and HEAD:**
  `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`; the implementation remains an
  uncommitted working-tree snapshot.
- **Final evidence:**
  `.audits/reviews/website-foundation-ticket-0004-v2-2026-09-26.md` and
  `.audits/reports/website-foundation-ticket-0004-v2-2026-09-26.md`.
- **AC-22 run evidence:** `.audits/runs/early-access.N7iOMk`.

The exact Docker-backed Early Access harness exited 0. The final independent
Standards and Spec review axes each report zero findings. Repository-wide
failures remain reported as failed under spec v2 AC-21, with their accepted
baseline provenance preserved below.

## Guardrail transfer findings

This cycle is a second-surface validation of the promoted frontend standards,
not a source from which to reconstruct or broaden them.

| Applicable contract | Website evidence | Refinement disposition |
| --- | --- | --- |
| Root App Router and root request proxy ownership | Next.js discovered root `app/` and `proxy.ts`; production build and route/runtime smoke passed. | Confirms the existing Next.js guardrail. No text change. |
| App-owned localization under `app/lib/i18n` | next-intl, localized route generation, metadata, navigation, and all four locale behaviors passed. | Confirms the existing localization guardrail without standardizing Website's locale list, route set, or persistence choices. No text change. |
| Ownership-aware absolute imports, local `./`, and no parent traversal | The catch-all alias was removed, semantic aliases remained developer-owned, scoped Biome and guardrail fixtures passed, and no Website parent traversal remains. | Confirms the existing ownership boundary. The concrete Website alias names are not promoted. No text change. |
| One alias source, private manifest metadata, and meaningful Turbo overrides | `tsconfig.paths.json` is the sole alias source, private version metadata and redundant local Turbo configuration are absent, and the integrated checks passed. | Confirms the existing application-configuration guardrail. No text change. |
| Useful project behavior justifies a wrapper | Website retained the existing build/start wrappers because they own LangDrift environment loading, standalone asset assembly, and runtime behavior; build and standalone smoke passed. | Confirms the qualification already present in the guardrail. It does not promote Website's scripts as a universal wrapper design. No text change. |
| Tests respect production ownership | The events fixture remained events-owned, while messaging browser tests stopped importing Website-private messages and passed through black-box behavior. | Supports the existing ownership principle. One cross-language fixture and one browser seam do not justify a new universal test-architecture rule. Left unpromoted. |

The cycle intentionally did **not** validate component-per-file structure,
props-interface cleanup, hook extraction, Jotai decomposition, CSS-to-Tailwind
migration, broad App Router composition, accessibility/CWV improvements, or
Early Access feature changes. Website's existing implementation in those areas
is neither promoted nor treated as a counterexample. No conclusion about those
guardrail sections changes in this refinement.

## Evidence-contract learning

Spec v2 AC-21 proved a useful provenance pattern: execute every agreed
repository check, require initiative-scoped checks to pass, and reproduce an
out-of-scope failure at the approved baseline before treating it as external
pre-existing debt. A failure with unresolved provenance remains blocking, and
a failed command remains failed in the evidence.

This is one cycle's acceptance-contract refinement. It is not promoted into
the repository workflow by this record. A future repeated instance plus owner
approval would be needed before changing the SDD workflow or introducing a
checker.

AC-22 also confirmed that unavailable integration infrastructure is recorded
as `not run — environment unavailable`, not replaced by weaker evidence. Once
Docker was available, the exact agreed harness—not a substitute—had to pass.
This is evidence handling for this cycle, not a new frontend guardrail.

## External debt preserved

| Surface | Failed repository gate | Disposition |
| --- | --- | --- |
| Docs | lint | External pre-existing defect; reproduced at the approved baseline; not copied into Website scope. |
| SSO | lint | External pre-existing defect; reproduced at the approved baseline; not copied into Website scope. |
| Shared React | lint | External pre-existing defect; reproduced at the approved baseline; not copied into Website scope. |
| Dashboard | typecheck and build | External pre-existing defects; reproduced at the approved baseline; not copied into Website scope. |

These checks did not pass. Their accepted provenance makes them nonblocking
for Website Foundation under spec v2, but does not close the external debt.

## Temporary calibration markers

The historical extraction remains unchanged. Its evidence ledger already
preserves the source, meaning, and frozen hashes of the Dashboard calibration
markers, so marker cleanup must not rewrite that past record to appear
predictive.

The owner approved retirement of exactly N01–N08, N10, E17, E20, and E22 on
2026-09-26. Each temporary marker was removed after confirming the following
canonical destination. Paths in the source column are under `apps/dashboard/`.

| Retired marker | Source and reusable intent | Existing canonical destination |
| --- | --- | --- |
| N01 | `AGENT_NOTES.md`: root `app/`, no `src/` wrapper | [Next.js application ownership](../../.agents/guardrails/nextjs.md#application-and-route-ownership) |
| N02 | `AGENT_NOTES.md`: readable expanded frontend JSON | [Biome configuration](../../biome.json): frontend-scoped `json.formatter.expand: always`, covered by the existing guardrail fixtures |
| N03 | `AGENT_NOTES.md`: meaningful ownership-aware aliases | [Frontend ownership](../../.agents/guardrails/frontend.md#ownership-and-public-boundaries) |
| N04 | `AGENT_NOTES.md`: remove duplicated paths declarations | [Application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation): one alias source |
| N05 | `AGENT_NOTES.md`: aliases in `tsconfig.paths.json` | [Application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation): dedicated paths file extended by the app config |
| N06 | `AGENT_NOTES.md`: omit `baseUrl` | [Application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation); this repository rule does not depend on the old note's general deprecation claim |
| N07 | `AGENT_NOTES.md`: app Turbo only for meaningful overrides | [Application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation) |
| N08 | `AGENT_NOTES.md`: omit private app publication versions | [Application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation) |
| N10 | `AGENT_NOTES.md`: direct tool commands when wrappers add no project behavior | [Application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation), including its useful-project-behavior exception |
| E17 | `app/(reports)/drift-report/page.tsx`: page-specific metadata | [Next.js route ownership](../../.agents/guardrails/nextjs.md#application-and-route-ownership) |
| E20 | `app/loading.tsx`: ownership-aware absolute imports | [Frontend ownership](../../.agents/guardrails/frontend.md#ownership-and-public-boundaries), including optional barrels and meaningful subpaths; removed the marker and its adjacent commented import example |
| E22 | `app/lib/i18n/request.ts`: separate import-origin groups | [Biome configuration](../../biome.json): frontend `organizeImports` groups and `:BLANK_LINE:` separators, covered by the existing guardrail fixtures |

`AGENT_NOTES.md` remains partially active with original items N09 (shared icon
ownership), N11 (Dashboard's state migration), and N12 (Tailwind migration).
Their owner-intent text is unchanged. Its preamble now explains partial
retirement and retains the file until every remaining item has a disposition.

All 26 other inline `AGENT:` markers remain unchanged: E01–E16, E18–E19, E21,
and E23–E29. They preserve evidence for component/hook/props/composition,
Jotai, Tailwind/shared UI, async control flow, product documentation, Dashboard
environment/deployment, navigation recovery, and Dashboard-local domain
modeling. Retirement does not claim that the corresponding Dashboard code
has been remediated; E17's metadata and the other deferred Dashboard concerns
remain outside Website's implementation scope.

## Refinement disposition

- **Promoted now:** nothing; the canonical guardrails already express every
  Website-validated reusable obligation.
- **Left unpromoted:** Website aliases, route/locale choices, wrappers, fixture
  mechanics, and browser assertion strings because they are local mechanisms.
- **No vocabulary update:** the cycle resolved no new domain term.
- **No ADR:** the cycle selected no new consequential architecture beyond the
  approved spec contract.
- **No checker or hook:** one evidence-contract refinement does not justify new
  automation.
- **Approved retirement completed:** exactly N01–N08, N10, E17, E20, and E22.
  All other marker retirement remains deferred.

## Final cycle state

Retirement verification on 2026-09-26:

- Compared all tracked Dashboard `AGENT:` lines with `HEAD`: exactly E17, E20,
  and E22 were removed; all 26 deferred inline markers were identical (exit 0).
- Compared the remaining numbered note text with `HEAD`: exactly N09, N11,
  and N12 remain, unchanged (exit 0).
- Compared the three edited source files after excluding line comments and
  blank lines: all executable source lines were identical (exit 0).
- `node_modules/.bin/biome check 'apps/dashboard/app/(reports)/drift-report/page.tsx' apps/dashboard/app/loading.tsx apps/dashboard/app/lib/i18n/request.ts`
  passed on all three files, with no fixes applied (exit 0).
- `git diff --check` passed (exit 0). Application builds and the Docker harness
  were not rerun for this comment/documentation-only cleanup; their recorded
  implementation results remain tied to the previously tested snapshot.

All four tickets retain `gates-complete`, the owner has accepted the completed
validation, and no material contract change awaits approval. Refinement is
complete and the Website Foundation Alignment cycle is closed under
`.agents/workflow/CYCLE.md`.

This final cleanup changes only Dashboard comments and calibration/refinement
documentation. The Website implementation, spec v2, ticket contracts, and
tested Early Access harness remain unchanged. The final Review and Audit
continue to describe their tested implementation snapshot; marker-retirement
verification covers the later comment-only delta. External failures remain
failed external debt under AC-21. No new cycle or Git publication is authorized
by this closure.
