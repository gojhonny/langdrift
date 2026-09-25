import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: 'Overview',
  'getting-started': 'Getting started',
  concepts: 'Core concepts',
  sdk: 'SDK',
  setup: 'Setup CLI',
  schemas: 'Schemas & Markdown',
  mcp: 'MCP & payloads',
  integrations: 'Integrations',
  api: 'API reference',
  troubleshooting: 'Troubleshooting',
  changelog: 'Changelog',
  // Canonical decision records: internal for now, reachable by URL only.
  // Excluded from the sitemap (app/sitemap.ts) and from search via
  // `searchable: false` frontmatter in each record.
  decisions: { display: 'hidden' }
}

export default meta
