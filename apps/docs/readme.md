# LangDrift Docs

Nextra documentation for LangDrift.

## Development

From the repository root:

```sh
pnpm docs
```

The application runs at `http://localhost:3004`.

## Configuration

`NEXT_PUBLIC_SITE_URL` is the deployed documentation origin. Leave it unset for
local development. Production deployments must set it to an HTTPS origin
without a path, query, or fragment.

## Validation

```sh
pnpm --filter docs typecheck
pnpm --filter docs build
```

The production build creates a Pagefind index in `public/_pagefind`.
