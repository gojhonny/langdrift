# Tailwind

Applies to application styling and shared UI styling. Component ownership remains in [frontend.md](frontend.md#shared-ui-ownership).

## Application styling and integration surfaces

Tailwind is the application styling system. Use its utilities for component, feature, layout and responsive styling.

Allow `.css` only when required or strongly implied by framework/library integration: for example Next.js `globals.css`, Tailwind directives, or technically necessary theme/token integration. Handwritten CSS must not become a parallel application styling system, even when placed in a global stylesheet.

Keep integration CSS limited to that technical purpose. Treat the Dashboard's current split CSS files as unfinished migration unless their separation is technically necessary. Neither their existence nor organizational convenience makes the current file layout a standard.

## Class composition and theme roles

Use `cn` built with `clsx` and `tailwind-merge` when conditional classes or defaults/consumer overrides need conflict-aware composition. A static class string does not need a wrapper solely for consistency. The helper's exact directory and suffix are not prescribed.

Where colors/fonts represent shared surface roles across themes, expose those roles through semantic Tailwind utilities backed by theme tokens. Keep components expressed in those roles instead of repeating unrelated palette literals. Exact palettes, token names and the current CSS decomposition are not standardized here; this is not a blanket prohibition of arbitrary-value utilities.
