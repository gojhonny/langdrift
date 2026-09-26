# Website Foundation Alignment

- **Version:** 2
- **Status:** ready-for-agent
- **Approval:** approved by owner — version 2 — 2026-09-26
- **Blocked by:** None (can start immediately)
- **Evidence:** none yet

## Version 2 Revision Basis

Version 1 was approved by the owner on 2026-09-26. Its AC-21 required:

> repository-required doctor, lint, typecheck, and build checks pass for the
> final snapshot. A pre-existing or unrelated failure remains a failed gate
> unless the owner changes the contract; it is not reclassified as a pass.

Version 2 is an explicit, owner-requested acceptance-contract refinement after
execution proved that repository-wide green can be blocked by defects outside
this initiative. It changes AC-21 only. The implementation contract, scope,
requirements, other acceptance criteria, testing decisions, and exclusions
remain those of approved version 1. This revision does not expand Website
Foundation into general repository remediation.

The execution-time classification against approved baseline
`fba2d02a5f688b3fced3f3b1620e60b340e1f3e2` established the following:

- the remaining Docs lint failures are pre-existing;
- the remaining SSO lint failures are pre-existing;
- the remaining shared React lint failures are pre-existing;
- the Dashboard typecheck failures are pre-existing;
- the Dashboard build failures are pre-existing.

Each listed failure reproduced at the approved baseline. The responsible
source files, manifests, dependency lockfile, and root task configuration were
not changed by this initiative, and the initiative neither caused nor worsened
the failure. These checks remain failed checks; version 2 does not represent
them as passing or copy their remediation into implementation scope.

AC-22 is unchanged. Docker-backed Early Access integration and browser checks
remain `not run — environment unavailable` until a working Docker daemon is
available. Passing unit, coverage, standalone, typecheck, build, and
static-asset checks are not substitutes for that evidence.

## Problem Statement

The Website application predates the promoted LangDrift frontend guardrails and
still carries a source-wrapper layout, ambiguous import aliases, prohibited
parent traversal, duplicated TypeScript path configuration, redundant
application metadata, and configuration paths coupled to the legacy layout.
Those conditions make the Website a poor second-surface validation of the
standards established from the Dashboard calibration corpus.

This is a structural problem rather than a product-feature problem. The
Website's public acquisition experience, localization, Early Access flow,
Turnstile verification, durable messaging contract, environment behavior,
navigation, state, styling, and content must remain stable while its
application foundation is aligned. The migration must also distinguish rules
that transfer cleanly from deferred Website debt and must not make private
production modules public merely to keep tests coupled to implementation
details.

## Solution

Align the Website workspace with the canonical frontend and Next.js
guardrails by removing `apps/website/src/`, placing the App Router and proxy at
the workspace root, and placing Website-owned localization resources under
`app/lib/i18n`. Preserve the other existing Website-owned concerns without
opportunistic redesign.

Replace the catch-all source alias and parent-relative imports with a small set
of ownership-aware absolute boundaries. Keep `tsconfig.paths.json` as the sole
TypeScript alias source. Bring private application metadata and Turborepo
inheritance into compliance while retaining the build and start wrappers that
perform real LangDrift environment and standalone-runtime orchestration.

Update every active integration, configuration, test, and documentation
consumer affected by the relocation. Preserve all observable Website and Early
Access behavior, and demonstrate that preservation through evidence tied to
the exact delivered snapshot.

## User Stories

1. As a LangDrift developer, I want the Website App Router at the application
   root, so that every Next.js application follows the promoted ownership
   standard.
2. As a LangDrift developer, I want the legacy source wrapper removed, so that
   source ownership is visible from the workspace structure.
3. As a LangDrift developer, I want the request proxy beside the root App
   Router, so that Next.js recognizes the boundary without legacy path rules.
4. As a localization maintainer, I want Website routing, request configuration,
   navigation helpers, and messages to share one Website-owned localization
   boundary, so that their ownership is explicit.
