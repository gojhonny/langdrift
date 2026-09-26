# Dashboard Tailwind Alignment

- **Version:** 2
- **Status:** ready-for-agent
- **Approval:** approved by owner — version 2 narrow prerequisite extension — 2026-09-26
- **Delivery progress:** gates-complete
- **Planning baseline:** `1cdede8a39f56c62a57b63e9933c85df5e7f8850`
- **Evidence:** `.audits/reviews/dashboard-tailwind-final-2026-09-26.md`, `.audits/reports/dashboard-tailwind-final-2026-09-26.md`, including approved N12/E24 retirement; final manifest SHA-256 `480e1488a231984ad0b6168e2de6f83d65d0b38c85386dd3b46f1cdfd287cd52`.

## Version 2 Revision Basis

Version 1 was approved on 2026-09-26. Execution restored the declared
dependencies and exposed the existing mismatch between Dashboard's theme
domain type (which included `system`) and its two-mode runtime and shared
controls. The owner explicitly approved the smallest correction: remove the
unsupported `system` member while preserving `light` and `dark` behavior.

Version 2 adds only this named exception to the prerequisite repair boundary
in Implementation Decision 3 and AC-02. It does not authorize system-theme
implementation, Jotai redesign, other domain-type repairs, or broader scope.
All other requirements, acceptance criteria, exclusions, and the approved
four-ticket breakdown remain unchanged. The approval above records the owner's
explicit acceptance of this narrow extension; it is not inferred gate approval.

## Problem Statement

Dashboard uses Tailwind extensively but retains temporary N12 calibration
evidence, split application/global CSS, join-only class composition, and
literal styling for some reusable surface roles. Developers cannot yet treat
its current styling as a validated application of the promoted Tailwind
guardrail. Moving styling without a reproducible visual baseline could change
the analytical experience, shared chart rendering, keyboard feedback, or
responsive interactions without detecting the regression.

The owner approved a Dashboard-only Tailwind alignment cycle, preserving its
current appearance and behavior. The canonical Tailwind guardrail governs the
meaning of N12: necessary framework and theme/token integration CSS is allowed.
The historical note does not establish a literal zero-CSS requirement.

## Solution

Use Tailwind utilities for Dashboard-owned application styling, preserve only
technically justified integration CSS, adopt conflict-aware class composition,
and express reusable color/font roles through semantic theme utilities.
Preserve the current palette, typography, layout, content, navigation, state,
localization, and interaction behavior.

First establish a reproducibly buildable Dashboard through the approved
bounded prerequisite repair. Capture its appearance and behavior before
styling changes. Deliver a repository-owned browser harness that compares that
baseline with the migrated application under controlled conditions, alongside
the existing interaction and localization tests.

## User Stories

1. As a Dashboard user, I want the same analytical layout after migration, so
   that my familiar Product Vision workflow remains intact.
2. As a Dashboard user, I want light and dark themes to retain their palette
   and contrast, so that information keeps its existing meaning.
3. As a Dashboard user, I want charts and their tooltips to retain their theme
   roles, so that shared visualization content remains readable.
4. As a mobile user, I want navigation, dialogs, and content to retain their
   responsive layout, so that the migration does not introduce overflow or
   unreachable controls.
5. As a keyboard user, I want focus indicators, containment, dismissal, and
   restoration to remain intact, so that navigation remains usable.
6. As a user with reduced-motion preferences, I want existing motion handling
   preserved, so that changing styling technology does not change my experience.
7. As a Dashboard user, I want transitions and typography preserved, so that
   the interface keeps its current visual character.
8. As a localized Dashboard user, I want language selection and translated
   layouts preserved, so that styling changes do not disrupt my chosen locale.
9. As a Dashboard user, I want filters, selections, timers, and navigation state
   to retain their behavior, so that styling work does not change product logic.
10. As a user encountering an application error, I want the existing fallback
    and recovery controls to remain usable even when the normal shell fails.
