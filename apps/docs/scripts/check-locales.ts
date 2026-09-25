import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  DOCS_DEFAULT_ROUTE_SLUG,
  DOCS_ROUTE_SLUG_LIST
} from '../../../packages/react/src/locales.ts'

const contentRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../content'
)
const canonicalSlug = DOCS_DEFAULT_ROUTE_SLUG
const translatedSlugs = DOCS_ROUTE_SLUG_LIST.filter(
  (slug) => slug !== canonicalSlug
)

function isDecision(relativePath: string) {
  return relativePath === 'decisions' || relativePath.startsWith('decisions/')
}

async function walk(directory: string): Promise<string[]> {
  const found: string[] = []
  let entries: Awaited<ReturnType<typeof readdir>>
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch {
    return found
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      found.push(...(await walk(fullPath)))
    } else {
      found.push(fullPath)
    }
  }

  return found
}

function relativeTo(root: string, file: string) {
  return path.relative(root, file).split(path.sep).join('/')
}

function metaKeys(source: string) {
  const keys: string[] = []
  for (const line of source.split('\n')) {
    const match = line.match(
      /^ {2}(?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_-]+))\s*:/
    )
    const key = match?.[1] ?? match?.[2] ?? match?.[3]
    if (key && key !== 'decisions') keys.push(key)
  }
  return keys
}

const failures: string[] = []
const canonicalRoot = path.join(contentRoot, canonicalSlug)
const canonicalFiles = await walk(canonicalRoot)
const publicPages = canonicalFiles
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => relativeTo(canonicalRoot, file))
  .filter((file) => !isDecision(file))
const publicMeta = canonicalFiles
  .filter((file) => file.endsWith('_meta.ts'))
  .map((file) => relativeTo(canonicalRoot, file))
  .filter((file) => !isDecision(file))

if (publicPages.length === 0) {
  failures.push(`no public MDX pages under content/${canonicalSlug}`)
}

for (const slug of translatedSlugs) {
  const localeRoot = path.join(contentRoot, slug)
  const localeFiles = new Set(
    (await walk(localeRoot)).map((file) => relativeTo(localeRoot, file))
  )

  for (const page of publicPages) {
    if (!localeFiles.has(page)) {
      failures.push(`missing content/${slug}/${page}`)
    }
  }

  for (const file of localeFiles) {
    if (
      file.endsWith('.mdx') &&
      !isDecision(file) &&
      !publicPages.includes(file)
    ) {
      failures.push(`unexpected content/${slug}/${file}`)
    }
    if (isDecision(file)) {
      failures.push(
        `decision content must stay English-only: content/${slug}/${file}`
      )
    }
  }

  for (const meta of publicMeta) {
    if (!localeFiles.has(meta)) {
      failures.push(`missing content/${slug}/${meta}`)
      continue
    }

    const englishKeys = metaKeys(
      await readFile(path.join(canonicalRoot, meta), 'utf8')
    )
    const translatedKeys = metaKeys(
      await readFile(path.join(localeRoot, meta), 'utf8')
    )
    for (const key of englishKeys) {
      if (!translatedKeys.includes(key)) {
        failures.push(`content/${slug}/${meta} omits "${key}"`)
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(
  `docs locales: ${publicPages.length} public pages match ${translatedSlugs.join(', ')}`
)
