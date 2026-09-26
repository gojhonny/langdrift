# 0004: Complete the root Next.js foundation

**Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 2, approved by owner on 2026-09-26)

**What to build:** Contract the migration onto the canonical Website foundation by making the App Router and request proxy workspace-root owners, removing the legacy wrapper, completing private-manifest and Turbo-inheritance alignment, and preserving the LangDrift build/start orchestration. Integrate the two independent migration slices and leave the complete snapshot ready for the separate Review and Audit gates.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1, contract aligned to spec version 2 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0002-consolidate-website-localization-ownership.ticket.md`, `.artifacts/tickets/0003-lift-website-owned-application-concerns.ticket.md`

**Evidence:** `.audits/reviews/website-foundation-ticket-0004-v2-2026-09-26.md`, `.audits/reports/website-foundation-ticket-0004-v2-2026-09-26.md`, and raw harness evidence under `.audits/runs/early-access.N7iOMk`; resolved base and `HEAD` `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`, with the uncommitted implementation status recorded in the review. The version 1 review and audit remain historical. Repository-wide lint, typecheck, and build remain failed but are proven external pre-existing failures under version 2 AC-21. The exact Docker-backed Early Access integration/browser harness exited 0.

- [x] The legacy Website source wrapper is absent and no active configuration or documentation resolves through it.
- [x] Next.js discovers the App Router and request proxy directly at the Website workspace root.
- [x] Website localization remains under the root App Router's `lib/i18n` boundary and next-intl configuration resolves it correctly.
- [x] The private Website manifest omits publication version metadata while preserving package identity and dependencies.
- [x] Redundant application-local Turbo configuration is absent and Website tasks inherit the intended root task graph.
- [x] Build and start scripts continue to invoke the existing LangDrift wrappers, and production build plus standalone-start smoke prove environment loading and asset assembly remain intact.
- [x] All active integration, enforcement, test, coverage, build, runtime, and documentation consumers resolve the final structure without compatibility copies, catch-all aliases, or prohibited traversal.
- [x] The complete localized home/pricing route matrix, metadata, navigation, language switching, styling, state, content, environment boundaries, and Early Access behavior remain equivalent.
- [x] Relevant Biome guardrail fixtures and Website checks pass on the integrated implementation snapshot.
- [x] All agreed repository-wide checks run and initiative-scoped checks pass. A failure caused or worsened by Website Foundation, or one whose provenance cannot be established, remains blocking. A failure proven against the approved baseline to be pre-existing, out of scope, and not worsened remains explicitly failed but does not independently block this initiative.
- [x] Relevant Early Access unit, coverage, integration, browser, privacy, and durable-messaging checks pass where the repository harness supports them; an unavailable required environment is not treated as a pass.
- [x] The implementation is handed to Review and Audit without claiming final snapshot-bound gate evidence prematurely.
