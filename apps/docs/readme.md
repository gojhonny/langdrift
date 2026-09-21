# LangDrift Docs

Existing Nextra documentation app. Run `pnpm docs` from the repository root.
Tracked `.env.development` sets `NEXT_PUBLIC_SITE_URL=http://localhost:3004`.
The variable is required; there is no fallback in application code.

## Vercel

Project: `langdrift-docs`, root directory `apps/docs`, Next.js, Node 24. Include
source files outside that root so workspace packages are available. The app's
`vercel.json` builds the app and its dependencies using the root frozen lockfile.

Production supplies `NEXT_PUBLIC_SITE_URL=https://docs.langdrift.md` and the custom
domain `docs.langdrift.md`. Preview deployments remain noindex. Production allows
indexing and builds a sitemap with the configured origin, excluding `/decisions`.
Decision pages marked `searchable: false` are excluded from Pagefind.

```sh
pnpm --filter @repo/design-tokens build
NEXT_PUBLIC_SITE_URL=https://docs.langdrift.md pnpm --filter docs build
```

The production build generates `public/_pagefind`. Turbo caches that directory
alongside the Next.js output so cached deployments retain search.
