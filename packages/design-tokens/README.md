# @repo/design-tokens

LangDrift visual tokens, with no UI components. The sole source is
`src/foundation/*.tokens.json`; `pnpm --filter @repo/design-tokens build`
validates references and writes ignored `dist/index.css` and `dist/tokens.json`.
Use `pnpm --filter @repo/design-tokens dev` to rebuild on source changes.

Import `@repo/design-tokens` for CSS or `@repo/design-tokens/tokens` for canonical
JSON. The `--ld-` variables preserve brand, light/dark themes, semantic colors,
radii, spacing, typography, shadows and easing. Components live in `@repo/react`.