5. As a Website maintainer, I want existing components, data, state, and
   environment concerns preserved through relocation, so that a foundation
   migration does not become an application redesign.
6. As a code reader, I want absolute imports to name meaningful owners, so that
   I can navigate across concern boundaries without decoding directory depth.
7. As a code reviewer, I want parent-directory traversal eliminated from the
   Website, so that the canonical import policy has a real second-surface test.
8. As a tooling maintainer, I want one TypeScript alias source, so that compiler
   and editor behavior cannot drift between duplicate configurations.
9. As a tooling maintainer, I want aliases scoped to real owners rather than a
   source-wide catch-all, so that aliases communicate architecture.
10. As a repository maintainer, I want private application manifests to omit a
    publication version, so that package metadata reflects actual intent.
11. As a repository maintainer, I want the Website to inherit root Turbo tasks
    without redundant local copies, so that task behavior has one owner.
12. As an operator, I want the existing Website build wrapper retained, so that
    safe tracked development environment values continue to support production
    builds without overriding explicitly supplied values.
13. As an operator, I want the existing Website start wrapper retained, so that
    standalone static assets, public assets, runtime environment, host, and
    port behavior remain intact.
14. As a visitor, I want every supported locale and route to behave exactly as
    before, so that structural work is invisible to me.
15. As a visitor, I want internal links, external Docs navigation, fragments,
    locale switching, query strings, and focus behavior preserved, so that
    navigation does not regress.
16. As an Early Access visitor, I want validation, security challenges,
    submission, and feedback to remain unchanged, so that joining the list is
    not affected by foundation work.
17. As a privacy-conscious visitor, I want my entered email and security token
    to remain outside URLs, persistent browser state, shared atoms, analytics,
    and logs.
18. As an Early Access operator, I want server validation, Turnstile checks,
    durable acceptance, and environment failures to retain their current
    semantics.
19. As a cross-language contract maintainer, I want registration fixtures to
    remain owned by the events contract, so that Website tests do not silently
    fork shared validation data.
20. As an end-to-end test maintainer, I want browser assertions independent of
    private Website production modules, so that tests verify observable
    behavior rather than importing their answer from the implementation.
21. As an owner reviewing the guardrails, I want transfer results and exceptions
    traceable to acceptance evidence, so that this cycle can refine standards
    without broadening its implementation scope.
22. As an auditor, I want failed and unexecuted checks reported accurately and
    evidence bound to the final snapshot, so that cycle completion is not
    inferred from stale or partial results.

## Implementation Decisions

1. `apps/website/src/` will not exist after the migration. The Next.js `app/`
   directory and `proxy.ts` will be owned directly by the Website workspace.
2. Website-specific localization resources will be owned under
   `app/lib/i18n`. This boundary includes the next-intl routing, navigation,
   request configuration, and Website message resources needed to keep the
   existing locale contract coherent.
3. Non-localization Website concerns will retain their existing conceptual
   ownership. Relocation may change their workspace-relative position and
   imports, but will not redesign components, domain data, state, forms,
   styling, or environment semantics.
4. Imports may use `./` for local siblings and descendants. Imports that leave
   their local ownership boundary will use a meaningful absolute boundary.
   Parent-directory traversal is prohibited, including embedded traversal.
5. The existing source-wide `@/*` mapping will be removed. Alias names will be
   derived from actual Website owners rather than copied from Dashboard. The
   alias set must cover the route/application boundary, localization,
   application UI composition, supporting Website data, shared state,
   environment configuration, and intentionally shared test contracts where
   those boundaries are crossed.
6. `tsconfig.paths.json` will be the exclusive owner of Website TypeScript path
   aliases. The main TypeScript configuration will extend it and will not
   duplicate `paths` or introduce `baseUrl`.
