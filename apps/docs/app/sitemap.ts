import type { MetadataRoute } from 'next'
import type { PageMapItem } from 'nextra'
import { getPageMap } from 'nextra/page-map'

import { siteConfig } from '../site.config'

// Internal decision records stay out of the public sitemap.
const internalPrefixes = ['/decisions']

function isInternal(route: string) {
  return internalPrefixes.some(
    (prefix) => route === prefix || route.startsWith(`${prefix}/`)
  )
}

function collectRoutes(items: PageMapItem[], routes = new Set<string>()) {
  for (const item of items) {
    if (
      'route' in item &&
      typeof item.route === 'string' &&
      !isInternal(item.route)
    ) {
      routes.add(item.route)
    }

    if ('children' in item) {
      collectRoutes(item.children, routes)
    }
  }

  return routes
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = collectRoutes(await getPageMap())

  return [...routes].sort().map((route) => ({
    changeFrequency: route === '/changelog' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
    url: new URL(route, siteConfig.url).toString()
  }))
}
