---
id: RULE-006
alwaysApply: false
globs: "**/*.{ts,tsx,js,jsx}"
description: Loops conventions for matching LangDrift code
title: Loops
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Loops

## 1 - Named collection work is its own file

`map`, `filter`, `find`, `some`, `every`, and `reduce` belong in a helper file when they are a named step. Do not hide a reduce inside a component render.

```ts
// Correct
export function getClosestIconVolume(value: number): Volume {
  const volumes = Object.values(Volume) as Volume[]

  return volumes.reduce((closest, current) => {
    const currentDistance = Math.abs(Number(current) - value)
    const closestDistance = Math.abs(Number(closest) - value)

    return currentDistance < closestDistance ? current : closest
  })
}
```

## 2 - Render lists with `map`

A list component maps data to items. It does not compute derived domain values inline.

## 3 - No `for` when a collection method is the meaning

Use an explicit loop only when the index is part of the algorithm or when control flow cannot be named as a collection step.
