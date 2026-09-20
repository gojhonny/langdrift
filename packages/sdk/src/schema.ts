import type { AnySchemaObject } from 'ajv'
import {
  ARTIFACT_TYPES,
  type ArtifactType,
  type DocumentType,
  type Pillar
} from './types.js'

export const SCHEMA_VERSION = 1 as const
const DRAFT = 'https://json-schema.org/draft/2020-12/schema'

const ref = (name: string) => ({ $ref: `#/$defs/${name}` })
const ids = { type: 'array', items: ref('artifactId'), uniqueItems: true }
const text = { type: 'string', minLength: 1, pattern: '\\S' }
const refs = { type: 'array', items: ref('artifactRef'), uniqueItems: true }
const actors = { type: 'array', items: ref('actorRef'), uniqueItems: true }

const definitions: Record<string, AnySchemaObject> = {
  artifactId: { type: 'string', minLength: 1, pattern: '^\\S+(?![\\s\\S])' },
  timestamp: { type: 'string', format: 'date-time' },
  credentialRef: {
    type: 'string',
    pattern: '^env:[A-Za-z_][A-Za-z0-9_]*(?![\\s\\S])'
  },
  relativePath: {
    type: 'string',
    minLength: 1,
    pattern: String.raw`^(?!.*(?:^|/)\.{1,2}(?:/|$))(?:[^/\\:\u0000-\u001f]+/)*[^/\\:\u0000-\u001f]+(?![\s\S])`
  },
  artifactRef: {
    type: 'object',
    additionalProperties: false,
    required: ['type', 'id'],
    dependentRequired: {
      external_id: ['integration'],
      integration: ['external_id']
    },
    properties: {
      type: ref('artifactId'),
      id: ref('artifactId'),
      path: ref('relativePath'),
      external_id: ref('artifactId'),
      integration: ref('artifactId')
    }
  },
  actorRef: {
    type: 'object',
    additionalProperties: false,
    required: ['type'],
    anyOf: [
      { required: ['id'], properties: { id: ref('artifactId') } },
      {
        required: ['external_id'],
        properties: { external_id: ref('artifactId') }
      }
    ],
    properties: {
      type: { type: 'string', enum: ['human', 'agent'] },
      id: ref('artifactId'),
      external_id: ref('artifactId')
    }
  },
  jsonValue: {
    anyOf: [
      { type: 'null' },
      { type: 'boolean' },
      { type: 'number' },
      { type: 'string' },
      { type: 'array', items: ref('jsonValue') },
      { type: 'object', additionalProperties: ref('jsonValue') }
    ]
  }
}

export const artifactPillars: Record<ArtifactType, Pillar> = {
  research: 'vision',
  prd: 'vision',
  context: 'vision',
  triage: 'loop',
  'design-document': 'loop',
  spec: 'loop',
  ticket: 'loop',
  adr: 'evidence',
  audit: 'evidence',
  drift: 'evidence',
  record: 'evidence'
}

const common = {
  schema_version: { type: 'integer', const: SCHEMA_VERSION },
  id: ref('artifactId')
}

const relationshipKinds = {
  research: ['vision.research'],
  prds: ['vision.prd'],
  design_documents: ['loop.design-document'],
  specs: ['loop.spec'],
  tickets: ['loop.ticket'],
  adrs: ['evidence.adr'],
  vision_targets: ['vision.target'],
  supersedes: ARTIFACT_TYPES.map((type) => `${artifactPillars[type]}.${type}`),
  superseded_by: ARTIFACT_TYPES.map(
    (type) => `${artifactPillars[type]}.${type}`
  )
}

function directives(type: ArtifactType, markdown: boolean) {
  const pillar = artifactPillars[type]
  return {
    documentType: type,
    version: SCHEMA_VERSION,
    source: {
      glob: `.drifts/${pillar}/${type}/**/*.${markdown ? 'md' : 'json'}`
    },
    ...(markdown
      ? {
          frontmatter: {
            namespace: 'langdrift',
            required: ['type', 'schema_version', 'id', 'title', 'owners']
          },
          references: relationshipKinds
        }
      : {}),
    mcp: { resource: `${pillar}.${type}` }
  }
}

function documentSchema(type: DocumentType): AnySchemaObject {
  return {
    $schema: DRAFT,
    $id: `langdrift://${artifactPillars[type]}/${type}/v1`,
    title: `LangDrift ${type} metadata`,
    $defs: definitions,
    type: 'object',
    additionalProperties: false,
    required: ['type', 'schema_version', 'id', 'title', 'owners'],
    properties: {
      ...common,
      type: { type: 'string', const: type },
      title: text,
      owners: { ...ids, minItems: 1 },
      references: refs,
      research: ids,
      prds: ids,
      design_documents: ids,
      specs: ids,
      tickets: ids,
      adrs: ids,
      vision_targets: ids,
      description: { type: 'string' },
      summary: { type: 'string' },
      status: text,
      deciders: ids,
      questions: { type: 'array', items: text },
      scope: text,
      tags: { type: 'array', items: text, uniqueItems: true },
      created_at: ref('timestamp'),
      updated_at: ref('timestamp'),
      decision_date: { type: 'string', format: 'date' },
      supersedes: refs,
      superseded_by: refs,
      external: {
        type: 'object',
        additionalProperties: false,
        required: ['integration', 'id'],
        properties: { integration: ref('artifactId'), id: ref('artifactId') }
      }
    },
    'x-langdrift': directives(type, true)
  }
}

