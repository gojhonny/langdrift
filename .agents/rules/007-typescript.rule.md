---
id: RULE-007
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: TypeScript conventions for matching LangDrift code
title: TypeScript
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# TypeScript

## 1 - Object shapes are interfaces

```ts
// Correct
export interface GalleryTrack {
  id: string
  name: string
  durationMs: number
  album: Album
}
```

## 2 - Aliases are `type`

Use `type` for `typeof` schema, function types, and unions.

```ts
// Correct
export type LoginFormSchema = typeof loginSchema
export type LoginAction = typeof loginAction
```

## 3 - Closed vocabularies are enums

```ts
// Correct
export enum Volume {
  Loud = '100',
  Moderate = '50',
  Quiet = '20',
  Off = '0'
}
```

## 4 - Seed data uses `satisfies`

```ts
// Correct
export const progress = {
  milliseconds: 0
} satisfies Progress
```

## 5 - Untrusted input is `unknown`

HTTP bodies, SSE payloads, and env strings enter as `unknown` or `string`. A guard function narrows them. Do not type a route body as the domain object before the guard.

## 6 - No `any`

`unknown` at the edge. Domain types after the guard.
