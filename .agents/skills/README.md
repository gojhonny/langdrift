# Skills

Read [SOURCES.md](SOURCES.md) for the upstream commit, checksums, and local adaptations. Read the skill's own `SKILL.md` before following it.

User-invoked skills, from their upstream frontmatter, require an explicit owner invocation. Presence in this directory does not start them, advance a phase, or authorize git.

- `grill-with-docs`
- `to-spec`
- `to-tickets`
- `implement`

The other skills installed from the pinned upstream commit keep that commit's invocation behavior. `grill-me` was already in the tree and was not part of this install. It still points at `.agents/sdd/`, which does not exist. Do not create that path to satisfy it.

Native discovery of these skills inside Cursor was not verified by this bootstrap.
