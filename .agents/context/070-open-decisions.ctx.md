---
context: open-decisions
status: current
source_branch: staging
reviewed_at: 2026-09-21
sources:
  - AGENTS.md
  - packages/sdk/README.md
  - packages/core/README.md
---

# Open decisions

These are unresolved in the current docs and code. Do not close them by choosing a value in an unrelated change.

- The Product Vision formula is open. Demo percentages are not that formula.
- Website offers name a 15-day free trial, Plus, and Pro. Prices, limits, billing cadence, and exact entitlements are open.
- The auth provider and the exact auth methods are open.
- There is no general product backend contract. The Early Access messaging runtime is a narrow use case, not that contract.
- `@langdrift/sdk` and `@langdrift/setup` are unpublished. Packing the workspace does not publish them.
- Setup does not connect GitHub, Linear, or Obsidian. Live platform integrations are not generally available from these packages.
