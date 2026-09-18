# TypeScript

## 1 - Compiler contract

### 1.1 - Strict mode is the baseline
Owned TypeScript must remain compatible with strict compiler settings.

Do not weaken `strict`, `noUncheckedIndexedAccess`, or other repository compiler safety settings to make a local implementation compile.

### 1.2 - Fix the model, not the compiler
When TypeScript reports an unsafe access or impossible assignment, first inspect whether the type or control flow is wrong.

Do not solve modeling problems with blanket assertions, `any`, or disabled compiler options.

## 2 - Type inference

### 2.1 - Let TypeScript infer obvious local values
Do not annotate local variables when the initializer already produces the exact useful type.

```ts
// Correct
const memoryCount = memories.length
```

```ts
// Incorrect
const memoryCount: number = memories.length
```

### 2.2 - Explicit types at important boundaries
Prefer explicit types for:
- exported contracts;
- public function returns when inference would expose implementation detail;
- dependency boundaries;
- complex generic APIs;
- domain-significant object shapes.

### 2.3 - Do not force annotations everywhere
Type annotations are not documentation when they merely repeat obvious compiler knowledge.

## 3 - `type` and `interface`

### 3.1 - Use `type` for composition and closed shapes
Prefer `type` for unions, intersections, mapped types, aliases, tuples, function signatures, and local object shapes.

```ts
type MemoryStatus = 'idle' | 'queued' | 'accepted'
```

### 3.2 - Use `interface` for object capability contracts
Use `interface` when defining a consumer-facing object contract intended to describe capabilities or implementation shape.

```ts
interface MemoryRepository {
  findAccepted(query: MemoryQuery): Promise<readonly Memory[]>
}
```

### 3.3 - No `I` prefix
Do not prefix interfaces with `I`.

```ts
// Incorrect
interface IMemoryRepository {}
```

### 3.4 - Do not create an interface only to mirror one class
A class does not need a matching interface unless consumers benefit from depending on that contract independently.

## 4 - `unknown` and untrusted values

### 4.1 - Use `unknown` at untrusted boundaries
Use `unknown` when the runtime shape is not yet trusted, including parsed external data, provider payloads, caught errors, and generic deserialization boundaries.

### 4.2 - Narrow before use
Validate, parse, or narrow `unknown` before accessing properties or passing it into trusted domain behavior.

```ts
function parseEvent(input: unknown): Event {
  return EventSchema.parse(input)
}
```

### 4.3 - Catch values are unknown
Do not assume a caught value is an `Error`.

```ts
try {
  await operation()
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message)
  }
}
```

## 5 - `any`

### 5.1 - `any` is prohibited in owned code
Do not use explicit `any` in application, domain, or package-owned contracts.

### 5.2 - Narrow third-party exception
`any` is allowed only when a third-party declaration or framework boundary cannot be represented more safely.

Keep the exception at the boundary and convert immediately to an owned type or `unknown`.

### 5.3 - Do not propagate `any`
An external `any` must not become an exported Amarelo contract.

## 6 - Type assertions

### 6.1 - Assertions do not validate runtime data
Do not use `as SomeType` to pretend an untrusted value has been validated.

```ts
// Incorrect
const event = JSON.parse(payload) as MemoryEvent
```

```ts
// Correct
const event = MemoryEventSchema.parse(JSON.parse(payload))
```

### 6.2 - Narrow assertions are allowed when runtime truth is already established
A local assertion is acceptable when code has proven the fact but TypeScript cannot express the relationship cleanly.

The assertion must be as narrow as possible.

### 6.3 - Double assertions are prohibited
Do not use `as unknown as TargetType` in owned code.

### 6.4 - Non-null assertion is exceptional
Avoid `!`. Prefer a guard, invariant check, or better type structure.

Use `!` only when an external lifecycle guarantees initialization and representing that lifecycle in the type would make the code materially worse.

## 7 - Literal types

### 7.1 - `as const`
Use `as const` to preserve literal values and readonly literal structures when those exact values matter to the contract.

