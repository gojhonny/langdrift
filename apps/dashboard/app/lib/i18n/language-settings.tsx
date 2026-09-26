'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'

import { LanguageSwitcher } from '@repo/react/ui/language-switcher'

import { setDashboardLocale } from './actions'

const languages = [
  { locale: 'en', label: 'EN', name: 'English' },
  { locale: 'pt-BR', label: 'PT-BR', name: 'Português (Brasil)' },
  { locale: 'zh-Hant', label: '中文', name: '繁體中文' },
  { locale: 'ja', label: 'あ', name: '日本語' }
] as const

export function DashboardLanguageSettings() {
  const locale = useLocale()
  const t = useTranslations('shell')
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  return (
    <div className="grid gap-2">
      <h2 className="m-0 text-sm font-medium">{t('language')}</h2>
      <p className="m-0 text-[11px] text-muted">{t('languageDescription')}</p>
      <LanguageSwitcher
        label={t('language')}
        currentLocale={locale}
        options={languages}
        disabled={pending}
        onLocaleChange={(nextLocale) => {
          if (nextLocale === locale) return
          setFailed(false)
          startTransition(async () => {
            try {
              const result = await setDashboardLocale(nextLocale)
              setFailed(!result.ok)
            } catch {
              setFailed(true)
            }
          })
        }}
      />
      <span aria-live="polite" className="text-[11px] text-muted">
        {pending ? t('savingLanguage') : ''}
      </span>
      {failed ? (
        <p role="alert" className="m-0 text-[11px]">
          {t('languageError')}
        </p>
      ) : null}
    </div>
  )
}
