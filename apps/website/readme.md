# website

Scaffold only. No pages or product components are implemented in this PR.

## Local environment

```sh
cp .env.template .env.local
```

`NEXT_PUBLIC_SSO_URL` and `NEXT_PUBLIC_DOCS_URL` are required. A missing variable throws at module load and stops `next dev` / `next build`; there is no hardcoded fallback. See `apps/docs/content/decisions/2026-09-20-environment-variables-fail-fast.mdx`.
