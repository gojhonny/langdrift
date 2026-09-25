'use client'

import type { MouseEvent } from 'react'

import type { LangdriftLocale } from '../../locales'

import './language-switcher.css'

export interface LanguageSwitcherOption {
  locale: LangdriftLocale
  label: string
  ariaLabel: string
  href: string
  hrefLang: string
}

export interface LanguageSwitcherProps {
  label: string
  options: readonly LanguageSwitcherOption[]
  activeLocale: LangdriftLocale
  onSelect?: (
    event: MouseEvent<HTMLAnchorElement>,
    locale: LangdriftLocale
  ) => void
}

function isPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

export function LanguageSwitcher({
  label,
  options,
  activeLocale,
  onSelect
}: LanguageSwitcherProps) {
  return (
    <nav aria-label={label} className="ld-language-switcher">
      {options.map((option) => (
        <a
          aria-current={option.locale === activeLocale ? 'page' : undefined}
          aria-label={option.ariaLabel}
          className="ld-language-switcher__option"
          href={option.href}
          hrefLang={option.hrefLang}
          key={option.locale}
          onClick={(event) => {
            if (!onSelect || !isPrimaryClick(event)) return
            onSelect(event, option.locale)
          }}
        >
          {option.label}
        </a>
      ))}
    </nav>
  )
}
