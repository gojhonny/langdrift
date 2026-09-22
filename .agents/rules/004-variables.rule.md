---
id: RULE-004
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: Variables conventions for matching LangDrift code
title: Variables
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Variables

## 1 - Declarations

Use `const`. Do not use `var`. Use `let` only when the binding must be reassigned.

## 2 - Props are named, then destructured

Layout and page props use a `*Props` interface. Destructure on the next line. Do not destructure in the parameter list of owned components.

```ts
// Correct
interface GalleryLayoutProps {
  children: React.ReactNode
}

export default function GalleryLayout(props: GalleryLayoutProps) {
  const { children } = props
}
```

```ts
// Incorrect
export default function GalleryLayout({ children }: GalleryLayoutProps) {
}
```

## 3 - Names carry the suffix of the kind

| Kind | Binding |
|---|---|
| Atom | `volumeAtom` |
| Schema | `loginSchema` |
| Seed data | `loginFormState`, `loginStateData` |
| Guard | `isLoginBodyValid` |
| Compute | `getClosestIconVolume`, `msToTime` |
| Map | `getIconByVolume`, `mapEmailChange` |
| Handler | `handleEmailBlur`, `handlePlayPause` |
| Instance | `loginInstance` |

Do not name owned modules `utils`, `helpers`, `common`, or `shared`.
