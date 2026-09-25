---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

<!-- langdrift-local-adaptation: completion delivers the change and its evidence. A git publish or integrate operation is not part of completion. -->

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work.

Completion is the delivered change plus the evidence for the checks that ran. Evidence fields are defined in `.agents/workflow/README.md`. A commit, push, pull request, merge, or release needs its own authorization and is outside completion.
