# Dashboard Tailwind Alignment — Ticket 0005 prerequisite checkpoint

- **Spec:** `.artifacts/specs/0002-dashboard-tailwind-alignment.spec.md`, approved version 1
- **Ticket:** `.artifacts/tickets/0005-establish-dashboard-baseline-and-browser-harness.ticket.md`
- **Base and HEAD:** `1cdede8a39f56c62a57b63e9933c85df5e7f8850`
- **Branch:** `codex/dashboard-tailwind-alignment`
- **Result:** blocked before the renderable baseline; this is not a completed Review/Audit gate

## Delivered prerequisite work

Restored workspace dependencies using the locked installation. Declared
Dashboard's `clsx` 2.1.1 and `tailwind-merge` 3.7.0 dependencies for the existing
unused helper, and `@playwright/test` 1.63.0 as a development dependency for the
approved browser harness. The lockfile change is limited to those Dashboard
declarations and the new tailwind-merge package entry. No helper was activated;
no application source, stylesheet, theme value, or shared implementation changed.

## Commands and results

| Command/check | Result | Exit |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` with required host network access | passed; locked installation restored, no lockfile change from this command | 0 |
| `pnpm --filter dashboard add clsx tailwind-merge` | passed; intentional Dashboard dependency declarations | 0 |
| `pnpm --filter dashboard add -D @playwright/test` | passed; browser tooling declared | 0 |
| `pnpm --filter dashboard typecheck` after restoration/additions | failed; two TS2322 theme-type errors | 2 |
| `pnpm --filter dashboard build` | failed; production compilation succeeded, then typechecking failed on the same two errors | 1 |
| `pnpm test:web-quality` | passed; 7 files, 31 tests | 0 |
| `git diff --check` | passed | 0 |
| Source/config comparison with the approved base | no differences in Dashboard application source, shared React, or Dashboard TypeScript/Next configuration | 0 |

The initial sandboxed install and typecheck invocations produced no output and
were interrupted (exit 130); they are not passes. The host invocations above
provided the actual installation and diagnostic results.

## Blocking finding

Both failures report `Type 'DashboardTheme' is not assignable to type
'"dark" | "light"'` because `'system'` is included in DashboardTheme:

- Dashboard shell, line 369: passing `theme` to ThemeToggle;
- Dashboard view, line 848: passing `theme` to the Settings ThemeToggle.

The Dashboard domain type is `'dark' | 'light' | 'system'`, whereas the shared
ThemeToggle accepts only the first two. The atom initializes to `light`; both
production toggles write only `light` or `dark`. A scoped source search found
no other `system` value in the Dashboard theme implementation.

**Classification: pre-existing defect, blocking for this initiative.** The
type declaration, both call sites, atom, and shared control contract are
unchanged from the approved base. The type-only `system` addition also appears
in the historical frontend calibration evidence. Restoring dependency
resolution exposed this previously obscured incompatibility. No styling or
class-composition migration has taken place. This checkpoint does not claim a
separate clean-checkout baseline command run; it records unchanged-source
provenance plus the diagnostics after the authorized prerequisite overlay.

Dashboard-scoped typecheck and build are mandatory under AC-14/AC-16. This
cannot use the external-failure exception. Narrowing the domain type or adding
system-theme behavior exceeds the approved dependency/import repair boundary.
The proposed smallest correction is to remove the unsupported `system` member
from the Dashboard theme type, preserving the existing two-mode runtime and
shared control contract. That correction has not been applied and requires an
owner-approved prerequisite scope refinement. No casts, typecheck suppression,
or build bypass were introduced.

## Outstanding evidence

No renderable/browser baseline exists yet. Browser harness implementation,
baseline capture/comparison, scoped Biome/guardrail checks, remaining repository
checks, and independent two-axis Review have not run for this ticket. They
remain outstanding, not passing. Ticket 0005 remains `in-progress`; Tickets
0006–0008 remain `not-started` with their blockers intact.

## Snapshot binding

Product/config delta at this checkpoint: Dashboard manifest and root lockfile
only. Planning spec/index/tickets and this checkpoint are uncommitted metadata.

| Path | SHA-256 |
| --- | --- |
| `apps/dashboard/package.json` | `c60b37d724a357029a9fcd988fa5444aaafccbe421bfce1af591b1cb86176a75` |
| `pnpm-lock.yaml` | `ac4c62f8f2901aaff250a5f27f5f2dc216bf2c06e01cfe704244a8dfd6b1ab04` |
| `apps/dashboard/app/lib/state/domain/dashboard-theme.domain.ts` | `68966689f02facaae9631fe49e89c3703b1563d67695d1661f06f3fcaf97cd84` |
| `apps/dashboard/app/lib/state/atoms/theme.atom.ts` | `1037e26d87c767abc19183ec4e0f18b416abea7aaff0748c8aba2d4699bbc4d0` |
| `apps/dashboard/app/lib/components/dashboard-shell/dashboard-shell.tsx` | `08c680475e110620dc48c7291f0e76179dfc5504325525358cc25465ab28a778` |
| `apps/dashboard/app/lib/views/dashboard-view/dashboard-view.tsx` | `21e4aa40761dfe5f6b95d597f198cff6e26a7efdf188edb5244b2fbfd1039c9d` |
| `packages/react/src/ui/theme-toggle/theme-toggle.tsx` | `d088b5800ae710e972153699d25b9b6e153cb56c5ace69171ee1b55703c23818` |
