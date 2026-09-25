# LangDrift

This file is the operational entry. Project knowledge lives in `.agents/context.md`. Procedures live in the skill they name. Spec-driven Development, the canonical lifecycle for this repository, lives in `.agents/workflow/`.

## Context

Read `.agents/context.md` to understand the product, its vocabulary, and its surface boundaries.

The tree shows implemented behavior. An approved spec or ADR is a contract. Do not treat one as the other. Archived material is not active policy.

## Spec-driven Development

Load this only when the owner is explicitly driving work through that cycle:

1. `.agents/workflow/README.md` for the local skill contract.
2. `.agents/workflow/CYCLE.md` for transitions and exit criteria.
3. The phase file in `.agents/workflow/` that matches the current point in the cycle.

A question or task outside that cycle does not enter it.

## Skills

- `.agents/skills/README.md` for what is installed and how invocation works.
- `.agents/skills/SOURCES.md` for upstream origin and local adaptations.
- The relevant `SKILL.md` before applying a procedure.

`grill-with-docs`, `to-spec`, `to-tickets`, and `implement` run only when the owner invokes them. Installing a skill does not run it, advance a phase, or authorize git. Files on disk do not prove that Cursor discovered them.

## Contracts and evidence

- `.artifacts/README.md` indexes requirements, research, designs, ADRs, specs, and tickets.
- `.audits/README.md` indexes results tied to a snapshot.

When implementing or reviewing a change, read the spec that applies and the references that spec uses. Do not read every artifact.

Choose checks from the workflow and from commands that exist in the repo. A former harness checklist is not evidence that this change is ready.

## Cursor

`.cursor/README.md` is Cursor-specific configuration. With an empty hook registry, no Cursor hook is active. `rules/`, `.agents/guardrails/`, and `.agents/hooks/` are reserved directories, not implemented mechanisms. A config file does not prove that a mechanism ran or that it works.

## Limits

Preserve local work that is outside the requested change. Keep credentials and personal data out of context, logs, and evidence. Stay inside the authorized scope. Say when a check did not run.

Commit, push, pull request, merge, and release each need their own authorization.

Do not read or edit `.drifts/` as part of ordinary agent work.

Superseded harness files remain in Git history at the migration base. That history is for recovery and investigation. Do not load it as active policy.
