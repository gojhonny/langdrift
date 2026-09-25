# 02 Review

## Inputs

The delivered snapshot and the local spec. The snapshot is the fixed base plus commits, staged changes, unstaged changes, and relevant new files, as `code-review` records them.

## Actions

Use `code-review` for Standards and Spec. Pass one axis does not repair a failure on the other.

If `implement` already ran `code-review` on this same snapshot, keep that review. Run another only when the snapshot changed or the first review did not cover both axes.

A later edit invalidates the review of the previous snapshot. Re-check the affected results.

## Outputs

A review under `.audits/reviews/` that names the spec path, the base, `HEAD`, and `git status --short`. The ticket's `Evidence` points at that review. `Delivery progress` stays `implemented-awaiting-gates` until `CYCLE.md` says the required gates have passed.

## Done

Both axes have a recorded result for this snapshot. A missing spec is a Spec skip stated in the review, not a pass.

## Blocked

Stop when the base does not resolve or the snapshot is empty. Ask for the base. Do not review an unnamed diff.
