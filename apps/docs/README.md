# Docs

Nextra documentation app. Next.js 16 on port 3004. It documents the local Vision, Loop, and Evidence protocol, `@langdrift/sdk`, and `@langdrift/setup`. Both packages are unpublished release candidates.

Decision records under `content/en/decisions/` stay English-only. Unprefixed `/decisions/*` redirects to `/en/decisions/*`. They carry `searchable: false`, so they stay out of navigation, the sitemap, and Pagefind until one is deliberately promoted.

```sh
./cli/drift dev docs
```

Tracked `.env.development` sets `NEXT_PUBLIC_SITE_URL=http://localhost:3004` and `NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000`. Both are required origins. There is no fallback in application code.

## Vercel

Project `langdrift-docs`, root directory `apps/docs`, Node 24. The app `vercel.json` builds from the repository root with Turbo so workspace packages are included, using the frozen lockfile.

Production supplies `NEXT_PUBLIC_SITE_URL=https://docs.langdrift.md`, `NEXT_PUBLIC_WEBSITE_URL=https://langdrift.md`, and the domain `docs.langdrift.md`. Preview deployments remain noindex. Production allows indexing. `postbuild` writes `public/_pagefind` from the Next server output. Turbo caches that directory with the Next output so a cached deployment keeps search.

```sh
pnpm --filter @repo/design-tokens build
NEXT_PUBLIC_SITE_URL=https://docs.langdrift.md pnpm --filter docs build
```
