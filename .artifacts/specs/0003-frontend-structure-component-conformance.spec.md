# 0003 — Frontend Structure & Component Conformance

**Version:** 1

**Status:** ready-for-agent

**Approval:** approved under the owner's explicit auto approval for this next cycle — 2026-09-26. Scope and seams are recorded in Planning v1; material contradictions still require owner direction.

**Delivery progress:** gates-complete

**Blocked by:** None (can start immediately)

**Evidence:** `.audits/reviews/frontend-structure-final-2026-09-26.md`, `.audits/reports/frontend-structure-final-2026-09-26.md`; final source identity `23bec95a784a7dd7da51cdaae312d3f792a8c1300ce63b7f3fce488e60c55dfa`. Refinement: `.artifacts/research/frontend-structure-refinement-2026-09-26.md`.

Planning: `.artifacts/research/frontend-structure-planning-2026-09-26.md`.
Standards: `.agents/guardrails/frontend.md`, `nextjs.md`; `tailwind.md` and
`jotai.md` constrain preservation where extracted components use those systems.

## Problem Statement

Dashboard and Website still contain component, props and hook structures that
violate promoted frontend standards. Dashboard centralizes page identity in a
section dispatcher and duplicates shared icon ownership. The completed foundation
and styling cycles intentionally deferred these concerns. Conformance must not
redesign screens or change application behavior.

## Solution

Give components/hooks independently navigable, concern-colocated ownership,
normalize component props contracts, let Dashboard routes compose their existing
page responsibilities, and move genuinely generic primitives/icon access to the
shared owner. Verify equivalent rendered behavior against the actual completed
N12 starting snapshot before retiring validated calibration evidence.

## User Stories

1. As a maintainer, I can find one component in its component file without searching a monolithic view.
2. As a maintainer, I can find each custom hook at an explicit hook boundary.
3. As a reviewer, I see a named props interface and initial body destructuring for every app component with props.
4. As a route owner, I compose meaningful page responsibilities without passing page identity to a universal dispatcher.
5. As a user, I see the same content, styling, navigation, routes and product vocabulary.
6. As a Dashboard user, my filters, voice interactions, theme and shared state retain their existing semantics.
7. As a keyboard user, modal focus, Escape, restoration and recovery remain unchanged.
8. As a Website visitor, locale changes preserve the established URL and drawer behavior.
9. As a visitor, charts, scenarios, evidence selection and inspectors keep their identities and interactions.
10. As an Early Access registrant, registration, challenge, privacy and durable acceptance remain unchanged.
11. As a package consumer, I use intentional shared icon/primitive public boundaries rather than app-private imports.
12. As an owner, I receive truthful snapshot-bound checks, external-debt classification and bounded refinement proposals.

## Implementation Decisions

- Production React code owned by Dashboard and Website is the conformance scope;
  newly introduced/modified shared primitives must conform too. Untouched shared
  vendor/component debt is not a whole-package cleanup mandate.
- One component per component file; one hook per hook-suffixed TypeScript file.
  Helpers/data may coexist where concern ownership is clear. Props are named
  interfaces local to their component, received as props, destructured first in
  the body with a separating blank line. No-props components need no empty contract.
- Routes compose the current gate, heading and page content. Useful navigation/
  title models, configurable skeletons and render props are legitimate. Remove
  the universal page discriminator, not every union or conditional in UI.
- Preserve actual route mappings, including legacy-named routes that currently
  render ordinary Evolution without presetting filters. Do not activate dormant
  render-time state writes. Metadata and displayed product semantics stay unchanged.
- App-specific responsive overlay behavior stays local. Existing generic Card/
  Kicker behavior gets a narrow shared public owner; unused generic code need not
  become public. Reuse appropriate existing foundations, but do not invent a
  vendor migration or a new generic framework. Preserve conflict-aware composition
  for moved primitives without changing unrelated consumers of the shared join-only
  helper. Shared icon exports own the icon dependency; app copies are removed.
- Keep business/package contracts with their real owner. Public exports are
  explicit. Absolute imports cross ownership boundaries; no parent traversal.
  Retain application aliases as the single-source existing configuration contract.
- Extraction preserves client/server boundaries, state identity/lifetime, callback
  behavior, localization, styles, DOM semantics and runtime/environment boundaries.
  Moving Website header focus coordination must retain its route-remount lifetime.

