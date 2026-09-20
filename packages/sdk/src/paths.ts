import { constants } from 'node:fs'
import { lstat, open, realpath } from 'node:fs/promises'
import path from 'node:path'
import { LangDriftError } from './errors.js'

export const MAX_ARTIFACT_BYTES = 1024 * 1024

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

/** Repository roots are explicit; discovery never searches inside directories. */
export async function findRepositoryRoot(
  start = process.cwd()
): Promise<string> {
  let candidate = await realpath(start)
  while (true) {
    try {
      await lstat(path.join(candidate, '.git'))
      return candidate
    } catch (error) {
      if (!isMissing(error)) throw error
    }
    const parent = path.dirname(candidate)
    if (parent === candidate) {
      throw new LangDriftError(
        'PROJECT_NOT_FOUND',
        'No Git root found. Pass an explicit project root.'
      )
    }
    candidate = parent
  }
}

/** Reject symlinks, traversal, hidden secrets and automation state, including missing destinations. */
export async function resolveSafePath(
  root: string,
  relative: string
): Promise<string> {
  const segments = relative.split('/')
  if (
    !relative ||
    path.isAbsolute(relative) ||
    relative.includes('\\') ||
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject control bytes in filesystem paths.
    /[:\u0000-\u001f\u007f]/.test(relative) ||
    segments.some(
      (segment) =>
        !segment ||
        segment === '.' ||
        segment === '..' ||
        (segment.startsWith('.') && segment !== '.drifts') ||
        segment === 'node_modules'
    )
  ) {
    throw new LangDriftError(
      'PATH_OUTSIDE_ROOT',
      'Use a relative project path without traversal, hidden files or dependency directories.'
    )
  }
  const canonicalRoot = await realpath(root)
  let candidate = canonicalRoot
  for (const segment of segments) {
    candidate = path.join(candidate, segment)
    try {
      if ((await lstat(candidate)).isSymbolicLink()) {
        throw new LangDriftError(
          'PATH_OUTSIDE_ROOT',
          'Symlinks are not supported for project artifacts.'
        )
      }
    } catch (error) {
      if (!isMissing(error)) throw error
    }
  }
  return candidate
}

export async function readProjectFile(
  root: string,
  relative: string,
  maxBytes = MAX_ARTIFACT_BYTES
): Promise<string> {
  const filename = await resolveSafePath(root, relative)
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const stat = await handle.stat()
    if (!stat.isFile() || stat.size > maxBytes) {
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        `Expected a regular file of at most ${maxBytes} bytes.`
      )
    }
    // Bound the allocation even if a concurrently written file grows after stat.
    const buffer = Buffer.alloc(maxBytes + 1)
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0)
    if (bytesRead > maxBytes)
      throw new LangDriftError(
        'ARTIFACT_INVALID',
        'Artifact exceeds the read limit.'
      )
    return buffer.subarray(0, bytesRead).toString('utf8')
  } finally {
    await handle.close()
  }
}
