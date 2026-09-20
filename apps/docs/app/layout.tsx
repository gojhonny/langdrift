import { LogoMark } from '@repo/react/ui/brand'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import Link from 'next/link'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Layout, Navbar } from 'nextra-theme-docs'
import type { ReactNode } from 'react'

import { siteConfig } from '../site.config'
import { GitHubStar } from './github-star'
import { SiteBrand } from './site-brand'
import { ThemeToggle } from './theme-toggle'

import 'nextra-theme-docs/style.css'
import './globals.css'

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

export const metadata: Metadata = {
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
    locale: 'en_US',
    siteName: siteConfig.name,
    title: siteConfig.homeTitle,
    type: 'website',
    url: siteConfig.url
  },
  twitter: {
    card: 'summary',
    description: siteConfig.description,
    title: siteConfig.homeTitle
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { color: '#f7f6f2', media: '(prefers-color-scheme: light)' },
    { color: '#0b0b0c', media: '(prefers-color-scheme: dark)' }
  ]
}

const navbar = (
  <Navbar key="langdrift-navbar" logo={<SiteBrand />} logoLink="/">
    <GitHubStar />
    <span className="ld-docs-desktop-theme">
      <ThemeToggle />
    </span>
  </Navbar>
)

const footer = (
  <footer className="ld-docs-footer" key="langdrift-footer">
    <div aria-hidden="true" className="ld-docs-footer__edge" />
    <div className="ld-docs-footer__inner">
      <Link className="ld-docs-footer__brand" href="/">
        <LogoMark size={23} />
        <span>
          <strong>LangDrift</strong>
          <small>
            Product intelligence for understanding how products move.
          </small>
        </span>
      </Link>
      <div className="ld-docs-footer__meta">
        <a href={siteConfig.productUrl}>Website</a>
        <span aria-hidden="true">·</span>
        <a href={siteConfig.github}>GitHub</a>
        <span aria-hidden="true">·</span>
        <span>© {new Date().getFullYear()} LangDrift</span>
        <span aria-hidden="true">·</span>
        <span>Neongate AI</span>
      </div>
    </div>
  </footer>
)

export default async function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const docsRepositoryBase = `${siteConfig.github}/tree/${siteConfig.contentBranch}/apps/docs`

  return (
    <html
      className={`${editorialFont.variable} ${monoFont.variable}`}
      dir="ltr"
      lang="en"
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
          editLink="Edit this page on GitHub"
          feedback={{
            content: 'Suggest a documentation improvement',
            labels: 'documentation'
          }}
          footer={footer}
          navbar={navbar}
          nextThemes={{
            defaultTheme: 'dark',
            storageKey: 'langdrift-docs-theme'
          }}
          pageMap={await getPageMap()}
          search={
            <Search
              aria-label="Search documentation"
              placeholder="Search docs…"
            />
          }
          sidebar={{ defaultMenuCollapseLevel: 2 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
