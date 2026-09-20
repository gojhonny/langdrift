import { pillarSchemas, SCHEMA_VERSION, type Project } from '@langdrift/sdk'

export const PROJECT_PATH = '.drifts/project.json'

export function createProtocolTemplate(
  project: Project | null
): Map<string, unknown> {
  if (project && project.schema_version !== SCHEMA_VERSION) {
    throw new Error('The project does not match the package protocol version.')
  }
  return new Map<string, unknown>([
    [PROJECT_PATH, project],
    ['.drifts/vision/schema.json', pillarSchemas.vision],
    ['.drifts/loop/schema.json', pillarSchemas.loop],
    ['.drifts/evidence/schema.json', pillarSchemas.evidence]
  ])
}
