# Website

Public LangDrift acquisition app. Next.js 16 on port 3000. Locales are `en`, `pt-BR`, `zh-Hant`, and `ja`. Routes are the localized home page and `/pricing`.

The home page explains Product Vision movement, Vision → Loop → Evidence, integrations, and early access. Early access keeps form state in React with Immer and Zod, then a Server Function validates again and posts with server-only Axios to `email-store`. Success requires a durable JetStream publication. That acceptance does not create an account, subscription, or activated trial. Submitted addresses stay out of atoms, logs, URLs, analytics, and browser persistence.

Shared application state uses Jotai. The footer contact is `dev.neongate@gmail.com`.

```sh
./cli/drift dev website
```

## Environment

From the repository root, run `./cli/drift env setup`. Tracked `.env.development` provides local URLs. Ignored `apps/website/.env` supplies `EMAIL_SERVICE_API_KEY`. Required values fail when missing. There is no hardcoded fallback. Public URLs use static `process.env.NEXT_PUBLIC_*` references so Next.js inlines them.

| Variable | Development | Vercel production |
| --- | --- | --- |
| `NEXT_PUBLIC_DOCS_URL` | `http://localhost:3004` | `https://docs.langdrift.md` |
| `NEXT_PUBLIC_SSO_URL` | `http://localhost:3002` | `https://sso.langdrift.md` |
| `NEXT_PUBLIC_DASHBOARD_URL` | `http://localhost:3001` | `https://dashboard.langdrift.md` |
| `EMAIL_SERVICE_URL` | `http://localhost:8080` | Deployed HTTPS email-store origin |
| `EMAIL_SERVICE_API_KEY` | Private shared key | Runtime's private shared key |

Docs links use `websiteLinks.docs`, derived from `NEXT_PUBLIC_DOCS_URL`, without locale prefixes. Rebuild after changing a public URL. Production values live in Vercel. There is no committed production environment file.