7. The events registration fixture remains owned by `packages/events`.
   Website tests will consume that contract through an intentional,
   ownership-named test boundary without copying the fixture or using
   prohibited traversal. This specification does not prescribe whether that
   boundary is an alias, test-support export, or another minimal mechanism;
   the selected mechanism must preserve ownership and work in the real test
   runner.
8. Messaging browser tests will not import Website-private production message
   modules. They will assert observable behavior using test-owned expectations
   or an intentional test-support contract. Production Website internals will
   not be made public solely for test convenience.
9. The Website private manifest will omit `version`.
10. The Website-local Turbo configuration will be removed because its current
    task definition duplicates root behavior and supplies no meaningful local
    override.
11. The build and start wrappers will remain. The build wrapper owns LangDrift
    development-environment loading for production builds, and the start
    wrapper owns standalone server validation, asset assembly, environment
    loading, host, and port behavior. Their continued use is compliant with the
    frontend guardrail because they add project behavior.
12. Relocation-sensitive consumers will be updated together. This includes
    next-intl configuration, TypeScript and Biome configuration, unit and
    coverage globs, browser/integration tests, active product or engineering
    documentation, and any build/runtime configuration that resolves Website
    source paths. Historical research and snapshot evidence will not be
    rewritten as though it described a new snapshot.
13. The existing shared language control remains owned by the shared React
    package. Website-specific locale choices, prefixes, messages, route
    integration, focus restoration, and navigation behavior remain with the
    Website.
14. CSS will move only as needed to preserve imports and rendering. The
    migration will not classify current handwritten application CSS as a
    permanent exception and will not perform the deferred Tailwind migration.
15. Existing Jotai state and diagnostic behavior will remain functionally
    unchanged. The migration will not decompose atom ownership or reinstate a
    different logging architecture.
16. No product behavior, public content, pricing statement, environment
    contract, Turnstile rule, server-submission rule, or durable-messaging
    meaning will change under this specification.

## Guardrail Traceability

