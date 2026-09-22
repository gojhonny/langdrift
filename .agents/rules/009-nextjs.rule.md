---
id: RULE-009
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: Next.js conventions for matching LangDrift code
title: Next.js
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Next.js

## 1 - App Router only

Routes live under `app/`. Use route groups `(public)` and `(protected)`. Use parallel slots `@name` when independent regions load on their own.

## 2 - Every slot repeats the same files

A parallel slot or auth page owns this set when the sibling already has it:

```text
page.tsx
layout.tsx
error.tsx
loading.tsx
default.tsx
lib/
```

Do not skip `error` / `loading` / `default` because the slot is small.

## 3 - `page.tsx` composes one child

```ts
// Correct
export default function GallerySlot() {
  return <TrackList />
}
```

## 4 - Layouts name their slots

Player-style layouts declare each slot on a props interface and destructure, including hyphenated names.

```ts
interface PlayerLayoutProps {
  'user-menu'?: React.ReactNode
  'now-playing'?: React.ReactNode
  gallery?: React.ReactNode
  uploader?: React.ReactNode
}
```

## 5 - `error.tsx` is a client leaf

```ts
'use client'

export default function LoginError(props: PageErrorProps) {
  const { error, reset } = props

  function handleReset() {
    reset()
  }
}
```

## 6 - Server actions are `'use server'` files

`form.action.ts` next to the form, not inline in the component. Route handlers in `app/api/**/route.ts` only wire the request to a guard and a service.

## 7 - Metadata is exported, not rendered

```ts
export const metadata: Metadata = {
  title: 'Pulse - Login',
  description,
  robots
}
```
