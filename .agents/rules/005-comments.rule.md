---
id: RULE-005
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: Comments conventions for matching LangDrift code
title: Comments
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Comments

## 1 - Code is the comment

Do not narrate what the next line does. Name the function and file instead.

## 2 - Section banners only in barrels and seed files

`/* === Atoms === */` is allowed in `index.ts` and `global.data.ts` to group exports. Do not banner every feature file.

## 3 - TODO must name the replacement

A TODO is allowed when it states what replaces the temporary path.

```ts
// Correct
const isAuthenticated = isAuthTemp // TODO: replace with server validation
```

```ts
// Incorrect
// TODO: fix later
```

## 4 - Catch blocks

An empty catch must say why the event is skipped, in one short comment.

```ts
} catch {
  /* malformed event — skip */
}
```

Do not leave commented-out code.
