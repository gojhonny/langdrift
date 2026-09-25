import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

import { useMDXComponents as getMDXComponents } from '../../../mdx-components'
import {
  DOCS_OPEN_GRAPH_LOCALES,
  docsLanguageAlternates,
  docsPublicPath,
  docsRouteSlug,
  localeFromDocsSlug
} from '../../../docs-locales'
import { siteConfig } from '../../../site.config'

interface PageProps {
  params: Promise<{
    lang: string
    mdxPath?: string[]
  }>
}

export const dynamicParams = false
export const generateStaticParams = generateStaticParamsFor('mdxPath', 'lang')

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { lang, mdxPath } = await params
  const locale = localeFromDocsSlug(lang)
  if (!locale) return {}

  const { metadata } = await importPage(mdxPath, lang)
  const canonical = docsPublicPath(docsRouteSlug(locale), mdxPath)
  const title =
    typeof metadata.title === 'string' ? metadata.title : siteConfig.homeTitle
  const description =
    typeof metadata.description === 'string'
      ? metadata.description
      : siteConfig.description
  const pageTitle =
    canonical === `/${lang}`
      ? siteConfig.homeTitle
      : `${title} | ${siteConfig.name}`
  const languages = docsLanguageAlternates(mdxPath)

  return {
    ...metadata,
    title: { absolute: pageTitle },
    alternates: {
      canonical,
      ...(languages ? { languages } : {})
    },
    openGraph: {
      description,
      locale: DOCS_OPEN_GRAPH_LOCALES[locale],
      siteName: siteConfig.name,
      title: pageTitle,
      type: 'article',
      url: new URL(canonical, siteConfig.url)
    },
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
    twitter: {
      card: 'summary',
      description,
      title: pageTitle
    }
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  if (!localeFromDocsSlug(params.lang)) notFound()

  const {
    default: MDXContent,
    metadata,
    sourceCode,
    toc
  } = await importPage(params.mdxPath, params.lang)

  return (
    <Wrapper metadata={metadata} sourceCode={sourceCode} toc={toc}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
