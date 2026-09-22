---
id: RULE-012
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: File suffixes conventions for matching LangDrift code
title: File suffixes
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# File suffixes

Suffixes are for **siblings in the same folder**. They are not a second taxonomy on top of the path.

## 1 - The folder already named the kind

When the directory is the role, the file is just the name.

```text
// Correct
domain/gallery-track.ts
atoms/volume.ts
mocks/session.ts
formatters/ms-to-time.ts
guards/is-login-body-valid.ts
services/login-service/login.ts

// Incorrect — suffix hell
domain/gallery-track.domain.ts
atoms/volume.atom.ts
formatters/ms-to-time.fmt.ts
guards/is-login-body-valid.guard.ts
```

## 2 - A family split uses a short role

Only when several files share a prefix in one folder (a form, a widget with helpers). Closed set:

```text
form.tsx
form.types.ts
form.data.ts
form.handlers.ts
form.mappers.ts
form.validation.ts
form.action.ts
```

## 3 - Nest echo suffixes are a closed set

Across every Pulse API the same roles repeat (`port`, `adapter`, `usecase`, `controller`, `dto`, `module`). Those echoes are allowed because they are the service template, not a menu:

```text
user.port.ts
mongoose-user.adapter.ts
login.usecase.ts
authority.controller.ts
login-request.dto.ts
authority.module.ts
```

Do not add `.util`, `.helper`, `.compute`, `.fmt`, or a new coinage. A mapper next to an adapter is `user.mapper.ts` because `mappers/` already holds more than one.

## 4 - Do not stack meaning

Path + prefix + suffix must not say the same thing three times on the frontend (`lib/state/domain/gallery-track.domain.ts`).

## 5 - Extension is not a role

`.ts` unless the file contains JSX (`.tsx`). A schema or handler without JSX is `.ts`.