### 7.2 - `satisfies`
Use `satisfies` when an object must conform to a contract while preserving its useful inferred literal type.

```ts
const DEFAULT_BUDGET = {
  memoryTokens: 600,
  reasoning: 'low'
} satisfies CognitiveBudget
```

### 7.3 - Do not replace validation with `satisfies`
`satisfies` is compile-time only. It does not validate runtime input.

## 8 - Discriminated unions

### 8.1 - Prefer unions for closed outcomes
Use discriminated unions when outcomes carry different valid data.

```ts
type MemorySearchResult =
  | {
      status: 'available'
      items: readonly Memory[]
    }
  | {
      status: 'unavailable'
      reason: MemoryUnavailableReason
    }
```

### 8.2 - Make illegal states unrepresentable
Do not model mutually exclusive states as several unrelated optional properties when a discriminated union can express the legal combinations.

```ts
// Incorrect
interface Result {
  status: 'available' | 'unavailable'
  items?: readonly Memory[]
  reason?: string
}
```

### 8.3 - Exhaustive handling
When all variants must be handled, use an exhaustive `switch` or equivalent `never` check.

```ts
function handleStatus(status: MemoryStatus): void {
  switch (status) {
    case 'idle':
      return
    case 'queued':
      return
    case 'accepted':
      return
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}
```

## 9 - Nullability and optionality

### 9.1 - `undefined` means omitted or unavailable by ordinary TypeScript convention
Prefer `undefined` when a value/property is simply not provided.

### 9.2 - `null` means explicit empty state
Use `null` when the domain or external contract intentionally represents an explicit absence.

### 9.3 - Do not mix `null` and `undefined` arbitrarily
Within one contract, choose the semantic representation deliberately.

### 9.4 - Optional property means property may be absent
Use `property?: T` only when absence of the key is valid.

If the key must exist and its value may be empty, use an explicit union such as `T | null` or `T | undefined` according to the contract.

### 9.5 - Do not rely on `exactOptionalPropertyTypes` unless enabled
Rules must reflect the compiler configuration actually used by the package. If the repository later enables `exactOptionalPropertyTypes`, update affected contracts intentionally rather than assuming the stricter semantics already apply.

## 10 - Indexed access

### 10.1 - Indexed values may be absent
With `noUncheckedIndexedAccess`, handle array/object indexed access as possibly undefined unless control flow proves otherwise.

```ts
const first = memories[0]
if (!first) return null

return first.id
```

### 10.2 - Do not silence indexed uncertainty with `!`
If a collection can be empty, handle that state explicitly.

## 11 - Generics

