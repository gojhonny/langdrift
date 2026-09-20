import assert from 'node:assert/strict'
import test from 'node:test'
import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { LangDriftError } from '../dist/errors.js'
import {
  artifactPillars,
  pillarSchemas,
  projectSchema,
  schemas,
  SCHEMA_VERSION
} from '../dist/schema.js'
import { ARTIFACT_TYPES } from '../dist/types.js'
import {
  validateArtifact,
  validateDrift,
  validateProject,
  validateRecord
} from '../dist/validation.js'

const documentTypes = ARTIFACT_TYPES.filter(
  (type) => !['record', 'drift'].includes(type)
)
const ref = { type: 'record', id: 'R-01' }
const timestamp = '2026-09-20T14:30:00Z'
const artifact = (type = 'prd') => ({
  type,
  schema_version: 1,
  id: 'P-01',
  title: 'Recorded intent',
  owners: ['user-01']
})
const record = () => ({
  type: 'record',
  schema_version: 1,
  id: 'R-01',
  kind: 'github.pull_request.merged',
  occurred_at: timestamp,
  source: { integration: 'github', external_id: 'pr-42' },
  actors: [],
  references: [],
  data: {}
})
const drift = () => ({
  type: 'drift',
  schema_version: 1,
  id: 'D-01',
  vision_target_id: 'V-01',
  state: 'expected',
  impact: { unit: 'percentage_points', before: 70, delta: 5, after: 75 },
  actors: [],
  references: [ref],
  reasoning: {
    method: 'deterministic',
    evidence_refs: ['R-01'],
    schema_version: 1
  }
})
const project = () => ({
  schema_version: 1,
  id: 'proj-01',
  account_id: 'acct-01',
  name: 'LangDrift',
  integrations: {
    langdrift: { enabled: true },
    github: { enabled: false },
    linear: { enabled: false },
    obsidian: { enabled: false }
  }
})

function invalid(validate, value, path, code = 'ARTIFACT_INVALID') {
  assert.throws(
    () => validate(value),
    (error) => {
      assert.ok(error instanceof LangDriftError)
      assert.equal(error.code, code)
      assert.ok(error.issues.length > 0)
      if (path)
        assert.ok(
          error.issues.some((issue) => issue.path === path),
          JSON.stringify(error.issues)
        )
      return true
    }
  )
}

test('the registry exposes exactly the 11 versioned Draft 2020-12 artifact schemas', () => {
  assert.equal(SCHEMA_VERSION, 1)
  assert.deepEqual(Object.keys(schemas), [...ARTIFACT_TYPES])
  for (const type of ARTIFACT_TYPES) {
    const schema = schemas[type]
    assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema')
    assert.equal(schema['x-langdrift'].documentType, type)
    assert.equal(schema['x-langdrift'].version, 1)
    assert.equal(
      schema['x-langdrift'].mcp.resource,
      `${artifactPillars[type]}.${type}`
    )
    assert.equal(schema.properties.type.const, type)
    assert.equal(schema.additionalProperties, false)
  }
  assert.equal(projectSchema.properties.schema_version.const, 1)
})

for (const type of documentTypes) {
  test(`${type}: minimal and complete metadata preserve supplied values`, () => {
    const minimal = artifact(type)
    assert.equal(validateArtifact(minimal), minimal)
    const complete = {
      ...minimal,
      references: [
        {
          ...ref,
          path: 'evidence/record/R-01.json',
          integration: 'github',
          external_id: 'event-01'
        }
      ],
      research: ['RSH-01'],
      prds: ['P-02'],
      design_documents: ['DD-01'],
      specs: ['S-01'],
      tickets: ['T-01'],
      adrs: ['ADR-01'],
      vision_targets: ['V-01'],
      description: 'Context',
      summary: 'Decision summary',
      status: 'draft',
      deciders: ['user-02'],
      questions: ['What changed?'],
      scope: 'Product',
      tags: ['direction'],
      created_at: timestamp,
      updated_at: timestamp,
      decision_date: '2026-09-20',
      supersedes: [{ type: 'adr', id: 'ADR-02' }],
      superseded_by: [{ type: 'adr', id: 'ADR-03' }],
      external: { integration: 'linear', id: 'L-01' }
    }
    const before = structuredClone(complete)
    assert.equal(validateArtifact(complete), complete)
    assert.deepEqual(complete, before)
    assert.equal(
      schemas[type]['x-langdrift'].frontmatter.namespace,
      'langdrift'
    )
  })
  test(`${type}: missing fields, wrong types, extra fields and invalid references fail`, () => {
    const missing = artifact(type)
    delete missing.title
    invalid(validateArtifact, missing, '/title')
    invalid(
      validateArtifact,
      { ...artifact(type), owners: 'user-01' },
      '/owners'
    )
    invalid(validateArtifact, { ...artifact(type), mystery: true }, '/mystery')
    invalid(
      validateArtifact,
      { ...artifact(type), references: [{ type: 'prd' }] },
      '/references/0/id'
    )
    invalid(
      validateArtifact,
      { ...artifact(type), schema_version: 2 },
      '/schema_version',
      'SCHEMA_UNSUPPORTED'
    )
  })
}

