import { readFile } from 'node:fs/promises'

// Both src and dist are one level below the published package manifest.
const packageMetadata: unknown = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
)
if (
  !packageMetadata ||
  typeof packageMetadata !== 'object' ||
  !('version' in packageMetadata) ||
  typeof packageMetadata.version !== 'string'
) {
  throw new Error('The setup package manifest must contain a version.')
}

export const generator = {
  name: '@langdrift/setup',
  version: packageMetadata.version
}
