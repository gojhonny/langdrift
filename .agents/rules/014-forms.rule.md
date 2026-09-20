---
id: RULE-014
always-apply: true
title: Forms
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Forms

A form is a copied machine. Login and signup must keep the same files. A new form copies that tree, then changes names.

```text
lib/ui/client/form/form.tsx
lib/ui/client/form/form.types.ts
lib/ui/client/form/form.data.ts
lib/ui/client/form/form.handlers.ts
lib/ui/client/form/form.mappers.ts
lib/ui/client/form/form.validation.ts
lib/ui/actions/form.action.ts
lib/ui/server/form-layout/form-layout.tsx
lib/state/state.types.ts
lib/state/state.data.ts
```

## 1 - `form.tsx` only binds events

The component holds `useImmer`, destructures state, declares `onX` / `handleX` wrappers, and renders. It does not call Zod or mutate drafts.

## 2 - Handlers update; mappers assign

```ts
// handlers
export function handleEmailChange(
  email: LoginFormState['email'],
  updater: StateUpdater<LoginFormState>
) {
  updater((draft: LoginFormState) => mapEmailChange(draft, email))
}
```

```ts
// mappers
export function mapEmailChange(draft: LoginFormState, email: string) {
  draft.email = email
  draft.fieldErrors.email = undefined
}
```

## 3 - Validation is the schema file

Zod lives in `form.validation.ts`. Blur and submit run `getFieldErrors` from `infra/zod`. The guard at the API boundary reuses the same schema.

## 4 - The action is the only server hop

`form.action.ts` starts with `'use server'` and calls the HTTP instance. The component never imports axios.

## 5 - Do not skip a file because the form is small

If signup exists, it has the same set as login. Missing `form.mappers.ts` is a defect, not a simplification. Do not invent extra suffixes (`form.compute.ts`, `form.hook.ts`) on top of this set.
