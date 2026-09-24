---
description: Catalog of scoped repository rules
alwaysApply: false
globs: ".agents/rules/**"
---

# Rules

Each file is `.agents/rules/NNN-name.rule.md`. Frontmatter fields in the current files are `alwaysApply`, `globs`, `description`, `title`, `status`, and `priority`.

`alwaysApply: true` means the rule is a candidate for every task. It still yields to [AGENTS.md](../../AGENTS.md), to current code, and to an explicit owner decision. `alwaysApply: false` means load the rule only when its `globs` match the files being changed; the title and description explain its purpose.

`status` and `priority` describe the rule file. They do not mark a LangDrift product decision as settled.

Rules 000 and 002–016 contain TypeScript or frontend/NestJS-specific structure and do not apply to Go files. Rule 001 contains language-neutral guidance. Rule 017 owns Go-specific conventions and its `globs` field activates only for Go files under the runtime and event-contract trees. Rule 018 is language-neutral and always on: a missing environment value throws, and product configuration lives in `.env*` files. TypeScript argument-count, return-count, naming, and file-layout restrictions do not apply to Go. Activation fields use the same `alwaysApply` spelling understood by the current harness; keep metadata and this catalog consistent.

A rule example is not permission to create missing packages or frameworks. Several files were imported from another repository and still mention NestJS, `packages/kernel`, `@pack/*`, or other structures that are not this repository. Check the current tree and `AGENTS.md` before following an example. Do not rewrite a rule body in order to “fix” that example unless the owner asks for that change.

## Catalog

| File | Title | alwaysApply |
| --- | --- | --- |
| `000-foundation-stone.rule.md` | Foundation stone | false; `**/*.{ts,tsx,js,jsx}` |
| `001-general-principles.rule.md` | General principles | true |
| `002-functions.rule.md` | Functions | false; `**/*.{ts,tsx,js,jsx}` |
| `003-if-statements.rule.md` | If statements | false; `**/*.{ts,tsx,js,jsx}` |
| `004-variables.rule.md` | Variables | false; `**/*.{ts,tsx,js,jsx}` |
| `005-comments.rule.md` | Comments | false; `**/*.{ts,tsx,js,jsx}` |
| `006-loops.rule.md` | Loops | false; `**/*.{ts,tsx,js,jsx}` |
| `007-typescript.rule.md` | TypeScript | false; `**/*.{ts,tsx,js,jsx}` |
| `008-react.rule.md` | React | false; `**/*.{ts,tsx,js,jsx}` |
| `009-nextjs.rule.md` | Next.js | false; `**/*.{ts,tsx,js,jsx}` |
| `010-nestjs.rule.md` | Nest.js | false; `**/*.{ts,tsx,js,jsx}` |
| `011-folders-and-aliases.rule.md` | Folders and aliases | false; `**/*.{ts,tsx,js,jsx}` |
| `012-file-suffixes.rule.md` | File suffixes | false; `**/*.{ts,tsx,js,jsx}` |
| `013-state.rule.md` | State | false; `**/*.{ts,tsx,js,jsx}` |
| `014-forms.rule.md` | Forms | false; `**/*.{ts,tsx,js,jsx}` |
| `015-http-routes.rule.md` | HTTP routes | false; `**/*.{ts,tsx,js,jsx}` |
| `016-packages.rule.md` | Packages | false; `**/*.{ts,tsx,js,jsx}` |
| `017-go.rule.md` | Go services and events | false; runtime and event-contract `**/*.go` |
| `018-environment.rule.md` | Environment | true |

This table is a loading index. The rule file is the text that applies.
