# Website

Public LangDrift acquisition surface, with early access through the messaging
runtime and documentation links in the desktop/mobile header and footer.

## Environment

From the repository root, run `./cli/drift env setup`. Tracked `.env.development`
provides local URLs; ignored `apps/website/.env` supplies `EMAIL_SERVICE_API_KEY`.
Required values fail explicitly when missing. Public URLs use static
`process.env.NEXT_PUBLIC_*` references so Next.js includes the correct origin.

| Variable | Development | Vercel production |
| --- | --- | --- |
| `NEXT_PUBLIC_DOCS_URL` | `http://localhost:3004` | `https://docs.langdrift.md` |
| `NEXT_PUBLIC_SSO_URL` | `http://localhost:3002` | `https://sso.langdrift.md` |
| `NEXT_PUBLIC_DASHBOARD_URL` | `http://localhost:3001` | `https://dashboard.langdrift.md` |
| `EMAIL_SERVICE_URL` | `http://localhost:8080` | Actual deployed HTTPS email-store origin |
| `EMAIL_SERVICE_API_KEY` | Private shared key | Runtime's private shared key |

The docs links use `websiteLinks.docs`, derived from `NEXT_PUBLIC_DOCS_URL`, without
locale prefixes. Rebuild after changing a public URL. Production values live in
Vercel; there is no committed production environment file.

The existing early-access form keeps React local state with Immer and Zod. Its
Server Function validates again and uses Axios to reach `email-store`; success
requires a durable JetStream publication. Submitted addresses stay out of atoms,
logs, URLs, analytics and browser persistence.
