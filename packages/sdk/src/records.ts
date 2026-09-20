import { createHash } from 'node:crypto'
import type { DriftEvent, RecordEvent } from './types.js'
import { validateDrift, validateRecord } from './validation.js'

/** Stable identity for a source event. Supply immutable provider IDs, never titles. */
export function recordId(
  integration: string,
  sourceId: string,
  eventId: string
): string {
  return `REC-${createHash('sha256')
    .update(JSON.stringify([integration, sourceId, eventId]))
    .digest('hex')}`
}

export function createRecord(
  input: Omit<RecordEvent, 'type' | 'schema_version'>
): RecordEvent {
  return validateRecord({ ...input, type: 'record', schema_version: 1 })
}

/** Caller owns the interpretation and units; this function never calculates an impact. */
export function createDrift(
  input: Omit<DriftEvent, 'type' | 'schema_version'>
): DriftEvent {
  return validateDrift({ ...input, type: 'drift', schema_version: 1 })
}
