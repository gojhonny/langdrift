# SDD cycle

This file owns how a cycle starts, moves, blocks, resumes, and ends. Phase files say what each phase produces. Skill files say how to do the work. Neither restates the transitions below.

## Entry

A cycle starts when the owner explicitly invokes `grill-with-docs` on a named effort. The structural decisions already recorded for the repository stay put. The session investigates requirements that are still open.

No phase starts the next user-invoked skill. At each boundary, name the next command and wait.

## Delivery progress

`Delivery progress` on a ticket uses only these values. `Status` is not one of them.

1. `not-started`. The ticket exists. Work has not begun.
2. `in-progress`. An explicit execution invocation is underway, approval of the current contract version exists, and every `Blocked by` path is resolved.
3. `implemented-awaiting-gates`. The change for this ticket is in the working tree or in commits, and a required review or audit is still missing, failed, or tied to an older snapshot.
4. `gates-complete`. The required review and audit for this ticket have evidence, and that evidence names the snapshot that was examined.

Allowed moves:

- `not-started` to `in-progress` only when the three conditions in step 2 hold.
- `in-progress` to `implemented-awaiting-gates` when the implementation is delivered and the gates are not yet passed.
- `implemented-awaiting-gates` to `gates-complete` only when every required gate has passing evidence for the current snapshot.
- Any later edit to the delivered snapshot returns the ticket to `implemented-awaiting-gates` until the affected gates are repeated.
- A material contract change clears Approval on the changed record, returns execution to planning, and sets `Delivery progress` back to `not-started` until the new version is approved.

A check that failed or did not run is not a pass. An approved contract does not resolve a blocker. `ready-for-agent` does not approve the contract and does not start implementation.

## Owner decisions

Stop and ask the owner before:

- approving a spec or a ticket breakdown;
- treating a contract change as accepted;
- committing, pushing, opening a pull request, merging, or releasing;
- invoking `grill-with-docs`, `to-spec`, `to-tickets`, or `implement`.

## Blocked work

Do not execute a ticket while `Blocked by` names a record that is not `gates-complete`. Do not execute while Approval is unset. Do not execute while `Status` is `needs-triage`, `needs-info`, or `wontfix`.

## Resume

To resume, read `CYCLE.md`, the current phase file, the spec, and the tickets. Trust `Delivery progress` and `Evidence` only when the snapshot they name still matches the tree. If the tree moved, the old evidence does not count.

## Link the work

Each ticket points at its spec. Evidence points at the ticket and at the snapshot: resolved base, `HEAD`, and `git status --short` when work is uncommitted. Reviews live under `.audits/reviews/`. Audit syntheses live under `.audits/reports/`. Raw command output, when retained, lives under `.audits/runs/` and is not itself a reviewed report.

## Close

The cycle is closed when every in-scope ticket is `gates-complete` for the final snapshot, the owner has accepted that evidence, and no material contract change is waiting. A closed cycle does not start another one.
