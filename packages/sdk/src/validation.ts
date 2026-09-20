import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import type { ErrorObject, ValidateFunction } from 'ajv'
import { LangDriftError, type Issue } from './errors.js'
import { projectSchema, schemas, SCHEMA_VERSION } from './schema.js'
import type {
  ArtifactMetadata,
  DocumentType,
  DriftEvent,
  Project,
  RecordEvent
} from './types.js'

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictNumbers: true,
  ownProperties: true,
  coerceTypes: false,
  useDefaults: false,
  removeAdditional: false
})
ajv.addKeyword({ keyword: 'x-langdrift', schemaType: 'object', valid: true })
addFormats.default(ajv)
const projectValidator = ajv.compile<Project>(projectSchema)
const validators = Object.fromEntries(
  Object.entries(schemas).map(([type, schema]) => [type, ajv.compile(schema)])
)

const pointer = (part: string) =>
  part.replaceAll('~', '~0').replaceAll('/', '~1')
const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype', 'toJSON'])

/** Reject non-JSON values before schema traversal without invoking accessors. */
function jsonIssue(value: unknown): Issue | undefined {
  const ancestors = new Set<object>()
  let nodes = 1
  const stack: Array<{
    value: unknown
    path: string
    depth: number
    leave?: boolean
  }> = [{ value, path: '', depth: 0 }]
  while (stack.length) {
    const entry = stack.pop()
    if (!entry) break
    const item = entry.value
    if (entry.leave) {
      ancestors.delete(item as object)
      continue
    }
    if (entry.depth > 100) {
      return {
        path: entry.path,
        message: 'must not exceed 100 levels of JSON nesting'
      }
    }
    if (item === null || typeof item === 'string' || typeof item === 'boolean')
      continue
    if (typeof item === 'number' && Number.isFinite(item)) continue
    if (typeof item !== 'object')
      return { path: entry.path, message: 'must be a JSON value' }
    if (ancestors.has(item))
      return {
        path: entry.path,
        message: 'must not contain a cyclic reference'
      }
    const prototype = Object.getPrototypeOf(item)
    if (
      prototype !== null &&
      prototype !== (Array.isArray(item) ? Array.prototype : Object.prototype)
    ) {
      return { path: entry.path, message: 'must be a plain JSON object' }
    }
    if (Object.getOwnPropertySymbols(item).length) {
      return { path: entry.path, message: 'must not contain symbol properties' }
    }
    ancestors.add(item)
    stack.push({ ...entry, leave: true })
    const descriptors = Object.getOwnPropertyDescriptors(item)
    for (const key of Object.keys(descriptors)) {
      if (unsafeKeys.has(key))
        return {
          path: `${entry.path}/${pointer(key)}`,
          message:
            'must not contain unsafe object keys or serialization overrides'
        }
      if (
        Array.isArray(item) &&
        key !== 'length' &&
        (!/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= item.length)
      ) {
        return {
          path: `${entry.path}/${pointer(key)}`,
          message: 'must not add named properties to a JSON array'
        }
      }
    }
    const keys = Object.keys(descriptors).filter(
      (key) => !Array.isArray(item) || key !== 'length'
    )
    if (Array.isArray(item) && keys.length !== item.length) {
      const firstGap = keys.findIndex((key, index) => Number(key) !== index)
      return {
        path: `${entry.path}/${firstGap === -1 ? keys.length : firstGap}`,
        message: 'must not contain holes in a JSON array'
      }
    }
    for (const key of keys) {
      const descriptor = descriptors[key]
      const path = `${entry.path}/${pointer(key)}`
      if (!descriptor || !('value' in descriptor) || !descriptor.enumerable) {
        return { path, message: 'must contain ordinary JSON data properties' }
      }
      nodes++
      if (nodes > 100_000) {
        return { path, message: 'must not exceed 100000 JSON values' }
      }
      stack.push({ value: descriptor.value, path, depth: entry.depth + 1 })
    }
  }
  return undefined
}

