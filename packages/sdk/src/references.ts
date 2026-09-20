import { LangDriftError } from './errors.js'
import { resolveSafePath } from './paths.js'
import type { ParsedArtifact } from './artifacts.js'
import type { ArtifactRef } from './types.js'

export interface ReferenceResolution {
  resolved: { from: string; reference: ArtifactRef; target: string }[]
  external: { from: string; reference: ArtifactRef }[]
  issues: { code: string; path: string; message: string }[]
}

/** Remote/registered entities must be supplied explicitly; resolving never fetches them. */
export async function resolveReferences(
  root: string,
  artifacts: ParsedArtifact[],
  knownReferences: ArtifactRef[] = []
): Promise<ReferenceResolution> {
  const result: ReferenceResolution = { resolved: [], external: [], issues: [] }
  const index = new Map<string, ParsedArtifact>()
  const key = (reference: { type: string; id: string }) =>
    JSON.stringify([reference.type, reference.id])
  for (const artifact of artifacts) {
    const id = key(artifact.metadata)
    if (index.has(id))
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        `Duplicate artifact identity ${id}.`
      )
    await resolveSafePath(root, artifact.path)
    index.set(id, artifact)
  }
  const known = new Set(knownReferences.map(key))
  const edges = new Map<string, string[]>()
  for (const artifact of artifacts) {
    const from = key(artifact.metadata)
    for (const reference of artifact.references) {
      if (reference.path) await resolveSafePath(root, reference.path)
      if (reference.integration && reference.external_id) {
        result.external.push({ from, reference })
        continue
      }
      const target = index.get(key(reference))
      if (target && (!reference.path || target.path === reference.path)) {
        result.resolved.push({ from, reference, target: target.path })
        edges.set(from, [...(edges.get(from) ?? []), key(reference)])
      } else if (!reference.path && known.has(key(reference))) {
        result.external.push({ from, reference })
      } else {
        result.issues.push({
          code: 'REFERENCE_NOT_FOUND',
          path: artifact.path,
          message: `Unresolved explicit reference ${key(reference)}.`
        })
      }
    }
  }
  const visited = new Set<string>()
  const active = new Set<string>()
  function visit(id: string): void {
    if (active.has(id)) {
      result.issues.push({
        code: 'REFERENCE_CYCLE',
        path: index.get(id)?.path ?? '',
        message: `Reference cycle includes ${id}.`
      })
      return
    }
    if (visited.has(id)) return
    active.add(id)
    for (const target of edges.get(id) ?? []) visit(target)
    active.delete(id)
    visited.add(id)
  }
  for (const id of index.keys()) visit(id)
  return result
}
