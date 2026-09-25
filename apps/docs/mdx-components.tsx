import type { MDXComponents } from 'nextra/mdx-components'
import { Callout } from 'nextra/components'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

import { LocaleLink } from './components/locale-link'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components: MDXComponents = {}) {
  return {
    ...docsComponents,
    Callout,
    a: LocaleLink,
    ...components
  }
}
