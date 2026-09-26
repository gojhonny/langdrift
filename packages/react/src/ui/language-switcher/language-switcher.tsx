import { Fragment } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface LanguageSwitcherOption<Locale extends string = string> {
  locale: Locale
  label: string
  name: string
  href?: string
}

export type LanguageSwitcherLinkProps = Omit<
  ComponentPropsWithoutRef<'a'>,
  'href'
> & { href: string }

export type LanguageSwitcherProps<Locale extends string = string> = {
  label: string
  currentLocale: string
  className?: string
} & (
  | {
      options: readonly (LanguageSwitcherOption<Locale> & { href: string })[]
      onLocaleChange?: never
      disabled?: never
      renderLink?: (
        option: LanguageSwitcherOption<Locale> & { href: string },
        linkProps: LanguageSwitcherLinkProps
      ) => ReactNode
    }
  | {
      options: readonly LanguageSwitcherOption<Locale>[]
      onLocaleChange: (locale: Locale) => void
      disabled?: boolean
      renderLink?: never
    }
)

const optionClassName =
  'inline-flex min-h-[1.7rem] items-center justify-center whitespace-nowrap rounded-full border-0 bg-transparent px-[0.7rem] text-[0.72rem] font-[650] tracking-[0.04em] text-[var(--ld-muted)] no-underline transition-colors duration-180 hover:text-[var(--ld-ink)] focus-visible:text-[var(--ld-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ld-ink)]! aria-[current=page]:bg-[color-mix(in_srgb,var(--ld-bg)_88%,transparent)] aria-[current=page]:text-[var(--ld-ink)] aria-pressed:bg-[color-mix(in_srgb,var(--ld-bg)_88%,transparent)] aria-pressed:text-[var(--ld-ink)] disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none'

export function LanguageSwitcher<Locale extends string>(
  props: LanguageSwitcherProps<Locale>
) {
  const { label, currentLocale, className = '' } = props
  const Container = props.onLocaleChange ? 'div' : 'nav'

  return (
    <Container
      aria-label={label}
      className={`inline-flex max-w-full shrink-0 flex-wrap gap-[0.15rem] rounded-full border border-[color-mix(in_srgb,var(--ld-hairline)_80%,transparent)] bg-[color-mix(in_srgb,var(--ld-surface)_72%,transparent)] p-[0.2rem] shadow-[0_8px_32px_color-mix(in_srgb,var(--ld-ink)_8%,transparent)] backdrop-blur-lg ${className}`}
      role={props.onLocaleChange ? 'group' : undefined}
    >
      {props.onLocaleChange
        ? props.options.map((option) => (
            <button
              aria-label={option.name}
              aria-pressed={currentLocale === option.locale}
              className={optionClassName}
              disabled={props.disabled}
              key={option.locale}
              onClick={() => props.onLocaleChange(option.locale)}
              type="button"
            >
              {option.label}
            </button>
          ))
        : props.options.map((option) => {
            const linkProps: LanguageSwitcherLinkProps = {
              'aria-current':
                currentLocale === option.locale ? 'page' : undefined,
              'aria-label': option.name,
              className: optionClassName,
              href: option.href,
              hrefLang: option.locale,
              children: option.label
            }

            return (
              <Fragment key={option.locale}>
                {props.renderLink ? (
                  props.renderLink(option, linkProps)
                ) : (
                  <a {...linkProps} />
                )}
              </Fragment>
            )
          })}
    </Container>
  )
}
