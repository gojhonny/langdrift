export const ARTIFACT_TYPES = [
  'research',
  'prd',
  'context',
  'triage',
  'design-document',
  'spec',
  'ticket',
  'adr',
  'audit',
  'drift',
  'record'
] as const

export type ArtifactType = (typeof ARTIFACT_TYPES)[number]
export type DocumentType = Exclude<ArtifactType, 'drift' | 'record'>
export type Pillar = 'vision' | 'loop' | 'evidence'
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[]
export interface JsonObject {
  [key: string]: JsonValue
}

export interface ArtifactRef {
  type: string
  id: string
  path?: string
  external_id?: string
  integration?: string
}

export interface ActorRef {
  type: 'human' | 'agent'
  id?: string
  external_id?: string
}

export interface Project {
  schema_version: 1
  id: string
  account_id: string
  name: string
  integrations: {
    langdrift: { enabled: true; credential_ref?: string }
    github: {
      enabled: boolean
      installation_id?: string
      repository?: string
      credential_ref?: string
    }
    linear: { enabled: boolean }
    obsidian: { enabled: boolean }
  }
  generator?: { name: string; version: string }
}

/** Deterministic frontmatter for the nine Markdown document families. */
export interface ArtifactMetadata {
  type: DocumentType
  schema_version: 1
  id: string
  title: string
  owners: string[]
  references?: ArtifactRef[]
  research?: string[]
  prds?: string[]
  design_documents?: string[]
  specs?: string[]
  tickets?: string[]
  adrs?: string[]
  vision_targets?: string[]
  description?: string
  summary?: string
  status?: string
  deciders?: string[]
  questions?: string[]
  scope?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
  decision_date?: string
  supersedes?: ArtifactRef[]
  superseded_by?: ArtifactRef[]
  external?: { integration: string; id: string }
}

export interface RecordEvent {
  type: 'record'
  schema_version: 1
  id: string
  kind: string
  occurred_at: string
  source: { integration: string; external_id: string; repository?: string }
  actors: ActorRef[]
  references: ArtifactRef[]
  data: JsonObject
}

export interface DriftEvent {
  type: 'drift'
  schema_version: 1
  id: string
  vision_target_id: string
  state: 'expected' | 'unexpected'
  impact: {
    unit: 'percentage_points' | 'ratio' | 'score_points'
    before: number
    delta: number
    after: number
  }
  actors: ActorRef[]
  references: ArtifactRef[]
  reasoning: {
    method: 'human' | 'deterministic' | 'llm'
    evidence_refs: string[]
    schema_version: 1
    model?: string
    model_version?: string
  }
  created_at?: string
}
