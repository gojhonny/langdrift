import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  createDrift,
  createPayload,
  parseArtifact,
  recordFromGitHubPullRequest,
  reportError,
  resolveCredential,
  sendPayload,
  validateRecord,
  TransportError
} from '../dist/index.js'

test('explicit diagnostics omit unknown remote bodies and stack traces', () => {
  let diagnostic
  reportError(new Error('secret@example.com Bearer private-token'), {
    write(value) {
      diagnostic = value
    }
  })
  assert.equal(diagnostic.code, 'UNKNOWN_ERROR')
  assert.equal(JSON.stringify(diagnostic).includes('private-token'), false)
})

const project = {
  schema_version: 1,
  id: 'project_1',
  account_id: 'account_1',
  name: 'Product',
  integrations: {
    langdrift: { enabled: true, credential_ref: 'env:TEST_TOKEN' },
    github: { enabled: false },
    linear: { enabled: false },
    obsidian: { enabled: false }
  }
}
const event = {
  action: 'closed',
  repository: { full_name: 'team/product' },
  pull_request: {
    id: 123,
    number: 42,
    title: 'Product Vision curve',
    state: 'closed',
    merged: true,
    user: { id: 1, type: 'User', email: 'not-forwarded@example.com' },
    merged_by: { id: 2, type: 'Bot' },
    created_at: '2026-09-19T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    merged_at: '2026-09-20T12:00:00Z',
    head: { ref: 'feature/curve', sha: 'abc123' },
    base: { ref: 'main', sha: 'def456' },
    labels: [{ name: 'feature' }],
    requested_reviewers: [{ id: 3, type: 'User' }]
  }
}
const references = [
  { type: 'spec', id: 'SPEC-001' },
  {
    type: 'ticket',
    id: 'TICKET-001',
    integration: 'linear',
    external_id: 'ENG-1'
  }
]

test('GitHub merged event maps deterministically to a Record with explicit references', () => {
  const record = recordFromGitHubPullRequest(event, references, {
    files: [
      { filename: 'curve.ts', status: 'modified', additions: 4, deletions: 1 }
    ]
  })
  assert.deepEqual(
    record,
    recordFromGitHubPullRequest(event, references, {
      files: [
        { filename: 'curve.ts', status: 'modified', additions: 4, deletions: 1 }
      ]
    })
  )
  assert.equal(record.kind, 'github.pull_request.merged')
  assert.equal(record.source.external_id, '123')
  assert.equal(record.actors[1].type, 'agent')
  assert.equal(record.data.author.external_id, 'github:1')
  assert.equal(record.data.files[0].additions, 4)
  assert.equal(JSON.stringify(record).includes('email'), false)
  assert.deepEqual(record.references, references)
  assert.throws(
    () => recordFromGitHubPullRequest({ ...event, action: 'opened' }),
    { code: 'ARTIFACT_INVALID' }
  )
  assert.throws(
    () =>
      recordFromGitHubPullRequest({
        ...event,
        pull_request: { ...event.pull_request, created_at: 'yesterday' }
      }),
    { code: 'ARTIFACT_INVALID' }
  )
  assert.throws(
    () =>
      recordFromGitHubPullRequest(event, references, {
        files: [{ filename: '../name', additions: -1 }]
      }),
    { code: 'ARTIFACT_INVALID' }
  )
})

test('Record payload carries routing, stable resource and provenance without credentials', () => {
  const record = recordFromGitHubPullRequest(event, references)
  const payload = createPayload(project, record)
  assert.equal(payload.account_id, project.account_id)
  assert.equal(payload.project_id, project.id)
  assert.equal(payload.resource, 'evidence.record')
  assert.equal(payload.resource_id, record.id)
  assert.deepEqual(payload.source, {
    kind: 'integration',
    integration: 'github',
    external_id: '123'
  })
  assert.deepEqual(payload.payload, record)
  assert.equal(JSON.stringify(payload).includes('credential'), false)
})

test('GitHub event identity survives repository rename or transfer', () => {
  const before = recordFromGitHubPullRequest(event)
  const after = recordFromGitHubPullRequest({
    ...event,
    repository: { full_name: 'new-owner/new-name' }
  })
  assert.equal(before.id, after.id)
  assert.equal(after.source.repository, 'new-owner/new-name')
})

