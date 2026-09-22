# @repo/react

Shared LangDrift React UI. First-party product components live under `src/ui`. SmoothUI, shadcn, and Orbz stay in `src/vendors` and are implementation foundations, not product vocabulary.

## Product UI

Import the public entries declared in `package.json`:

- `@repo/react/ui/product-vision-curve` and `@repo/react/ui/drift-curve` — Product Vision movement
- `@repo/react/ui/agent-orb` — Voice Orb
- `@repo/react/ui/brand`, `@repo/react/ui/metric`, `@repo/react/ui/status-pill`
- `@repo/react/ui/theme-toggle`, `@repo/react/ui/target-distribution-chart`
- `@repo/react/ui/icons` and `@repo/react/ui/icons/server`
- `@repo/react/ui/ai-avatars`
- `@repo/react/utilities` — `cn`
- `@repo/react/styles.css` and `@repo/react/tokens.css`

Visual tokens come from `@repo/design-tokens`. This package does not publish to npm. `build` and `typecheck` both run `tsc --noEmit`. Peer dependencies are React 19 and React DOM 19. Next.js 16 is an optional peer.
