import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { LangDriftError } from './errors.js'
import { createRecord, recordId } from './records.js'
import type { ActorRef, ArtifactRef, RecordEvent } from './types.js'

interface GitHubUser {
  id: number
  type?: string
}
export interface GitHubPullRequestEvent {
  action: 'closed'
  repository: { full_name: string }
  pull_request: {
    id: number
    number: number
    title: string
    state: 'closed'
    merged: true
    user: GitHubUser
    merged_by: GitHubUser | null
    created_at: string
    updated_at: string
    merged_at: string
    head: { ref: string; sha: string }
    base: { ref: string; sha: string }
    labels?: { name: string }[]
    requested_reviewers?: GitHubUser[]
    html_url?: string
  }
}

export interface GitHubPullRequestDetails {
  commits?: { sha: string; message: string }[]
  files?: {
    filename: string
    status: string
    additions: number
    deletions: number
  }[]
}

const string = { type: 'string', minLength: 1 }
const integer = { type: 'integer', minimum: 0 }
const identity = { type: 'integer', minimum: 1 }
const timestamp = { type: 'string', format: 'date-time' }
const userSchema = {
  type: 'object',
  required: ['id'],
  properties: { id: identity, type: string }
}
const branchSchema = {
  type: 'object',
  required: ['ref', 'sha'],
  properties: { ref: string, sha: string }
}
const githubValidator = new Ajv2020({ allErrors: true })
addFormats.default(githubValidator)
const validateEvent = githubValidator.compile({
  type: 'object',
  required: ['action', 'repository', 'pull_request'],
  properties: {
    action: { const: 'closed' },
    repository: {
      type: 'object',
      required: ['full_name'],
      properties: {
        full_name: { type: 'string', pattern: '^[^/\\s]+/[^/\\s]+$' }
      }
    },
    pull_request: {
      type: 'object',
      required: [
        'id',
        'number',
        'title',
        'state',
        'merged',
        'user',
        'merged_by',
        'created_at',
        'updated_at',
        'merged_at',
        'head',
        'base'
      ],
      properties: {
        id: identity,
        number: identity,
        title: string,
        state: { const: 'closed' },
        merged: { const: true },
        user: userSchema,
        merged_by: { anyOf: [userSchema, { type: 'null' }] },
        created_at: timestamp,
        updated_at: timestamp,
        merged_at: timestamp,
        head: branchSchema,
        base: branchSchema,
        labels: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name'],
            properties: { name: string }
          }
        },
        requested_reviewers: { type: 'array', items: userSchema },
        html_url: string
      }
    }
  }
})
const validateDetails = new Ajv2020().compile({
  type: 'object',
  additionalProperties: false,
  properties: {
    commits: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['sha', 'message'],
        properties: { sha: string, message: string }
      }
    },
    files: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['filename', 'status', 'additions', 'deletions'],
        properties: {
          filename: string,
          status: string,
          additions: integer,
          deletions: integer
        }
      }
    }
  }
})

/** Explicit GitHub webhook/API fields become facts, never a Drift interpretation. */
export function recordFromGitHubPullRequest(
  event: GitHubPullRequestEvent,
  references: ArtifactRef[] = [],
  details: GitHubPullRequestDetails = {}
): RecordEvent {
  if (!validateEvent(event) || !validateDetails(details)) {
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Expected a merged GitHub pull request and valid optional commit/file facts.'
    )
  }
  const pr = event.pull_request
  const actor = (user: GitHubUser): ActorRef => ({
    type: user.type === 'Bot' ? 'agent' : 'human',
    external_id: `github:${user.id}`
  })
  const author = actor(pr.user)
  const merger = pr.merged_by ? actor(pr.merged_by) : undefined
  return createRecord({
    id: recordId('github', 'pull_request', `${pr.id}:merged`),
    kind: 'github.pull_request.merged',
    occurred_at: pr.merged_at,
    source: {
      integration: 'github',
      repository: event.repository.full_name,
      external_id: String(pr.id)
    },
    actors: [
      author,
      ...(merger && merger.external_id !== author.external_id ? [merger] : [])
    ],
    references,
    data: {
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: { ...author },
      ...(merger ? { merged_by: { ...merger } } : {}),
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      merged_at: pr.merged_at,
      head: { ref: pr.head.ref, sha: pr.head.sha },
      base: { ref: pr.base.ref, sha: pr.base.sha },
      ...(pr.labels ? { labels: pr.labels.map(({ name }) => name) } : {}),
      ...(pr.requested_reviewers
        ? {
            requested_reviewers: pr.requested_reviewers.map((user) => ({
              ...actor(user)
            }))
          }
        : {}),
      ...(pr.html_url ? { url: pr.html_url } : {}),
      ...(details.commits
        ? { commits: details.commits.map((commit) => ({ ...commit })) }
        : {}),
      ...(details.files
        ? { files: details.files.map((file) => ({ ...file })) }
        : {})
    }
  })
}

/** Optional sources implement ingestion; the SDK does not enable bidirectional writes. */
export interface RecordSourceAdapter {
  integration: string
  readRecords(): AsyncIterable<RecordEvent>
}

export const integrationCapabilities = {
  github: 'deterministic-fixture-mapper',
  langdrift: 'injected-transport',
  linear: 'interface-only',
  obsidian: 'interface-only'
} as const
