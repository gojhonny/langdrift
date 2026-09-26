# Frontend Standards Extraction — evidence and promotion record

Status: the owner approved canonicalization after the initial extraction. The [canonicalization record](#canonicalization-record) below records the approved resolutions, promoted destinations, held scope and verification. Canonical policy lives in [.agents/guardrails/](../../.agents/guardrails/README.md) and the accepted mechanical configuration, not in this research file. The remaining Dashboard validation set has not been refactored.

The extraction sections below preserve the earlier snapshot and conclusions, including their then-pending approval and unresolved questions. They are historical evidence, not a second active policy or a claim that approval is still missing. Subsequent owner resolutions and runtime verification take precedence as recorded at the end.

## Snapshot and provenance

Inspected on 2026-09-26, with dirty-source hashes captured at `2026-09-26T09:29:23.669Z`.

| Item | Resolved value |
| --- | --- |
| Branch | `refactor/dashboard-organization` |
| Calibration base | `fb55651d7743aa45407e47ec85452c045a2740b0` |
| First manual-era slice | `fb8762c5229d4c70cee3f11ef14f43b430e3fd9d`, parent is the base |
| Second manual-era slice | `5769cbe29e0b85baa322e2a7ca7eeb92e8fde98a`, parent is the first slice |
| HEAD / subsequent assisted slice | `715ec372d04979d9e7df0beaf15e3243a4363057`, parent is the second slice |
| Owner work after HEAD | 12 modified tracked Dashboard files and four untracked formatter files; no staged Dashboard changes |
| Dashboard corpus | 147 tracked files plus four untracked formatter files |

The base is resolved from the actual parent chain, not guessed from a branch name. `fb55651..5769cbe` isolates the two earlier organization/Tailwind slices. `5769cbe..715ec37` isolates the later atom/domain, quality, i18n, and route-state implementation. The conversation records that later implementation as agent-assisted and then committed under the owner's identity. Therefore commit author/committer names do **not** establish manual implementation provenance. The owner's current request identifies the working corpus as manually refactored, but Git alone cannot prove the editing process behind every line in the two earlier slices.

Confidence: high for paths, diff boundaries, current edits, and known assisted work; medium for attributing every changed line in the two earlier slices to unaided manual work. A moved file is evidence of a placement decision, not independent evidence endorsing every inherited implementation detail. A file containing a new owner comment is evidence of that comment's intent, not approval of the surrounding assisted or legacy body.

Primary evidence: the owner request and preceding implementation conversation; `git log -8 --format='%H %P %s'`; rename-aware `git diff --find-renames=25% --name-status fb55651 5769cbe -- apps/dashboard`; the corresponding `--numstat` and `--unified=0` diffs; `git diff --name-status 5769cbe HEAD -- apps/dashboard`; and current [AGENT_NOTES.md](/Users/sky/code/langdrift/apps/dashboard/AGENT_NOTES.md).

## Exact corpus map

Paths in this section are relative to `apps/dashboard/`. Brace notation enumerates the exact members, not an open-ended recommendation. These categories account for all 147 tracked current files: 31 earlier-slice files unchanged by the assisted commit, seven mixed files changed by that commit, 107 assisted additions, and two unchanged legacy files. Dirty edits are overlaid separately below.

### Earlier-slice files not subsequently changed by the assisted commit — 31

| Current path(s) | Original path / change | What the evidence supports |
| --- | --- | --- |
| `.env.development`, `Dockerfile`, `README.md` | Same paths, edited in `fb8762c` | Local edits and explicit comments. Environment values were not used as standards evidence. Dockerfile retains commented alternatives and is unfinished evidence. |
| `AGENT_NOTES.md` | Added in `fb8762c`, amended in `5769cbe` | Twelve explicit owner directives, not implementation completion. |
| `app/(menu)/{decisions,evidence,evolution,overview,people,reports,settings}/page.tsx` — seven | `src/app/<same-route>/page.tsx` | Route-group move and one import-line replacement per file across the base-to-second-slice diff. Component bodies are inherited. |
| `app/(evolution)/{drift-by-product-area,drift-by-team,drift-events,drift-graph,drift-timeline,intentional-drift,unexplained-drift,vision-baseline}/page.tsx` — eight | `src/app/<same-route>/page.tsx` → `app/<same-route>/page.tsx` → grouped location | Route-group move and one import-line replacement each. Component bodies are inherited. |
| `app/(reports)/drift-report/page.tsx` | `src/app/drift-report/page.tsx` → `app/drift-report/page.tsx` → grouped location | Same move/import-only history; current dirty change adds a metadata directive only. |
| `app/page.tsx` | `src/app/page.tsx` | Exact-content move; redirect body is legacy. |
| `app/favicon.ico` | `public/favicon.ico` | Exact binary move. Not a style sample. |
| `app/globals.css` | Replacement for the old `src/app/globals.css` and old auxiliary application stylesheets | Five integration/import statements. |
| `app/lib/template/classes/{app,base,dark,root,theme}.css` — five | Added in `5769cbe` | Tailwind integration, theme-variable mapping, and retained CSS rules. These still require comparison with the closed CSS exception; presence alone does not settle acceptability. |
| `app/lib/components/index.ts` | Added in `5769cbe` | Explicit local re-export of DashboardShell. |
| `app/lib/template/ui.tsx` | Added in `5769cbe` | `cx`, Card, Kicker, and Muted implementations; current owner comments explicitly reject their present placement/ownership and custom helper. |
| `tsconfig.json` | Same path | Removed inline paths and added `extends: './tsconfig.paths.json'`. |

Representative current sources: [Overview page](/Users/sky/code/langdrift/apps/dashboard/app/(menu)/overview/page.tsx), [Evolution detail page](/Users/sky/code/langdrift/apps/dashboard/app/(evolution)/drift-by-team/page.tsx), [root redirect](/Users/sky/code/langdrift/apps/dashboard/app/page.tsx), [global styles](/Users/sky/code/langdrift/apps/dashboard/app/globals.css), [template UI](/Users/sky/code/langdrift/apps/dashboard/app/lib/template/ui.tsx), and [TypeScript configuration](/Users/sky/code/langdrift/apps/dashboard/tsconfig.json).

### Mixed earlier/assisted current files — seven

| Current path | Earlier path / region | Later assisted change |
| --- | --- | --- |
| `app/layout.tsx` | `src/app/layout.tsx`; shell location/CSS integration changed | i18n provider, locale/metadata lookup, reduced-motion body class. Current owner props rewrite is a third layer. |
| `app/lib/components/dashboard-shell/dashboard-shell.tsx` | `src/app/dashboard-shell.tsx` → `app/_lib/components/dashboard-shell/dashboard-shell.tsx`; atom consumption and Tailwind rendering changes | i18n, client navigation, dialog semantics, voice lifecycle and accessibility changes. |
| `app/lib/views/dashboard-view/dashboard-view.tsx` | `src/app/dashboard-view.tsx` → `app/_lib/views/dashboard-view/dashboard-view.tsx`; atom consumption and broad Tailwind conversion | i18n fixtures/text, selected-control semantics, classification classes, Settings language control, page gate. Current edits add directives only. |
| `app/lib/views/index.ts` | Added at `app/_lib/views/index.ts`, moved into `lib` | Removed domain-type re-export. |
| `next.config.ts` | Commented out standalone output in `fb8762c` | Security headers and next-intl integration. |
| `package.json` | Framework commands and Zustand-to-Jotai dependencies changed | Added next-intl only. Private version/icon duplication remain comparison evidence, not accepted practice. |
| `tsconfig.paths.json` | Reformatted and redefined meaningful aliases without baseUrl | Added atoms/domain/i18n/components aliases. |

The shell's base-to-second-slice similarity is 48% (171 added / 98 removed lines); the view's is 44% (350 added / 206 removed). These are substantial edits but not clean rewrites of all architecture. Current [DashboardShell](/Users/sky/code/langdrift/apps/dashboard/app/lib/components/dashboard-shell/dashboard-shell.tsx) and [DashboardView](/Users/sky/code/langdrift/apps/dashboard/app/lib/views/dashboard-view/dashboard-view.tsx) must be read region by region.

### Assisted additions — 107

| Exact set | Count | Evidence treatment |
| --- | ---: | --- |
| `app/{default,error,loading,not-found}.tsx`, and the same four filenames beside each of the 16 grouped `page.tsx` files enumerated above | 68 | Owner-requested, assisted route scaffolding. Repetition is generated consistency, not 68 independent manual decisions. Root loading has a new owner import comment. |
| `app/global-error.tsx` | 1 | Assisted root error boundary, now annotated by the owner. |
| `app/lib/components/dashboard-shell/{dashboard-shell.test.tsx,overlay-dialog.tsx}` | 2 | Assisted tests and modal mechanism. |
| `app/lib/components/route-state/{dashboard-not-found.tsx,dashboard-page-gate.tsx,dashboard-page-skeleton.tsx,dashboard-route-error.tsx,route-state.test.tsx}` | 5 | Assisted route presentation and tests. The current one-second delay is an explicit slice choice, not inferred frontend policy. |
| `app/lib/i18n/{actions.ts,config.ts,language-settings.tsx,locale.test.tsx,request.ts,route-state.messages.ts,shell.messages.ts,messages/en.ts,messages/index.ts,messages/ja.ts,messages/pt-br.ts,messages/zh-hant.ts}` | 12 | Assisted localization, with explicit owner annotations now in request.ts. |
| `app/lib/state/atoms/{account-menu-open,classification,group-by,notifications-open,product-menu-open,range,select-product,selected-point,selected-product,theme,voice-open}.atom.ts`, plus `index.ts` | 12 | Assisted extraction of existing atom declarations/actions. Owner has now annotated primitive Immer use and client directive placement. |
| `app/lib/state/domain/{dashboard-locale,dashboard-range,dashboard-section,dashboard-theme,evolution-classification,evolution-group}.domain.ts`, plus `index.ts` | 7 | Assisted extraction/addition of domain declarations, now partially annotated/edited by owner. |

The superseded `app/lib/state/{state.ts,state-logger.tsx}` originated in the earlier manual-era state migration (via `app/state.ts` and `app/state-logger.tsx`). Both were removed by the assisted commit after atom extraction and the explicit request to remove logs. Their removal is not evidence against all development inspectability.

### Untouched current legacy files — two

`postcss.config.mjs` and `turbo.json` have no changes in either slice range or the current worktree. Use only as comparison/validation evidence. In particular, the local [turbo.json](/Users/sky/code/langdrift/apps/dashboard/turbo.json) still exists despite AGENT_NOTES item 7; its presence is not a decision to duplicate root configuration.

Historical deletions also include `src/.gitkeep`, `public/.gitkeep`, the old `src/app/favicon.ico`, and old `src/app/{globals,polish,product-experience,responsive}.css`; these support removal/relocation analysis rather than current implementation samples.

## Mixed-file region map

The counts below come from current-worktree `git blame -M -C --line-porcelain`; M = lines attributed to either earlier slice, A = known assisted commit, L = pre-base legacy, D = uncommitted owner work. Counts include whitespace and are **textual lineage**, not percentages of manual engineering effort, standards quality, or proof of authorship. Copy/move heuristics can change attribution. Reproduce with the command against the named frozen hashes before using exact line locations.

| File / current region | Lines | M | A | L | D |
| --- | --- | ---: | ---: | ---: | ---: |
| shell imports/constants | 1–68 | 10 | 6 | 52 | 0 |
| DashboardNavigation | 69–185 | 39 | 19 | 59 | 0 |
| DashboardShell | 186–542 | 100 | 128 | 129 | 0 |
| view imports/constants | 1–45 | 13 | 11 | 16 | 5 |
| useVisionPoints | 46–146 | 1 | 97 | 3 | 0 |
| Heading | 147–163 | 13 | 3 | 1 | 0 |
| ClassificationPill | 164–184 | 16 | 3 | 2 | 0 |
| VisionPanel | 185–269 | 35 | 31 | 19 | 0 |
| MovementList | 270–318 | 32 | 7 | 10 | 0 |
| Attention | 319–356 | 25 | 13 | 0 | 0 |
| Overview | 357–425 | 51 | 16 | 2 | 0 |
| Fact | 426–434 | 9 | 0 | 0 | 0 |
| BaselineProvenance | 435–467 | 19 | 14 | 0 | 0 |
| EvolutionControls | 468–528 | 26 | 13 | 22 | 0 |
| GroupedEvolution | 529–627 | 63 | 20 | 16 | 0 |
| Evolution | 628–638 | 0 | 0 | 11 | 0 |
| Decisions | 639–694 | 34 | 13 | 9 | 0 |
| People | 695–738 | 38 | 6 | 0 | 0 |
| Reports | 739–781 | 27 | 16 | 0 | 0 |
| Evidence | 782–829 | 36 | 12 | 0 | 0 |
| Settings | 830–865 | 16 | 11 | 9 | 0 |
| LegacyEvolution | 866–876 | 1 | 0 | 9 | 1 |
| DashboardView dispatch | 877–905 | 2 | 2 | 25 | 0 |

Thus the monolithic dispatch, legacy classification write during render, inherited props patterns, and assisted localization hook are not independent positive examples of the owner's preferred composition. The new comments explicitly identify several as unfinished.

## Current owner delta — exact overlay

| File (under `apps/dashboard/`) | New evidence relative to HEAD |
| --- | --- |
| `app/(reports)/drift-report/page.tsx` | Per-page metadata comment; body unchanged. |
| `app/global-error.tsx` | Named props/interface and Next Link comments; body unchanged. |
| `app/layout.tsx` | Named `RootLayoutProps` interface, `props` parameter, body destructuring, spacing changes; six AGENT directives. Translation variable `t` remains explicitly marked for change. |
| `app/lib/i18n/request.ts` | Import grouping spacing and async optional-chain directive; expression remains unchanged. |
| `app/lib/state/atoms/account-menu-open.atom.ts` | Immer-only-for-complex-state directive; primitive still uses Immer. |
| `app/lib/state/atoms/group-by.atom.ts` | No-client-directive-needed comment; directive still present. |
| `app/lib/state/domain/dashboard-section.domain.ts` | Filesystem-routing ownership comment; union still present. |
| `app/lib/state/domain/dashboard-theme.domain.ts` | Added `'system'` to union; no corresponding behavior change in this delta. |
| `app/lib/state/domain/evolution-classification.domain.ts` | Enum preference comment; union still present. |
| `app/lib/template/ui.tsx` | `cn`, component file placement, shared-vendor/base ownership directives; body unchanged. |
| `app/lib/views/dashboard-view/dashboard-view.tsx` | One component/file, hook suffix, ambiguous one-comment/file, and composition directives; body unchanged. |
| `app/loading.tsx` | Root-level import via public alias directive and commented example; deep import remains. |
| `app/lib/template/formatters/cn.fmt.ts` | New untracked `clsx` + `tailwind-merge` formatter. |
| `app/lib/template/formatters/currency.fmt.ts` | New untracked `Intl.NumberFormat` formatter. |
| `app/lib/template/formatters/ms-to-time.fmt.ts` | New untracked duration formatter. |
| `app/lib/template/formatters/to-initials.fmt.ts` | New untracked initials formatter. |

Source links: [layout](/Users/sky/code/langdrift/apps/dashboard/app/layout.tsx:28), [i18n request](/Users/sky/code/langdrift/apps/dashboard/app/lib/i18n/request.ts:4), [atom directive](/Users/sky/code/langdrift/apps/dashboard/app/lib/state/atoms/account-menu-open.atom.ts:3), [classification directive](/Users/sky/code/langdrift/apps/dashboard/app/lib/state/domain/evolution-classification.domain.ts:7), and [formatter directory example](/Users/sky/code/langdrift/apps/dashboard/app/lib/template/formatters/cn.fmt.ts).

## Explicit-comment collection coverage

The current Dashboard has **29 `AGENT:` markers across 15 files**, plus **12 numbered AGENT_NOTES directives**. The count is marker occurrences, not independent standards: several overlap and some describe unresolved work. `AGENT_NOTES` itself asks for eventual removal after the cycle; it is retained during extraction.

| File | Marker lines | Topics, without promotion |
| --- | --- | --- |
| `.env.development` | 2 (continued on 3) | Keep SSO URL server-side; unused setting to remain commented. Only comment text was inspected for this evidence. |
| `Dockerfile` | 24, 38, 50 | Commented build alternatives, Dashboard environment placement, start command. |
| `README.md` | 3 | Product-oriented documentation. |
| `next.config.ts` | 20 | Question/intent about standalone output. |
| `app/(reports)/drift-report/page.tsx` | 3 | Route metadata. |
| `app/global-error.tsx` | 6, 31 | Props typing; Next Link. |
| `app/layout.tsx` | 10, 11, 28, 35, 38, 43 | Descriptive names; await spacing; props interfaces; body destructuring; props-first placement; return spacing. |
| `app/loading.tsx` | 1 | Root-level public import entry. |
| `app/lib/i18n/request.ts` | 4, 11 | Import-group spacing; explicit async response handling. |
| `app/lib/state/atoms/account-menu-open.atom.ts` | 3 | Immer for complex types. |
| `app/lib/state/atoms/group-by.atom.ts` | 1 | Atom client directive. |
| `app/lib/state/domain/dashboard-section.domain.ts` | 19 | Filesystem owns pages, not section-injected dispatch. |
| `app/lib/state/domain/evolution-classification.domain.ts` | 7 | Enum rather than this union. |
| `app/lib/template/ui.tsx` | 3, 8, 9 | Shared `cn`; single component files; generic UI ownership. |
| `app/lib/views/dashboard-view/dashboard-view.tsx` | 3, 4, 6, 876 | Component/hook separation; ambiguous comment restriction; compositional pages/layouts. |

## Dirty-source SHA-256 snapshot

Hashes bind the extraction to the owner's uncommitted evidence. No environment values, credentials, or personal data are included.

| Path under `apps/dashboard/` | SHA-256 |
| --- | --- |
| `app/(reports)/drift-report/page.tsx` | `27d2e5c886b448f4aed3044937d14675bdd7186b6902a57614fcb1b3f0131827` |
| `app/global-error.tsx` | `52be0fffedb9c959c8de73978b9e23a3aa4f205a5626b9e73596199e2a88757e` |
| `app/layout.tsx` | `f20383e8e032c306e4919a14a9dabfa8e176b826adf375c8b37fd4ce5dfabef1` |
| `app/lib/i18n/request.ts` | `183ae6afcc8858e3b187304f49ce34ad9b0404132364e6ff4b85a513b342bcea` |
| `app/lib/state/atoms/account-menu-open.atom.ts` | `15f34116052ab2c165f202dea4c70f1d773d52ce8f4c9836eaed432e32808b35` |
| `app/lib/state/atoms/group-by.atom.ts` | `e7493c01e1ae96026ff0faaff661428d21a18745ced9306c8a572e9786fbcd6e` |
| `app/lib/state/domain/dashboard-section.domain.ts` | `28be8a2546fdfc80d3652569c8dedb2c34536f2cf6c6f5c0da9029b5df0e0a34` |
| `app/lib/state/domain/dashboard-theme.domain.ts` | `68966689f02facaae9631fe49e89c3703b1563d67695d1661f06f3fcaf97cd84` |
| `app/lib/state/domain/evolution-classification.domain.ts` | `bc273ae455594c93fed18cd816d01c01d919188e11a1cb77044395e18992d3a0` |
| `app/lib/template/ui.tsx` | `bd22d9d63268cbb82996a55876e9a18881f0b550943ea95b5b15d2178d601c67` |
| `app/lib/views/dashboard-view/dashboard-view.tsx` | `21e4aa40761dfe5f6b95d597f198cff6e26a7efdf188edb5244b2fbfd1039c9d` |
| `app/loading.tsx` | `258cbd354be8036b0fe827cd1dc9b45ee6e323c1d0b6a413bd9760fc8d4076ef` |
| `app/lib/template/formatters/cn.fmt.ts` | `89a866c9dde83eff89b3d514ab27ed765205c0de489f2bc981a3f61d80fff172` |
| `app/lib/template/formatters/currency.fmt.ts` | `12076632d11dd4ca9f2b91b74385934d635f29b1e7b4ff2659a0fa914d7c3448` |
| `app/lib/template/formatters/ms-to-time.fmt.ts` | `4c8c85a3fd6fae705003d803497e35c0a4935183e241cd69c727a69925623ff0` |
| `app/lib/template/formatters/to-initials.fmt.ts` | `7d56413484ae6a0ce71ae9073c1390ee307db6410d01f332f3863d2478b0fe4c` |

## Research limits

The provenance investigation used local primary evidence only. The separate tooling-capability lookup consulted official Biome documentation, but the installed schema and read-only probes govern the version-specific assessment below; external style guides did not supply candidate standards. Neither investigation read `.drifts/`, modified production code, ran build/runtime checks, or performed Git mutations. Existing audit reports bind earlier snapshots and do not certify these dirty edits. The “85% complete” estimate is owner context, not a measured code-completeness percentage. Repeated code from a shared legacy ancestor or generated assisted scaffold does not count as independently refactored examples.

## Candidate inventory — initial extraction

There are **40 entries**: 12 general frontend, six Next.js, three Tailwind, seven conditional Jotai, seven tooling/mechanical, one architectural hold, and four unresolved interpretations. This is an inventory for owner approval, **not 40 accepted standards**.

Each category is supplied by its section heading. Each row records the name, principle, application context, concrete evidence, rejected behavior, confidence, owner-approval status, and proposed destination. Evidence references `E01–E29` and `N01–N12` resolve in the coverage ledger below. The closed decisions are from the current extraction brief; earlier slice-specific approvals are identified separately.

Confidence measures support for the stated candidate, not implementation completeness. **High** generally means an explicit current decision or clear directive, **medium** means a bounded observation or earlier local approval, and **low** means unresolved interpretation. Owner status distinguishes **closed**, **explicit intent**, **Dashboard-only approval**, **observation only**, and **unresolved**. Explicit intent does not mean that the owner has approved promotion into a canonical standard. **Promotion approval is pending for every entry.**

### General frontend — F01–F12

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| F01 — Ownership-aware imports | When leaving a local ownership boundary, use a meaningful absolute import. Permit `./` for local siblings/descendants; prohibit all parent traversal. Alias vocabulary remains developer-owned. | Current closed imports decision; N03; manual-era page imports changed to `@views`; local coordinated atom imports use `./`. | `../` at any depth; one prescribed alias vocabulary; treating every descendant as local regardless of ownership. The root layout's deep `./lib/components/...` is a validation target, not automatic approval. | High; **closed**. | `frontend.md` for boundary meaning; `biome.json` for the parent-traversal prohibition only. U02 separately holds public-entry granularity. |
| F02 — Explicit component props contract | For components with props, declare a named props **interface**, receive a `props` argument, then destructure at the start of the body. Keep props contracts local unless they have a real shared owner. | Actual dirty `RootLayoutProps` and `RootLayout(props)` rewrite; E09–E11, E18. | Anonymous object annotations, props object type aliases, destructuring in the function parameter. Most legacy view components remain counterexamples. | High; **explicit intent**, with a current manual positive example. | `frontend.md`; existing Biome interface rule covers only part. M07 owns whitespace, not a duplicate props rule. |
| F03 — One component per file, colocated by concern | When authoring/extracting components, put each component in its own file and colocate related components. Dashboard-owned custom components belong under its `app/lib/components`; do not turn that local folder spelling into a cross-framework layout mandate. | E13, E25; existing DashboardShell module placement supports colocation but still contains two components. | Multi-component `dashboard-view.tsx`, `template/ui.tsx`, and shell files. Generated route-state modules are not positive manual exceptions. | High for intent, limited realization; **explicit intent** (“no exceptions”). | `frontend.md`. A component-aware checker would be custom, not an existing Biome component-count rule. |
| F04 — Independently navigable hooks | When extracting a custom hook, give it its own `.hook.ts` file; related hooks may be siblings. | E14; `useVisionPoints` remains embedded in the view and is predominantly assisted code. No completed Dashboard `.hook.ts` example yet. | A hook hidden in a many-component view; inferring approval from the existing embedded hook. | High for intent, unvalidated implementation; **explicit intent**. | `frontend.md`; suffix enforcement is possible after the hook-file scope is settled. |
| F05 — Compose responsibilities at their owner | For pages/views that combine independently meaningful UI responsibilities, compose those responsibilities rather than grow one component selected by a page/mode discriminator. | E16 explicitly requests composition of the page gate and heading; the current section-dispatch body is mostly legacy, not a manual positive sample. | One central view owning all pages behind an injected section value. This is **not** a ban on dependency injection, render props, polymorphic primitives, or ordinary configurable components. | High for this problem, medium for broader reuse; **explicit intent**. | `frontend.md`; N02 supplies the narrower Next.js application, without repeating this principle. |
| F06 — Shared ownership of generic UI | When UI is a generic base primitive, use the shared `packages/react` surface, with SmoothUI/shadcn-based building blocks where appropriate; keep app-specific compositions in the app. | E25–E26 reject app-local Card/Kicker/Muted bases and name the shared owner; earlier skeleton/language requests also chose `packages/react`. | Rebuilding generic visual primitives in each app or moving app business composition into the shared package merely because it is a component. | High; **explicit intent**, corroborated by earlier slice requests. | `frontend.md`. No new shared-component API or vendor migration is authorized by this inventory. |
| F07 — One shared icon identity | When React surfaces use the shared icon family, the icon dependency and exported access should be owned by `packages/react`. | N09 explicitly identifies duplicated `@phosphor-icons/react` dependency in Dashboard. The duplicate remains in the current manifest. | App-by-app direct icon dependencies or competing icon identities. | High; **explicit intent**, not yet implemented in this corpus. | `frontend.md`; manifest/import checks could enforce the accepted boundary. |
| F08 — Types follow domain ownership | Move reusable business/domain concepts out of component files to their domain owner. Keep props and types derived solely from local props in the defining component; preserve package-owned types. Use type-only imports for domain contracts. | Earlier explicitly approved atom/domain plan; extraction of DashboardTheme/Range, EvolutionClassification/Group; retained ownership of VisionPoint, VisionDriftEvent, AgentOrbState. These extractions were assisted, not repeated manual discoveries. | Domain-shaped declarations hidden in components; exporting domain types through a view barrel; moving every local type into a global bucket. | Medium for generalization; **Dashboard-only approval**. | `frontend.md` candidate. Exact `domain/`, `@domain`, one declaration per `.domain.ts` file remain approved slice mechanics, not yet universal architecture. U03 holds enum scope. |
| F09 — Descriptive bindings | In authored frontend code, use descriptive variable names rather than one-letter bindings. | E07 rejects translation binding `t`; new formatters use names such as `totalSeconds`, `minutes`, `seconds`, and `word`. | `t` remains in root metadata and assisted localization code. Its prevalence does not override the new directive. | High; **explicit intent**. | `frontend.md` for readability; `biome.json` may cover selected identifier-length constraints. Descriptiveness is reviewable, not a regex guarantee. |
| F10 — Explicit async result handling | In statements that await a response, receive the result and make missing/invalid-result handling explicit with a conditional before continuing. Do not combine optional chaining into that await statement. | E23 identifies `(await cookies()).get(...)?.value` as a negative example. | Optional chaining obscuring the async response boundary. Do not reinterpret this as “all optional chaining is forbidden” or “every absent cookie must throw”; the existing locale fallback is application behavior. | High for the directive, unvalidated rewrite; **explicit intent**. | `frontend.md`; whole-statement AST checking would be needed for the syntactic portion. |
| F11 — Product-oriented app documentation | When documenting an app, explain what the surface does and its product role; stack facts should support that explanation rather than substitute for it. | E02; the Dashboard README was edited in the earlier slice and explains its product role. | A boilerplate app README that only lists framework/tooling. Do not promote fixture metrics or illustrative product formulas as engineering standards. | High; **explicit intent** and manual-era implementation. | `frontend.md`. |
| F12 — Explicit public module exports | When a module offers a public barrel, export its intended symbols explicitly by name and retain ownership of the exported concerns. | Manual-era `components/index.ts` and `views/index.ts`; explicit named atom/domain barrels were also required by the earlier Dashboard plan. | Accidental public API expansion through indiscriminate wildcard exports; view barrels becoming domain owners. | Medium; **Dashboard-only approval**, supported by two manual-era module entries. | `frontend.md` candidate. This does not settle which consumers must use a bare alias; see U02. |

### Next.js — NJS01–NJS06

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| NJS01 — App Router at the workspace root | For a LangDrift Next.js application, use `app/` directly under its workspace; no `src/` wrapper. | N01 and current closed decision; manual-era move from `src/app` into `app`, then route groups. | Restoring `src/app` from a template or an external guide. | High; **closed**, implemented. | `nextjs.md`; a scoped filesystem check is deterministic. |
| NJS02 — Filesystem-owned route identity | In the App Router, let route files own page identity and compose their page/layout UI. Apply F05 here without encoding the whole route system as an injected section type. | E27 on DashboardSection; E16 on DashboardView; route-group placement is manual-era evidence, while route bodies/dispatcher remain legacy. | Route files that merely inject a section value into a universal page switch. Do not ban every finite navigation or section-title model: their actual non-routing uses still need inspection during validation. | High for intent, implementation pending; **explicit intent**. | `nextjs.md`, referencing F05 rather than duplicating the general composition rule. |
| NJS03 — Page-specific metadata | When a route represents a distinct page, give it appropriate page-specific metadata rather than relying only on a generic root title/description. | E17 in `drift-report/page.tsx`; current route body still has no metadata. | All pages presenting the same generic identity; confusing shared root metadata with sufficient page identity. | High; **explicit intent**, not yet realized in the marked route. | `nextjs.md`. Content relevance remains human-reviewed even if export presence is checked. |
| NJS04 — Framework navigation for internal destinations | For ordinary internal Next.js navigation, use Next Link. Treat external links, fragment skip links, and deliberate full-document recovery as distinct contexts rather than banning anchors globally. | E19 asks to replace the internal Overview anchor in global-error; prior approved quality work requested internal client navigation. Existing assisted shell links corroborate behavior, not manual authorship. | Ordinary internal navigation implemented as a reload anchor. The global-error recovery case remains a local behavior test before changing it, not grounds to ignore the owner's directive. | High for normal navigation; **explicit intent** plus earlier slice approval. | `nextjs.md`; import/JSX checks can flag candidates but cannot infer every intentional recovery case. |
| NJS05 — App-owned i18n, shared language control | For a localized app, keep app-specific localization resources under its root `app/lib/i18n` and consume the common language-control component from `packages/react`. | Earlier explicit owner request and assisted Dashboard i18n implementation; the current request.ts comments concern style, not a different localization owner. | Duplicating the generic language control in each app or moving Dashboard messages into a generic UI package. | Medium for reuse; **Dashboard-only approval**. | `nextjs.md` candidate. Dashboard Settings placement, four locales, cookie spelling, UTC, and exact message-file split are local choices, not standards. |
| NJS06 — Server-owned configuration stays server-owned | When configuration is only needed for a server-side function/redirect, keep that operation and its configuration at the server boundary; do not expose it to the client without a client need. | E01 says SSO_URL should be handled server-side and the unused setting commented out. No environment value is included in this research. | Exposing a value merely because it exists in app configuration; treating a public URL as a secret by definition. | Medium: one bounded example; **explicit intent** for this configuration. | `nextjs.md` candidate. This does not prescribe deployment environment transport; A01 holds that question. |

### Tailwind — TW01–TW03

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| TW01 — Tailwind is the application styling system | For app styling, use Tailwind utilities. Restrict `.css` to required/strongly implied framework/library integration; do not build a parallel handwritten application styling layer. | Current closed styling decision, N12, manual-era shell/view conversion and deletion of former application stylesheets. Six current integration/base/theme CSS files require U04's scope decision. | Adding component/application selectors in standalone CSS as an alternative to utilities. Do not conclude that every current `.css` file is either approved or forbidden solely from its extension. | High for principle; **closed**. Exception boundary unresolved, not the primary tool. | `tailwind.md`; U04 must settle the disputed integration scope before file-level enforcement. |
| TW02 — Conflict-aware class composition | When conditional/default/consumer Tailwind classes need composition, use `cn` with `clsx` and `tailwind-merge`, rather than a truthy-string join that cannot resolve utility conflicts. | E24; current manual `cn.fmt.ts` implementation calls `twMerge(clsx(inputs))`. Existing `cx` remains a negative example. | Repeating bespoke class-joining helpers or silently retaining conflicting utilities. | High; **explicit intent** plus a new manual implementation. | `tailwind.md`. Exact helper folder/suffix and a rule to call cn on every static class string are not supported. |
| TW03 — Semantic theme utilities | When colors/fonts represent shared surface roles, expose theme tokens through Tailwind utilities so component markup expresses roles across themes. | Manual-era shell and view use `bg-surface`, `text-muted`, `border-hairline`; theme mapping exists in `theme.css`, variables in root/dark files. | Repeating unrelated literal palette choices for the same role in each component. Current arbitrary spacing utilities do not support a blanket ban on arbitrary values. | Medium; **observation only** across two edited regions sharing one theme system. | `tailwind.md` candidate, contingent on U04. Exact colors, class names, and five-file template layout receive no promotion. |

### Jotai, only when chosen — J01–J07

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| J01 — Jotai is an app choice | Apply these conventions only to an application that has chosen Jotai. | Current closed state decision; N11 records Dashboard's specific Zustand-to-Jotai migration. | Turning one app's migration into a mandatory dependency for all React surfaces. | High; **closed**. | Scope preamble of `jotai.md`, not a duplicated global dependency rule. |
| J02 — Local interaction remains local | In a Jotai app, keep ephemeral state in React when it need not escape the component/local composition boundary; use atoms for shared, coordinated, independently consumed or observed state. | Closed decision; Dashboard shell retains local mobile-navigation and voice-interaction state alongside shared atoms. Retention is corroboration, not proof that every inherited boundary is ideal. | Replacing every useState with an atom; hiding genuinely shared state behind unrelated local owners. | High; **closed**. | `jotai.md`. |
| J03 — Cohesive domain ownership of shared state | Keep primitive, derived and write behavior for the same concern together under meaningful feature/domain ownership. | Current closed decision and earlier detailed Q09 answer. The subsequent global atoms/domain layout was explicitly authorized **for this slice**; it is not evidence that the general ownership principle was revoked. | Global technical buckets that separate unrelated concerns only by atom/action/selector kind; imposing the earlier illustrative product/theme/evolution/navigation folder list. | High; **closed**. Current layout is a local exception/transitional validation target. | `jotai.md`; do not pre-design the replacement domain decomposition. |
| J04 — Fine-grained, individually navigable state units | In the chosen Jotai model, use independently consumable state units rather than one undifferentiated state object/file. One atom per `.atom.ts` file is the owner's approved Dashboard realization; coordinated write atoms can colocate with their state dependencies. | Earlier explicit one-atom/file plan; ten value atoms and selectProductAtom were subsequently extracted by assistance; selectProductAtom uses sibling imports and coordinates two values. | A monolithic atom-definition file; unnecessarily forcing coordinated state transitions into unrelated owners. | High for Dashboard intent, medium for universal file granularity; **Dashboard-only approval**. | `jotai.md` candidate. Do not canonize the current global `atoms/` folder or `@atoms` name; J03 governs ownership. |
| J05 — Atom definitions do not declare a React client boundary | For atom-definition modules, omit a redundant `'use client'` directive; place framework client boundaries at the consuming UI boundary where required. | E28 on group-by atom. All current atom files still carry the directive, so this is explicit intent awaiting application, not a repeated implemented pattern. | Marking every pure atom definition as a React client entry merely because consumers use Jotai. | High for intent; **explicit intent**. | `jotai.md`; a scoped syntax check is feasible. This is not a ban on client directives in other modules. |
| J06 — Immer for complex state, ordinary atoms for primitives | When selecting an atom constructor, reserve atomWithImmer for complex objects/arrays where immutable draft updates add value; use ordinary atoms for primitive values. | E29 on boolean account-menu atom. Current ten value atoms use Immer, including primitive strings/booleans/numbers. | Wrapping primitive values in Immer by default. Existing assisted splitting preserved the old constructor intentionally and is now marked for change. | High for intent, implementation pending; **explicit intent**. | `jotai.md`; straightforward literals can be checked, general type classification requires stronger analysis. |
| J07 — Inspectability without a mandated logger | When shared state is difficult to understand during development, preserve useful inspectability without prescribing a central registry, logger component, or console output for every change. | Current brief says inspectability is **desirable**; prior Q10 separated it from a registry/logger; the owner later explicitly removed atom logs. | Restoring console logging or a registry as an automatic compliance requirement; interpreting log removal as a prohibition on all diagnostic mechanisms. | High for the boundary; **closed**. Current brief does not establish a mandatory inspectability implementation or acceptance test. | `jotai.md`, framed at the current “desirable” strength. Exact diagnostic mechanism: **no promotion**. |

### Tooling / mechanical — M01–M07

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| M01 — One alias configuration source, no baseUrl | For app TypeScript alias configuration, put paths in `tsconfig.paths.json`, extend it from the app config, and do not add baseUrl. | N04–N06, closed decision, actual manual-era tsconfig cleanup; current paths are centralized and baseUrl is absent. | Defining paths independently in both config files; reintroducing baseUrl. The old duplicate note is already addressed, not an open question. | High; **closed**, implemented. | `frontend.md` for the config contract; a JSON/inheritance checker, not an invented Biome rule, could enforce it later. |
| M02 — App Turbo files only for meaningful overrides | When deciding whether an app needs local Turbo configuration, retain/create it only for behavior not already supplied by the root. | N07 and closed decision; current untouched app dev task repeats root dependsOn/cache/persistent behavior. | Copying root task configuration into each app. | High; **closed**, current legacy file remains a validation target. | `frontend.md`; config comparison can check known duplicates, with override semantics considered. |
| M03 — Private app versions require a publication reason | For private app manifests without a publication requirement, omit a package version. | N08 and closed decision; current private Dashboard manifest still has `0.1.0`. | Template versions carried indefinitely in unpublished app manifests; applying this automatically to publishable shared packages. | High; **closed**, not implemented. | `frontend.md`; scoped manifest validation is deterministic once publication exceptions are explicit. |
| M04 — Commands expose the tool directly | When a wrapper adds no LangDrift behavior, use the framework/tool command directly. Container-specific orchestration belongs at its container boundary. | N10 and closed decision; manual-era package scripts changed from runtime shell wrappers to direct Next commands. | Passthrough build/start wrappers that obscure the underlying command. Do not ban scripts that actually implement meaningful project behavior. | High; **closed**, direct commands implemented. | `frontend.md`; judging meaningful behavior remains semantic. A01 separately holds container details. |
| M05 — Readable expanded JSON | When configuration contains nested objects, format it so structure is readable rather than compressing it into one line. | N02's explicit compact negative example; manual-era paths file is expanded. Current Biome expand default is auto and can preserve that exact compact example. | Assuming the current 80-column formatter prevents nested one-line JSON. | High for the readability intent, medium for a universal `expand: always` setting; **explicit intent**. | `biome.json` candidate (`json.formatter.expand`), with scope/small-object behavior assessed before changing the repository-wide formatter. No duplicate prose formatting standard. |
| M06 — Separate import-origin groups | In a module with multiple import origins, separate third-party, app-absolute and local-relative groups with a blank line. | E22 and dirty request.ts spacing; aliases such as @atoms must be recognized as first-party rather than mistaken for npm scope imports. | One uninterrupted import block mixing origins; imposing a universal alias prefix to suit a formatter. | High; **explicit intent**. | `biome.json` candidate using organizeImports groups plus execution-path integration. U02 does not alter these origin groups. |
| M07 — Statement breathing room | Use blank lines around await statements, before returns, and after the initial props destructuring when code follows. Interpret “space” as a blank line, supported by the actual layout rewrite. | E08, E11–E12 and the current RootLayout body. New formatter guard clauses show that compact-block edge cases still need validation. | Dense adjacent async/return/props statements. Do not invent blank lines before a block's first statement or after its last without validating those cases. | High for intent, medium for exact edge cases; **explicit intent**. | `frontend.md` until a reliable custom checker is designed; the installed Biome formatter has no statement-padding option. Do not put an unsupported option in biome.json. |

### Architectural decision — A01

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| A01 — Deployment packaging and environment boundary | When Dashboard deployment is revisited, choose a coherent build output, start command, and environment-delivery model from actual deployment requirements. The present comments do not establish that decision. | E03 comments out standalone output; E04 retains alternative build/runtime instructions; E05 names app `.env.development`; E06 suggests a standalone-style node entry while actual CMD uses pnpm start. | Promoting “never standalone,” “always bake development env into the image,” or an exact Docker command as a frontend standard from unfinished alternatives. | Low as a selected architecture; **unresolved**, and nonblocking for this extraction. | **No promotion now.** Only a later consequential, hard-to-reverse deployment decision with documented trade-offs might warrant `.artifacts/adrs/`; these comments alone do not. |

### Unresolved interpretations — U01–U04

| ID / name | Principle and trigger/context | Concrete evidence | Counterexample / rejected behavior | Confidence; owner approval | Proposed destination |
| --- | --- | --- | --- | --- | --- |
| U01 — Comment count or component count? | Resolve whether “Always, ONE comment per file, no exceptions” is literal or a copied component directive before extracting a comment policy. | E15 in the view, immediately after separate component/hook directives; the same sentence allows siblings. Several owner-annotated files contain multiple comments. | Silently correcting the wording, imposing a one-comment quota, or using the current multi-comment files as an automatic rejection of explicit intent. | Low interpretation confidence; **unresolved**. | **No promotion.** If “component,” merge into F03; a literal comment policy needs explicit scope. |
| U02 — Public alias entrypoint scope | Decide whether bare imports such as `@components` are required when consuming a module's public API, or whether the note prohibits all first-party alias subpaths. Preserve F01's already-closed local-boundary rule either way. | E20's bare @components example; current configuration still supports @components/*, @i18n/*, @state/* and @template/*; only DashboardShell is currently exported by the component barrel. | Treating every alias subpath as either approved or prohibited without resolving the note; universal renaming of developer-owned aliases. | Low scope confidence; **unresolved**. | **No promotion** until scoped; then `frontend.md`, coordinated with F01/F12 rather than duplicate rules. |
| U03 — Enum scope for domain values | Decide how far the instruction “This should be Enum and not type” extends beyond EvolutionClassification. | E21 on a single classification union; other domain unions remain, and DashboardTheme was manually extended as a union. | Converting all unions, props discriminants, or package-owned types to enums based on one comment; ignoring the explicit classification change. | High for the named classification, low for a universal rule; **explicit local intent, unresolved general scope**. | **No general promotion** now. A bounded domain-modeling rule could later live in `frontend.md`; an ordinary type preference does not justify an ADR. |
| U04 — Global Tailwind integration CSS boundary | Determine whether the current split global token/base/Tailwind bridge is an intentional integration exception or unfinished CSS removal. TW01 remains closed. | The manual-era globals/app/root/dark/base/theme stylesheets coexist with N12 and the closed CSS exception; `@theme`, dark variant, variables and base element rules have different purposes. | Approving arbitrary application CSS because globals exist, or deleting required theme integration because the extension is .css. | Medium evidence, unresolved exception scope; **unresolved**. | **No promotion of the file layout.** The accepted exception belongs under TW01 in `tailwind.md`, not a parallel CSS standard. |

## Complete explicit-evidence ledger

`E` numbers identify every current AGENT marker; `N` numbers preserve the numbering in AGENT_NOTES. Evidence locations refer to the frozen snapshot above. This is coverage, not a claim that each marker deserves a rule.

| ID | Source / marker | Inventory treatment |
| --- | --- | --- |
| E01 | `.env.development:2–3`, server-side SSO configuration / unused value | NJS06; no environment values copied. |
| E02 | `README.md:3`, product explanation | F11. |
| E03 | `next.config.ts:20`, standalone comment | A01; no global standalone prohibition inferred. |
| E04 | `Dockerfile:24`, commented build/runtime alternative block | A01, alongside M04; alternative preserved as unresolved evidence. |
| E05 | `Dockerfile:38`, app environment location | A01; not permission to copy deployment secrets into images. |
| E06 | `Dockerfile:50`, suggested node start command | A01; actual pnpm command remains a contradiction to resolve in deployment work. |
| E07 | `app/layout.tsx:10`, descriptive bindings | F09. |
| E08 | `app/layout.tsx:11`, await spacing | M07. |
| E09 | `app/layout.tsx:28`, props interface | F02. |
| E10 | `app/layout.tsx:35`, no props parameter destructuring | F02. |
| E11 | `app/layout.tsx:38`, first-body props destructuring and spacing | F02 for structure; M07 for spacing. |
| E12 | `app/layout.tsx:43`, return spacing | M07. |
| E13 | `dashboard-view.tsx:3`, one component per file | F03. |
| E14 | `dashboard-view.tsx:4`, one hook / .hook.ts | F04. |
| E15 | `dashboard-view.tsx:6`, one comment per file | U01, not silently merged. |
| E16 | `dashboard-view.tsx:876`, composable rather than injected page UI | F05 and Next.js specialization NJS02. |
| E17 | `app/(reports)/drift-report/page.tsx:3`, page metadata | NJS03. |
| E18 | `app/global-error.tsx:6`, named props interface | F02. |
| E19 | `app/global-error.tsx:31`, use Next Link | NJS04; recovery behavior remains a local validation case. |
| E20 | `app/loading.tsx:1`, root public import | U02, with F01/F12. |
| E21 | `evolution-classification.domain.ts:7`, enum | U03. |
| E22 | `app/lib/i18n/request.ts:4`, grouped imports | M06. |
| E23 | `app/lib/i18n/request.ts:11`, await without optional chaining | F10. |
| E24 | `app/lib/template/ui.tsx:3`, use cn | TW02. |
| E25 | `app/lib/template/ui.tsx:8`, separate app component files | F03 for files; F06 for ownership. |
| E26 | `app/lib/template/ui.tsx:9`, generic primitives from packages/react | F06. |
| E27 | `dashboard-section.domain.ts:19`, filesystem pages | NJS02. |
| E28 | `group-by.atom.ts:1`, no client directive in atoms | J05. |
| E29 | `account-menu-open.atom.ts:3`, complex-state Immer | J06. |
| N01 | `AGENT_NOTES.md:5`, no src | NJS01; already implemented. |
| N02 | `AGENT_NOTES.md:7–12`, JSON readability | M05. |
| N03 | `AGENT_NOTES.md:14`, meaningful domain/route-group aliases | F01; not a fixed alias dictionary. |
| N04 | `AGENT_NOTES.md:16–18`, duplicated alias paths | M01; already resolved in current configs. |
| N05 | `AGENT_NOTES.md:20`, dedicated paths config | M01. |
| N06 | `AGENT_NOTES.md:22`, no baseUrl | M01; already removed. The owner's local contract does not depend on proving a general TypeScript deprecation claim. |
| N07 | `AGENT_NOTES.md:24`, Turbo override-only | M02. |
| N08 | `AGENT_NOTES.md:26`, unpublished app version | M03. |
| N09 | `AGENT_NOTES.md:28`, shared Phosphor ownership | F07. |
| N10 | `AGENT_NOTES.md:30–34`, direct commands / Docker behavior | M04; unresolved packaging details stay in A01. |
| N11 | `AGENT_NOTES.md:36`, Dashboard chooses Jotai | J01; no cross-app mandate. |
| N12 | `AGENT_NOTES.md:38`, Tailwind rather than pure CSS | TW01; global integration ambiguity U04. |

The AGENT_NOTES preamble requests deletion **when the cycle ends**. This cycle is only beginning; the notes remain evidence and have not been deleted.

## Contradictions and how they are classified

| Evidence tension | Resolution available now | Needs an owner answer now? |
| --- | --- | --- |
| Several old notes describe src, duplicated paths, baseUrl, wrappers and Zustand that no longer exist in that form. | These are implemented decisions, not open violations. Historical notes remain provenance, not a current-state checklist. | No. |
| Dated project context mentions Zustand/state logging, while current code and decisions use Jotai without atom logs. | Read context as dated observed behavior. The later explicit decisions and tree settle the current state; do not restore old architecture. | No. |
| Current technical `atoms/`/`domain/` folders versus the general domain-ownership decision. | The intermediate plan explicitly overrode the earlier folder preference **for this slice**. The new brief explicitly reinstates cohesive ownership as the general contract. Preserve the local exception as provenance; do not standardize it globally or invent its replacement. | No. |
| Every atom has use client and primitive atoms still use Immer. | The new comments identify these as unfinished changes; the assisted extraction preserved prior behavior. Intent wins over incomplete implementation, without editing it now. | No. |
| Many components still use inline/destructured props; view has many components and an embedded hook. | Inherited/assisted bodies are marked transitional by explicit comments. RootLayout supplies a new positive props example. | No. |
| A new `.fmt.ts` helper uses ordinary `ClassValue` import, while earlier domain consumers use import type. | Earlier approval explicitly covered domain contracts; current Biome useImportType is off. Do not infer a repository-wide type-import mandate from that slice without additional evidence. | No; broader promotion held. |
| DashboardSection drives pages and also types a title mapping. | Owner rejects injected page dispatch, not necessarily every useful navigation model. Validate remaining consumers when composition is changed; do not prescribe total type deletion now. | No. |
| Theme union now includes system, while current theme consumers remain two-way. | A partial local feature change, not a new universal theme standard or proof of typecheck success. | No. |
| Private version, icon dependency duplication, local Turbo duplication remain. | Explicit owner intent is clear; these are remaining implementation targets, not questions. | No. |
| Normal internal Link preference versus global-error's reload anchor. | Owner's local change request is explicit; recovery behavior must be tested later. Do not broaden that single case into a universal anchor ban. | No. |
| Six manual-era CSS integration/base files versus the closed CSS exception. | Purpose differs by file/directive, and manual creation makes “just legacy” an inadequate explanation. | **Yes — U04.** |
| Comment quota, bare-alias scope, classification enum scope. | Text/code cannot conclusively establish the intended general rule. | **Yes — U01–U03.** |
| Standalone output disabled, alternate Docker instructions retained, incompatible start alternatives. | Unfinished deployment work is not necessary to settle this frontend inventory. | No immediate question; A01 stays unpromoted. |

## Deduplication and destination boundaries

- **F02 absorbs three props directives**: interface, named props argument, and first-body destructuring. Spacing is centralized in M07; do not create three separate props policies plus a duplicate formatting paragraph.
- **F01 is import ownership**, **F12 is public exports**, **M01 is alias configuration**, and **M06 is visual import grouping**. U02 only settles public-entry granularity. These are distinct contexts, not grounds for repeating one import rule in four guardrails.
- **F05 is composition; NJS02 is its App Router specialization.** The Next.js text should point to the general principle, then state the route-specific consequence.
- **F03 and F06 separate file granularity from shared ownership.** Moving a generic component to packages/react is not the same decision as splitting components into individual files.
- **TW01 absorbs the closed styling contract and N12.** U04 narrows its exception; it must not become a competing “CSS standard.” TW02 owns class merging, not general formatter naming.
- **J02 governs state lifetime/visibility; J03 governs ownership; J04 governs state-unit granularity.** None mandates global technical folders. J01 is the activation condition for the whole Jotai document.
- **M01 absorbs N04–N06.** A single source of alias configuration and no baseUrl should not become three independent documents.
- **Use Biome as the canonical source for accepted mechanical formatting.** Guardrails should add meaning or limits that configuration cannot express, not copy settings into prose.
- **No ADR is justified yet.** Component file size, props syntax, imports, enums and utility conventions are ordinary reversible preferences. A01 lacks a selected architecture and deployment evidence.
- **No Cursor rule is proposed yet.** After promotion, thin contextual pointers may activate accepted canonical guardrails. They must not duplicate rule text, and file presence must not be reported as proof of activation.

## Deterministic enforcement assessment

This is a capability assessment, not an implementation plan already executed. The installed tool is **Biome 2.3.15**. Primary evidence is the local [configuration schema](/Users/sky/code/langdrift/node_modules/@biomejs/biome/configuration_schema.json), current [biome.json](/Users/sky/code/langdrift/biome.json), existing scripts, and read-only stdout formatter/linter probes. Newer documentation syntax must not be copied blindly into this installed version.

Current configuration already enforces interface-style eligible object type definitions and kebab-case filenames. It disables organizeImports and useImportType. The root lint command runs `biome lint`, not `biome check`; formatter/assist capabilities do not become enforced merely by adding an option. Staged hooks are configured separately; their existence does not prove they ran on this snapshot.

| Candidate | Reliable mechanical part | Current capability / limit | Promotion implication |
| --- | --- | --- | --- |
| F01 | Reject parent-relative module paths in imports/reexports and supported literal dynamic import/require forms. | Built-in `style.noRestrictedImports` accepts path/glob restrictions; not currently configured for this contract. It cannot infer semantic ownership of a `./` descendant. | Eligible for biome.json once accepted; test static, reexport, dynamic and boundary cases before claiming coverage. |
| F02 | Prefer interfaces for eligible named object type aliases. | Existing `useConsistentTypeDefinitions` covers this. It does **not** require a named props interface, reject inline object annotations, or control parameter/body destructuring. Union types are not converted into interfaces. | Keep existing coverage; the rest needs scoped custom AST analysis or review, not a nonexistent native rule. |
| F03 | Count component declarations per source module. | Requires a component-aware custom checker and explicit treatment of wrappers/anonymous callbacks/framework conventions. `useComponentExportOnlyModules` is about Fast Refresh export mixing, not component count. | Do not present that rule as enforcement of one component/file. |
| F04 | Enforce hook filename suffix in a known hook-file scope. | Filename conventions can cover a scoped set; finding/counting hook definitions across arbitrary files requires custom analysis. | Validate the first real extraction before choosing detection scope. |
| F07 | Detect app icon dependencies/imports that cross the shared boundary. | Manifest validation plus scoped noRestrictedImports can cover known package specifiers. Public API ownership is not inferred by Biome. | Feasible later; no dependency changes now. |
| F08/F12 | Check import type syntax and wildcard public exports. | `useImportType` exists but is off; turning it on globally is broader than the earlier domain-only approval. Export policy can be checked syntactically after scope is agreed. | Do not silently expand the rule's scope. |
| F09 | Reject one-character identifiers for selected declaration kinds. | `useNamingConvention` offers custom matches/selectors. A length rule does not prove descriptive naming; type parameters and generated/framework code need deliberate scope. | Native partial enforcement, semantic review remains. |
| F10 | Reject optional chaining anywhere in a statement containing await. | Custom AST analysis is needed. Checking only the AwaitExpression operand misses the actual `(await cookies()).get(...)?.value` example. | Not a current Biome option. Explicit branching quality remains reviewable. |
| NJS01 | Detect a src wrapper in a Next.js app workspace. | Scoped filesystem/manifest check; no Biome semantic rule required. | Deterministic once app selection is defined. |
| NJS03/NJS04 | Detect absent metadata exports / ordinary internal anchors. | Presence/JSX checks are possible but cannot prove distinct useful metadata or correct recovery semantics. | Partial checks, not complete acceptance criteria. |
| TW01/TW03 | Inventory CSS files, imports and syntax. | A file extension or selector grep cannot decide legitimate Tailwind/framework integration. U04 must settle the allowed scope. | No reliable blanket CSS ban yet. |
| TW02 | Restrict known obsolete cx imports or helpers after migration. | Known syntax can be flagged; generic class-composition semantics are not fully inferred. | Do not claim cn use guarantees a correct visual result. |
| J03/J04 | Count atom declarations and check filenames. | Custom AST can identify known constructors; it cannot determine a meaningful domain decomposition. | Mechanical granularity is separable from ownership review. |
| J05 | Reject use client in the accepted atom-definition scope. | Simple scoped AST/directive check. | Deterministic; not a repository-wide client-directive ban. |
| J06 | Flag primitive literal initializers passed to atomWithImmer. | Custom AST can catch obvious primitives; imported/computed values need type-aware analysis. Need not ban plain atoms containing complex values. | Partial check, not a complete type/value classifier. |
| M01 | Verify paths location and absence of baseUrl across effective app config. | JSON/inheritance validation is needed; merely grepping the leaf config is insufficient. | Deterministic custom check, no built-in Biome rule. |
| M02/M03/M04 | Compare known Turbo overrides, inspect private manifests, flag known passthrough wrappers. | JSON/script inspection is deterministic for defined cases; whether a wrapper/override adds behavior is semantic. | Do not imply a config comparison proves all task-graph equivalence. |
| M05 | Expand JSON objects/arrays. | `json.formatter.expand: "always"` is supported. Current auto formatting preserves the compact AGENT_NOTES negative example when it fits 80 columns. | Native capability; assess repository-wide churn and desired small-object scope before changing it. |
| M06 | Group imports by configured origins with blank separators. | organizeImports supports groups. **Installed 2.3.15 uses `null` as a separator**. Its `:ALIAS:` matcher does not cover arbitrary names such as @atoms/@components; use app-aware patterns, not alias renaming. Newer `:BLANK_LINE:` syntax is not the installed contract. | Native assist capability, currently off. A lint-only command will not run the assist; eventual command integration must be explicit. |
| M07 | Insert/check statement padding. | The installed formatter has no statement-padding option; stdout probes do not insert the requested blank lines. A custom token/AST checker needs settled edge cases. | Keep this out of biome.json until an actual supported mechanism exists. |
| U01/U02/U03 | Count comments, restrict subpaths, identify selected union declarations. | Syntactically possible after scope resolution; native enum rules do not infer which business concepts must be enums. | Do not automate an unresolved interpretation. |

Read-only probes checked capabilities, not Dashboard readiness. Inline props and the classification union pass the existing interface preference; translation `t` passes current naming; the component-export rule concerns mixed exports rather than multiple components. A generic stdin-lint error was not treated as rule-specific evidence. No formatter write, build, test suite, runtime audit, or production verification was performed in this extraction.

## Deliberately not promoted

| Observation / local requirement | Why no reusable standard is inferred |
| --- | --- |
| Four route-state sibling files beside each page, plus global-error | Explicitly requested Dashboard feature scaffolding, implemented with assistance. Repetition is not independent manual evidence that every Next.js route should always have default/error/not-found/loading siblings. |
| A forced one-second loading skeleton | Explicit local UX request, not a frontend performance or loading-duration standard. Do not automatically add such delays elsewhere. |
| Exact atom/domain barrels, alias spellings and one domain declaration per `.domain.ts` file | Approved Dashboard slice mechanics. The reusable ownership principle must not freeze technical folders or universal alias names. One-domain/file can be reconsidered after independently refactored evidence. |
| Four `.fmt.ts` helpers under template/formatters | A new coherent helper cluster, not yet integrated. It supports small named utilities, but not a universal suffix, folder, one-function/file rule, English currency locale, or two-initial naming rule. cn has separate explicit evidence in TW02. |
| Theme gains system in its union | Unfinished local behavior and compatibility work; no evidence that every surface must expose the same theme modes. |
| Existing charts, delayed orb initialization, modal mechanics and audit thresholds | Earlier assisted remediation and functional acceptance criteria, not extracted manual style standards. This cycle does not reopen the quality implementation/audit. |
| Locale list, cookie, UTC, Settings placement and message-file decomposition | Application-specific localization choices. Only the proposed ownership boundary is a candidate. |
| Page names, current route groups, exact component folder names and fixture metrics | Product/application structure, not a mandatory directory dictionary or universal frontend architecture. |
| Current formatting widths/quotes/semicolons and other established Biome settings | Already encoded tool configuration, not newly discovered manual standards to restate in guardrails. |
| Central atom registry, StateLogger, console logging every change | Explicitly not the architecture required by the owner; logs were subsequently removed. |

## Remaining Dashboard work as a validation set — not started

The owner's remaining “~15%” is a future holdout, not a measured percentage or authorization to refactor now. After inventory approval and separately authorized promotion/validation, choose small independent examples from unfinished areas; do not count mechanically generated siblings as independent confirmations.

| Future validation slice | Candidates exercised | What would strengthen or falsify the candidate |
| --- | --- | --- |
| One real page extracted from the monolithic view, plus its related component/hook | F02–F05, F09, F12, NJS02–NJS03, U02 | Props/hook/file rules remain natural without an artificial dispatcher or excessive barrel plumbing. The route owns composition and metadata; useful non-routing domain models are not deleted merely for naming pages. |
| A second, independently refactored page or shell concern | Same structural candidates | Tests transfer beyond the first chosen example. Existing legacy route wrappers cannot supply this independence by simple repetition. |
| One primitive state concern and one complex/coordinated concern | J02–J06, F08 | Local state remains local; ordinary/Immer atoms match actual update needs; cohesive ownership emerges from the implementation rather than a prescribed folder tree. |
| Theme mode and classification changes | F08, U03, J04/J06 | Owner's intended enum/type scope survives real consumers; system theme behavior and shared component contracts remain coherent. No change is assumed complete from a type edit alone. |
| One generic UI replacement and one app-specific composition | F03, F06–F07, TW02 | Shared package ownership removes duplicate bases without absorbing app business behavior; cn is integrated where it adds value; icon access has a usable shared API. |
| Global styling integration followed by another component conversion | TW01–TW03, U04 | Agreed CSS exception preserves Tailwind token/dark/base integration without reopening a parallel app styling system. Exact old file layout is not needed to express the rule. |
| Locale request and a second asynchronous function | F09–F10, M06–M07 | Explicit result handling remains clear, missing-cookie fallback stays valid, and spacing works for guards/adjacent awaits without ritual empty lines. |
| Paths, manifest, Turbo and command cleanup | F01, M01–M06 | Proposed deterministic checks accept valid exceptions and catch known negatives. Import assists actually run in the chosen check path, not only in config. |
| One useful formatter integrated into a real consumer | TW02 where relevant; helper observations | Determine whether `.fmt.ts`/template placement is a reusable convention or merely this cluster's location; do not impose the answer before integration. |

Website, SSO and Mobile remain **later validation targets**. Their existing style was not used to override Dashboard evidence, and their regression builds/smoke tests were not run for this extraction.

## Questions recorded during extraction — subsequently resolved

1. **U01 — Did “ONE comment per file” mean “one component per file,” or is a literal comment-count restriction intended?** Recommendation: treat it as the component rule and avoid a numerical comment quota, unless the owner confirms otherwise.
2. **U02 — Does the bare `@components` requirement apply to consumers of a module's public entrypoint, or prohibit every first-party alias subpath?** Recommendation: use the public entrypoint across that module boundary, retain meaningful subpaths when they identify their own public modules, and keep the already-approved local `./` rule.
3. **U03 — Is the enum instruction specific to EvolutionClassification, or intended for a broader class of domain value sets?** Recommendation: record the named classification change now and leave any broader enum policy pending a second concrete example; do not convert every union by analogy.
4. **U04 — Are the split global token/base/theme CSS files an intentional Tailwind/framework integration exception, or unfinished CSS removal?** Recommendation: permit only necessary global integration, including a split when useful, without admitting component/application CSS as a parallel styling system or prescribing these exact filenames.

No further question is needed about Jotai being optional, local React state, no parent traversal, alias naming ownership, log removal, root app placement, or the already-resolved paths/baseUrl cleanup. Deployment alternatives remain parked rather than expanding this first interview.

## Initial extraction handoff — historical

The initial extraction is complete at the stated snapshot. This research file is the only agent-authored repository change from this step. All 16 owner-delta SHA-256 hashes were rechecked after synthesis with no mismatch; the inventory has 40 unique entries and the ledger covers all 29 markers plus 12 numbered notes. No guardrail, ADR, Cursor rule, Biome configuration, production file, or Git history was changed. No final standard is declared stable.

At that handoff, work stopped for owner approval and answers to U01–U04. Approval had not been inferred, no later SDD phase had been started, and the remaining Dashboard validation work had not begun.

## Canonicalization record

### Authority and snapshot

The owner explicitly approved the candidate inventory for promotion and supplied U01–U04 resolutions in the attachment headed “The candidate inventory is approved for promotion. Proceed now with canonicalization.” This authorizes canonical guardrails, validated Biome configuration and thin Cursor activation pointers, not another planning step, Dashboard refactor, SDD phase, or Git publication.

Promotion base: `8910eaccb493972daa09f88ef32e32a72ad2c5fd`, branch `refactor/dashboard-organization`; the tree was clean before this step. That commit contains the earlier extraction and its manual-source snapshot. The older base/HEAD/dirty hashes above still describe the extraction moment, not the promotion's current Git status.

### Owner resolutions

| Resolution | Approved meaning | Disposition |
| --- | --- | --- |
| U01 | “ONE comment” was a mistake: one React component per component file and one custom hook per `.hook.ts`; no numerical comment restriction. | Merged into F03/F04. |
| U02 | Local `./` is allowed, parent traversal is prohibited, cross-boundary imports are absolute; developers own meaningful alias names/abstractions. Public barrels are optional and meaningful absolute subpaths are allowed. | Merged into F01/F12; bare aliases are not mandatory. |
| U03 | Enum instruction applies specifically to EvolutionClassification. | Dashboard-local pending implementation; broader enum policy remains held. No type was changed in this step. |
| U04 | CSS is limited to required/strongly implied integration, including technically necessary theme/token work. Current split CSS is unfinished migration unless separation is technically necessary. | Merged into TW01. The earlier “split when useful” recommendation was not accepted; convenience alone is insufficient. |

### Promoted and merged candidates

There are 35 substantive accepted candidates, one architectural hold and four resolved interpretation entries. They are consolidated into four guardrails and supported mechanical configuration, not 40 independent rules/files. Approval of reusable principles does not promote every literal filename or folder appearing in their evidence.

| Candidate IDs | Canonical destination | Consolidation / boundary |
| --- | --- | --- |
| F01, F12, U02 | [frontend — ownership and public boundaries](../../.agents/guardrails/frontend.md#ownership-and-public-boundaries) | One ownership-aware import/public API principle; optional explicit named barrels, meaningful subpaths. |
| F02, F03, F04, U01 | [frontend — components, hooks and composition](../../.agents/guardrails/frontend.md#components-hooks-and-composition) | Props interface/argument/body handling forms one contract; separate component/hook files do not imply one arbitrary function or comment per file. |
| F05 | [frontend — composition](../../.agents/guardrails/frontend.md#components-hooks-and-composition) | General responsibility composition; no blanket ban on injection, render props or configurable components. |
| F06, F07 | [frontend — shared UI ownership](../../.agents/guardrails/frontend.md#shared-ui-ownership) | Generic primitives and common icon access have a shared owner; app business compositions stay local. |
| F08 | [frontend — domain/type ownership](../../.agents/guardrails/frontend.md#ownership-and-public-boundaries) | Domain type ownership and type-only domain imports promote; exact global folders/aliases/suffixes and an enum preference do not. |
| F09, F10, M07 | [frontend — readable control flow](../../.agents/guardrails/frontend.md#readable-control-flow) | Descriptive bindings, explicit consumed async responses and statement spacing; void side effects do not require invented unused response bindings. |
| F11, M01, M02, M03, M04 | [frontend — application configuration and documentation](../../.agents/guardrails/frontend.md#application-configuration-and-documentation) | Product-oriented docs; single alias config/no baseUrl; meaningful Turbo overrides; unpublished app manifests; direct commands. |
| NJS01, NJS02, NJS03 | [nextjs — application and route ownership](../../.agents/guardrails/nextjs.md#application-and-route-ownership) | Root app/ and route-specific identity/metadata. NJS02 references F05 rather than repeating it. |
| NJS04, NJS06 | [nextjs — navigation and server boundaries](../../.agents/guardrails/nextjs.md#navigation-and-server-boundaries) | Ordinary internal client navigation and server-owned configuration; recovery/fragment/external contexts are distinguished. |
| NJS05 | [nextjs — localization ownership](../../.agents/guardrails/nextjs.md#localization-ownership) | App-specific i18n location promotes; generic language-control ownership references F06. Locale list, cookie and Settings placement stay local. |
| TW01, U04 | [tailwind — styling and integration surfaces](../../.agents/guardrails/tailwind.md#application-styling-and-integration-surfaces) | One styling rule owns the narrow CSS exception; no separate CSS policy or current file-layout standard. |
| TW02, TW03 | [tailwind — class composition and theme roles](../../.agents/guardrails/tailwind.md#class-composition-and-theme-roles) | Conflict-aware cn and semantic theme roles promote without exact helper suffix, palette or arbitrary-value prohibition. |
| J01, J02, J03, J04 | [jotai — scope and state ownership](../../.agents/guardrails/jotai.md) | Optional app choice; local interaction remains local; cohesive domains and fine-grained independently consumed units. J04's one-atom/.atom.ts realization stays Dashboard-local. |
| J05, J06 | [jotai — atom definitions and updates](../../.agents/guardrails/jotai.md#atom-definitions-and-updates) | Unnecessary client boundaries removed as a principle; ordinary primitive atoms; Immer only when complex state benefits. No atom files changed. |
| J07 | [jotai — inspectability](../../.agents/guardrails/jotai.md#inspectability) | Useful diagnostic awareness, not the old registry/logger or automatic transition logs. |
| M05, M06 | [biome.json](../../biome.json) and the enforcement verification below | Configuration, rather than duplicate guardrail prose, owns validated JSON formatting and import grouping. Scope and execution limits are reported explicitly. |

### Held and Dashboard-local scope

- **A01 remains held.** No deployment packaging/environment architecture was selected and no ADR was created.
- **U03's broader enum policy remains unpromoted.** Only EvolutionClassification has the owner's specific instruction; implementation is left to the later Dashboard slice.
- **J04's file mechanics and F08's exact domain layout stay local:** no universal `.atom.ts`/`.domain.ts`, global atoms/domain buckets or fixed alias vocabulary. The reusable ownership/granularity principles do promote.
- **No promotion** of the current split CSS layout, `.fmt.ts` helper cluster/location/defaults, forced one-second skeleton, blanket route-state sibling scaffolding, system-theme addition, locale list/cookie/UTC/control placement, fixture metrics, exact route groups, or old logger mechanism. These retain the classifications in the initial extraction; this step did not implement or remove them.
- `apps/dashboard/AGENT_NOTES.md` and every `AGENT:` comment remain intact until the validation cycle is complete. Their existence is evidence, not an alternative canonical policy.

### Documentation and activation verification

`writing-for-agents` guided consolidation: each reusable meaning has one canonical location; specialized guardrails link to general ownership/composition instead of restating it. The guardrails README selects by task scope. AGENTS.md and the harness/Cursor READMEs received only the navigation/status changes needed to stop calling the promoted documents nonexistent reserved mechanisms.

An independent read-only agent checked all four guardrails, their index and activation/navigation files against the approval and all 40 inventory entries. No missing accepted principle, contradiction or duplicate canonical policy was found. Its optional async-binding precision suggestion was applied to avoid requiring meaningless variables for void side effects.

The single [frontend.mdc](../../.cursor/rules/frontend.mdc) contains frontmatter and a pointer to the guardrails index, not policy text. Its form follows the [official Cursor rules documentation](https://cursor.com/docs/rules); actual discovery/attachment in a running Cursor session remains **unverified**. The hook registry is unchanged and empty.

### Mechanical verification

The installed Biome **2.3.15** executable, rather than schema hints alone, was exercised against positive and negative fixtures. New configuration applies to `apps/**`, `packages/react/**` and `packages/design-tokens/**`; it does not impose frontend rules on SDK/core or the messaging runtime. Existing interface-style eligible type definitions, kebab-case filenames and the shared React image-rule exception are preserved. No app/package source was rewritten.

**Correction to the initial capability assessment:** the bundled schema lists `null` for import-group separation, but the actual 2.3.15 configuration deserializer rejects it. The executable accepts `:BLANK_LINE:`, and output/negative-fixture tests confirm that it inserts the approved group breaks. The earlier research assertion that the installed version required `null` was wrong; it is retained only as historical evidence, not implementation advice.

| Enforcement added | Actual coverage | Limit / execution path |
| --- | --- | --- |
| F01: `style.noRestrictedImports` at error level | Parent traversal at the beginning or embedded in module specifiers, including `..`, `../parent`, nested traversal, `./nested/../peer`, and `@components/../peer`. Tested on named/type ESM imports, named/wildcard reexports, side-effect imports, string-literal dynamic imports and TypeScript import-equals. | Native rule does **not** cover ordinary `require()` calls, import-type expressions, template-literal/computed dynamic imports or backslash paths. Semantic ownership of an allowed local `./` path remains reviewed. Runs under existing lint. |
| M06: scoped organizeImports assist | Third-party imports, first-party absolute imports, then relative imports, separated by blank lines. Tests distinguish scoped third-party packages from actual app aliases/workspace packages and allow meaningful absolute subpaths. | Explicit first-party matchers need maintenance when aliases change; they do not constrain developer naming. Side-effect imports and detached comments remain barriers. Runs under `biome check` with assists, **not** the existing `biome lint` command. |
| M05: scoped `json.formatter.expand: always` | Expanded JSON object/array structure for frontend configs; compact negative fixtures fail and expanded output passes with identical parsed data. | A broad setting would alter 21 of 42 inspected tracked JSON/JSONC files, including a Go event fixture and NATS configuration. That broad scope was rejected. Frontend-only expansion affects 14 of 28 frontend files; root/backend/core/sdk formatting is unchanged. Runs under formatting/check, not lint. |

The JSON impact comparison formatted to stdout only and compared parsed results. All inspected semantic values were preserved. Fourteen existing frontend configurations will need formatting when their migration is authorized; no mass rewrite was performed here. Enabling the scoped formatter adds known frontend formatting debt without changing unrelated runtime fixtures.

#### Reproducible checks and results

| Command / check | Result on this promotion snapshot |
| --- | --- |
| `node --test .agents/guardrails/biome.test.mjs` | **PASS: 12 tests.** Includes 42 rejected path/form combinations, eight allowed module paths, five explicit native gaps, scope checks, grouping positive/negative/idempotent cases, attached/detached comments, side-effect barriers, JSON semantic preservation and the existing React override. |
| `node_modules/.bin/biome check biome.json` | **PASS:** configuration parses and its own formatting/lint/assist check passes. |
| `node_modules/.bin/biome lint apps/dashboard --files-ignore-unknown=true` | **PASS:** 146 files. This does not prove compliance with human-reviewed guardrails or import/JSON assists. |
| `node_modules/.bin/biome lint . --files-ignore-unknown=true` | **FAIL:** 392 files inspected; 111 now-detected parent-traversal errors in existing source and one pre-existing informational `noUselessFragments` diagnostic. No fixes applied. |
| `node_modules/.bin/biome check apps packages/react packages/design-tokens --formatter-enabled=false --linter-enabled=false --files-ignore-unknown=true` | **FAIL:** 352 files inspected; 65 existing organizeImports diagnostics. No fixes applied. |
| Read-only `biome format` on the 28 tracked frontend JSON/JSONC files | **FAIL:** 14 existing formatting differences. The separate before/after stdout comparison across 42 tracked JSON/JSONC files confirms only those 14 frontend files change under the scoped setting. |
| Markdown links/anchors, activation-pointer contents, source hashes, candidate disposition coverage, `git diff --check` | **PASS:** ten Markdown documents checked, no broken links; Cursor body contains only the index pointer; all 16 original owner-source hashes unchanged; all 40 candidates accounted for; no whitespace errors. |

Current migration backlog, not edits introduced by this step:

| Surface | Parent-traversal errors / affected files | Import-group diagnostics |
| --- | --- | ---: |
| Dashboard | 0 / 0 | 12 |
| Docs | 8 / 6 | 2 |
| Mobile | 0 / 0 | 2 |
| SSO | 7 / 7 | 1 |
| Website | 93 / 41 | 27 |
| Shared React | 3 / 2 | 21 |
| Total | 111 / 56 | 65 |

These failures are **unresolved adoption work**. They were not fixed because the owner explicitly excluded refactoring the validation set and other production changes. Root lint now reports the approved restriction; it is not green. Existing lint/CI scripts were left intact, so import assists and formatting must be checked separately with the commands above. No build, application typecheck, browser audit, or Cursor runtime attachment test was run for this documentation/config-only change.

To reproduce the frontend JSON check without including unrelated root/backend files:

```sh
node --input-type=module <<'JS'
import { execFileSync, spawnSync } from 'node:child_process'
const files = execFileSync('git', [
  'ls-files', '-z', '--', 'apps', 'packages/react', 'packages/design-tokens'
], { encoding: 'utf8' }).split('\0').filter(file => /\.jsonc?$/.test(file))
const result = spawnSync('./node_modules/.bin/biome', [
  'format', '--files-ignore-unknown=true', ...files
], { stdio: 'inherit' })
process.exitCode = result.status ?? 1
JS
```

#### Human review and future custom enforcement

The fixture suite invokes Biome; it does not implement a second policy engine. These accepted rules still require human review, with custom automation deferred:

- **F01 native gaps and semantic local boundaries:** stronger module-specifier analysis would be needed for uncovered syntactic forms; ownership cannot be inferred from string length.
- **F02–F04:** native interface preference does not require named props, initial body destructuring, one component per file, or one hook per `.hook.ts`. These need component/hook-aware syntax analysis.
- **F05–F08/F12:** composition, generic UI/icon ownership, domain/package ownership and public API intent need review. Targeted manifest/import/export checks could cover specific mechanical parts later. Global useImportType was not enabled beyond the approved domain-contract obligation.
- **F09/F10/M07:** descriptive names, explicit async absence/failure handling and statement spacing are not enforced by these Biome changes. A syntax checker could catch selected naming lengths, optional chaining in an await-containing statement and padding, but semantic clarity remains reviewed.
- **NJS01–NJS06:** root app placement, route identity/metadata, ordinary navigation versus recovery, server configuration boundaries and localization ownership are not certified by these config checks.
- **TW01–TW03:** technical necessity of integration CSS, appropriate cn use and semantic theme roles require review; extension/glob checks alone cannot establish necessity.
- **J01–J07:** state lifetime, cohesive domain ownership, granularity, necessary client boundaries, appropriate Immer use and useful inspectability remain reviewed. No logger or atom rewrite was added.
- **M01–M04:** paths/baseUrl/config inheritance, meaningful Turbo overrides, publication exceptions and useful versus passthrough wrappers would need scoped manifest/config analysis; no large checker framework was introduced.

#### Verification binding and exit

The config/tests verified above have these SHA-256 identities:

| File | SHA-256 |
| --- | --- |
| `biome.json` | `2f9a6df421aaab1320640b07d65e1eea90c75398c821198bed7fecb2e8167b2c` |
| `.agents/guardrails/biome.test.mjs` | `ccfd21746b7a0427cc1f59a473694445dea491606ad552046dca8e8f3b9db1d2` |

Canonicalization changes are limited to the four guardrails, their index/test fixture, the research record, Biome configuration, one Cursor activation pointer and the existing navigation READMEs/AGENTS entrypoint. The production diff is empty, the notes are retained, and no ADR, spec, ticket, custom policy-checker framework, hook or Git publication was created. New rules are canonical; adoption is not yet complete and the Frontend Standard is not declared validation-stable. Stop after this promotion and verification; the remaining Dashboard validation phase requires a separate owner instruction.
