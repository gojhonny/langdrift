# Website local state and forms

This scoped convention applies to Website features. It does not migrate existing SSO, Mobile or Console implementations. It lives here while the owner restructures `.agents`; no file in that folder is required or changed by this implementation.

1. Use React `useState` for feature-local forms, with Immer `produce` for structured immutable updates. Reserve Jotai for application state shared by independent features or routes.
2. Separate rendering/event wiring, handlers, draft mappers, initial state, types and schema when validation warrants it. Keep the files proportional to the behavior; do not split trivial components mechanically.
3. Handlers coordinate validation and effects. Mappers accept `Draft<State>`, mutate the draft and return `void`. Recipes are synchronous and pure: no network, storage, logging, focus or ref mutation.
4. Adapt recipes with functional `setState(produce(recipe))`, so updates receive the latest queued state. Do not add `use-immer` or a generic form engine.
5. Use Zod at untrusted input boundaries and derive relevant types from the schema. Render errors with ordinary React and existing UI primitives, without a form provider/resolver library.
6. Use the successful parse output after normalization; invalid input must not advance. Preserve the editable text while correcting validation errors.
7. Keep stable error codes in state and translate at render time. Associate visible errors with their fields and communicate with text as well as color.
8. Derive display booleans from one status, rather than redundant flags. Validation runs from user events, not mount effects. Any future asynchronous flow needs separate authorization, an in-flight guard and stale/unmount handling outside recipes.
9. Keep email and other entered data out of Jotai, debugging, analytics, URLs and browser storage. Never put server secrets in client imports.
10. The current early-access form validates input locally only. It must not request, persist, simulate capture or claim registration succeeded. Durable capture and any acquisition endpoint are outside the owner's current instruction.
11. Reuse existing Smooth UI/shadcn components through public exports where available. Verify labels, semantics, keyboard access, focus and reduced motion; native semantic controls are appropriate when no primitive exists.
12. Add abstractions, dependencies and meaningful tests for actual requirements. Do not duplicate schemas or rewrite unrelated state architecture.
