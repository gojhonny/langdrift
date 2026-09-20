---
id: RULE-000
always-apply: true
status: implemented
priority: critical
title: Foundation stone
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Foundation stone

## 1 - Predictability is the design

Owned code must look the same no matter who wrote it. A second developer opens a slot, a form, a route, or a domain service and already knows the folders, the filenames, and where state lives.

When adding work, follow the tree the codebase already uses. Do not invent a third layout because the feature feels special. Local cleverness that only the author can navigate is a defect.

A reader must guess the path and the filename before opening the file.

## 2 - One file, one job

A file owns one reason to change. Do not combine a component, its handlers, its schema, and its types in a single module.

```ts
// Correct — each concern is a file
form.tsx
form.types.ts
form.handlers.ts
form.mappers.ts
form.validation.ts
form.data.ts
```

```ts
// Incorrect
form.tsx  // component + handlers + zod + types + initial state
```

## 3 - The page is a leaf

`page.tsx` only composes. It does not fetch, validate, map, or hold local UI state.

```ts
// Correct
export default function LoginPage() {
  return <LoginForm />
}
```

```ts
// Incorrect
export default function LoginPage() {
  const [email, setEmail] = useState('')
  // validation, submit, layout...
}
```

## 4 - Vendor stays in infra

Third-party adapters live under `infra/<vendor>`. Owned product code lives under `lib`. HTTP boundaries live under `api`. UI that belongs to a route lives under that route's `lib/`.

Do not put Zod helpers, Immer types, or shadcn primitives inside a feature folder. Do not put feature forms inside `infra`.
