# 01 Execution

## Inputs

An approved spec in `.artifacts/specs/` and the tickets in `.artifacts/tickets/` whose `Blocked by` entries are resolved. `Delivery progress` moves only as `CYCLE.md` says.

## Actions

On an explicit `implement` invocation, implement the approved tickets. Use `tdd` for executable behavior at the seams the spec already names. Confirm those seams before writing a test.

A documentation-only change uses the checks that fit the document: links, structure, and a reading pass. Do not add a test whose only purpose is to imitate TDD.

A material change to the spec or a ticket stops execution. Return to planning and obtain approval of the changed version.

## Outputs

The change in the working tree or in commits, plus evidence references on the tickets. `implement` also asks for `code-review` as part of its own procedure. Keep that review. Do not start a second one here unless the snapshot changed.

## Done

Each executed ticket is `implemented-awaiting-gates` or, when that same invocation already produced passing review evidence for this snapshot, still waiting on any audit the cycle requires. Implementation alone is not `gates-complete`.

## Blocked

Do not start a ticket with an open blocker, unset Approval, or a `Status` of `needs-triage`, `needs-info`, or `wontfix`. The next step is to clear that condition, not to code around it.
