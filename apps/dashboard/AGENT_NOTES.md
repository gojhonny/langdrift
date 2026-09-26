# Agent notes

*this document should be deleted when the SDD cycle ends and the instructions here should compose rules*

1. In Next.js apps we'll never use src/ folders. The app/ will be placed in root directly.

2. JSON files should not have bad formatting like this.

Bad:
```json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
````

3. absolute paths are defined per domain or router groups.

4. `compilerOption.paths` rule is repeated in:
- apps/dashboard/tsconfig.json
- apps/dashboard/tsconfig.paths.json

5. All nextjs typescript apps should have a `tsconfig.paths.json` exclusively to define them.

6. `"baseUrl": "."` is deprecated. Should not be used.

7. No need to have a `turbo.json` file if inherits from the root one and duplicate the rule. App specific `turbo.json` files should be used in case we need to override something from root.

8. App's `package.json` files should not have version since it's not published.

9. `"@phosphor-icons/react"` should be a dependency of `packages/react` only, since all next.js/react apps should use the same icon identity. It's duplicated dependency here.

10. this is not needed, should be done in Dockerfile directly:
```shell
"runtime:build": "sh ../../cli/src/runtime/next-build.sh build",
"runtime:start": "sh ../../cli/src/runtime/next-start.sh 3001",
```

11. we're going to replace zustand with jotai.