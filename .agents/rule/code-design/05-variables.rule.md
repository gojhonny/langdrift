# Variables

## 1 - Declarations

### 1.1 - `const` by default
Use `const` whenever the binding is not reassigned.

```ts
// Correct
const memory = await repository.findById(memoryId)
```

### 1.2 - `let` only for intentional reassignment
Use `let` only when reassignment is part of the algorithm and improves clarity.

```ts
// FIXME: Incorrect, use reduce
// Correct
let totalTokens = 0

for (const item of items) {
  totalTokens += item.tokens
}
```

### 1.3 - `var` is prohibited
Do not use `var` in owned TypeScript or JavaScript code.

## 2 - Naming

### 2.1 - Meaning before brevity
A variable name must communicate the value's domain meaning or transformation purpose.

```ts
// Correct
const memoryTokenBudget = 600
const acceptedMemories = memories.filter(isAcceptedMemory)
```

```ts
// Incorrect
const x = 600
const data2 = data.filter(check)
```

### 2.2 - Do not encode the TypeScript type in the name
Do not use Hungarian-style prefixes or suffixes such as `strName`, `arrMemories`, `memoryObj`, or `userInterface`.

The name should describe meaning, not implementation type.

### 2.3 - Boolean names
Boolean variables should read as predicates.

Prefer prefixes such as:
- `is`;
- `has`;
- `can`;
- `should`;
- `needs`.

Domain predicates without those prefixes are allowed when the boolean meaning is already explicit.

```ts
const hasConsent = consent.status === 'granted'
const canRecallMemory = hasConsent && memoryEnabled
```

### 2.4 - Collections use plural nouns
Arrays, sets, maps, and other collections should normally use plural names.

```ts
const memories = await repository.findAll()
```

Do not use a plural name when the domain concept itself is conventionally singular, such as `metadata`.

## 3 - Scope

### 3.1 - Narrowest useful scope
Declare a variable as close as practical to the code that consumes it.

Do not lift a variable to module or outer-function scope only to avoid passing a value explicitly.

### 3.2 - Module-level state
Mutable module-level state is prohibited unless the module explicitly owns a singleton lifecycle and that ownership is intentional.

Prefer an instance, provider, or explicit dependency for mutable runtime state.

## 4 - Intermediate values

### 4.1 - Name domain-significant calculations
If an expression represents a meaningful domain fact, assign it a descriptive name instead of repeating or embedding it in a large condition.

```ts
const remainingTokens = maxTokens - usedTokens
const fitsTokenBudget = estimatedTokens <= remainingTokens
```

### 4.2 - Do not name trivial one-use expressions unnecessarily
Avoid variables that only rename an immediately obvious property or literal without improving readability.

```ts
// Incorrect
const id = memory.id
return id
```

```ts
// Correct
return memory.id
```

An exception applies when the variable name communicates a domain distinction not visible in the source expression.

## 5 - Destructuring

### 5.1 - Destructure a small coherent set
Use destructuring when several fields from the same value are used together and the resulting local names improve readability.

```ts
const { tenantId, subjectId } = context
```

### 5.2 - Do not destructure everything by habit
Do not destructure large objects only to forward or recreate all of their properties.

Keep the owner object visible when that ownership is important to understanding the code.

## 6 - Constants

### 6.1 - Module constants
Use `UPPER_SNAKE_CASE` for stable module-level constants that are not ordinary runtime values.

```ts
const MAX_MEMORY_ITEMS = 20
```

### 6.2 - Semantic promotion
Do not promote a literal to a module constant only because it appears more than once.

Promote it when the repeated value has one semantic meaning and should evolve consistently.

## 7 - Mutation

### 7.1 - Local mutation is allowed
Local mutation is acceptable when it makes the algorithm more direct than constructing repeated immutable copies.

### 7.2 - Do not mutate caller-owned inputs
Treat input objects and arrays as caller-owned unless the contract explicitly transfers mutation ownership.

Prefer returning a new result over mutating an argument.

```ts
// Incorrect
function normalizeMemory(memory: Memory): Memory {
  memory.statement = memory.statement.trim()
  return memory
}
```

```ts
// Correct
function normalizeMemory(memory: Memory): Memory {
  return {
    ...memory,
    statement: memory.statement.trim()
  }
}
```