test('stable IDs reject whitespace and metadata does not silently coerce, default or infer', () => {
  for (const id of ['', 'with space', '\nID', 'ID\n', 'ID\t', 'ID\u00a0'])
    invalid(validateArtifact, { ...artifact(), id }, '/id')
  invalid(
    validateArtifact,
    { ...artifact(), schema_version: '1' },
    '/schema_version'
  )
  invalid(validateArtifact, { ...artifact(), owners: [] }, '/owners')
  invalid(validateArtifact, { ...artifact(), title: '  ' }, '/title')
  invalid(validateArtifact, record(), '/type')
  invalid(validateArtifact, drift(), '/type')
  invalid(validateArtifact, { ...artifact(), type: 'decision' }, '/type')
})

test('project validates routing metadata and rejects unsupported configuration or secrets', () => {
  const minimal = project()
  assert.equal(validateProject(minimal), minimal)
  const full = project()
  full.integrations.langdrift.credential_ref = 'env:LANGDRIFT_TOKEN'
  full.integrations.github = {
    enabled: true,
    installation_id: '123',
    repository: 'owner/repo',
    credential_ref: 'env:GITHUB_TOKEN'
  }
  full.generator = { name: '@langdrift/setup', version: '0.1.0' }
  assert.equal(validateProject(full), full)
  invalid(
    validateProject,
    { ...minimal, account_id: 123 },
    '/account_id',
    'PROJECT_INVALID'
  )
  invalid(
    validateProject,
    { ...minimal, schema_version: 2 },
    '/schema_version',
    'SCHEMA_UNSUPPORTED'
  )
  const disabled = project()
  disabled.integrations.langdrift.enabled = false
  invalid(
    validateProject,
    disabled,
    '/integrations/langdrift/enabled',
    'PROJECT_INVALID'
  )
  const secret = project()
  secret.integrations.github.token = 'private-value'
  invalid(
    validateProject,
    secret,
    '/integrations/github/token',
    'PROJECT_INVALID'
  )
  const missing = project()
  delete missing.integrations.linear
  invalid(validateProject, missing, '/integrations/linear', 'PROJECT_INVALID')
})

test('project credentials are environment references and GitHub routing has an explicit shape', () => {
  for (const integration of ['github', 'langdrift']) {
    for (const credential of [
      'ghp_secret',
      'raw-secret-token',
      'env:',
      'env:123INVALID',
      'env:NAME\n',
      'env:NAME=value'
    ]) {
      const value = project()
      value.integrations[integration].credential_ref = credential
      invalid(
        validateProject,
        value,
        `/integrations/${integration}/credential_ref`,
        'PROJECT_INVALID'
      )
    }
  }
  for (const installation of ['abc', 123, '-1', '123\n']) {
    const value = project()
    value.integrations.github.installation_id = installation
    invalid(
      validateProject,
      value,
      '/integrations/github/installation_id',
      'PROJECT_INVALID'
    )
  }
  for (const repository of [
    'repo',
    'owner/repo/extra',
    'https://github.com/owner/repo',
    '/repo',
    'owner/repo\n'
  ]) {
    const value = project()
    value.integrations.github.repository = repository
    invalid(
      validateProject,
      value,
      '/integrations/github/repository',
      'PROJECT_INVALID'
    )
  }
})

