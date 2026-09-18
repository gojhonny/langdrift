# Drift Manifest

`.drifts/` is LangDrift's proposed portable project-integration layer. The name is product-neutral about adapters: Obsidian is a future consumer, not the owner of the factory or its documents.

`drift.json` is a compact, versioned record of initiatives, progress, actors, activity, and references. `schemas/drift.schema.json` defines its draft JSON shape. `integrations/obsidian/` and `integrations/mcp/` are empty reservations, not working connections. No server, vault sync, npm installer, or MCP tool is configured by this scaffold.

## Source of truth

- `.agents/workflow/` owns PRDs, designs, technical designs, specs, decisions, and handoffs. A document's `status` stays in its own frontmatter.
- `drift.json` owns initiative execution state and recorded activity. `planned` does not mean its PRD is approved; `completed` cannot stand in for product approval or release evidence.
- Artifact entries contain stable identity and repository-root-relative path, not copied prose or a second editable document status.
- Activity records distinguish the actor who performed an action from the initiative owner. Drafting by an agent is not human approval. A summary of work is an attributed claim; only linked verification evidence supports a verified outcome.
- `.audits/` owns verification records. Git/history or an explicit content revision must bind any future approval/evidence to what was reviewed. Do not use a moving branch URL as the sole revision reference.

The current entry records drafting the website PRD and Sinapsi handoff; website implementation remains planned. The JSON is a repository-side record, not a global LangDrift product data model or Product Vision scoring schema.

## Future adapter contract

All JSON artifact paths are relative to the repository root, not this directory. Adapters must validate the schema and additionally check unique IDs, resolving artifact/activity references, real targets, and repository containment after resolving symlinks. JSON Schema cannot prove those relationships or the truth of recorded actions.

Future writes must preserve unknown future-version data or reject unsupported versions, detect stale revisions instead of silently overwriting changes, and require explicit human authorization for approvals or external actions. An MCP connection does not grant an agent approval authority. Credentials, local vault paths, tokens, and session material must not enter tracked JSON; use local ignored configuration when an adapter is designed.

Adapters may project Markdown metadata into read-only views, but must not create a second writable source of document status. Obsidian will need an explicitly implemented adapter/projection to consume this contract; a JSON file is not automatically an Obsidian note graph.

LangDrift should eventually be able to create this folder in another person's project without dictating that project's harness layout. This example references `.agents/`, but the schema accepts safe repository-relative artifact paths elsewhere. Removing `.drifts/` must not break the agentic factory or website.

## Current limits

The schema and manifest are a draft, not a released stable protocol. Lifecycle transitions, human approval representation, conflict resolution, transport, and retention remain design work. Empty integration directories intentionally contain only `.gitkeep`. Imported agent skill schemas remain independent of this manifest schema.

Schema dialect reference: [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).
