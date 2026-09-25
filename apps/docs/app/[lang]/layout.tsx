import { LogoMark } from '@repo/react/ui/brand'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import Link from 'next/link'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Layout, Navbar } from 'nextra-theme-docs'
import type { ReactNode } from 'react'

import { docsChrome } from '../../chrome'
import {
  DOCS_OPEN_GRAPH_LOCALES,
  localeFromDocsSlug,
  type DocsRouteSlug
} from '../../docs-locales'
import { siteConfig } from '../../site.config'
import { websiteUrlForLocale } from '../../website-url'
import { DocsLanguageSwitcher } from '../docs-language-switcher'
import { GitHubStar } from '../github-star'
import { SiteBrand } from '../site-brand'
import { ThemeToggle } from '../theme-toggle'

import 'nextra-theme-docs/style.css'
import '../globals.css'

const editorialFont = Space_Grotesk({
  display: 'swap',
  subsets: ['latin'],
  variable: '--ld-font-editorial',
  weight: ['400', '500', '600', '700']
})

const monoFont = Space_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--ld-font-mono',
  weight: ['400', '700']
})

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { color: '#f7f6f2', media: '(prefers-color-scheme: light)' },
    { color: '#0b0b0c', media: '(prefers-color-scheme: dark)' }
  ]
}

interface LayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export async function generateMetadata({
  params
}: LayoutProps): Promise<Metadata> {
  const { lang } = await params
  const locale = localeFromDocsSlug(lang)
  if (!locale) return {}

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.homeTitle,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.publisher, url: siteConfig.productUrl }],
    creator: siteConfig.publisher,
    publisher: siteConfig.publisher,
    category: 'technology',
    robots: {
      follow: siteConfig.searchIndexable,
      index: siteConfig.searchIndexable,
      googleBot: {
        follow: siteConfig.searchIndexable,
        index: siteConfig.searchIndexable,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    openGraph: {
      description: siteConfig.description,
      locale: DOCS_OPEN_GRAPH_LOCALES[locale],
      siteName: siteConfig.name,
      title: siteConfig.homeTitle,
      type: 'website',
      url: new URL(`/${lang}`, siteConfig.url)
    },
    twitter: {
      card: 'summary',
      description: siteConfig.description,
      title: siteConfig.homeTitle
    }
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  const locale = localeFromDocsSlug(lang)
  if (!locale) {
    return (
      <html dir="ltr" lang="en">
        <body>{children}</body>
      </html>
    )
  }

  const copy = docsChrome[locale]
  const routeSlug = lang as DocsRouteSlug
  const docsRepositoryBase = `${siteConfig.github}/tree/${siteConfig.contentBranch}/apps/docs`
  const home = `/${routeSlug}`

  return (
    <html
      className={`${editorialFont.variable} ${monoFont.variable}`}
      dir="ltr"
      lang={locale}
      suppressHydrationWarning
    >
      <Head
        backgroundColor={{ dark: '#0b0b0c', light: '#f7f6f2' }}
        color={{
          hue: 25,
          lightness: { dark: 60, light: 45 },
          saturation: 95
        }}
      />
      <body>
        <Layout
          docsRepositoryBase={docsRepositoryBase}
          editLink={copy.editLink}
          feedback={{
            content: copy.feedback,
            labels: 'documentation'
          }}
          footer={
            <footer className="ld-docs-footer" key="langdrift-footer">
              <div aria-hidden="true" className="ld-docs-footer__edge" />
              <div className="ld-docs-footer__inner">
                <Link className="ld-docs-footer__brand" href={home}>
                  <LogoMark size={23} />
                  <span>
                    <strong>LangDrift</strong>
                    <small>{copy.footerLine}</small>
                  </span>
                </Link>
                <div className="ld-docs-footer__meta">
                  <a href={websiteUrlForLocale(locale)}>{copy.website}</a>
                  <span aria-hidden="true">·</span>
                  <a href={siteConfig.github}>GitHub</a>
                  <span aria-hidden="true">·</span>
                  <span>© {new Date().getFullYear()} LangDrift</span>
                  <span aria-hidden="true">·</span>
                  <span>Neongate AI</span>
                </div>
              </div>
            </footer>
          }
          navbar={
            <Navbar
              key="langdrift-navbar"
              logo={<SiteBrand label={copy.docsLabel} />}
              logoLink={home}
            >
              <DocsLanguageSwitcher lang={routeSlug} />
              <GitHubStar />
              <span className="ld-docs-desktop-theme">
                <ThemeToggle />
              </span>
            </Navbar>
          }
          nextThemes={{
            defaultTheme: 'dark',
            storageKey: 'langdrift-docs-theme'
          }}
          pageMap={await getPageMap(`/${routeSlug}`)}
          search={
            <Search
              aria-label={copy.searchLabel}
              placeholder={copy.searchPlaceholder}
              searchOptions={{ filters: { locale: routeSlug } }}
            />
          }
          sidebar={{ defaultMenuCollapseLevel: 2 }}
        >
          <div data-pagefind-filter={`locale:${routeSlug}`}>{children}</div>
        </Layout>
      </body>
    </html>
  )
}
