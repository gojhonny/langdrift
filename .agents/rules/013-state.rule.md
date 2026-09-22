---
id: RULE-013
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: State conventions for matching LangDrift code
title: State
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# State

## 1 - Three folders, never mixed

Global product state splits into:

```text
lib/state/domain/     # shapes
lib/state/atoms/      # or store slices — one binding per file
lib/state/mocks/      # fixtures
lib/state/global.ts   # seed values the UI may read
```

Do not put domain interfaces inside an atom file. Do not put mocks inside a component.

## 2 - One atom (or slice) per file

```ts
// Correct — atoms/volume.ts
export const volumeAtom = atom<number>(volume)
```

The folder is `atoms/` (or the Zustand slice folder). The export can keep the `Atom` suffix; the filename does not repeat it. Website, SSO, and Mobile use Jotai. Console uses Zustand. The file split does not change.

## 3 - Form state is local Immer, not an atom

Feature forms use `useImmer` plus `form.data.ts`. Do not put email, password, or field errors on a global atom. Keep entered secrets out of atoms, logs, URLs, and persistence.

## 4 - Updates go through an updater type

```ts
export type StateUpdater<State> = (
  recipe: (draft: Draft<State>) => void
) => void
```

Handlers call `updater((draft) => mapX(draft, ...))`. Mappers mutate the draft. Components do not write nested fields inline.

## 5 - Feature state stays in the feature

Login seed types live under `login/lib/state/`. They do not join `lib/state/atoms/` until they are truly global.