11. As a frontend developer, I want application styling expressed in Tailwind,
    so that there is one intended styling system for Dashboard.
12. As a frontend developer, I want necessary integration CSS distinguished
    from application styling, so that compliance does not break framework or
    theme integration.
13. As a frontend developer, I want conflicting utility classes composed
    intentionally, so that defaults and consumer overrides are predictable.
14. As a frontend developer, I want semantic utilities for recurring surface
    roles, so that themes do not depend on scattered palette literals.
15. As a maintainer, I want dependencies declared by their actual consumer, so
    that Dashboard builds from a clean supported workspace installation.
16. As a maintainer, I want prerequisite repairs recorded separately from
    styling changes, so that the visual baseline is trustworthy.
17. As a reviewer, I want repeatable browser comparisons and interaction tests,
    so that preservation is demonstrated through observable behavior.
18. As a reviewer, I want each retained CSS responsibility justified against
    canonical policy, so that moving CSS into a global file cannot hide debt.
19. As an owner, I want repository failures classified with baseline evidence,
    so that unrelated debt remains visible without concealing regressions.
20. As an owner, I want this cycle's findings and marker dispositions tied to
    the final snapshot, so that later refinement has reliable evidence.

## Implementation Decisions

1. The implementation boundary is Dashboard-owned styling and its necessary
   configuration, dependency declarations, tests, and active documentation.
   Shared packages remain providers of their existing public integration
   surfaces. Their implementation and other applications are not migration
   targets.
2. Execute from the merged Website Foundation baseline. Record the actual base
   before work begins; if newer main changes affect this contract or its
   assumptions, reconcile them before relying on the earlier observations.
3. Restore the locked dependency installation before attributing missing-module
   failures to production source. Then reassess the remaining diagnostics.
   Only the minimum dependency/import repairs necessary for this cycle's
   validation are authorized. Broader logic or architectural repair requires
   owner scope approval. The sole approved domain-type exception is narrowing
   DashboardTheme to its existing `light` and `dark` modes by removing the
   unsupported `system` member before the renderable baseline is captured.
4. The approved prerequisite slice may establish the declared dependencies of
   the Dashboard class-composition helper and the browser harness. Dependency
   additions and their lock changes must be bounded and explained. General
   dependency upgrades and unrelated manifest cleanup are excluded.
5. Keep the prerequisite delta identifiable. Establish the visual baseline
   after the application is buildable but before changing stylesheet behavior,
   class composition, semantic roles, or theme values. Declaring dependencies
   for an unused helper must not also activate that helper before baseline
   capture. Baseline preparation must not silently correct visual defects.
6. Inventory each Dashboard-owned CSS responsibility and its consumers. Move
   component, feature, layout, and responsive styling into Tailwind utilities.
   Retain CSS only for required or strongly implied framework/library or
   technically necessary theme/token integration.
7. Judge the necessity of retained CSS and any file separation by function.
   Existing file layout and organizational convenience are insufficient
   justification. Neither a fixed stylesheet count nor a universal token-file
   arrangement is prescribed. Preserve necessary shared stylesheet imports.
8. Use conflict-aware `cn` composition built with `clsx` and `tailwind-merge`
   where conditional classes or defaults/consumer overrides require it. Plain
   string joining is insufficient for those cases. Static strings need no
   ceremonial helper call. The helper's directory and suffix are not policy.
9. Preserve intended rendered defaults and overrides when replacing the
   join-only helper. A different class-conflict result is a potential visual
   regression requiring examination, even when the new helper is canonical.
   Do not change the shared public helper to expand this Dashboard migration.
10. Represent reusable surface colors and fonts through semantic Tailwind
    utilities backed by theme tokens. Preserve current values and distinct
    roles, including text contrast versus chart graphics, rather than merging
    them merely because they share a color family. Arbitrary values that do
    not represent reusable theme roles are not categorically prohibited.
