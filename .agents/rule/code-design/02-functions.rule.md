---
id: RULE-0001
title: Functions
description: 
status: in-progress
date: 2026-09-11
deciders:
  - Jonatas Sales
supersedes: []
superseded-by: null
always-apply: true
---

# Functions

## 1 - Topology

### 1.1 - Definition
We should use mostly `function` keyword instead of `arrow functions`. Arrow functions should only be used for third-party libraries enforcement or in `Array` functions like `Array.map`.

```ts
// Correct
function add(a: number, b: number): number {
  return a + b;
}

// Correct
const users = data.map((user) => ({ /* ... */}))

// Correct
const userIds = data.map((user) => {
  return user.id
})
```

### 1.1.1 - Parentesis spacings
No spaces between function name and the parentesis

```ts
// Correct
function add(a: number, b: number): number {
  return a + b;
}

// Incorrect
function add (a: number, b: number): number {
  return a + b;
}
```

### 1.1.2 - Arrow functions arguments 
Arrow functions arguments should always have parentisis even though it's one argument

```ts
// Incorrect
const users = data.map(user => ({ /* ... */}))

// Incorrect
const userIds = data.map(user => {
  return user.id
})
```

### 1.1.3 - Owned `this` functions should never be used for array functions like `Array.reduce/map/filter/etc`

```ts
// Incorrect
const users = data.map(function(user) { /* ... */})

// Incorrect
const userIds = data.map(function transformUser(user) {
  return user.id
})
```

### 1.2 Functions as variables
Variables should only be used in the following cases:
- The variable is sharable between more than one loop
- It was imported from a third-party library and enforced
- It must be out of the scope of the current function


```ts
// Correct

function reusableFun() {
  // { ... }
}
```

```ts
// Correct
import { reusableFun } from 'third-party'

function foo() {
  const transformedData = data.map(reusableFun)
  const transformedMetaData = data.map(reusableFun)

  // ...
}
```

```ts
// Correct
import { reusableFun } from 'third-party'

// ...

const transformedData = data.map(reusableFun)
const transformedMetaData = data.map(reusableFun)
```

```ts
// Incorrect
function Foo() {
  // same scope

  const reusableFun = () => ({ /* ... */ })

  const transformedData = data.map(reusableFun)
  const transformedMetaData = data.map(reusableFun)
}

// Incorrect
function Foo() {
  // same scope

  function reusableFun() { 
    /* ... */
  }

  const transformedData = data.map(reusableFun)
  const transformedMetaData = data.map(reusableFun)
}
```

### 1.3 Use of "use strict";
Should only be used in non-TS files. .js and .mjs files are prohibited in this project unless with exceptional cases. If it's necessary to use js, it must be declared in the begining of the module

```js
// Correct
"use strict";

function Foo() { 
  /* ... */
}

function Bar() { 
  /* ... */
}

function Baz() { 
  /* ... */
}
```

```mjs
// Incorrect
function Foo() { 
  "use strict"
  /* ... */
}

function Bar() { 
  /* ... */
}

function Baz() { 
  /* ... */
}
```

### 1.4 Arguments
Only 2 arguments are allowed to be passed as paramaters to a function call, otherwise you should use a typed object:

```ts
// Correct
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3)
```

```ts
// Incorrect
function add(a: number, b: number, c: number): number {
  return a + b * c;
}

add(2, 3, 5)
```

### 1.4.1 - More Arguments
More than two arguments must be in a super exceptional case, like third-party libraries enforcement, but never a matter of choice

```ts
// Correct
function add(event: UserEvent): boolean {
  //...
}

add({ id: 1 })
```

## 2 - Returns
we should have just one return per function (except when using `error-first strategy`):

```ts
// Correct
function Foo(event: UserEvent): string {
  return event.id
}

// Correct
function Bar(event: UserEvent): string | null {
  if (!event.id) return null

  return event.id
}
```

### 2.1 Two usages of error-first
Error first strategy is limited to one usage, otherwise you should create a separate function because your function is getting complex:

```ts
// Incorrect
function Bar(event: UserEvent): TransformedEvent {
  if (!event.id) return null

  if (!event.name) return null

  const {id, name} = event
  
  return {
    id,
    name
  }
}

// Correct
function Bar(event: UserEvent): TransformedEvent {
  if (!event.id || !event.name) return null

  const {id, name} = event
  
  return {
    id,
    name
  }
}
```

## 3 - Scope chaining
Function nesting is only allowed in cases where it's recognized as a best practice, like a `React` component handler or factory functions (explicitely only one level of nesting allowed), otherwise it should not be used.

```ts
// Correct
type TypedFoo = (id: number) => void

function FooFactory(params: FooParams): TypedFoo {
  // ...

  // always destruct first
  const { id } = params

  return function FooWithId () {
    // ...
    return {
      id,
      // ...
    }
  }
}

// Incorrect
function FooFactory(params: FooParams): (id: number) => void {
  // ...

  // always destruct first
  const { id } = params

  return function FooWithId () {
    // ...
    return {
      id,
      // ...
    }
  }
}

// Incorrect
function FooFactory(params: FooParams): TypedFoo {
  // ...
  return function FooWithId () {
    // ...
    return {
      id: params.id,
      // ...
    }
  }
}
```

### 3.1 - React example
It can be common on opinionated libraries or conventions like in `React` to have nesting, but it must be one level only:

```tsx
// Correct
export function MyComponent(props: MyComponentProps): React.ReactElement {

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    // ...
  }

  return (
    <div>
      <button onClick={handleOnClick}>Click me</button>
    </div>
  )
}

// Incorrect
export function MyComponent(props: MyComponentProps): React.ReactElement {

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement>) {
    const foo = () => {
      // ...
    }

    const isBar = foo(event.id)

    if (!isBar) {
      setBar(event.currentTarget.defaultBar)
      return
    }

    event.stopPropagation()
    // ...
  }

  return (
    <div>
      <button onClick={handleOnClick}>Click me</button>
    </div>
  )
}
```

### 3.1.1 - More React Examples
One level nesting is permitted in the situations above as long as it's not an `arrow function`. With, again conventional exceptions

```tsx
// Incorrect
export function MyComponent(props: MyComponentProps): React.ReactElement {

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    // ...
  }

  return (
    <div>
      <button onClick={handleOnClick}>Click me</button>
    </div>
  )
}

// Correct
export function MyComponent(props: MyComponentProps): React.ReactElement {

  const expensiveCalculationValue = React.useMemo(() => {
    // ...
  })

  return (
    <div>
      <BigDownTreeComponent value={expensiveCalculationValue} />
    </div>
  )
}
```

## 4 - Invocation
Never write a self-invocation function:

```ts
// Incorrect
function selfInvocationFoo() {
  // ...
}()

// Correct
function foo() {
  // ...
}

foo()
```

### 4.1 - Double invocation
Never write a double-invocation function, even if it's a factory (unless it's third-party lib convention):

```ts
// Incorrect
function fooFactory() {
  // ...
  return function Foo() {
    //...
  }
}

const value = fooFactory()()


// Correct
const foo = fooFactory()

const bar = foo()
```

### 4.2 Arbitrary array invocation
Arbitrary array invocations are not permitted

```ts
const methodName = "multiply";

const calculator = {
  [methodName](a, b) {
    return a * b
  },
};

calculator.multiply(2, 3)
```

## Async Functions
async functions must follow some rules

