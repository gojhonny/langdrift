# Rules

Each file is `.agents/rules/NNN-name.rule.md`. Frontmatter fields in the current files are `always-apply`, `title`, `status`, and `priority`.

`always-apply: true` means the rule is a candidate for every task. It still yields to [AGENTS.md](../../AGENTS.md), to current code, and to an explicit owner decision. `always-apply: false` means load the rule only when the task matches its title.

`status` and `priority` describe the rule file. They do not mark a LangDrift product decision as settled.

A rule example is not permission to create missing packages or frameworks. Several files were imported from another repository and still mention NestJS, `packages/kernel`, `@pack/*`, or other structures that are not this repository. Check the current tree and `AGENTS.md` before following an example. Do not rewrite a rule body in order to “fix” that example unless the owner asks for that change.

## Catalog

| File | Title | always-apply |
| --- | --- | --- |
| `000-foundation-stone.rule.md` | Foundation stone | true |
| `001-general-principles.rule.md` | General principles | true |
| `002-functions.rule.md` | Functions | true |
| `003-if-statements.rule.md` | If statements | true |
| `004-variables.rule.md` | Variables | true |
| `005-comments.rule.md` | Comments | true |
| `006-loops.rule.md` | Loops | true |
| `007-typescript.rule.md` | TypeScript | false |
| `008-react.rule.md` | React | true |
| `009-nextjs.rule.md` | Next.js | true |
| `010-nestjs.rule.md` | Nest.js | false |
| `011-folders-and-aliases.rule.md` | Folders and aliases | true |
| `012-file-suffixes.rule.md` | File suffixes | true |
| `013-state.rule.md` | State | true |
| `014-forms.rule.md` | Forms | true |
| `015-http-routes.rule.md` | HTTP routes | false |
| `016-packages.rule.md` | Packages | false |

This table is a loading index. The rule file is the text that applies.
