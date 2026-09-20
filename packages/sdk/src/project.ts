import { LangDriftError } from './errors.js'
import { readProjectFile } from './paths.js'
import { validateProject } from './validation.js'
import type { Project } from './types.js'

export async function loadProject(root: string): Promise<Project> {
  let text: string
  try {
    text = await readProjectFile(root, '.drifts/project.json')
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new LangDriftError(
        'PROJECT_NOT_FOUND',
        'Run LangDrift setup to create .drifts/project.json.'
      )
    }
    throw error
  }
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new LangDriftError(
      'PROJECT_INVALID',
      'Invalid JSON in .drifts/project.json.'
    )
  }
  return validateProject(value)
}
