# Drift CLI

`drift` is the repository-local POSIX shell control plane, adapted from the Amarelo `elo` CLI architecture.

The executable surface is setup/doctor/harness/cleanup/runtime/run/dev/showcase, environment helpers, Git helpers, and package verification.

Lang Drift currently has no backend. `runtime` is reserved for the compose stack. `dev` watches one frontend app. `run` starts one built app in production. `showcase` builds and starts all four.

All repository command scripts are `.sh` files.