### 11.1 - A generic must express a relationship
Use a generic when the same operation preserves or relates caller-provided types.

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0]
}
```

### 11.2 - Do not use generics as abstraction decoration
Do not introduce `<T>` when the implementation is actually specific to one domain type.

### 11.3 - Generic names
`T`, `K`, and `V` are acceptable for small conventional generic relationships.

Use descriptive names such as `TInput`, `TResult`, or `TEvent` when several type parameters exist or the role is not obvious.

### 11.4 - Constrain when behavior requires structure
If a generic implementation accesses properties or requires capabilities, express that constraint in the generic definition instead of asserting inside the implementation.

## 12 - Readonly and mutation

### 12.1 - Input contracts are readonly by default
Use `readonly` on fields that consumers are not expected to mutate.

### 12.2 - Readonly collections
Prefer `readonly T[]` or `ReadonlyArray<T>` for input and exported collection contracts that should not be mutated by consumers.

### 12.3 - Readonly is not a command to clone everything
Internal local mutation remains valid when the owning implementation controls the value and mutation makes the algorithm clearer.

## 13 - Runtime schemas

### 13.1 - Validate at trust boundaries
Use runtime validation when data enters from an untrusted or external boundary such as HTTP, environment variables, Kafka payloads, Neo4j records, provider output, browser storage, or deserialized JSON.

### 13.2 - Internal values do not automatically need schemas
Do not create a Zod schema for every internal TypeScript type.

### 13.3 - One source of contract truth when practical
Avoid independently maintaining a TypeScript shape and runtime schema that are intended to be identical but have no mechanical or review relationship.

### 13.4 - Schemas must not leak infrastructure inward
A database- or provider-specific schema belongs at that adapter boundary unless the schema represents the actual canonical domain contract.

## 14 - Functions and callbacks

### 14.1 - Follow the Functions rule
Function declaration style, parameter count, nesting, returns, and arrow-function exceptions are governed by `0001-functions.rule.md`.

### 14.2 - Callback types
Use explicit callback types when callbacks cross a module/public boundary or when inference is insufficient.

Do not create named callback types for trivial one-off local callbacks.

## 15 - Async types

### 15.1 - Async return contract
An exported async function should communicate its resolved result through `Promise<T>` when an explicit return annotation is appropriate.

### 15.2 - Do not return floating promises accidentally
If a promise is intentionally not awaited, make that intention explicit with `void` and ensure failure handling is intentionally delegated.

```ts
void refreshStatus().catch(reportStatusFailure)
```

### 15.3 - Promise constructors are exceptional
Do not wrap an existing promise-returning API in `new Promise` unless adapting a callback/event API or controlling a new asynchronous protocol.

## 16 - Errors and typed results

### 16.1 - Expected branchable outcomes
Use a discriminated result when the caller is expected to react differently to normal outcomes such as `found`, `not-found`, `unavailable`, or `skipped`.

### 16.2 - Exceptions
Throw for programming errors, violated invariants, unsupported states, or failures that the current boundary cannot meaningfully handle as ordinary control flow.

### 16.3 - Do not encode every failure twice
Do not return an error result and also throw for the same expected condition.

## 17 - Imports

### 17.1 - Type-only imports
Use `import type` when a symbol is consumed only by the type system.

```ts
import type { Memory } from '@repo/memory'
```

### 17.2 - Public package boundaries
Import another package through its declared public exports.

Do not deep-import another package's internal `src` files.

### 17.3 - Internal aliases
Use repository-approved aliases only within the scope where they are configured and owned.

Do not invent new alias conventions inside a feature.

## 18 - Exports and barrels

### 18.1 - Deliberate public surfaces
Export only symbols intended for consumers of that module or package.

### 18.2 - Barrels only at useful boundaries
Use `index.ts` barrels when they provide a deliberate module/package surface.

Do not create a barrel in every leaf directory merely to re-export one file.

### 18.3 - Avoid accidental cycles
If a barrel creates circular dependency pressure, import from the owning module or redesign the boundary rather than preserving the barrel by convention.

## 19 - Mapped and utility types

### 19.1 - Utility types must preserve meaning
Use `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, and mapped types when the derived relationship is real and remains understandable.

### 19.2 - Do not manufacture domain contracts from convenience utilities
A public domain contract should not become an unreadable stack of utility types only to reduce lines.

Prefer an explicit named contract when it communicates meaning better.

## 20 - Function overloads

### 20.1 - Use overloads only for genuinely different call shapes
Do not use overloads when an optional parameter, union, or discriminated input object expresses the API more clearly.

### 20.2 - Keep implementation signature internal
Consumers should see the supported overload contracts, not depend on an overly broad implementation signature.

## 21 - Branded and opaque types

### 21.1 - Use only for important non-interchangeable primitives
A branded identifier may be useful when mixing two same-primitive values would create a realistic defect.

### 21.2 - Do not brand every identifier
Do not add branded wrappers to all IDs by default. The extra type machinery must prevent a concrete class of mistakes.

## 22 - Verification

When reviewing TypeScript code, verify:
1. no untrusted data is trusted through assertion alone;
2. `any` has not escaped a third-party boundary;
3. closed result states are modeled legally;
4. nullable and optional values have intentional meaning;
5. public package boundaries do not deep-import internals;
6. generics express a real relationship;
7. types reduce ambiguity instead of hiding it.
