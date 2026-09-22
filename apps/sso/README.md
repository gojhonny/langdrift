# SSO

Account preview adjacent to the website. Next.js 16 on port 3002. `/` redirects to `/sign-in`.

The screens progress through sign-up, create organization, select plan, and setup. Sign-in is a separate step. Plan labels in the preview are Free, Plus+, and Pro. Prices, limits, and billing cadence are not defined here. Apple, Google, and GitHub buttons report that provider sign-in is not connected. `@workos-inc/authkit-nextjs` is installed and is not imported by these screens.

Shared state uses Jotai. The state logger stays in the app.

```sh
./cli/drift dev sso
```
