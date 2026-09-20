import type { MDXComponents } from 'nextra/mdx-components'
import { Callout } from 'nextra/components'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components: MDXComponents = {}) {
  return {
    ...docsComponents,
    Callout,
    ...components
  }
}
