import {
  artifactLocations,
  artifactReferences,
  type ParsedArtifact
} from './artifacts.js'
import { LangDriftError } from './errors.js'
import type {
  ArtifactRef,
  DriftEvent,
  JsonObject,
  Project,
  RecordEvent
} from './types.js'
import {
  validateArtifact,
  validateDrift,
  validateProject,
  validateRecord
} from './validation.js'

export interface PayloadSource {
  kind: 'markdown' | 'json' | 'integration'
  path?: string
  integration?: string
  external_id?: string
}

export interface PayloadEnvelope {
  schema_version: 1
  account_id: string
  project_id: string
  resource: string
  resource_id: string
  source: PayloadSource
  references: ArtifactRef[]
  payload: JsonObject
}

function safeSource(source: PayloadSource): PayloadSource {
  const keys = Object.keys(source)
  if (
    keys.some(
      (key) => !['kind', 'path', 'integration', 'external_id'].includes(key)
    )
  ) {
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Source contains unsupported fields.'
    )
  }
  if (source.kind === 'integration') {
    if (
      typeof source.integration !== 'string' ||
      !/^\S+$/.test(source.integration) ||
      typeof source.external_id !== 'string' ||
      !/^\S+$/.test(source.external_id) ||
      source.path !== undefined
    ) {
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Integration sources require integration and external_id.'
      )
    }
  } else if (source.kind === 'markdown' || source.kind === 'json') {
    if (
      typeof source.path !== 'string' ||
      !source.path ||
      source.path.includes('\\') ||
      // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject control bytes in source paths.
      /[:\u0000-\u001f\u007f]/.test(source.path) ||
      source.path
        .split('/')
        .some(
          (part) =>
            !part ||
            part === '..' ||
            part === '.' ||
            part === 'node_modules' ||
            (part.startsWith('.') && part !== '.drifts')
        ) ||
      source.integration !== undefined ||
      source.external_id !== undefined
    ) {
      throw new LangDriftError(
        'PATH_OUTSIDE_ROOT',
        'Payload source requires a safe relative artifact path.'
      )
    }
  } else
    throw new LangDriftError('ARTIFACT_INVALID', 'Unsupported source kind.')
  return { ...source }
}

/** Normalized envelope for a future MCP adapter; this does not implement a server or upload. */
export function createPayload(
  projectInput: Project,
  input: ParsedArtifact | RecordEvent | DriftEvent,
  source?: PayloadSource
): PayloadEnvelope {
  const project = validateProject(projectInput)
  const parsed = 'metadata' in input ? input : undefined
  const metadata = parsed
    ? parsed.metadata
    : (input as RecordEvent | DriftEvent)
  const validated =
    metadata.type === 'record'
      ? validateRecord(metadata)
      : metadata.type === 'drift'
        ? validateDrift(metadata)
        : validateArtifact(metadata)
  const location = artifactLocations[validated.type]
  const metadataPayload = JSON.parse(JSON.stringify(validated)) as JsonObject
  let payload = metadataPayload
  if (parsed && validated.type !== 'record' && validated.type !== 'drift') {
    if (
      typeof parsed.body !== 'string' ||
      Buffer.byteLength(parsed.body) > 1024 * 1024
    ) {
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Artifact body must be text of at most 1 MiB.'
      )
    }
    payload = { metadata: metadataPayload, body: parsed.body }
  }
  const provenance =
    source ??
    (parsed
      ? ({
          kind: parsed.path.endsWith('.md') ? 'markdown' : 'json',
          path: parsed.path
        } as PayloadSource)
      : validated.type === 'record'
        ? ({
            kind: 'integration',
            integration: validated.source.integration,
            external_id: validated.source.external_id
          } as PayloadSource)
        : undefined)
  if (!provenance)
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Provide source provenance for Drift.'
    )
  return {
    schema_version: 1,
    account_id: project.account_id,
    project_id: project.id,
    resource: `${location.split('/')[0]}.${validated.type}`,
    resource_id: validated.id,
    source: safeSource(provenance),
    references: artifactReferences(validated),
    payload
  }
}

export function resolveCredential(
  reference: string,
  environment: Readonly<Record<string, string | undefined>> = process.env
): string {
  if (!/^env:[A-Za-z_][A-Za-z0-9_]*$/.test(reference)) {
    throw new LangDriftError(
      'CREDENTIAL_MISSING',
      'Credentials must use an env:NAME reference.'
    )
  }
  const value = environment[reference.slice(4)]
  if (!value || /[\r\n\0]/.test(value))
    throw new LangDriftError(
      'CREDENTIAL_MISSING',
      'The referenced credential is missing or invalid.'
    )
  return value
}

export interface TransportResult {
  correlationId?: string
}
export interface PayloadTransport {
  send(
    payload: PayloadEnvelope,
    context: { authorization: string }
  ): Promise<TransportResult>
}

/** Adapter errors carry only status, never raw remote bodies or credentials. */
export class TransportError extends Error {
  constructor(public readonly status?: number) {
    super('Transport failed')
  }
}

export async function sendPayload(
  project: Project,
  artifact: ParsedArtifact | RecordEvent | DriftEvent,
  transport: PayloadTransport,
  options: {
    credentialRef: string
    environment?: Readonly<Record<string, string | undefined>>
    source?: PayloadSource
  }
): Promise<TransportResult> {
  const payload = createPayload(project, artifact, options.source)
  const authorization = resolveCredential(
    options.credentialRef,
    options.environment
  )
  try {
    return await transport.send(payload, { authorization })
  } catch (error) {
    if (
      error instanceof TransportError &&
      (error.status === 401 || error.status === 403)
    ) {
      throw new LangDriftError(
        'REMOTE_UNAUTHORIZED',
        'The destination rejected authorization.'
      )
    }
    if (
      error instanceof TransportError &&
      error.status &&
      error.status >= 400 &&
      error.status < 500
    ) {
      throw new LangDriftError(
        'REMOTE_REJECTED',
        'The destination rejected the payload.'
      )
    }
    throw new LangDriftError(
      'MCP_UNAVAILABLE',
      'The destination transport is unavailable. Retry explicitly; no data was queued locally.'
    )
  }
}
