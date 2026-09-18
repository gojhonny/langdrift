# Expressions and Declarations

## 1 - Plain objects

### 1.1 - Default for passive data
Use a plain typed object when a value mainly carries data and does not own identity-specific behavior or lifecycle.

### 1.2 - No class ceremony for passive records
Do not wrap passive DTO-like data in classes only to attach getters or mirror fields.

## 2 - Factory functions

### 2.1 - Use a factory when creation has meaning
Use a named factory when creation enforces invariants, normalization, defaults, or derived values.

```ts
function createTokenBudget(tokens: number): TokenBudget {
  if (tokens < 0) throw new RangeError('Token budget cannot be negative')

  return { tokens }
}
```

### 2.2 - Do not create factories for ordinary literals
Do not introduce a factory when direct construction is already valid and clear.

## 3 - Classes

### 3.1 - Classes own state, lifecycle, or cohesive behavior
Use a class when behavior and state belong together, lifecycle matters, encapsulation is useful, or a framework contract requires an instance/provider shape.

### 3.2 - No class-per-action convention
Do not create one class for every operation by default.

A one-method class requires a concrete reason such as:
- framework/provider lifecycle;
- stateful behavior;
- a real substitution boundary;
- encapsulated invariants;
- a contract that is clearer as an object.

### 3.3 - Composition over inheritance
Prefer composition for owned application behavior.

Inheritance is allowed when required by a framework or when a base abstraction owns a genuine runtime contract and shared behavior.

Do not inherit only to reuse implementation.

## 4 - Object expressions

### 4.1 - Explicit boundary mapping
When creating domain, application, transport, persistence, or provider-boundary objects, prefer explicit field mapping if spreading could propagate fields unintentionally.

```ts
// Correct
const projection: MemoryProjection = {
  id: memory.id,
  statement: memory.statement
}
```

```ts
// Incorrect at a trust boundary
const projection: MemoryProjection = {
  ...memory
}
```

Object spread remains valid for local copies and updates when the full source shape is intentionally preserved.

### 4.2 - Property shorthand
Use property shorthand when the property and variable share the same meaningful name.

## 5 - Nullish and logical expressions

### 5.1 - `??`
Use nullish coalescing when only `null` or `undefined` should trigger the fallback.

```ts
const retries = configuration.retries ?? 0
```

### 5.2 - `||`
Use `||` for fallback only when every falsy value is intentionally treated as absent.

Do not replace a valid `0`, empty string, or `false` accidentally.

## 6 - Optional chaining

### 6.1 - Acceptable absence
Use optional chaining when absence is part of the valid contract.

### 6.2 - Do not hide invariant violations
Do not use optional chaining merely to silence a path that should be required.

```ts
// Incorrect when session is required here
session?.close()
```

Validate the invariant and fail clearly instead.

## 7 - Literal expressions

### 7.1 - Avoid magic domain values
Name literals that encode a domain threshold, policy, or reusable semantic value.

### 7.2 - Ordinary local literals stay local
Do not create constants for obvious one-off literals that carry no domain meaning.

## 8 - Enums and literal vocabularies

### 8.1 - Prefer literal unions
Prefer string literal unions or `as const` maps for closed string vocabularies.

```ts
type MemoryStatus = 'idle' | 'queued' | 'accepted'
```

### 8.2 - Enum exception
Use a TypeScript `enum` only when its runtime enum semantics are intentionally required by an external contract or a concrete implementation need.

## 9 - Destructured declarations

### 9.1 - Keep ownership visible
Do not destructure deeply nested objects so aggressively that the source owner becomes unclear.

Prefer a named intermediate object when the ownership boundary matters.