test('record validates the minimal envelope and preserves complete raw JSON data', () => {
  const minimal = record()
  assert.equal(validateRecord(minimal), minimal)
  const full = {
    ...minimal,
    source: { ...minimal.source, repository: 'owner/repo' },
    actors: [
      { type: 'human', id: 'user-01', external_id: 'github-123' },
      { type: 'agent', external_id: 'agent-42' }
    ],
    references: [
      { type: 'ticket', id: 'T-01', integration: 'linear', external_id: 'L-01' }
    ],
    data: { nested: { values: [null, false, 0, 'raw', { count: 3 }] } }
  }
  assert.equal(validateRecord(full), full)
  invalid(
    validateRecord,
    { ...minimal, occurred_at: 'yesterday' },
    '/occurred_at'
  )
  invalid(validateRecord, { ...minimal, data: [] }, '/data')
  invalid(
    validateRecord,
    { ...minimal, actors: [{ type: 'human' }] },
    '/actors/0/id'
  )
  invalid(
    validateRecord,
    { ...minimal, actors: [{ type: 'bot', id: 'u-1' }] },
    '/actors/0/type'
  )
  invalid(
    validateRecord,
    { ...minimal, source: { integration: 'github', external_id: 42 } },
    '/source/external_id'
  )
  invalid(
    validateRecord,
    { ...minimal, schema_version: 3 },
    '/schema_version',
    'SCHEMA_UNSUPPORTED'
  )
  invalid(validateRecord, { ...minimal, type: 'drift' }, '/type')
  invalid(
    validateRecord,
    { ...minimal, computed_score: 100 },
    '/computed_score'
  )
  const missing = record()
  delete missing.data
  invalid(validateRecord, missing, '/data')
})

test('references require complete external identity and safe relative paths', () => {
  for (const path of [
    '/etc/passwd',
    '../secret',
    'a/../b',
    './record.json',
    'a/./b',
    'a//b',
    'a/',
    'C:\\secret',
    'a\\b',
    'record.json\n'
  ]) {
    invalid(
      validateRecord,
      { ...record(), references: [{ ...ref, path }] },
      '/references/0/path'
    )
  }
  for (const reference of [
    { ...ref, external_id: 'ext-1' },
    { ...ref, integration: 'github' }
  ]) {
    invalid(
      validateRecord,
      { ...record(), references: [reference] },
      '/references/0'
    )
  }
  assert.ok(
    validateRecord({
      ...record(),
      references: [{ ...ref, path: '.drifts/evidence/record/R-01.json' }]
    })
  )
})

test('drift accepts explicit units and positive or negative movement without inferred scoring', () => {
  for (const unit of ['percentage_points', 'ratio', 'score_points']) {
    const value = drift()
    value.impact = { unit, before: 0.1, delta: 0.2, after: 0.3 }
    assert.equal(validateDrift(value), value)
  }
  const full = drift()
  full.state = 'unexpected'
  full.impact = { unit: 'score_points', before: 1000, delta: -1001, after: -1 }
  full.actors = [{ type: 'human', id: 'u-1' }]
  full.created_at = timestamp
  full.reasoning = {
    method: 'llm',
    evidence_refs: ['R-01'],
    schema_version: 1,
    model: 'test-model',
    model_version: 'v1'
  }
  assert.equal(validateDrift(full), full)
  const human = drift()
  human.reasoning = { method: 'human', evidence_refs: [], schema_version: 1 }
  assert.ok(validateDrift(human))
})

test('drift rejects missing shape, invalid state/unit and inconsistent impact', () => {
  const missing = drift()
  delete missing.vision_target_id
  invalid(validateDrift, missing, '/vision_target_id')
  invalid(validateDrift, { ...drift(), state: 'unknown' }, '/state')
  invalid(
    validateDrift,
    { ...drift(), impact: { ...drift().impact, unit: 'percent' } },
    '/impact/unit'
  )
  invalid(
    validateDrift,
    { ...drift(), impact: { ...drift().impact, after: 76 } },
    '/impact/after'
  )
  invalid(
    validateDrift,
    {
      ...drift(),
      impact: {
        unit: 'ratio',
        before: Number.MAX_VALUE,
        delta: Number.MAX_VALUE,
        after: Number.MAX_VALUE
      }
    },
    '/impact/after'
  )
  invalid(validateDrift, { ...drift(), type: 'record' }, '/type')
  invalid(validateDrift, { ...drift(), extra: true }, '/extra')
  invalid(
    validateDrift,
    { ...drift(), schema_version: 2 },
    '/schema_version',
    'SCHEMA_UNSUPPORTED'
  )
})