| Canonical obligation | Application in this specification | Acceptance criteria |
| --- | --- | --- |
| [Frontend ownership and public boundaries](../../.agents/guardrails/frontend.md#ownership-and-public-boundaries) | Meaningful absolute boundaries; no parent traversal; intentional test ownership | AC-06, AC-07, AC-08, AC-09 |
| [Frontend shared UI ownership](../../.agents/guardrails/frontend.md#shared-ui-ownership) | Preserve shared language control and Website-specific integration | AC-16 |
| [Frontend application configuration](../../.agents/guardrails/frontend.md#application-configuration-and-documentation) | Single alias source, private manifest metadata, meaningful Turbo overrides, justified wrappers, active documentation | AC-05, AC-10, AC-11, AC-12, AC-13 |
| [Next.js application ownership](../../.agents/guardrails/nextjs.md#application-and-route-ownership) | Root App Router and root proxy; no source wrapper | AC-01, AC-02, AC-03 |
| [Next.js navigation and server boundaries](../../.agents/guardrails/nextjs.md#navigation-and-server-boundaries) | Preserve internal/external navigation and client/server environment exposure | AC-16, AC-19 |
| [Next.js localization ownership](../../.agents/guardrails/nextjs.md#localization-ownership) | Website resources under `app/lib/i18n` with unchanged locale behavior | AC-04, AC-15, AC-16 |
| [Tailwind application styling](../../.agents/guardrails/tailwind.md#application-styling-and-integration-surfaces) | Preserve current integration only; defer application CSS migration | AC-17, AC-22 |
| [Jotai state lifetime and inspectability](../../.agents/guardrails/jotai.md#state-lifetime-and-ownership) | Preserve state behavior; defer decomposition | AC-18, AC-22 |
| Evidence and workflow contracts | Required checks and snapshot-bound evidence; no false pass | AC-20, AC-21, AC-23 |

Component-per-file, named props interfaces, hook extraction, broad route
composition, Tailwind conversion, and Jotai decomposition remain canonical
standards where applicable, but their current Website violations are not
acceptance targets for this structural specification.

## Acceptance Criteria

### Structure and ownership

- **AC-01:** `apps/website/src/` does not exist in the delivered snapshot, and
  no active Website configuration or documentation resolves source through it.
- **AC-02:** the Website App Router exists directly under the workspace root,
  and a production Next.js build discovers and builds its current localized
  home and pricing routes.
- **AC-03:** `proxy.ts` exists at the Website workspace root and next-intl
  routing through the proxy preserves the current matcher and locale behavior.
- **AC-04:** Website-owned next-intl configuration and message resources are
  under `app/lib/i18n`, and every active next-intl configuration reference
  resolves to that boundary.
- **AC-05:** the Website TypeScript configuration extends
  `tsconfig.paths.json`; all Website aliases are declared only in that file;
  the extending configuration declares neither `paths` nor `baseUrl`.
- **AC-06:** no `@/*` source catch-all remains in Website configuration or
  source imports. Every introduced alias maps to a named ownership boundary
  rather than the entire application source tree.
- **AC-07:** Website source and test modules contain no direct, nested, or
  embedded parent-directory traversal imports. Scoped Biome enforcement passes
  without suppressing the canonical rule.
- **AC-08:** the registration fixture used by Website validation tests remains
  owned by the events contract, has not been copied into Website, and is
  consumed through an intentional boundary that resolves in typecheck and the
  test runner without prohibited traversal.
- **AC-09:** messaging browser tests do not import private Website production
  message modules and do not use prohibited traversal to obtain Website-private
  source. Their assertions still cover localized challenge failure behavior.

### Configuration and integration

- **AC-10:** the Website private manifest has no `version` field and retains its
  private package identity and existing dependency contract.
- **AC-11:** the redundant Website-local Turbo configuration is absent, and the
  Website's development, build, typecheck, and start tasks inherit the intended
  root task graph.
- **AC-12:** the Website build and start scripts continue invoking the existing
  LangDrift wrappers. A production build and standalone start smoke prove the
  current environment-loading and asset-assembly behavior still works.
- **AC-13:** every active integration, test, coverage, enforcement, build,
  runtime, and documentation path affected by relocation resolves correctly.
  Historical research and old snapshot evidence remain historical rather than
  being silently rewritten.
- **AC-14:** Website typecheck and production build pass using the repository's
  supported Node and package-manager contract.

### Behavioral equivalence

- **AC-15:** the supported locale set, default locale, locale prefixes,
  disabled locale detection, disabled locale cookie, localized home routes,
  and localized pricing routes are behaviorally equivalent before and after
  relocation.
- **AC-16:** metadata, canonical links, language alternates, internal links,
  external Docs navigation, fragment navigation, query/hash preservation,
  language-switch behavior, drawer closure, and focus restoration remain
  behaviorally equivalent.
- **AC-17:** the rendered Website retains its current styles, theme behavior,
  assets, and content. No Tailwind migration or visual redesign is included.
- **AC-18:** existing Website local state, shared Jotai state, form state, and
  development inspectability retain their current observable behavior.
- **AC-19:** Early Access client validation, server validation, Turnstile
  verification, submission mapping, durable acceptance, user feedback,
  environment failure behavior, and server-only/client-safe configuration
  boundaries remain unchanged. Email and challenge data remain absent from
  URLs, browser persistence, shared atoms, analytics, and logs.

### Evidence and gates

- **AC-20:** relevant Biome guardrail fixtures, configuration checks, scoped
  Website lint, and formatting/import-organization checks pass for the final
  snapshot.
- **AC-21:** all agreed repository-wide doctor, lint, typecheck, and build
  checks are executed for the final snapshot, and every initiative-scoped
  required check passes. Any repository-wide failure caused or worsened by
  this initiative blocks completion. An out-of-scope failure may be classified
  as an external pre-existing blocker only when it is reproduced against the
  approved baseline and evidence demonstrates that this initiative neither
  caused nor worsened it. Such a failure remains reported as a failed check and
  is never represented as passing, but a proven external pre-existing failure
  does not by itself prevent this initiative from reaching `gates-complete`.
  Unresolved provenance, including an inability to establish whether the
  initiative caused or worsened a failure, remains blocking.
- **AC-22:** existing Early Access unit and coverage checks pass. Existing
  integration and browser proofs relevant to Website routing, submission,
  privacy, localized failure feedback, and durable messaging pass wherever the
  repository harness supports them. An unavailable required environment leaves
  the corresponding gate unpassed rather than inferred.
- **AC-23:** review and audit evidence records the resolved base, final `HEAD`,
  and working-tree status. Every claimed pass applies to that exact snapshot;
  failed or unexecuted checks are named as such, and any later material edit
  invalidates affected evidence.

## Testing Decisions

1. Prefer the highest existing seam. The primary behavioral proof is a built
   and started Website exercised through its public localized routes and the
   existing Early Access browser/integration flow. Tests should observe routes,
   navigation, rendered feedback, environment failure, durable acceptance, and
   privacy outcomes rather than private module layout.
2. Use narrow static seams for obligations that are structural by definition:
   filesystem layout, TypeScript inheritance, alias ownership, manifest
   metadata, Turbo inheritance, path references, and prohibited imports.
3. Use the installed Biome guardrail fixture suite as prior art for mechanical
   import enforcement. Passing Biome is necessary but does not replace review
   of whether an alias names a meaningful owner.
4. Use the existing Website TypeScript command and production Next.js build to
   prove that moved modules, generated types, next-intl configuration, server
   boundaries, and shared package imports resolve together.
5. Use the existing Early Access Vitest suite and coverage thresholds as prior
   art for validation, action, environment, Turnstile, mapping, and form
   behavior.
6. Use the existing Playwright registration flow and runtime proof as prior art
   for localized browser behavior, no-JavaScript behavior, privacy, durable
   storage, event identity, and provider identity. Browser expectations must
   not import their answer from private production messages.
7. Exercise the existing standalone start wrapper after a production build so
   the wrapper exception is validated through behavior rather than merely
   preserved in package metadata.
8. Run repository-level checks because root Vitest, Biome, documentation, or
   other shared configuration may change even though the primary product scope
   is Website.
9. Bind review and audit reports to the exact final snapshot. Raw command output
   is supporting evidence, not a reviewed report by itself.

## Out of Scope

- Finishing Website Early Access or adding Early Access features.
- Changing email submission, validation, Turnstile, durable messaging,
  environment-variable, navigation, localization, or content semantics.
- Component-per-file remediation, props-interface cleanup, or custom-hook
  extraction.
- Full CSS-to-Tailwind migration, broad CSS cleanup, or visual redesign.
- Jotai domain decomposition, atom redesign, or a new diagnostic architecture.
- Broad App Router composition or component-tree refactoring.
- Broad accessibility or Core Web Vitals remediation.
- Dashboard changes or copying Dashboard-specific folders and aliases.
- General repository cleanup unrelated to Website relocation.
- Commit, push, pull request, merge, release, deployment, or publication.

## Further Notes

- The approved Planning result is the authoritative input for this version.
- Baseline at specification time is merge commit
  `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2` with a clean working tree before
  this spec was added.
- Baseline Website TypeScript passes. Six Early Access test files with 42 tests
  pass. Scoped Website Biome lint reports 93 errors, all from the canonical
  parent-traversal restriction. These are baseline observations, not delivery
  evidence.
- The Website production build and runtime smoke were not run during Planning
  or specification and are not represented as passing.
- No vocabulary update, ADR, PRD, or separate technical design is required for
  this reversible structural migration.
- `ready-for-agent` is a triage label only. Approval remains unset until the
  owner approves this exact version, and no tickets or implementation are
  authorized by this spec's existence.
