export interface Issue {
  /** JSON Pointer into the rejected value; the root is an empty string. */
  path: string
  message: string
}

export class LangDriftError extends Error {
  readonly code: string
  readonly issues: readonly Issue[]

  constructor(code: string, message: string, issues: readonly Issue[] = []) {
    super(message)
    this.name = 'LangDriftError'
    this.code = code
    this.issues = [...issues]
  }
}