## Testing Decisions

Seams approved by cycle auto-approval: production browser routes/interactions and
screenshots, existing shell/route-state tests, existing Early Access unit/coverage
and real integration/browser harness, and affected shared public APIs. Prefer
observable behavior over tests of extracted internals. Add Website header/demo
regression observations before production extraction. Characterization tests may
start green; do not manufacture a production bug to claim red/green TDD.

Archive/hash the complete relevant uncommitted starting source without secrets.
Bare HEAD predates N12 and is not the structural cycle's implementation baseline.
Keep the original Dashboard appearance comparator; establish Website appearance/
interaction evidence before migration. No post-change expected-image regeneration,
masking of changed responsibilities or tolerance widening to accept regressions.

## Acceptance Criteria

| ID | Required evidence and canonical traceability |
| --- | --- |
| AC-01 | Exact completed N12 source baseline, HEAD/status, source hashes/archive and pre-migration browser evidence exist before structural implementation; preserve prior work. |
| AC-02 | Production app component inventory has one React component per component file; extracted files colocate by concern. Frontend Components/hooks. |
| AC-03 | Both identified hooks have dedicated `.hook.ts` ownership and updated callers with equivalent data/memoization. Frontend Components/hooks. |
| AC-04 | All app production components with props have named local interfaces, props arguments and initial body destructuring/spacing; new shared components also conform. Frontend Props. |
| AC-05 | Dashboard filesystem routes compose existing independent responsibilities; no universal whole-page dispatcher or dormant dispatcher behavior remains. Useful navigation/skeleton configuration survives. Frontend Composition; Next Route ownership. |
| AC-06 | Generic primitives and icon access have intentional shared ownership/public exports; duplicate Dashboard icon dependency removed. Conflict/override behavior and existing consumers remain unchanged. Frontend Shared UI/public boundaries; Tailwind composition. |
| AC-07 | Domain/props types, server/client boundaries and imports preserve ownership; no prohibited traversal/wildcard public export or duplicated aliases introduced. Frontend Ownership; Next Server boundaries. |
| AC-08 | Full existing Dashboard browser matrix and new Website baseline comparisons/interactions pass on final source, preserving routes, layouts, themes, responsive/focus/scroll/locale/recovery behavior without baseline replacement. |
| AC-09 | Website chart/scenario/evidence and header interactions remain equivalent; localization, query/hash, modifier navigation and remount focus state preserved. |
| AC-10 | Existing Early Access unit, coverage, real Docker integration/browser harness pass; hydration, unnamed input, privacy, challenge, deduplication and durable chain evidence are not replaced by mocks. |
| AC-11 | Dashboard/Website/affected shared typechecks and production builds, scoped lint/format/import checks, existing web-quality suite and guardrail fixtures pass. |
| AC-12 | All agreed repository doctor/lint/typecheck/build checks run. Initiative regressions/worsening block; out-of-scope failures are nonblocking only with baseline reproduction and no-worsening proof. Failures remain failed; unresolved provenance/unavailable required evidence blocks. |
| AC-13 | No product, state, styling, metadata, localization or runtime redesign; excluded markers/debt remain identifiable and unmodified. |
| AC-14 | Independent Standards/Spec Review and Audit record exact baseline/candidate source, commands/exits, actual observations, failed/unrun checks and all AC dispositions. Each ticket resolves only on its verified snapshot. |
| AC-15 | Refinement records transfer/ambiguity/local intent and validated marker dispositions. Retire only canonically represented, implemented, verified intent under recorded cycle auto-approval; retain unresolved/state/runtime evidence. No universal rule inferred from a local extraction. |

## Out of Scope

Jotai redesign/atom decomposition; further Tailwind/CSS migration; product screens,
features or copy; Early Access feature completion; deployment/Docker architecture;
broad accessibility/CWV; localization redesign; page metadata additions; generic
shared/vendor-wide cleanup; unrelated Docs/SSO/shared failures; union-to-enum
changes; new standards/checkers without evidence. No Git publication.

## Further Notes

Approval does not turn a failed check green. Existing external lint debt must be
reproduced against this source baseline; old-cycle classifications alone do not
satisfy AC-12. An actual material contradiction stops for owner resolution despite
auto-approval. Close only with final snapshot-bound gates and refinement.
