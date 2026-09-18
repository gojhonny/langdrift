# Verification and evidence

| Folder | Responsibility |
| --- | --- |
| `checks/` | Future POSIX `.sh` validators |
| `fixtures/` | Known-good and known-bad inputs for validators |
| `schemas/` | Future verification-record contracts |
| `runs/` | Local raw run output; ignored except `.gitkeep` |
| `records/` | Compact, deliberate, durable verification records |

These directories are placeholders. No checker is implemented; `drift check` must fail clearly instead of reporting a false pass. Its target convention is now `.audits/checks/<name>.audit.sh`.

Future records should identify exact source revision, relevant document/rule/skill revisions, criterion, method, actor, time, and passed/failed/blocked/not-run results. Claims of approval also require an explicit human decision reference. Preserve durable evidence links; do not rely on expired CI artifacts or uncommitted logs as the sole proof.

Raw logs may contain secrets or personal data. Keep them local by default, redact before publication, and deliberately retain any evidence needed for a durable claim. The source revision tested is not necessarily the later commit that stores its verification record.

Workflow planning belongs in `.agents/workflow/`; initiative/integration metadata belongs in `.drifts/`. A schema check validates structure, not product correctness, human approval, or runtime integration.
