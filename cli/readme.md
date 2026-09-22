# Drift CLI

`drift` is the repository-local POSIX shell control plane, adapted from the Amarelo `elo` CLI architecture.

The executable surface is setup/doctor/harness/cleanup/runtime/run/dev/showcase/smoke, environment helpers, Git helpers, and package verification.

LangDrift has a narrow Early Access Go runtime. `drift early-access setup` creates disposable local credentials; `drift runtime early-access up|down|reset|logs|status` manages the mock-backed stack. `drift test early-access` and `drift audit early-access` run its checks. `dev` watches one frontend app; `run` starts one built app.

All repository command scripts are `.sh` files.