11. Preserve theme selection, initial rendering, chart variable contracts, and
    the deliberately light global-error fallback. Existing font distinctions,
    brand treatment, focus rings, transitions, and reduced-motion behavior
    remain part of the preservation contract.
12. Preserve functional browser integration such as setting the document theme
    and color scheme or locking/restoring scroll for a modal. Those operations
    are not prohibited application CSS merely because they write style state.
13. Keep routes, metadata, public copy, locale choices/persistence, environment
    boundaries, shared/local state, and recovery semantics unchanged. Necessary
    styling edits inside a component do not authorize extracting its hooks,
    changing its props API, or decomposing its responsibilities.
14. New or changed imports respect canonical ownership boundaries and avoid
    parent traversal. Configuration and dependency edits must support this
    bounded migration without adding compatibility copies or suppressing rules.
15. Deliver durable browser configuration, assertions, baseline acquisition, and
    reproduction instructions using supported repository dependencies. Existing
    ignored audit scripts may inform the work, but machine-specific paths and
    private historical output cannot be required to execute the new harness.
16. Observe the built application through routes and user interactions. Keep
    deterministic test setup in the harness; do not introduce production-only
    testing APIs or expose private modules to satisfy browser assertions.
17. Preserve deferred calibration evidence throughout execution. Refinement may
    propose retirement of N12 and the class-composition marker only after their
    obligations are proved; retirement requires its own owner acceptance.

## Testing Decisions

The owner approved the test seams during Planning Q4: the primary seam is a
built Dashboard exercised in a real browser, supported by existing component
interaction, route-state, and localization tests. This specification makes
that agreed boundary concrete; it does not require a second architecture for
testing private implementation details.

### Baseline and comparison

- Record two distinct references: the approved repository base used to
  establish failure provenance, and the renderable pre-styling snapshot used
  for visual comparison. Include every prerequisite change between them.
- Capture baseline and candidate with the same browser/version, viewport,
  device scale, fonts, locale, theme, fixture data, and settled application
  state. Record dependency/runtime versions and setup commands. Do not compare
  a development baseline with an unrelated production candidate.
- Stabilize nondeterministic animation/data for screenshots in the harness.
  Exercise transitions and reduced-motion behavior separately, so stabilization
  does not hide the behavior under test. Do not mask migrated UI to obtain a
  passing comparison.
- Declare tolerances and permitted nondeterminism before candidate comparison.
  Only demonstrable rendering noise may be tolerated; layout, text, colors,
  typography, focus indicators, or interaction changes cannot be accepted by
  widening thresholds or regenerating the baseline from the migrated app.
- Retain baseline/candidate artifacts, comparison results, and human review of
  meaningful differences. New rendering defects block acceptance. Existing
  visual defects remain documented unless a separate change is approved.

### Coverage matrix

| Boundary | Required observable evidence |
| --- | --- |
| Dashboard routes | Smoke the current route inventory, including the root redirect, and verify successful rendering/navigation without new browser exceptions. |
| Representative page layouts | Compare before/after at desktop and mobile widths in light and dark themes. Cover the shell, Overview, Evolution/chart content, Settings, and any distinct migrated styling responsibility not represented by those pages. Record the selected matrix and why it covers the changes before migration. |
| Responsive behavior | Preserve document reflow and reachability of controls, including the existing narrow-screen case, menus, overlays, and tooltip placement. |
| Interaction states | Exercise current selections/filters, route transitions, modal and nonmodal behavior, Escape dismissal, focus containment/restoration, and scroll restoration. |
| Keyboard and motion | Compare visible focus feedback; assert preserved reduced-motion handling and transition behavior outside stabilized screenshots. This is regression evidence, not full accessibility or CWV certification. |
| Localization | Retain all supported-locale tests and exercise language changes in the browser, including a non-Latin locale and the resulting layout. |
| Recovery | Preserve loading/not-found/error behavior through existing tests and browser coverage of the global-error fallback. The fallback remains independent of the normal shell/locale provider. |

