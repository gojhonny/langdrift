# Drift CLI

`drift` is the repository-local POSIX shell control plane, adapted from the Amarelo `elo` CLI architecture.

The executable surface intentionally mirrors the reference CLI: bootstrap/setup/doctor/harness/cleanup/runtime/changelog, artifact scaffolding, environment helpers, Git helpers, and audit dispatch.

Lang Drift currently has no backend runtime and no implemented audit suite, so runtime targets the frontend Turborepo tasks and `check` reports missing audit implementations rather than pretending product-specific Amarelo audits apply here.

All repository command scripts are `.sh` files.
