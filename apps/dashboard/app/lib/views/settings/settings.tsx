'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'

import { themeAtom } from '@atoms'
import { DashboardLanguageSettings } from '@i18n/language-settings'
import { Card } from '@repo/react/ui/primitives'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'

export function Settings() {
  const t = useTranslations('view')
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <Card className="px-3.5">
      <div className="flex min-h-[68px] items-center justify-between border-b border-hairline max-sm:flex-col max-sm:items-start max-sm:gap-2.5 max-sm:py-3">
        <span className="grid gap-[3px]">
          <strong className="text-[10px]">{t('settings.appearance')}</strong>
          <small className="text-[8px] text-muted">
            {t('settings.appearanceDescription')}
          </small>
        </span>
        <ThemeToggle
          label={t(
            theme === 'light' ? 'settings.switchDark' : 'settings.switchLight'
          )}
          onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          theme={theme}
        />
      </div>
      <div className="border-b border-hairline py-3">
        <DashboardLanguageSettings />
      </div>
      <div className="flex min-h-[68px] items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2.5 max-sm:py-3">
        <span className="grid gap-[3px]">
          <strong className="text-[10px]">{t('settings.voice')}</strong>
          <small className="text-[8px] text-muted">
            {t('settings.voiceDescription')}
          </small>
        </span>
      </div>
    </Card>
  )
}
