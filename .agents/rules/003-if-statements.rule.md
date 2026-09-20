---
id: RULE-003
always-apply: true
title: If statements
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# If statements

## 1 - Guard and leave

Reject impossible cases with an early return. Do not nest the happy path.

```ts
// Correct
if (!audioRef.current) return
if (fieldErrors === null) return
if (!trackId) return
```

```ts
// Incorrect
if (audioRef.current) {
  if (fieldErrors !== null) {
    // happy path
  }
}
```

## 2 - One decision per guard cluster

Independent rejections that mean the same thing belong in one condition. A second early return for a different decision requires another function (see RULE-002).

```ts
// Correct
if (!event.id || !event.name) return null
```

```ts
// Incorrect
if (!event.id) return null
if (!event.name) return null
```

## 3 - Auth and redirects

A layout may guard with `if` and `redirect`. Keep that as the only branch in the layout.

```ts
// Correct
if (!isAuthenticated) {
  redirect('/login')
}

return children
```
