# Frontend Structure & Component Conformance — Planning v1

Owner brief: new initiative after Website Foundation and N12 closure. The owner
then granted auto approval for this next cycle, superseding the brief's manual
phase pauses, not its scope, evidence or Git limits. This record uses that advance
approval for the recommendations below. Unresolved material contradictions still
return to the owner. No publication is authorized.

## Baseline and decision tree

The starting point is the **uncommitted completed N12 snapshot**, not bare HEAD:
HEAD/base `1cdede8a39f56c62a57b63e9933c85df5e7f8850`, branch
`codex/dashboard-tailwind-alignment`, final N12 retirement manifest
`480e1488a231984ad0b6168e2de6f83d65d0b38c85386dd3b46f1cdfd287cd52`.
No reset, stash, commit or branch replacement is needed to plan or execute.
Preserve a source manifest/archive before implementation to distinguish cycles.

- Canonical structural rules → both app-owned React surfaces.
  - Files/components/hooks/props → mechanical extraction preserving behavior.
  - Page composition → Dashboard filesystem owns identity; Website already does.
  - Generic ownership → targeted shared primitives and existing shared icons.
  - State, styling, runtime, product changes → excluded.
- Evidence → pre-change browser baselines, existing component/Early Access seams,
  type/build, structural inventory and independent Review/Audit.
  - Existing Dashboard harness → retain its full behavior/appearance matrix.
  - Missing Website composition coverage → establish before source migration.
  - External failures → execute all checks; reproduce against this cycle's
    baseline and prove no worsening. Unresolved provenance remains blocking.

## Scope inventory

Read-only delegated inventories examined real TypeScript declarations and callers.
Dashboard: 123 component functions in 96 production files; 38 accept props,
37 violate the named-interface/props/body-destructure contract. Five multi-component
files: dashboard-view (18 plus useVisionPoints), route skeleton (7), template UI
(3), shell (2), page gate (2). Website: 28 components in 21 production files;
21 accept props and all destructure parameters (18 anonymous contracts, one alias,
two named interfaces). Four multi-component files: website-header (3),
integrations-section (3), vision-loop-evidence-demo (3), executive-review-panels
(2). useHeroPoints is embedded in hero-chart and consumed by selected-movement.
Counts describe the starting inventory, not permanent component-count policy.

Dashboard's 16 leaf pages select DashboardView by section. Extract existing
meaningful compositions and let routes compose gate/heading/content without a
universal page switch. Navigation/title data and configurable skeleton selection
remain legitimate; not every discriminant is dispatch. Existing public routes
intentional-drift/unexplained-drift currently render ordinary Evolution; do not
activate dormant LegacyEvolution filter writes. Team/area URLs do not preset
grouping. Remove unreferenced dispatcher-only code only after caller verification.

Generic Card/Kicker are existing app-local primitives without a drop-in shared
equivalent. Move their existing bounded behavior to the shared owner with explicit
public exports; do not add a new design system or upstream vendor migration.
Unused Muted needs no speculative public API. Shared icon access already exists;
extend only needed exports and remove Dashboard's duplicate dependency.
Dashboard OverlayDialog embeds app-specific responsive modality; it remains local.
Website's theme control has a distinct styling/tooltip contract; a native button
does not itself prove a missing generic abstraction. Do not redesign it here.

Keep domain contracts with existing owners; props stay local. Meaningful absolute
subpaths and explicit optional barrels preserve ownership. No parent traversal.

## Relevant calibration evidence

| Evidence | Classification and disposition |
| --- | --- |
| E09–E11, E18 | Canonical props contract; root layout already conforms, global-error and other props need normalization |
| E13/E14 | Canonical component/hook boundaries; unresolved implementation debt in giant view |
| E15 | Obsolete wording: earlier extraction explicitly resolved it to component/hook count, never comment count |
| E16/E27 | Canonical route composition; implement while retaining useful title/navigation models |
| E25/E26 | Canonical component/generic ownership; targeted shared move |
| N09 | Canonical shared icon identity; resolve Dashboard duplicate |
| E07/E08/E12/E23 | Readability/async evidence, outside primary structural scope; preserve unless incidentally validated, no blanket retirement |
| E19 | Deliberate document recovery is a legitimate canonical exception; preserve recovery, not an automatic Link rewrite |
| E21 | Local enum preference, not universal policy; deferred |
| N11/E28/E29 | State ownership/atom/Immer concerns; deferred unchanged |
| Deployment/environment markers | Outside this cycle; preserve |

Website has no temporary AGENT markers. A marker's existence does not create new
policy. Retirement occurs only after validated intent, using the owner's cycle
auto-approval for a clearly recorded bounded retirement proposal; contested
intent or unvalidated markers remain.

## Behavioral invariants and tests

Preserve DOM semantics, styling/classes, route identity, title/copy/vocabulary,
locales, URLs, metadata, gate timing/recovery, theme, responsive/modal distinctions,
keyboard/focus/scroll, voice timers, selected state and atom identity. Preserve
Website header locale query/hash/modifier behavior, drawer focus restoration and
responsive closure; chart/selection memoization; evidence inspector source identity,
filters and return focus. Keep Early Access hydration disabling, unnamed input,
challenge resets, duplicate suppression, source attribution and privacy unchanged.

Confirmed seams under advance approval: production browser routes and user
interactions/screenshots; existing Dashboard shell/route-state tests; Website
Early Access tests/coverage plus its real Docker integration/browser harness;
targeted public shared primitives/icons. No tests of extracted private functions.
Add Website header/demo browser observations before changing its production code.
Missing required browser/integration infrastructure is blocking, never mocked green.

Run doctor, root lint/typecheck/build, app and affected shared checks, web-quality,
Early Access unit/coverage/integration/browser, scoped Biome/format/import checks
and guardrail fixtures. A temporary AST inventory supports review, not a new
unapproved enforcement framework. Preserve exact baseline/candidate snapshots.

## Transfer, exclusions and open decisions

Component/props/hook conventions transfer naturally; extraction layout is
application-specific. Website configurable sections/render props and Dashboard
skeletons are legitimate configuration, not forbidden whole-page dispatch.
Shared discriminated-union contracts elsewhere (e.g. LanguageSwitcher) are not
silently widened to satisfy an interface syntax rule; untouched shared/vendor
debt is not a whole-package conformance claim.

No Jotai decomposition, new Tailwind migration, metadata/content redesign,
accessibility/CWV program, localization/runtime/Docker redesign, Early Access
feature changes, unrelated Docs/SSO/shared lint fixes, or product changes.
No new vocabulary or hard-to-reverse architectural decision requires an ADR.
No unresolved owner decision remains after applying the bounded recommendations
under auto-approval. A real contradiction discovered later reopens only that branch.

Planning v1 accepted under the owner's explicit cycle auto-approval. Next:
to-spec, then ticket breakdown with recorded advance approval, then implementation.