function versionIssue(value: unknown, path = ''): Issue | undefined {
  if (!value || typeof value !== 'object' || !('schema_version' in value))
    return
  if (
    Number.isInteger(value.schema_version) &&
    value.schema_version !== SCHEMA_VERSION
  ) {
    return {
      path: `${path}/schema_version`,
      message: `must use supported schema version ${SCHEMA_VERSION}`
    }
  }
}

function schemaIssue(error: ErrorObject): Issue {
  let path = error.instancePath
  if (error.keyword === 'required')
    path += `/${pointer(String(error.params.missingProperty))}`
  if (error.keyword === 'additionalProperties')
    path += `/${pointer(String(error.params.additionalProperty))}`
  return { path, message: error.message ?? 'does not match the schema' }
}

function validate<T>(
  input: unknown,
  validator: ValidateFunction,
  code: string,
  label: string
): T {
  const json = jsonIssue(input)
  if (json)
    throw new LangDriftError(
      code,
      `${label} must contain JSON-compatible data.`,
      [json]
    )
  const version = versionIssue(input)
  if (version)
    throw new LangDriftError(
      'SCHEMA_UNSUPPORTED',
      'Unsupported protocol schema version.',
      [version]
    )
  if (input && typeof input === 'object' && 'reasoning' in input) {
    const reasoningVersion = versionIssue(input.reasoning, '/reasoning')
    if (reasoningVersion)
      throw new LangDriftError(
        'SCHEMA_UNSUPPORTED',
        'Unsupported reasoning schema version.',
        [reasoningVersion]
      )
  }
  if (!validator(input)) {
    throw new LangDriftError(
      code,
      `${label} does not match protocol version ${SCHEMA_VERSION}.`,
      (validator.errors ?? []).map(schemaIssue)
    )
  }
  return input as T
}

export function validateProject(input: unknown): Project {
  return validate(input, projectValidator, 'PROJECT_INVALID', 'Project')
}

export function validateArtifact(input: unknown): ArtifactMetadata {
  const json = jsonIssue(input)
  if (json)
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Artifact must contain JSON-compatible data.',
      [json]
    )
  const version = versionIssue(input)
  if (version)
    throw new LangDriftError(
      'SCHEMA_UNSUPPORTED',
      'Unsupported protocol schema version.',
      [version]
    )
  const type =
    input && typeof input === 'object' && 'type' in input
      ? input.type
      : undefined
  if (
    typeof type !== 'string' ||
    type === 'record' ||
    type === 'drift' ||
    !Object.hasOwn(schemas, type)
  ) {
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Expected a supported Markdown artifact type; use the Record or Drift validator for event envelopes.',
      [
        {
          path: '/type',
          message: 'must name a supported Markdown artifact type'
        }
      ]
    )
  }
  return validate(
    input,
    validators[type as DocumentType],
    'ARTIFACT_INVALID',
    'Artifact'
  )
}

export function validateRecord(input: unknown): RecordEvent {
  return validate(input, validators.record, 'ARTIFACT_INVALID', 'Record')
}

export function validateDrift(input: unknown): DriftEvent {
  const drift = validate<DriftEvent>(
    input,
    validators.drift,
    'ARTIFACT_INVALID',
    'Drift'
  )
  const issues: Issue[] = []
  const { before, delta, after } = drift.impact
  const sum = before + delta
  const tolerance =
    Number.EPSILON *
    8 *
    Math.max(1, Math.abs(before), Math.abs(delta), Math.abs(after))
  if (!Number.isFinite(sum) || Math.abs(sum - after) > tolerance) {
    issues.push({
      path: '/impact/after',
      message:
        'must equal impact.before + impact.delta within floating-point precision'
    })
  }
  const references = new Set(drift.references.map((reference) => reference.id))
  drift.reasoning.evidence_refs.forEach((id, index) => {
    if (!references.has(id))
      issues.push({
        path: `/reasoning/evidence_refs/${index}`,
        message: 'must identify an entry in references'
      })
  })
  if (issues.length)
    throw new LangDriftError(
      'ARTIFACT_INVALID',
      'Drift contains inconsistent impact or evidence provenance.',
      issues
    )
  return drift
}
