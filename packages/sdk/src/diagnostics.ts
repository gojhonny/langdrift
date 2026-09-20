import { LangDriftError, type Issue } from './errors.js'

export interface Diagnostic {
  level: 'error'
  code: string
  message: string
  issues: readonly Issue[]
}

/** Applications choose their log destination; the SDK never writes logs implicitly. */
export interface Logger {
  write(diagnostic: Diagnostic): void
}

export function reportError(error: unknown, logger: Logger): void {
  logger.write(
    error instanceof LangDriftError
      ? {
          level: 'error',
          code: error.code,
          message: 'LangDrift could not complete the operation.',
          issues: error.issues
        }
      : {
          level: 'error',
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected operation failure occurred.',
          issues: []
        }
  )
}
