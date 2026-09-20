---
id: RULE-011
always-apply: true
title: Folders and aliases
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Folders and aliases

## 1 - Four roots under `app/`

| Root | Owns |
|---|---|
| `(public)` / `(protected)` | Routes, slots, page trees |
| `lib/` | Owned capabilities (state, ui, template, feature kits) |
| `infra/<vendor>/` | Zod, Immer, Next types, shadcn |
| `api/<context>/` | BFF / HTTP boundary |

## 2 - Feature `lib/` repeats ui and state

A login, signup, gallery, or slot uses:

```text
lib/ui/client/
lib/ui/server/
lib/ui/actions/     # when a server action exists
lib/ui/index.ts
lib/state/          # when the feature has local seed types
```

## 3 - Alias the slice, not the whole app

Each route slice gets a path alias to its `lib/`:

```text
@login/*        →  app/(public)/(auth)/login/lib/*
@signup/*       →  app/(public)/(auth)/signup/lib/*
@gallery/*      →  .../@gallery/lib/*
@atoms          →  app/lib/state/atoms/index.ts
@domain         →  app/lib/state/domain/index.ts
@infra/*        →  app/infra/*
@api/*          →  app/api/*
```

Do not import via deep relative chains (`../../../../`) across slices.

## 4 - Barrels are the public surface

`index.ts` re-exports only what other slices may import. Internal files import each other by relative path inside the folder.

## 5 - Domain services use layer aliases

A Nest context aliases layers, not random deep paths:

```text
@domain/*         →  src/<context>/domain/*
@application/*    →  src/<context>/application/*
@infra/*          →  src/<context>/infra/*
@interface/*      →  src/<context>/interface/*
@pack/<name>      →  packages/<name>
```
