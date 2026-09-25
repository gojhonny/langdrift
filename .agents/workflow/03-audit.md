# 03 Audit

## Inputs

The approved acceptance criteria, the review for this snapshot, and the commands the change actually requires. Select commands from `CYCLE.md`'s evidence rule and from the commands present in the repo. A command list copied from an older harness is not proof that this change is ready.

## Actions

Map each acceptance criterion to evidence or to an explicit gap. Record the command, the result summary, the exit code, and any required check that did not run.

Separate three outcomes:

- The environment failed before the assertion could run.
- The failure reproduces on the baseline without this change.
- The failure appears with this change and is a regression.

A file's presence is not evidence that the behavior works. A failed or skipped required check is not a pass.

## Outputs

A sanitized report under `.audits/reports/` for this snapshot. Raw output, if kept, goes under `.audits/runs/` and stays unreviewed until a report cites it. Ticket `Evidence` links the report and the snapshot.

## Done

Every in-scope criterion is tied to passing evidence for this snapshot, or the report states a failing or unrun check and `Delivery progress` remains `implemented-awaiting-gates`.

## Blocked

Stop when a required command cannot be run and the criterion depends on it. Report the gap. Do not mark the criterion passed.
