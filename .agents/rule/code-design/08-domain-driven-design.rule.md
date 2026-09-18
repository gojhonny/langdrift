# Domain-Driven Design

## 1 - Purpose

### 1.1 - DDD is a modeling tool
Use Domain-Driven Design concepts when they make business meaning, invariants, identity, lifecycle, or ownership clearer.

DDD does not require a fixed folder tree, one class per concept, repositories for every entity, or a domain service for every operation.

### 1.2 - Do not model infrastructure as domain
Database drivers, Kafka records, Neo4j nodes, HTTP requests, provider responses, framework decorators, and persistence schemas are not domain concepts merely because the domain uses them.

## 2 - Ubiquitous language

### 2.1 - Use product language in owned code
Domain names should match the language used by the product and team.

Do not create multiple technical aliases for the same concept without a real distinction.

### 2.2 - Distinguish domain name from package or directory name
A physical directory name does not automatically define a domain concept.

For example, `memory-nucleus` may be the package location while `Memory`, `Curation`, or another term represents the actual domain concept in code.

### 2.3 - Avoid redundant suffix chains
Do not repeat the same meaning across path, symbol, and suffix when context already makes the role clear.

```ts
// Prefer when already inside memory/retrieval
function retrieve(query: MemoryQuery): Promise<MemoryResult> {
  // ...
}
```

Avoid names such as `MemoryRetrievalMemoryService` unless each term communicates a distinct responsibility.

## 3 - Entities

### 3.1 - Identity defines an entity
Use an entity model when identity and lifecycle matter beyond the current field values.

### 3.2 - Representation is not prescribed
An entity may be represented by:
- a class with behavior;
- a typed immutable record plus owned functions;
- another simple form that keeps invariants explicit.

Do not require classes solely because the concept is an entity.

### 3.3 - Keep invariants close to the entity responsibility
Rules that determine whether an entity state is valid should remain close to the domain model or domain behavior that owns those states.

Do not bury entity invariants in controllers, persistence adapters, or generic utilities.

## 4 - Value Objects

### 4.1 - Use value objects for meaningful invariant-bearing values
A value object is justified when a value has domain behavior or invariants that should not be repeated by every consumer.

Examples may include bounded token budgets, money, normalized identifiers, or another concept whose validity is more than its primitive TypeScript type.

### 4.2 - Do not wrap every primitive
Do not create a value-object class for every string, number, date, identifier, or enum-like value.

### 4.3 - Equality is by value
When a concept is modeled as a value object, consumers should reason about its value rather than object identity.

## 5 - Domain Services

### 5.1 - Use only for domain behavior without a natural entity owner
A domain service is appropriate when a business operation spans domain concepts and does not belong naturally to one entity or value object.

### 5.2 - `Service` is not a generic suffix
Do not create `FooService` as a dumping ground for unrelated helpers, database calls, or orchestration.

A service must have a cohesive domain responsibility.

## 6 - Application services and use cases

### 6.1 - Orchestration is not domain logic
Coordination of repositories, queues, model calls, clocks, or other external capabilities belongs outside pure domain behavior.

### 6.2 - A use case does not require a class
Use a function when the operation is stateless and a class adds no lifecycle, encapsulation, framework integration, or meaningful dependency ownership.

Use a class when those concerns genuinely exist.

## 7 - Repositories

### 7.1 - Repository contracts use domain/application language
A repository represents persistence capabilities needed by the owning behavior.

```ts
// Correct
interface MemoryRepository {
  findAccepted(input: AcceptedMemoryQuery): Promise<readonly Memory[]>
}
```

```ts
// Incorrect
interface MemoryRepository {
  find(collection: string, filter: Record<string, unknown>): Promise<unknown[]>
}
```

### 7.2 - Do not create generic CRUD repositories
Do not standardize all persistence behind generic `create/read/update/delete` contracts when consumers need domain-specific operations.

### 7.3 - One concrete database does not require leaking that database inward
Even when Neo4j is the decided implementation, domain/application code should depend on owned persistence semantics when isolation has concrete value.

The Neo4j specialist rules own Cypher, driver, transaction, and graph-model conventions.

## 8 - Bounded Contexts

### 8.1 - A bounded context needs distinct meaning or rules
A bounded context is justified when a part of the domain has its own language, invariants, lifecycle, or responsibility that should not be mixed with another.

### 8.2 - Folder size does not create a bounded context
Do not split a bounded context merely because a directory has many files.

### 8.3 - Do not extract packages speculatively
A bounded context may remain a module inside an existing package until independent package ownership or dependency pressure justifies extraction.

## 9 - Shared Kernel

### 9.1 - Shared kernel is exceptional
Place a concept in a shared kernel only when:
- at least two domain areas genuinely consume it;
- its meaning is stable across those consumers;
- changes must be coordinated across those consumers;
- the shared ownership is clearer than duplication.

### 9.2 - No leftovers in kernel
Do not move a type to `kernel` only because its owner is unclear.

If ownership is unclear, determine the owner first.

### 9.3 - `shared`, `common`, and `utils` are not substitutes
Do not create generic shared folders to avoid making an ownership decision.

## 10 - Schemas and domain models

### 10.1 - Schema has a boundary responsibility
A runtime schema exists to validate data crossing an untrusted or invariant-sensitive boundary.

Do not create one runtime schema for every internal TypeScript type by convention.

### 10.2 - Avoid independently maintained duplicate truths
When a schema and a TypeScript type describe the same boundary contract, prefer one clear ownership relationship rather than two definitions that can silently drift.

### 10.3 - Domain model may be narrower than persistence model
Persistence-specific fields and migration compatibility do not automatically belong in the canonical domain model.

Map them at the adapter boundary when that separation improves meaning.

## 11 - Domain events

### 11.1 - Use only when an event is a real domain fact
Do not introduce domain events merely because asynchronous infrastructure exists.

### 11.2 - Kafka messages are not automatically domain events
A Kafka message may transport a domain event, an integration event, or an infrastructure command. Name and model it according to its actual meaning.

Kafka-specific delivery and broker rules belong to the messaging specialist.

## 12 - Aggregates

### 12.1 - Introduce only for real consistency boundaries
Use an aggregate when a group of entities/value objects must preserve invariants through one consistency boundary.

### 12.2 - Do not invent aggregate roots for folder organization
A root object is not an aggregate root merely because other files can be grouped beneath it.

## 13 - Verification questions

Before introducing a DDD abstraction, the author should be able to answer:
1. Which domain concept or invariant does it clarify?
2. Who owns it?
3. Which consumers need it?
4. What incorrect coupling does it prevent?
5. Why is a simpler local representation insufficient?

If these questions have no concrete answers, do not add the abstraction yet.
