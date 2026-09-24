---
id: RULE-018
description: Missing environment values throw, and product configuration lives in .env files.
title: Environment
status: implemented
priority: critical
alwaysApply: true
date: 2026-09-22
---

# Environment

A missing environment value throws. The application, worker, or CLI must not invent a value because configuration was omitted.

Safe local values belong in tracked `.env.development`. Private values belong in gitignored `.env`. Production values belong to the deployment platform.

Read a variable at the owning configuration boundary, validate it there, and pass the typed value to the feature. Do not parse the same variable again inside a component, and do not fill a missing value with a literal.

```ts
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''
```

```go
value := os.Getenv("VALUE")
if value == "" {
  value = "literal"
}
```

A runner that cannot load the owning `.env*` file may set the value itself. That assignment is not an application fallback.

Test fixtures, protocol constants, validation allowlists, and documentation examples are not runtime configuration.
