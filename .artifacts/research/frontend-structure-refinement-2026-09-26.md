# Frontend Structure & Component Conformance — Refinement

Spec0003v1, Tickets0009–0013. Accepted under the owner's explicit cycle-wide
auto-approval. This disposition follows verified Dashboard/Website comparisons,
real Early Access evidence and independent Standards/Spec review; final snapshot
results are in `.audits/reports/frontend-structure-final-2026-09-26.md`.

## Retired calibration evidence

| Marker | Reusable intent already in canonical policy | Delivered evidence |
| --- | --- | --- |
| N09 | frontend.md, Shared UI ownership: one shared icon dependency/public access | Dashboard imports shared icons; duplicate dependency removed; types/build/browser pass |
| E09–E11, E18 | frontend.md, Components/hooks and props; Readable control flow | Named local interfaces, props argument and initial body destructuring; both application inventories and browser evidence |
| E13, E25 | frontend.md, one component per component file and concern colocation | Dashboard and Website extraction inventories, independent AST review, browser comparisons |
| E14 | frontend.md, one custom hook per .hook.ts file | Both hooks extracted with equivalent memoization/data and updated callers |
| E15 | frontend.md explicitly rejects a numerical comment restriction | Ambiguous old comment resolved as component separation, not a one-comment quota |
| E16, E27 | frontend.md composition; nextjs.md filesystem route ownership | Routes compose meaningful gate/heading/content; universal dispatcher removed; useful navigation union retained |
| E26 | frontend.md Shared UI ownership | Narrow public Card/Kicker API, public-boundary tests and preserved conflict-aware overrides |

E13–E16/E25–E26 disappeared with obsolete implementation modules; their temporary
pending-retirement record in execution notes is now resolved by this disposition.
The remaining source markers listed above are removed, not copied as duplicate
policy into production. No behavior changes are made for marker retirement.

## Deferred evidence and external debt

N11 remains in AGENT_NOTES.md, so that file remains active. E01–E06 (deployment,
runtime/environment and documentation), E07/E08/E12/E23 (readability/async),
E19 (deliberate full-document recovery), E21 (enum preference), and E28/E29
(state concerns) remain deferred. Prior cycles' already approved retirements
are unchanged. This cycle does not resolve Jotai architecture, runtime policy,
metadata completeness or a union-to-enum preference.

Repository lint still fails on the 18 Docs/SSO/untouched shared React errors.
The actual completed N12 baseline reproduces identical diagnostics and file/config
hashes. They remain failed external pre-existing debt, not delivered scope.

## Transfer and non-promotions

Website independently validates component/props/hook ownership without requiring
Dashboard's folders, rendering model or state design. Header remount focus state
must retain lifetime; a private concern-local record is a local implementation,
not a universal pattern. Generic primitives deserve a narrow public owner while
app composition remains private. Configurable skeletons and navigation types are
not whole-page dispatchers. No new guardrail, ADR, checker or vocabulary change
is justified: the applicable canonical intent already exists.

Visual capture can vary even with identical source/fonts/runtime. Failed runs
remain failed. The archive reproduction proves two candidate raster states were
already present before migration; fresh baseline-source and candidate comparisons
also pass using unchanged expected images and tolerance. Integer viewport clips
for fixed headers and warmed document clips are harness mechanics, not universal
frontend standards or a guarantee against browser rasterization noise.

No disputed promotion remains. No new initiative, merge or release is authorized
by refinement. The owner's later explicit authorization permits this cycle's
commit and PR after verification, superseding the original no-publication limit.
