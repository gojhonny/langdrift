import type { Project } from '@langdrift/sdk'

export interface SetupOptions {
  root?: string
  projectId?: string
  accountId?: string
  name?: string
  githubInstallationId?: string
  githubRepository?: string
  linear?: boolean
  obsidian?: boolean
  dryRun?: boolean
}

export interface SetupFile {
  path: string
  status: 'create' | 'preserve' | 'conflict'
  reason?: string
}

export interface SetupPlan {
  root: string
  project: Project | null
  files: SetupFile[]
}

export interface SetupResult extends SetupPlan {
  project: Project
  dryRun: boolean
  changed: boolean
}

export class SetupError extends Error {
  readonly code: string
  readonly files: SetupFile[]
  readonly fields: string[]

  constructor(
    code: string,
    message: string,
    files: SetupFile[] = [],
    fields: string[] = []
  ) {
    super(message)
    this.name = 'SetupError'
    this.code = code
    this.files = files
    this.fields = fields
  }
}