### Commands and supporting evidence

Existing commands to execute during delivery and final gates:

- `pnpm --filter dashboard typecheck`
- `pnpm --filter dashboard build`, followed by the existing application start
  command for the production browser run
- `pnpm test:web-quality`, retaining the existing Dashboard and shared React
  test coverage
- `node_modules/.bin/biome lint apps/dashboard --files-ignore-unknown=true`
- Biome formatting/import-organization checks on changed supported files and
  configuration; CSS necessity remains a semantic review obligation
- `node --test .agents/guardrails/biome.test.mjs`
- `./cli/drift doctor --ci`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`
- `git diff --check`

The new reproducible browser command is a delivery artifact: document and
execute its actual baseline/candidate invocations. No nonexistent command is
represented as existing or passing here. A lower-level class-composition test
may supplement browser evidence when it verifies an observable override
contract; class-string snapshots alone do not prove visual preservation.

For every required check record its command, result, exit code where
applicable, and relevant observations. Classify failures as initiative
regressions, proven external pre-existing failures, environment/infrastructure
failures, or unresolved provenance. Required checks that cannot run remain
unpassed. Broaden checks when actual dependency/shared-consumer impact warrants
it, without making unrelated feature suites a substitute for Dashboard proof.

## Guardrail Traceability

| Canonical contract | Application | Acceptance criteria |
| --- | --- | --- |
| [Tailwind styling and integration](../../.agents/guardrails/tailwind.md#application-styling-and-integration-surfaces) | Utilities own application styling; retained CSS has technical justification | AC-04, AC-05 |
| [Tailwind composition and theme roles](../../.agents/guardrails/tailwind.md#class-composition-and-theme-roles) | Conflict-aware composition and semantic utilities preserve rendered values | AC-06, AC-07, AC-08 |
| [Frontend ownership](../../.agents/guardrails/frontend.md#ownership-and-public-boundaries) | Dashboard dependencies/imports and intentional test boundaries | AC-02, AC-06, AC-12 |
| [Frontend shared UI ownership](../../.agents/guardrails/frontend.md#shared-ui-ownership) | Preserve existing shared providers; no primitive relocation or shared helper rewrite | AC-05, AC-12 |
| [Next.js navigation, server, and localization boundaries](../../.agents/guardrails/nextjs.md) | Preserve public routes, recovery, localization, and environment behavior | AC-09, AC-10, AC-11 |
| [Jotai state ownership](../../.agents/guardrails/jotai.md) | Preserve observable state behavior; decomposition remains deferred | AC-09, AC-12 |
| [Workflow evidence contract](../../.agents/workflow/README.md#record-fields) | Approved scope and results bound to the actual snapshot | AC-01, AC-03, AC-16, AC-17, AC-18 |

Other canonical obligations remain policy, but existing component/hook/props,
Jotai, shared UI, route-composition, and configuration debt is not silently
added to this cycle. New code must respect applicable guardrails; existing
unrelated violations are recorded separately.

## Acceptance Criteria

- **AC-01 — Baseline:** execution identifies a base containing merged Website
  Foundation, with the approved baseline above as provenance. Any intervening
  material divergence is reconciled before implementation evidence is claimed.
- **AC-02 — Prerequisites:** the locked dependency installation is restored and
  reassessed; any remaining prerequisite dependency/import repair is bounded,
  explained, and sufficient to obtain a buildable Dashboard. The chosen
  conflict-aware helper and browser tooling have intentional dependency owners.
  The approved exception removes the unsupported `system` member from
  DashboardTheme, preserving its existing two-mode runtime and shared controls.
  Broader repairs are not performed under this contract.
- **AC-03 — Pre-styling evidence:** a renderable baseline is captured before
  stylesheet, composition, role, or theme behavior changes. Its exact source
  identity, prerequisite delta, dependency state, and capture conditions are
  retained separately from the repository provenance base.
- **AC-04 — Application styling:** Dashboard-owned component, feature, layout,
  and responsive styling uses Tailwind utilities. Review accounts for every
  migrated or retained CSS responsibility; moving application rules into a
  global file does not satisfy the criterion.
- **AC-05 — Integration CSS:** every retained Dashboard CSS responsibility and
  any continued file separation has documented technical necessity consistent
  with canonical policy. Required framework, token, theme, and shared-style
  integrations continue working. Literal zero-CSS is not a requirement.
- **AC-06 — Class composition:** all Dashboard composition sites that require
  conditional/default/override conflict handling use the approved `clsx` plus
  `tailwind-merge` behavior. Join-only composition is absent from those sites,
  intended rendered precedence is preserved, and the shared helper is unchanged.
- **AC-07 — Semantic roles:** recurring surface color/font roles are represented
  by semantic Tailwind utilities backed by theme tokens. Existing palette,
  typography, chart roles, brand treatment, and distinct contrast tones are
  preserved; no arbitrary-value ban or token naming vocabulary is invented.
- **AC-08 — Visual equivalence:** the documented comparison matrix passes for
  representative desktop/mobile and light/dark states. Differences are explained
  with retained artifacts; substantive visual changes require owner approval
  and cannot be hidden through threshold changes or candidate-derived baselines.
- **AC-09 — Interaction equivalence:** navigation, filters, selections, timers,
  modal/nonmodal behavior, focus, scrolling, transitions, and reduced-motion
  handling remain equivalent through existing tests and browser assertions.
- **AC-10 — Routes and localization:** the current route inventory passes smoke
  checks; language selection, supported locales, persistence, and localized
  layouts retain their behavior, including browser evidence for a non-Latin
  locale. No route identity, metadata, copy, or environment contract is changed.
- **AC-11 — Recovery:** existing loading/not-found/error tests remain green,
  and the global-error fallback retains its appearance and recovery behavior
  independently of the normal shell/provider. Browser evidence covers the
  fallback without introducing a production testing API.
- **AC-12 — Scope and ownership:** no component/hook/props decomposition,
  shared-primitive relocation, Jotai redesign, shared-package styling/helper
  rewrite, or deployment change is included. New/changed imports preserve
  ownership and contain no prohibited traversal. Functional theme/scroll DOM
  integration remains intact.
- **AC-13 — Reproducible harness:** browser tests, setup, baseline acquisition,
  and comparison instructions are repository-owned and runnable from a fresh
  supported checkout with documented dependencies. They do not depend on
  machine-specific executable paths or ignored historical audit scripts.
- **AC-14 — Scoped gates:** Dashboard typecheck, production build, production
  browser comparisons, scoped lint, and existing Dashboard interaction,
  route-state, and localization tests pass. Changed-file formatting/import
  checks and the promoted guardrail fixtures pass. Required unavailable browser
  infrastructure remains blocking; unit tests cannot substitute for it.
- **AC-15 — Existing test integration:** the existing web-quality suite runs
  without removing or weakening its assertions. Dashboard results must pass;
  any unrelated shared-suite failure must meet AC-16's external-failure proof.
- **AC-16 — Repository gates:** all agreed repository-wide doctor, lint,
  typecheck, and build checks execute. Dashboard-scoped required checks and
  browser comparisons must pass. Any failure caused or worsened by N12 blocks
  completion. An unrelated failure may be nonblocking only when reproduced at
  the approved baseline with evidence that N12 neither caused nor worsened it.
  It remains explicitly failed. Unresolved provenance and unavailable required
  evidence remain blocking. The previous cycle's classifications are leads,
  not automatic evidence for this snapshot or an exemption for Dashboard.
- **AC-17 — Final evidence:** Review and Audit identify the resolved base,
  final HEAD, working-tree status, and content identities for uncommitted
  changes and visual artifacts. Command results identify pass/fail/not-run
  honestly, and every pass applies to the examined snapshot. Later material
  edits require repeating affected gates.
- **AC-18 — Refinement boundary:** record what the migration validated about
  canonical Tailwind policy, any limitations, and the disposition proposed for
  N12 and directly related calibration evidence. Preserve deferred owner-intent
  markers and external debt. No marker is retired or local mechanism promoted
  without the relevant owner acceptance.

## Out of Scope

- Component-per-file refactors, hook extraction, props-interface cleanup,
  generic primitive relocation, icon ownership changes, and broad App Router
  composition work.
- N11/Jotai decomposition, state architecture or logging changes, new theme
  modes, and feature behavior changes.
- Shared React/design-token implementation migration, shared `cn` behavior
  changes, or styling changes in Website, SSO, Docs, or Mobile.
- Broad accessibility remediation, WCAG certification, CWV optimization,
  performance budgets, or visual redesign. Existing accessibility and motion
  behavior remains subject to regression checks.
- Deployment/runtime architecture, environment redesign, general dependency
  upgrades, private-version/Turbo cleanup, and unrelated repository repairs.
- Early Access feature or infrastructure changes; prior Docker evidence is not
  a substitute for this cycle's Dashboard browser proof.
- New universal palette, alias, token, helper-path, or stylesheet-layout rules;
  unapproved marker retirement; tickets or implementation during `to-spec`.
- Commit, push, PR, merge, publish, or release without separate authorization.

## Further Notes

### Authority and baseline observations

Planning Q1–Q4 approved full Dashboard Tailwind alignment, preservation of
appearance/behavior, bounded prerequisite dependency/import repairs, and a
reproducible browser harness. Q5 resolved the predecessor merge; Q6 explicitly
approved the repository gate semantics in AC-16. The owner then invoked
`to-spec`. These decisions authorize specification, not approval of this draft.

PR #74 merged on 2026-09-26 as
`1cdede8a39f56c62a57b63e9933c85df5e7f8850`; that was verified as main and is
the local HEAD inspected for this specification. Historical Website review
and audit results remain evidence of their own cycle.

Planning found six Dashboard CSS files, consisting of framework imports, an
import aggregator, base application rules, light/dark tokens, and Tailwind
theme mapping. It also found a used join-only `cx`, an unused Dashboard `cn`
that imports undeclared dependencies, and a public shared `cn` that is also
join-only. No JSX inline `style` attributes were found; theme synchronization
and modal scroll management use functional DOM style integration.

A direct installed TypeScript check with `--noEmit --incremental false` exited
2 during Planning: 27 unresolved-module diagnostics for declared localization/
state dependencies, eight possibly consequent implicit-any diagnostics, and
two unresolved helper dependencies. The first group had declared lock entries
but missing app-local installation links. This supports restoring installation
first; it does not establish that every diagnostic will disappear. A separate
pnpm diagnostic hung and was interrupted with exit 130, producing no result.
Neither is final gate evidence.

Prior art includes the existing `pnpm test:web-quality` configuration and
[historical Dashboard browser audit](../../.audits/reports/dashboard-web-quality-2026-09-26.md).
Its ignored scripts are exploratory evidence only. Current canonical policy
is the [guardrail index](../../.agents/guardrails/README.md), with Tailwind as
the primary specialization. The [standards extraction record](../research/frontend-standards-extraction-2026-09-26.md)
preserves marker provenance; Dashboard implementation is not a substitute for
those canonical obligations.

No new domain term or consequential architecture decision requires a glossary
change or ADR. Exact file mechanics and ticket decomposition remain for the
approved downstream phases. Version 1 requires explicit owner approval before
`to-tickets`; no ticket has been created and implementation has not started.
