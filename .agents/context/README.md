# Fragmented context

Context files describe the repository as it exists. They do not add requirements, and they do not override [AGENTS.md](../../AGENTS.md).

## Names

Files use a numeric prefix and the `.ctx.md` suffix:

```text
000-fragmented-context.ctx.md
010-repository-topology.ctx.md
020-product-and-surface-boundaries.ctx.md
030-packages-and-contracts.ctx.md
040-messaging-runtime-and-environment.ctx.md
050-harness-and-agent-runtime.ctx.md
060-verification.ctx.md
070-open-decisions.ctx.md
```

`000` is the catalog and the loading rules. Later numbers are topics. Leave gaps so a new topic can sit beside its neighbors. Add a fragment when a topic is too specific for `AGENTS.md` and too stable to rediscover on every task. Do not add one for a single pull request or for an open product choice that already lives in `070`.

## How to write one

- Read the current code, config, or schema first.
- List those paths in frontmatter `sources`.
- Keep one topic in the file.
- When code and a fragment disagree, follow the code and update the fragment.
- When a code change makes a fragment wrong, update that fragment in the same change when practical.
- Delete or narrow a fragment that cannot be kept current.
- Do not copy secrets, whole source files, or the text of `AGENTS.md`.
- Do not read or write `.drifts/` to maintain this set.

Start at [000-fragmented-context.ctx.md](000-fragmented-context.ctx.md).
