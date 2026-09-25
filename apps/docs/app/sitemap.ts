import type { MetadataRoute } from 'next'
import type { PageMapItem } from 'nextra'
import { getPageMap } from 'nextra/page-map'

import { DOCS_ROUTE_SLUG_LIST } from '../docs-locales'
import { siteConfig } from '../site.config'

function isDecision(route: string) {
  return (
    route === '/decisions' ||
    route.endsWith('/decisions') ||
    route.includes('/decisions/')
  )
}

function collectRoutes(items: PageMapItem[], routes = new Set<string>()) {
  for (const item of items) {
    if (
      'route' in item &&
      typeof item.route === 'string' &&
      !isDecision(item.route)
    ) {
      routes.add(item.route)
    }

    if ('children' in item) {
      collectRoutes(item.children, routes)
    }
  }

  return routes
}

function localizedRoute(slug: string, route: string) {
  if (route === `/${slug}` || route.startsWith(`/${slug}/`)) return route
  if (route === '/') return `/${slug}`
  return `/${slug}${route}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = new Set<string>()

  for (const slug of DOCS_ROUTE_SLUG_LIST) {
    for (const route of collectRoutes(await getPageMap(`/${slug}`))) {
      const localized = localizedRoute(slug, route)
      if (!isDecision(localized)) routes.add(localized)
    }
  }

  return [...routes].sort().map((route) => ({
    changeFrequency: route.endsWith('/changelog') ? 'weekly' : 'monthly',
    priority: DOCS_ROUTE_SLUG_LIST.some((slug) => route === `/${slug}`)
      ? 1
      : 0.7,
    url: new URL(route, siteConfig.url).toString()
  }))
}
