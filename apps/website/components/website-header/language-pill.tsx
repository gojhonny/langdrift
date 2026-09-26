'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'

import { Link, usePathname, useRouter } from '@i18n/navigation'
import { LanguageSwitcher } from '@repo/react/ui/language-switcher'

import { drawerFocus } from './drawer-focus'

const languages = [
  { locale: 'en', label: 'EN', name: 'english' },
  { locale: 'pt-BR', label: 'PT-BR', name: 'portuguese' },
  { locale: 'zh-Hant', label: '中文', name: 'chinese' },
  { locale: 'ja', label: 'あ', name: 'japanese' }
] as const

interface LanguagePillProps {
  fromDrawer?: boolean
}

export function LanguagePill(props: LanguagePillProps) {
  const { fromDrawer = false } = props

  const locale = useLocale()
  const t = useTranslations('header')
  const pathname = usePathname()
  const router = useRouter()
  const [urlSuffix, setUrlSuffix] = useState('')

  useEffect(() => {
    const syncUrlSuffix = () => {
      setUrlSuffix(`${window.location.search}${window.location.hash}`)
    }
    syncUrlSuffix()
    window.addEventListener('hashchange', syncUrlSuffix)
    window.addEventListener('popstate', syncUrlSuffix)

    return () => {
      window.removeEventListener('hashchange', syncUrlSuffix)
      window.removeEventListener('popstate', syncUrlSuffix)
    }
  }, [])

  function selectLanguage(
    event: MouseEvent<HTMLAnchorElement>,
    nextLocale: (typeof languages)[number]['locale']
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    if (fromDrawer && nextLocale !== locale) {
      drawerFocus.locale = nextLocale
    }
    router.replace(
      `${pathname}${window.location.search}${window.location.hash}`,
      { locale: nextLocale, scroll: false }
    )
  }

  return (
    <LanguageSwitcher
      className={fromDrawer ? '[&_a]:min-h-11' : undefined}
      currentLocale={locale}
      label={t('language')}
      options={languages.map((language) => ({
        locale: language.locale,
        label: language.label,
        name: t(`languages.${language.name}`),
        href: `${pathname}${urlSuffix}`
      }))}
      renderLink={(language, linkProps) => (
        <Link
          {...linkProps}
          locale={language.locale}
          onClick={(event) => selectLanguage(event, language.locale)}
          scroll={false}
        />
      )}
    />
  )
}
