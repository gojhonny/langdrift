'use client'

import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

import { localeFromDocsSlug } from '../docs-locales'

export function LocaleLink({ href, ...props }: ComponentProps<'a'>) {
  const pathname = usePathname()
  const lang = pathname.split('/').filter(Boolean)[0] ?? ''
  let resolved = href

  if (
    typeof href === 'string' &&
    localeFromDocsSlug(lang) &&
    href.startsWith('/') &&
    !href.startsWith('//') &&
    href !== `/${lang}` &&
    !href.startsWith(`/${lang}/`)
  ) {
    resolved = `/${lang}${href}`
  }

  return <a href={resolved} {...props} />
}
