# Audits

Evidence tied to a snapshot. A file here is not proof that a behavior works until a reviewed report says what was run and what passed.

- `runs/` holds raw, transient command output. It is created by existing producers: `cli/src/commands/early-access.sh` and the Early Access job in `.github/workflows/ci.yml`. `.gitignore` ignores `.audits/runs/*`. A fresh checkout may not contain it. This bootstrap did not delete historical runs; none were present at preflight.
- [reviews/](reviews/README.md) holds reviews bound to a snapshot. Version them only after a content review.
- [reports/](reports/README.md) holds sanitized syntheses. Version them only after a content review.

Evidence required for acceptance cannot depend on a local log that was discarded with no other copy. Do not put secrets or real personal data in any of these directories.

Older audit documents elsewhere in the tree, including `messaging/runtime/early-access/AUDIT.md`, stay historical. Creating this directory does not refresh them.
