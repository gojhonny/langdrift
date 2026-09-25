# SDD integration contract

`.agents/workflow/` is the canonical Spec-driven Development lifecycle for LangDrift. It is not a registry of other methodologies. This file is the local contract for the installed engineering skills. It replaces a `docs/agents/` layout and a `.scratch/` tracker. Skills that publish, review, or model the domain read this file. They do not invent a second tracker.

`.agents/workflow/CYCLE.md` owns delivery transitions. Phase files in this directory name skills and outputs. They do not redefine the fields below.

Installing a skill does not start it. `grill-with-docs`, `to-spec`, `to-tickets`, and `implement` require an explicit owner invocation. Their upstream frontmatter sets `disable-model-invocation: true`. Workflow state, `Status`, or the end of a previous phase does not invoke them and does not authorize a git operation.

## Issue tracker

Specs and tickets are local Markdown. There is no GitHub, Linear, or `.scratch/` copy.

```text
.artifacts/specs/<id>-<slug>.spec.md
.artifacts/tickets/<id>-<slug>.ticket.md
```

`<id>` is a decimal sequence padded to four digits, starting at `0001`. Specs and tickets each have their own sequence. Take the next free id by listing that directory. `<slug>` is lowercase words separated by hyphens.

A ticket names its spec, its acceptance criteria, and its blockers. One ticket per file.

## Triage labels

`Status` is only a triage role:

| Role | Meaning |
| --- | --- |
| `needs-triage` | An owner still needs to classify the record. |
| `needs-info` | The record is waiting on a missing fact or decision. |
| `ready-for-agent` | The record is specified enough for an agent to pick up when separately invoked. |
| `ready-for-human` | The work needs a person to implement it. |
| `wontfix` | The record will not be actioned. |

`ready-for-agent` is not owner approval, implementation, or verification.

## Record fields

Use these names. Do not add a second status field with a different meaning.

- **Status.** One triage role from the table above.
- **Approval.** The owner's decision on this spec, or on this ticket breakdown, plus the version approved. `unset` until that decision exists. Approving a record does not close an open blocker.
- **Delivery progress.** `not-started`, `in-progress`, `implemented-awaiting-gates`, or `gates-complete`. Transitions are only in `CYCLE.md`. Completed implementation is `implemented-awaiting-gates` until the required gates pass. A failed or unrun required check stays unpassed. `gates-complete` requires those gates and their evidence.
- **Blocked by.** `None (can start immediately)`, or the paths of the records that gate this one. Approval does not remove a blocker.
- **Evidence.** `none yet`, or paths under `.audits/` plus the snapshot they examined. A review or audit applies only to that snapshot. A later edit invalidates it.

A material change to a spec or ticket requires approval of the changed version before execution continues.

## Domain docs

- Vocabulary: the `## Vocabulary` region of `.agents/context.md`, between the `langdrift-vocabulary` markers. Domain modeling edits that region only.
- ADRs: `.artifacts/adrs/`.
- Research notes: `.artifacts/research/`.
- Technical designs: `.artifacts/designs/`.
- PRDs, when a change needs one: `.artifacts/prds/`.
- Evidence: `.audits/`.

There is no root `CONTEXT.md` and no `docs/adr/`.

## Invocation

Explicit owner invocation is required for `grill-with-docs`, `to-spec`, `to-tickets`, and `implement`. The workflow names the next command and waits.

Other installed skills keep the invocation semantics of upstream commit `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`. A skill may be read when its own contract says to consult it. That is not a session of a user-invoked skill.

## Operating limits

- Do not claim a sub-agent, a parallel review, or a delegated research run unless that run happened.
- Do not commit, push, open a pull request, merge, or release without a separate authorization.
- Do not treat a record's `Status` as permission to start work.
