// Required environment contract for the website. Missing values throw at
// module load so `next dev` and `next build` stop immediately; there is no
// hardcoded runtime fallback. Local values live in `.env.development`.
// Policy: apps/docs/content/en/decisions/2026-09-20-environment-variables-fail-fast.mdx

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See apps/website/.env.development.`
    )
  }
  return value.replace(/\/+$/, '')
}

// Static `process.env.NEXT_PUBLIC_*` references so Next can inline them.
export const websiteEnv = {
  docsUrl: requireEnv('NEXT_PUBLIC_DOCS_URL', process.env.NEXT_PUBLIC_DOCS_URL),
  ssoUrl: requireEnv('NEXT_PUBLIC_SSO_URL', process.env.NEXT_PUBLIC_SSO_URL),
  turnstileSiteKey: requireEnv(
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  )
}