test('Markdown payload rebuilds references and resource from validated metadata', () => {
  const artifact = parseArtifact(
    '---\nlangdrift:\n  type: prd\n  schema_version: 1\n  id: PRD-1\n  title: Product\n  owners: [person]\n  research: [RES-1]\n---\nBody',
    '.drifts/vision/prd/a.md'
  )
  artifact.resource = 'made.up'
  artifact.references = []
  const payload = createPayload(project, artifact)
  assert.equal(payload.resource, 'vision.prd')
  assert.deepEqual(payload.references, [{ type: 'research', id: 'RES-1' }])
  assert.equal(payload.payload.body, 'Body')
  assert.equal(payload.payload.metadata.id, 'PRD-1')
  artifact.path = '../secret.md'
  assert.throws(() => createPayload(project, artifact), {
    code: 'PATH_OUTSIDE_ROOT'
  })
})

test('discovered JSON events retain a schema-valid payload without a Markdown body', () => {
  const record = recordFromGitHubPullRequest(event)
  const parsed = parseArtifact(
    JSON.stringify(record),
    '.drifts/evidence/record/1.json'
  )
  const envelope = createPayload(project, parsed)
  assert.deepEqual(validateRecord(envelope.payload), record)
  assert.equal('body' in envelope.payload, false)
})

test('injected transport receives validated envelope with separate authorization', async () => {
  const record = recordFromGitHubPullRequest(event)
  let calls = 0
  const transport = {
    async send(payload, context) {
      calls++
      assert.deepEqual(payload, createPayload(project, record))
      assert.equal(context.authorization, 'private-token')
      assert.equal(JSON.stringify(payload).includes('private-token'), false)
      return { correlationId: 'request-1' }
    }
  }
  assert.deepEqual(
    await sendPayload(project, record, transport, {
      credentialRef: 'env:TEST_TOKEN',
      environment: { TEST_TOKEN: 'private-token' }
    }),
    { correlationId: 'request-1' }
  )
  await assert.rejects(
    sendPayload(project, { ...record, schema_version: 2 }, transport, {
      credentialRef: 'env:TEST_TOKEN'
    }),
    { code: 'SCHEMA_UNSUPPORTED' }
  )
  await assert.rejects(
    sendPayload(project, record, transport, {
      credentialRef: 'env:TEST_TOKEN',
      environment: {}
    }),
    { code: 'CREDENTIAL_MISSING' }
  )
  assert.equal(calls, 1)
})

test('credentials and remote error bodies never appear in structured failures', async () => {
  assert.throws(() => resolveCredential('raw-secret'), {
    code: 'CREDENTIAL_MISSING'
  })
  assert.throws(
    () => resolveCredential('env:TOKEN', { TOKEN: 'line\nbreak' }),
    { code: 'CREDENTIAL_MISSING' }
  )
  const record = recordFromGitHubPullRequest(event)
  for (const [error, code] of [
    [new TransportError(401), 'REMOTE_UNAUTHORIZED'],
    [new TransportError(422), 'REMOTE_REJECTED'],
    [new Error('Bearer secret remote-body'), 'MCP_UNAVAILABLE']
  ]) {
    await assert.rejects(
      sendPayload(
        project,
        record,
        {
          async send() {
            throw error
          }
        },
        { credentialRef: 'env:TOKEN', environment: { TOKEN: 'secret' } }
      ),
      (failure) => {
        assert.equal(failure.code, code)
        assert.equal(failure.message.includes('secret'), false)
        return true
      }
    )
  }
})

test('Drift retains supplied impact and evidence, rejecting fabricated unlinked provenance', () => {
  const input = {
    id: 'DRIFT-1',
    vision_target_id: 'VT-1',
    state: 'expected',
    impact: { unit: 'percentage_points', before: 91, delta: -4, after: 87 },
    actors: [{ type: 'human', id: 'user_1' }],
    references: [{ type: 'record', id: 'REC-1' }],
    reasoning: {
      method: 'llm',
      evidence_refs: ['REC-1'],
      schema_version: 1,
      model: 'provider/model'
    }
  }
  const drift = createDrift(input)
  assert.deepEqual(drift.impact, input.impact)
  assert.throws(() => createDrift({ ...input, references: [] }), {
    code: 'ARTIFACT_INVALID'
  })
  assert.throws(() => createPayload(project, drift), /source provenance/)
  assert.equal(
    createPayload(project, drift, {
      kind: 'json',
      path: '.drifts/evidence/drift/1.json'
    }).resource,
    'evidence.drift'
  )
})