test('LLM reasoning requires model and linked evidence; reasoning versions are explicit', () => {
  const value = drift()
  value.reasoning.method = 'llm'
  invalid(validateDrift, value, '/reasoning/model')
  value.reasoning.model = 'test-model'
  value.reasoning.evidence_refs = []
  invalid(validateDrift, value, '/reasoning/evidence_refs')
  value.reasoning.evidence_refs = ['unlinked-record']
  invalid(validateDrift, value, '/reasoning/evidence_refs/0')
  invalid(
    validateDrift,
    { ...drift(), reasoning: { ...drift().reasoning, model_version: 'v2' } },
    '/reasoning'
  )
  invalid(
    validateDrift,
    { ...drift(), reasoning: { ...drift().reasoning, schema_version: 2 } },
    '/reasoning/schema_version',
    'SCHEMA_UNSUPPORTED'
  )
})

test('non-JSON data fails safely before Ajv without executing getters or toJSON', () => {
  for (const value of [
    undefined,
    NaN,
    Infinity,
    -Infinity,
    1n,
    () => 1,
    Symbol('private'),
    new Date(),
    new Map()
  ]) {
    invalid(validateRecord, { ...record(), data: { value } }, '/data/value')
  }
  let invoked = 0
  const accessor = Object.defineProperty({}, 'secret', {
    enumerable: true,
    get() {
      invoked++
      return 'private-value'
    }
  })
  invalid(validateRecord, { ...record(), data: accessor }, '/data/secret')
  const serializable = {
    toJSON() {
      invoked++
      return {}
    }
  }
  invalid(validateRecord, { ...record(), data: serializable }, '/data/toJSON')
  assert.equal(invoked, 0)
  const cyclic = {}
  cyclic.self = cyclic
  invalid(validateRecord, { ...record(), data: cyclic }, '/data/self')
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    invalid(
      validateRecord,
      { ...record(), data: JSON.parse(`{"${key}": {}}`) },
      `/data/${key}`
    )
  }
  const shared = { count: 1 }
  assert.ok(validateRecord({ ...record(), data: { a: shared, b: shared } }))
  const array = [1]
  array['4294967295'] = true
  invalid(
    validateRecord,
    { ...record(), data: { array } },
    '/data/array/4294967295'
  )
  invalid(
    validateRecord,
    { ...record(), data: { sparse: Array(1) } },
    '/data/sparse/0'
  )
})

test('standalone pillar schemas retain local definitions and validate only their families', () => {
  for (const [pillar, original] of Object.entries(pillarSchemas)) {
    const ajv = new Ajv2020({ strict: true })
    addFormats(ajv)
    ajv.addKeyword({
      keyword: 'x-langdrift',
      schemaType: 'object',
      valid: true
    })
    const validate = ajv.compile(JSON.parse(JSON.stringify(original)))
    for (const type of ARTIFACT_TYPES) {
      const value =
        type === 'record'
          ? record()
          : type === 'drift'
            ? drift()
            : artifact(type)
      assert.equal(
        validate(value),
        artifactPillars[type] === pillar,
        `${pillar}: ${type} ${JSON.stringify(validate.errors)}`
      )
    }
  }
})

test('untrusted JSON is bounded before recursive validation and rejects inherited array behavior', () => {
  let deep = {}
  for (let index = 0; index < 110; index++) deep = { nested: deep }
  invalid(validateRecord, { ...record(), data: deep })
  invalid(validateRecord, {
    ...record(),
    data: { values: Array(100_001).fill(0) }
  })
  invalid(
    validateRecord,
    { ...record(), data: { sparse: Array(4_294_967_295) } },
    '/data/sparse/0'
  )
  let invoked = false
  const inherited = Object.setPrototypeOf([], {
    toJSON() {
      invoked = true
      return []
    }
  })
  invalid(
    validateRecord,
    { ...record(), data: { inherited } },
    '/data/inherited'
  )
  assert.equal(invoked, false)
})
