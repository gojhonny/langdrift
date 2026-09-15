# Lang Drift React / Design Foundation

This package is the single shared design-system boundary for the initial Lang Drift scaffold. It intentionally contains **tokens and configuration only** in this PR; no product components are implemented yet.

## Surface foundations

| Surface | Foundation | Lang Drift adaptation |
| --- | --- | --- |
| Public website, auth-adjacent acquisition, plans | Cohere DESIGN.md | Editorial scale, whitespace, dark product bands, selective gradient cards, real product UI in the story |
| Console / authenticated app | Vercel DESIGN.md | Monochrome precision, hairlines, restrained radius/elevation, Geist-oriented product typography |
| Mobile PWA | Vercel DESIGN.md | Same product language, adapted for installed/mobile navigation and responsive executive views |
| Metrics, graphs, data motion | SmoothUI | Preferred metric/data interaction primitives; always inherit Lang Drift tokens |
| Voice presence | Orbz | Canonical future Voice visual; Amarelo app is the interaction reference |

Sources:
- https://getdesign.md/cohere/design-md
- https://getdesign.md/vercel/design-md
- https://smoothui.dev/
- https://orbz.site/
- https://app.amarelo.life/

## Color semantics

Orange (`#F97316`) is Lang Drift identity. It must not represent generic warning, error, or negative drift.

- Intentional Evolution: `#3B82F6`
- Healthy / Aligned: `#16A34A`
- Unexplained Drift: `#DC2626`
- Unknown / Review: `#A855F7`

Do not mix semantic colors decoratively.

## SmoothUI

SmoothUI is treated as a source/reference for metric and data-motion primitives, following the same copy-in/vendor pattern as the Amarelo reference repository. The vendor folder is reserved now; components will be introduced only when a product surface requires them.
