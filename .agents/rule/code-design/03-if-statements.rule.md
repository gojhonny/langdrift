# If Statements

## 1 - Guard clauses

### 1.1 - Error-first strategy
Use a guard clause to reject one invalid, unavailable, or terminal condition before the main path.

A single-line guard is allowed when the body is one terminal statement and remains readable.

```ts
// Correct
if (!memory) return null

return projectMemory(memory)
```

```ts
// Correct
if (!memory) {
  throw new Error('Memory is required')
}

return projectMemory(memory)
```

### 1.2 - One guard decision
Follow `0001-functions.rule.md`: a function should not accumulate multiple independent early-return guards. Combine conditions that represent the same rejection decision or extract a separate function when the main function is becoming branch-heavy.

```ts
// Correct
if (!event.id || !event.name) return null

return transformEvent(event)
```

```ts
// Incorrect
if (!event.id) return null
if (!event.name) return null

return transformEvent(event)
```

## 2 - Braces

### 2.1 - Multi-line bodies require braces
Any branch containing more than one statement must use braces.

```ts
// Correct
if (!result) {
  logger.warn('Missing result')
  return null
}
```

### 2.2 - Single-line non-terminal branches use braces
Do not omit braces for a non-terminal side effect.

```ts
// Incorrect
if (enabled) startWorker()

continueSetup()
```

```ts
// Correct
if (enabled) {
  startWorker()
}

continueSetup()
```

## 3 - Else

### 3.1 - Do not use `else` after a terminal branch
If an `if` branch returns or throws, continue the next path without `else`.

```ts
// Correct
if (!memory) return null

return projectMemory(memory)
```

```ts
// Incorrect
if (!memory) {
  return null
} else {
  return projectMemory(memory)
}
```

### 3.2 - `else if` is for one mutually-exclusive decision
Use `else if` only when the branches are different outcomes of the same decision.

If conditions represent independent rules, split them or use named predicates instead of creating a long chain.

## 4 - Conditions

### 4.1 - Prefer direct boolean expressions
Do not compare booleans to `true` or `false` unless the distinction is required by a third-state contract.

```ts
// Correct
if (memoryEnabled) {
  enableMemory()
}
```

```ts
// Incorrect
if (memoryEnabled === true) {
  enableMemory()
}
```

### 4.2 - Name domain-significant conditions
When a condition combines multiple facts or expresses a domain decision, extract a named boolean or predicate.

```ts
// Correct
const canRecallMemory = memoryEnabled && hasConsent && query.length > 0

if (!canRecallMemory) return EMPTY_MEMORY
```

```ts
// Incorrect
if (!(memoryEnabled && hasConsent && query.length > 0 && !isExpired)) {
  return EMPTY_MEMORY
}
```

### 4.3 - No assignment inside conditions
Do not assign values inside an `if` condition in owned code.

## 5 - Ternary expressions

### 5.1 - Simple value selection
Use a ternary only for a simple two-value expression.

```ts
const status = enabled ? 'enabled' : 'disabled'
```

### 5.2 - Nested ternaries are prohibited
Do not nest ternaries. Use a named function, a guard, or a `switch`.

## 6 - Switch

### 6.1 - Closed discriminated decisions
Prefer `switch` when several branches depend on the same closed discriminant.

### 6.2 - Exhaustiveness
When the discriminant is a TypeScript union, handle every variant and make unhandled variants a compile-time error.

```ts
function statusLabel(status: MemoryStatus): string {
  switch (status) {
    case 'idle':
      return 'Idle'
    case 'queued':
      return 'Queued'
    case 'accepted':
      return 'Accepted'
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}
```
