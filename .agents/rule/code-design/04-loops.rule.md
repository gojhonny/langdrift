# Loops and Iteration

## 1 - Default collection operations

### 1.1 - `map`
Use `map` when every input item produces one output item.

```ts
const ids = memories.map((memory) => memory.id)
```

### 1.2 - `filter`
Use `filter` when selecting a subset without changing the selected item shape.

### 1.3 - `find`, `some`, and `every`
Use these operations when iteration may stop as soon as the result is known.

### 1.4 - `reduce`
Use `reduce` only for a real aggregation with an accumulator whose meaning is obvious.

```ts
// Correct
const totalTokens = usage.reduce((total, item) => total + item.tokens, 0)
```

```ts
// Incorrect
const result = memories.reduce((accumulator, memory) => {
  // unrelated branching, mutation, and side effects
  return accumulator
}, createAccumulator())
```

Do not use `reduce` as a generic replacement for readable iteration.

## 2 - Explicit loops

### 2.1 - Default prohibition
Do not use `for`, `for...in`, `for...of`, or `while` when a standard collection operation expresses the same intent more clearly.

### 2.2 - Allowed `for...of` exception
Use `for...of` when at least one of these is required:
- sequential `await`;
- explicit `break` or `continue`;
- stateful iteration where collection chaining would hide the algorithm;
- ordered side effects.

```ts
// Correct exception
for (const event of events) {
  if (event.type === 'stop') break

  await processEvent(event)
}
```

### 2.3 - Indexed `for` exception
An indexed `for` is allowed only when the index itself is part of the algorithm or when direct indexed access materially improves clarity or performance.

### 2.4 - `while` exception
Use `while` only when repetition is controlled by evolving state rather than collection traversal.

The terminating condition must be obvious from the loop body or surrounding code.

## 3 - Prohibited iteration patterns

### 3.1 - Async `forEach`
Do not use an `async` callback with `forEach` when completion, failure, or ordering matters.

```ts
// Incorrect
memories.forEach(async (memory) => {
  await persistMemory(memory)
})
```

Use `Promise.all` for intentional parallelism or `for...of` for intentional sequencing.

### 3.2 - Side effects inside `map`
Do not use `map` primarily for side effects.

```ts
// Incorrect
memories.map((memory) => {
  queue.push(memory)
  return memory
})
```

### 3.3 - Mutation hidden inside `filter`
A `filter` predicate must decide inclusion. It must not mutate external state as its primary behavior.

## 4 - Parallelism

### 4.1 - `Promise.all`
Use `Promise.all` when operations are independent, may safely execute concurrently, and all results are required.

### 4.2 - `Promise.allSettled`
Use `Promise.allSettled` only when individual failures are expected to be collected rather than fail the whole operation.

### 4.3 - Do not parallelize by accident
Do not replace sequential behavior with concurrency only to shorten code or improve theoretical speed.

## 5 - Chaining

### 5.1 - Keep chains readable
Collection chains should represent one coherent transformation pipeline.

When a chain requires multiple non-trivial callbacks or obscures intermediate domain meaning, name the intermediate value.

```ts
// Correct
const acceptedMemories = memories.filter(isAcceptedMemory)
const memoryIds = acceptedMemories.map((memory) => memory.id)
```

A single fluent chain is also valid when each step is obvious and no meaningful intermediate domain concept is lost.
