// Adapted from Amarelo's deterministic token builder; LangDrift owns the sources.
import { watch } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

interface JsonRecord {
  [key: string]: unknown
}
interface Token {
  path: string[]
  type: string
  value: unknown
}
const directory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const files = ['colors', 'typography', 'dimensions', 'effects']
function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
function flatten(
  node: JsonRecord,
  path: string[] = [],
  inherited?: string
): Token[] {
  const type = typeof node.$type === 'string' ? node.$type : inherited
  if ('$value' in node) {
    if (!type) throw new TypeError(`Missing $type: ${path.join('.')}`)
    return [{ path, type, value: node.$value }]
  }
  return Object.entries(node).flatMap(([key, value]) => {
    if (key.startsWith('$')) return []
    if (!/^[a-z0-9-]+$/.test(key) || !isRecord(value))
      throw new TypeError(`Invalid token group: ${key}`)
    return flatten(value, [...path, key], type)
  })
}
function resolveValue(
  value: unknown,
  tokens: JsonRecord,
  stack: string[]
): unknown {
  if (typeof value !== 'string')
    throw new TypeError(`Invalid token value: ${stack[0]}`)
  const match = value.match(/^\{([^}]+)\}$/)
  if (!match) return value
  const reference = match[1] as string
  if (stack.includes(reference))
    throw new TypeError(
      `Circular token reference: ${[...stack, reference].join(' -> ')}`
    )
  const token = reference
    .split('.')
    .reduce<unknown>(
      (node, key) => (isRecord(node) ? node[key] : undefined),
      tokens
    )
  if (!isRecord(token) || !('$value' in token))
    throw new TypeError(`Unknown token reference: ${reference}`)
  return resolveValue(token.$value, tokens, [...stack, reference])
}
function serialize(value: unknown, type: string): string {
  if (
    !['color', 'dimension', 'fontFamily', 'shadow', 'cubicBezier'].includes(
      type
    )
  )
    throw new TypeError(`Unsupported token type: ${type}`)
  if (typeof value !== 'string' || !value.trim() || /[;{}\n]/.test(value))
    throw new TypeError(`Invalid ${type} value`)
  if (type === 'dimension' && !/^\d+(\.\d+)?(px|rem|em)$/.test(value))
    throw new TypeError('Invalid dimension')
  if (type === 'cubicBezier' && !/^cubic-bezier\([\d.,\s]+\)$/.test(value))
    throw new TypeError('Invalid easing')
  return value
}
export function compileTokens(documents: unknown[]): {
  css: string
  tokens: JsonRecord
} {
  const tokens: JsonRecord = {}
  for (const document of documents) {
    if (!isRecord(document))
      throw new TypeError('Token document must be an object')
    for (const [key, value] of Object.entries(document)) {
      if (key in tokens) throw new TypeError(`Duplicate token group: ${key}`)
      tokens[key] = value
    }
  }
  const selectors = new Map<string, string[]>([[':root', []]])
  for (const token of flatten(tokens)) {
    const value = serialize(
      resolveValue(token.value, tokens, [token.path.join('.')]),
      token.type
    )
    const theme = token.path[0] === 'themes' ? token.path[1] : undefined
    const selector = theme ? `[data-theme='${theme}']` : ':root'
    const name = (theme ? token.path.slice(2) : token.path).join('-')
    // Keep theme aliases live so overrides of foundation variables still apply.
    const reference =
      typeof token.value === 'string' && token.value.match(/^\{([^}]+)\}$/)
    const cssValue = reference
      ? `var(--ld-${reference[1]?.replaceAll('.', '-')})`
      : value
    const declarations = selectors.get(selector) ?? []
    declarations.push(`  --ld-${name}: ${cssValue};`)
    selectors.set(selector, declarations)
  }
  return {
    tokens,
    css: `/* Generated from src/foundation/*.tokens.json. Do not edit. */\n\n${[...selectors].map(([selector, declarations]) => `${selector} {\n${declarations.join('\n')}\n}`).join('\n\n')}\n`
  }
}
export async function buildTokens(): Promise<void> {
  const documents = await Promise.all(
    files.map(
      async (name) =>
        JSON.parse(
          await readFile(
            resolve(directory, `src/foundation/${name}.tokens.json`),
            'utf8'
          )
        ) as unknown
    )
  )
  const result = compileTokens(documents)
  await mkdir(resolve(directory, 'dist'), { recursive: true })
  await Promise.all([
    writeFile(resolve(directory, 'dist/index.css'), result.css),
    writeFile(
      resolve(directory, 'dist/tokens.json'),
      `${JSON.stringify(result.tokens, null, 2)}\n`
    )
  ])
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  await buildTokens()
  if (process.argv.includes('--watch')) {
    let pending = Promise.resolve()
    watch(resolve(directory, 'src/foundation'), () => {
      pending = pending.then(buildTokens).catch((error) => {
        console.error(error.message)
      })
    })
  }
}
