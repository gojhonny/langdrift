# General Code Design Principles

## 1 - Human readability

### 1.1 - Code is written for humans first
Owned code must prefer the clearest direct implementation that satisfies the requirement. A shorter implementation is not automatically better if it hides control flow, ownership, side effects, or domain meaning.

```ts
// Correct
function normalizePatientName(name: string): string {
  return name.trim()
}
```

```ts
// Incorrect
const normalizePatientName = createPipeline(trimString())
```

### 1.2 - Explicit over clever
Do not compress multiple decisions into dense expressions only to reduce lines. Name relevant intermediate values when they represent a domain fact or improve the reading order.

## 2 - SOLID

### 2.1 - Single Responsibility Principle
A function, module, class, or provider should have one primary responsibility and one primary reason to change.

This does not mean one function per file, one class per action, or one directory per responsibility. Cohesive behavior may stay together when it changes for the same reason.

### 2.2 - Open/Closed Principle
Introduce extension points only when the application has a concrete need for alternative behavior.

Do not create strategies, abstract classes, generic factories, or plugin systems for hypothetical future consumers.

### 2.3 - Liskov Substitution Principle
An implementation of a contract must preserve the contract's observable expectations. Do not implement an interface and then weaken its guarantees, throw for supported inputs, or change the meaning of its result.

### 2.4 - Interface Segregation Principle
Interfaces must describe cohesive capabilities needed by their consumers. Do not create large service interfaces containing unrelated operations.

### 2.5 - Dependency Inversion Principle
Business behavior may depend on an owned contract when an external dependency or replaceable capability must be isolated.

Do not introduce an interface around deterministic local code only to satisfy a pattern.

## 3 - DRY

### 3.1 - Deduplicate knowledge, not appearance
Remove duplicated business rules, validation rules, constants, transformations, and decisions when those copies must evolve together.

Code that merely looks similar is not necessarily duplication.

### 3.2 - Prefer local duplication over premature abstraction
If two implementations belong to different responsibilities and may evolve independently, keep them local until a stable shared concept exists.

### 3.3 - Shared modules require semantic ownership
Do not create generic dumping grounds named `utils`, `helpers`, `common`, or `shared` for unrelated behavior.

A shared module must have a clear semantic owner and concrete consumers.

## 4 - KISS

### 4.1 - Smallest coherent solution
Choose the smallest solution that keeps behavior, ownership, and side effects understandable.

Do not add indirection when a direct function, object, or module is sufficient.

### 4.2 - Abstractions pay rent
Every abstraction must solve at least one concrete problem such as:
- isolating an external dependency;
- enforcing an invariant;
- expressing a stable domain concept;
- allowing a real alternative implementation;
- removing duplicated knowledge that must stay synchronized;
- making a complex unit independently testable.

If none applies, prefer the simpler form.

## 5 - YAGNI

### 5.1 - No speculative architecture
Do not add capabilities, extension points, layers, configuration, or fallback paths for requirements that are not part of the current product direction.

### 5.2 - Current decisions are enough
Do not design around hypothetical scale, hypothetical providers, hypothetical databases, or hypothetical consumers unless a current rule or ADR explicitly requires it.

## 6 - Functional programming

### 6.1 - Declarative collection operations
Prefer `map`, `filter`, `find`, `some`, `every`, and small compositions when they directly express the operation.

### 6.2 - Functional style is not a goal by itself
Do not force `reduce`, chained expressions, or immutable copies when an explicit local algorithm is easier to understand.

### 6.3 - Side effects must remain obvious
A transformation callback should not hide network, persistence, queue, filesystem, or model side effects unless the API explicitly exists for effects.

```ts
// Incorrect
const memories = candidates.map((candidate) => {
  void repository.save(candidate)
  return candidate.memory
})
```

## 7 - Composition over inheritance

### 7.1 - Default
Prefer composition of focused behavior over inheritance for owned application code.

### 7.2 - Inheritance exception
Inheritance is acceptable when a framework contract requires it or when the base abstraction owns a genuine runtime contract and shared behavior.

Do not inherit only to reuse private implementation.

## 8 - Rule of three is not mandatory

### 8.1 - Extraction is semantic
Do not wait for an arbitrary duplication count when duplicated domain knowledge already creates a consistency risk.

### 8.2 - Repetition is not automatically a refactor trigger
Do not extract code solely because two or three blocks look alike. First identify the stable shared meaning.
