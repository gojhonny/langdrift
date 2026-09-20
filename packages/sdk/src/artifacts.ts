import type { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { parseDocument } from 'yaml'
import { LangDriftError } from './errors.js'
import {
  MAX_ARTIFACT_BYTES,
  readProjectFile,
  resolveSafePath
} from './paths.js'
import { schemas } from './schema.js'
import type {
  ArtifactMetadata,
  ArtifactRef,
  DriftEvent,
  RecordEvent
} from './types.js'
import {
  validateArtifact,
  validateDrift,
  validateRecord
} from './validation.js'

export interface ParsedArtifact {
  metadata: ArtifactMetadata | RecordEvent | DriftEvent
  body: string
  path: string
  references: ArtifactRef[]
  resource: string
}

export const artifactLocations = {
  research: 'vision/research',
  prd: 'vision/prd',
  context: 'vision/context',
  triage: 'loop/triage',
  'design-document': 'loop/design-document',
  spec: 'loop/spec',
  ticket: 'loop/ticket',
  adr: 'evidence/adr',
  audit: 'evidence/audit',
  drift: 'evidence/drift',
  record: 'evidence/record'
} as const

const referenceFields: Record<string, string> = {
  research: 'research',
  prds: 'prd',
  design_documents: 'design-document',
  specs: 'spec',
  tickets: 'ticket',
  adrs: 'adr',
  vision_targets: 'vision-target'
}

export function artifactReferences(
  metadata: ParsedArtifact['metadata']
): ArtifactRef[] {
  const references: ArtifactRef[] = [...(metadata.references ?? [])]
  if (metadata.type !== 'drift' && metadata.type !== 'record') {
    references.push(
      ...(metadata.supersedes ?? []),
      ...(metadata.superseded_by ?? [])
    )
    if (metadata.external)
      references.push({
        type: metadata.type,
        id: metadata.id,
        integration: metadata.external.integration,
        external_id: metadata.external.id
      })
  }
  for (const [field, type] of Object.entries(referenceFields)) {
    const ids: unknown = Reflect.get(metadata, field)
    if (Array.isArray(ids)) for (const id of ids) references.push({ type, id })
  }
  if (metadata.type === 'drift')
    references.push({ type: 'vision-target', id: metadata.vision_target_id })
  const unique = new Map(references.map((ref) => [JSON.stringify(ref), ref]))
  return [...unique.values()]
}

/** Parse only explicit metadata. Markdown headings are never used to invent IDs. */
export function parseArtifact(
  text: string,
  artifactPath: string
): ParsedArtifact {
  if (Buffer.byteLength(text, 'utf8') > MAX_ARTIFACT_BYTES) {
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Artifact exceeds the 1 MiB limit.'
    )
  }
  let input: unknown
  let body = ''
  if (artifactPath.endsWith('.json')) {
    try {
      input = JSON.parse(text)
    } catch {
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Artifact is not valid JSON.'
      )
    }
  } else if (artifactPath.endsWith('.md')) {
    const frontmatter =
      /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)
    if (!frontmatter)
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Markdown requires langdrift YAML frontmatter.'
      )
    try {
      const document = parseDocument(frontmatter[1], {
        schema: 'core',
        uniqueKeys: true
      })
      if (document.errors.length || document.warnings.length)
        throw new Error('Invalid frontmatter')
      const parsed = document.toJS({ maxAliasCount: 0 })
      input = parsed?.langdrift
    } catch {
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Frontmatter must be valid YAML without custom tags, duplicate keys or aliases.'
      )
    }
    body = text.slice(frontmatter[0].length)
  } else {
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Only .md and .json artifacts are supported.'
    )
  }
  const type =
    input && typeof input === 'object' && 'type' in input
      ? input.type
      : undefined
  const metadata =
    type === 'record'
      ? validateRecord(input)
      : type === 'drift'
        ? validateDrift(input)
        : validateArtifact(input)
  const location = artifactLocations[metadata.type]
  const pillar = location.split('/')[0]
  return {
    metadata,
    body,
    path: artifactPath,
    references: artifactReferences(metadata),
    resource: `${pillar}.${metadata.type}`
  }
}

export interface DiscoveryOptions {
  maxFiles?: number
  maxDirectories?: number
}

/** Only package-declared source globs are supported in v1, never a repository-wide crawl. */
export async function discoverArtifacts(
  root: string,
  options: DiscoveryOptions = {}
): Promise<ParsedArtifact[]> {
  const maxFiles = options.maxFiles ?? 1000
  const maxDirectories = options.maxDirectories ?? 1000
  if (
    !Number.isSafeInteger(maxFiles) ||
    maxFiles < 1 ||
    !Number.isSafeInteger(maxDirectories) ||
    maxDirectories < 1
  ) {
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Discovery limits must be positive integers.'
    )
  }
  const artifacts: ParsedArtifact[] = []
  let directories = 0
  async function walk(
    relative: string,
    expectedType: keyof typeof artifactLocations
  ): Promise<void> {
    if (++directories > maxDirectories)
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Discovery directory limit exceeded.'
      )
    let entries: Dirent[]
    try {
      entries = await readdir(await resolveSafePath(root, relative), {
        withFileTypes: true
      })
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
        return
      throw error
    }
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const child = `${relative}/${entry.name}`
      if (entry.isSymbolicLink())
        throw new LangDriftError(
          'PATH_OUTSIDE_ROOT',
          'Artifact discovery does not follow symlinks.'
        )
      if (entry.isDirectory()) await walk(child, expectedType)
      else if (
        entry.isFile() &&
        entry.name.endsWith(
          ['record', 'drift'].includes(expectedType) ? '.json' : '.md'
        )
      ) {
        if (artifacts.length >= maxFiles)
          throw new LangDriftError(
            'ARTIFACT_INVALID',
            'Discovery file limit exceeded.'
          )
        const parsed = parseArtifact(await readProjectFile(root, child), child)
        if (parsed.metadata.type !== expectedType) {
          throw new LangDriftError(
            'ARTIFACT_INVALID',
            `Artifact type does not match its ${expectedType} source directory.`
          )
        }
        artifacts.push(parsed)
      }
    }
  }
  // Schemas and directives are package-owned and versioned together.
  for (const type of Object.keys(
    schemas
  ) as (keyof typeof artifactLocations)[]) {
    if (type in artifactLocations)
      await walk(`.drifts/${artifactLocations[type]}`, type)
  }
  return artifacts
}
