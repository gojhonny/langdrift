import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { siteConfig } from '../../site.config'

interface PageProps {
  params: Promise<{
    mdxPath?: string[]
  }>
}

export const dynamicParams = false
export const generateStaticParams = generateStaticParamsFor('mdxPath')

function canonicalPathFor(mdxPath?: string[]) {
  if (!mdxPath?.length) return '/'
  return `/${mdxPath.join('/')}`
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { mdxPath } = await params
  const { metadata } = await importPage(mdxPath)
  const canonical = canonicalPathFor(mdxPath)
  const title =
    typeof metadata.title === 'string' ? metadata.title : siteConfig.homeTitle
  const description =
    typeof metadata.description === 'string'
      ? metadata.description
      : siteConfig.description
  const pageTitle =
    canonical === '/' ? siteConfig.homeTitle : `${title} | ${siteConfig.name}`

  return {
    ...metadata,
    title: { absolute: pageTitle },
    alternates: { canonical },
    openGraph: {
      description,
      locale: 'en_US',
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
  const {
    default: MDXContent,
    metadata,
    sourceCode,
    toc
  } = await importPage(params.mdxPath)

  return (
    <Wrapper metadata={metadata} sourceCode={sourceCode} toc={toc}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