const recordSchema: AnySchemaObject = {
  $schema: DRAFT,
  $id: 'langdrift://evidence/record/v1',
  title: 'LangDrift Record',
  $defs: definitions,
  type: 'object',
  additionalProperties: false,
  required: [
    'type',
    'schema_version',
    'id',
    'kind',
    'occurred_at',
    'source',
    'actors',
    'references',
    'data'
  ],
  properties: {
    ...common,
    type: { type: 'string', const: 'record' },
    kind: ref('artifactId'),
    occurred_at: ref('timestamp'),
    source: {
      type: 'object',
      additionalProperties: false,
      required: ['integration', 'external_id'],
      properties: {
        integration: ref('artifactId'),
        external_id: ref('artifactId'),
        repository: ref('artifactId')
      }
    },
    actors,
    references: refs,
    data: { type: 'object', additionalProperties: ref('jsonValue') }
  },
  'x-langdrift': directives('record', false)
}

const driftSchema: AnySchemaObject = {
  $schema: DRAFT,
  $id: 'langdrift://evidence/drift/v1',
  title: 'LangDrift Drift',
  $defs: definitions,
  type: 'object',
  additionalProperties: false,
  required: [
    'type',
    'schema_version',
    'id',
    'vision_target_id',
    'state',
    'impact',
    'actors',
    'references',
    'reasoning'
  ],
  properties: {
    ...common,
    type: { type: 'string', const: 'drift' },
    vision_target_id: ref('artifactId'),
    state: { type: 'string', enum: ['expected', 'unexpected'] },
    impact: {
      type: 'object',
      additionalProperties: false,
      required: ['unit', 'before', 'delta', 'after'],
      properties: {
        unit: {
          type: 'string',
          enum: ['percentage_points', 'ratio', 'score_points']
        },
        before: { type: 'number' },
        delta: { type: 'number' },
        after: { type: 'number' }
      }
    },
    actors,
    references: refs,
    reasoning: {
      type: 'object',
      additionalProperties: false,
      required: ['method', 'evidence_refs', 'schema_version'],
      properties: {
        method: { type: 'string', enum: ['human', 'deterministic', 'llm'] },
        evidence_refs: ids,
        schema_version: common.schema_version,
        model: text,
        model_version: text
      },
      dependentRequired: { model_version: ['model'] },
      if: { properties: { method: { const: 'llm' } }, required: ['method'] },
      // biome-ignore lint/suspicious/noThenProperty: JSON Schema requires "then" for conditional validation.
      then: {
        required: ['model'],
        properties: {
          model: text,
          evidence_refs: { type: 'array', minItems: 1 }
        }
      }
    },
    created_at: ref('timestamp')
  },
  'x-langdrift': directives('drift', false)
}

export const schemas: Record<ArtifactType, AnySchemaObject> = {
  research: documentSchema('research'),
  prd: documentSchema('prd'),
  context: documentSchema('context'),
  triage: documentSchema('triage'),
  'design-document': documentSchema('design-document'),
  spec: documentSchema('spec'),
  ticket: documentSchema('ticket'),
  adr: documentSchema('adr'),
  audit: documentSchema('audit'),
  drift: driftSchema,
  record: recordSchema
}

export const projectSchema: AnySchemaObject = {
  $schema: DRAFT,
  $id: 'langdrift://project/v1',
  title: 'LangDrift project',
  $defs: definitions,
  type: 'object',
  additionalProperties: false,
  required: ['schema_version', 'id', 'account_id', 'name', 'integrations'],
  properties: {
    ...common,
    account_id: ref('artifactId'),
    name: text,
    integrations: {
      type: 'object',
      additionalProperties: false,
      required: ['langdrift', 'github', 'linear', 'obsidian'],
      properties: {
        langdrift: {
          type: 'object',
          additionalProperties: false,
          required: ['enabled'],
          properties: {
            enabled: { type: 'boolean', const: true },
            credential_ref: ref('credentialRef')
          }
        },
        github: {
          type: 'object',
          additionalProperties: false,
          required: ['enabled'],
          properties: {
            enabled: { type: 'boolean' },
            installation_id: { type: 'string', pattern: '^[0-9]+(?![\\s\\S])' },
            repository: {
              type: 'string',
              pattern: '^[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9._-]+(?![\\s\\S])'
            },
            credential_ref: ref('credentialRef')
          }
        },
        linear: {
          type: 'object',
          additionalProperties: false,
          required: ['enabled'],
          properties: { enabled: { type: 'boolean' } }
        },
        obsidian: {
          type: 'object',
          additionalProperties: false,
          required: ['enabled'],
          properties: { enabled: { type: 'boolean' } }
        }
      }
    },
    generator: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'version'],
      properties: { name: text, version: ref('artifactId') }
    }
  },
  'x-langdrift': { documentType: 'project', version: SCHEMA_VERSION }
}

function pillarSchema(pillar: Pillar): AnySchemaObject {
  const types = ARTIFACT_TYPES.filter(
    (type) => artifactPillars[type] === pillar
  )
  // Local refs resolve against this document. Embedded artifacts deliberately
  // omit their own $id/$defs, keeping each generated pillar file self-contained.
  const artifacts = Object.fromEntries(
    types.map((type) => {
      const {
        $id: _id,
        $schema: _draft,
        $defs: _defs,
        ...shape
      } = schemas[type]
      return [type, shape]
    })
  )
  return {
    $schema: DRAFT,
    $id: `langdrift://${pillar}/v1`,
    title: `LangDrift ${pillar}`,
    $defs: { ...definitions, ...artifacts },
    oneOf: types.map((type) => ref(type)),
    'x-langdrift': { pillar, version: SCHEMA_VERSION }
  }
}

export const pillarSchemas: Record<Pillar, AnySchemaObject> = {
  vision: pillarSchema('vision'),
  loop: pillarSchema('loop'),
  evidence: pillarSchema('evidence')
}
