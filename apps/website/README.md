# Website

Public LangDrift acquisition app. Next.js 16 on port 3000. Locales are `en`, `pt-BR`, `zh-Hant`, and `ja`. Routes are the localized home page and `/pricing`.

The home page explains Product Vision movement, Vision → Loop → Evidence, integrations, and early access. Early access keeps form state in React with Immer and Zod, then a Server Function validates again and posts with server-only Axios to `email-store`. Success requires a durable JetStream publication. That acceptance does not create an account, subscription, or activated trial. Submitted addresses stay out of atoms, logs, URLs, analytics, and browser persistence.

Shared application state uses Jotai. The footer contact is `dev.neongate@gmail.com`.

```sh
./cli/drift dev website
```

## Environment

From the repository root, run `./cli/drift early-access setup`. Tracked `.env.development` provides local URLs, the required `TURNSTILE_VERIFY_URL` and Cloudflare's public test site key. Ignored `apps/website/.env` supplies the shared API key and a local test secret. The Server Function verifies each challenge before calling Go. Required values fail when missing, including `TURNSTILE_VERIFY_URL`. Public URLs and the site key use static `process.env.NEXT_PUBLIC_*` references so Next.js inlines them.

| Variable | Development | Production |
| --- | --- | --- |
| `NEXT_PUBLIC_DOCS_URL` | `http://localhost:3004` | `https://docs.langdrift.md` |
| `NEXT_PUBLIC_SSO_URL` | `http://localhost:3002` | `https://sso.langdrift.md` |
| `NEXT_PUBLIC_DASHBOARD_URL` | `http://localhost:3001` | `https://dashboard.langdrift.md` |
| `EMAIL_SERVICE_URL` | `http://localhost:8080` | Deployed HTTPS email-store origin |
| `EMAIL_SERVICE_API_KEY` | Private shared key | Runtime's private shared key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare public test key | Real site key for the deployed hostname |
| `TURNSTILE_SECRET_KEY` | Cloudflare test secret | Real server-only secret |
| `TURNSTILE_EXPECTED_HOSTNAME` | `localhost` | Deployed Website hostname |
| `EARLY_ACCESS_MODE` | `development` | `production` |

Docs links use `websiteLinks.docs`, derived from `NEXT_PUBLIC_DOCS_URL`, without locale prefixes. Rebuild after changing a public URL. Hosting is undecided; configure secrets in the selected deployment environment. There is no committed production environment file. Production rejects Cloudflare test keys and plaintext runtime connections.

The form requires JavaScript and a completed security check. Its submit button stays disabled until hydration, and entered email has no native form field name so it cannot enter a fallback navigation URL. Turnstile tokens remain in component-local memory and are replaced after each submission.
