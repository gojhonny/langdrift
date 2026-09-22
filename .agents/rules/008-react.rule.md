---
id: RULE-008
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: React conventions for matching LangDrift code
title: React
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# React

## 1 - Named function components

Export `function Name`. Do not assign the component to an arrow const.

```ts
// Correct
export function PlayPauseButton() {}
export default function LoginPage() {}
```

```ts
// Incorrect
export const PlayPauseButton = () => {}
```

## 2 - Folder matches the component file

```text
play-pause-button/play-pause-button.tsx
volume-bar/volume-bar.tsx
form/form.tsx
```

Do not leave a lone `Button.tsx` at a random `components/` root for owned UI.

## 3 - Client vs server is a folder

Owned UI lives in `lib/ui/client/` or `lib/ui/server/`. A client file starts with `'use client'`. Server layouts do not.

## 4 - One level of handlers inside the component

The component may declare `function handleX` / `function onX` that forwards to `*.handlers.ts`. Do not nest another function inside that handler.

## 5 - shadcn stays in infra

Import primitives from `@shadcn/components/ui/*`. Do not fork those primitives into `lib/`. First-party product UI does not use shadcn as a domain name.
