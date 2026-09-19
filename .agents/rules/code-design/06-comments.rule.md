# Comments

## 1 - Purpose

### 1.1 - Explain why, not what
Comments should explain a constraint, tradeoff, external behavior, invariant, or decision that is not obvious from the code itself.

```ts
// Correct
// Provider usage may be partial after interruption; null means unknown, not zero.
const outputTokens = usage.outputTokens ?? null
```

```ts
// Incorrect
// Increment counter
counter += 1
```

### 1.2 - Code should carry ordinary meaning
Do not use comments to compensate for unclear names, oversized functions, or hidden control flow. Improve the code first when the meaning can be expressed directly.

## 2 - Architectural comments

### 2.1 - Current behavior only
Inline comments may explain why a local architectural boundary exists, but they must describe the current implementation.

Historical architecture belongs in ADRs or repository history.

### 2.2 - No policy duplication
Do not copy repository rules or ADR text into source comments. Link or name the governing concept only when the local reason is not otherwise understandable.

## 3 - TODO comments

### 3.1 - Concrete TODOs only
A TODO must state the missing decision or bounded work clearly enough that another engineer can understand what remains.

```ts
// Correct
// TODO: replace synthetic pricing when provider pricing input is supplied.
```

```ts
// Incorrect
// TODO: improve this
```

### 3.2 - No speculative TODOs
Do not add TODOs for hypothetical scalability, provider replacement, future abstractions, or production hardening that is not part of the current product direction.

## 4 - Disabled code

### 4.1 - Do not comment out source code
Delete dead code instead of preserving it in comments. Git history already preserves previous implementations.

```ts
// Incorrect
// const result = oldImplementation(input)
const result = newImplementation(input)
```

## 5 - JSDoc

### 5.1 - Public contracts
Use JSDoc when a public package contract, framework integration point, generic constraint, or non-obvious invariant cannot be communicated sufficiently through the type signature and naming.

### 5.2 - Do not restate types
Do not add JSDoc that merely repeats parameter names, TypeScript types, or obvious return values.

## 6 - Warning comments

### 6.1 - Preserve external constraints
A short warning comment is appropriate when removing or changing apparently redundant code would violate a provider, protocol, migration, or framework requirement.

### 6.2 - Keep warnings testable
Whenever practical, the condition described by a warning comment should also be protected by a test, type, schema, or rule rather than relying on the comment alone.
