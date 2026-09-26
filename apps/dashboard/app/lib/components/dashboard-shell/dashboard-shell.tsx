'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { FormEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  accountMenuOpenAtom,
  notificationsOpenAtom,
  productMenuOpenAtom,
  selectedProductAtom,
  themeAtom,
  voiceOpenAtom
} from '@atoms'
import { AgentOrb, type AgentOrbState } from '@repo/react/ui/agent-orb'
import { aiAvatars } from '@repo/react/ui/ai-avatars'
import { Bell, List, X } from '@repo/react/ui/icons'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import { Tooltip } from '@repo/react/vendors/shadcn/tooltip'
import { cn } from '@template/formatters/cn.fmt'

import { DashboardNavigation } from './dashboard-navigation'
import { OverlayDialog } from './overlay-dialog'

const sectionLabels: Record<string, string> = {
  '/overview': 'Overview',
  '/evolution': 'Evolution',
  '/decisions': 'Decisions',
  '/people': 'People',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/vision-baseline': 'Evolution',
  '/drift-graph': 'Evolution',
  '/drift-timeline': 'Evolution',
  '/drift-events': 'Evolution',
  '/drift-by-team': 'Evolution',
  '/drift-by-product-area': 'Evolution',
  '/intentional-drift': 'Evolution',
  '/unexplained-drift': 'Evolution',
  '/drift-report': 'Reports',
  '/evidence': 'Evidence'
}

const voicePromptIds = ['vision', 'week', 'unexplained'] as const

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell(props: DashboardShellProps) {
  const { children } = props

  const t = useTranslations('shell')
  const locale = useLocale()
  const pathname = usePathname()
  const [theme, setTheme] = useAtom(themeAtom)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const [voiceOpen, setVoiceOpen] = useAtom(voiceOpenAtom)
  const [notificationsOpen, setNotificationsOpen] = useAtom(
    notificationsOpenAtom
  )
  const [accountMenuOpen, setAccountMenuOpen] = useAtom(accountMenuOpenAtom)
  const setProductMenuOpen = useSetAtom(productMenuOpenAtom)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [voiceQuestion, setVoiceQuestion] = useState('')
  const [voiceAnswer, setVoiceAnswer] = useState('')
  const [voiceOrbState, setVoiceOrbState] = useState<AgentOrbState>('idle')
  const routeRef = useRef(pathname)
  const voiceTimersRef = useRef<number[]>([])
  const localeRef = useRef(locale)
  const currentSection = t(
    `navigation.${(sectionLabels[pathname] ?? 'Overview').toLowerCase()}`
  )
  const voiceAnswers: Record<string, string> = Object.fromEntries(
    voicePromptIds.map((id) => [
      t(`voiceQuestions.${id}`),
      t(`voiceAnswers.${id}`)
    ])
  )
  const voicePrompts = Object.keys(voiceAnswers)

  const cancelVoiceTimers = useCallback(() => {
    for (const timer of voiceTimersRef.current) window.clearTimeout(timer)
    voiceTimersRef.current = []
  }, [])

  useEffect(() => cancelVoiceTimers, [cancelVoiceTimers])

  useEffect(() => {
    if (localeRef.current === locale) return
    localeRef.current = locale
    cancelVoiceTimers()
    setVoiceQuestion('')
    setVoiceAnswer('')
    setVoiceOrbState('idle')
  }, [locale, cancelVoiceTimers])

  useEffect(() => {
    if (!voiceOpen) {
      cancelVoiceTimers()
      setVoiceOrbState('idle')
    }
  }, [voiceOpen, cancelVoiceTimers])

  useEffect(() => {
    if (routeRef.current === pathname) return
    routeRef.current = pathname
    setMobileNavOpen(false)
    setProductMenuOpen(false)
    setAccountMenuOpen(false)
    setNotificationsOpen(false)
    document.getElementById('dashboard-content')?.focus()
  }, [pathname, setAccountMenuOpen, setNotificationsOpen, setProductMenuOpen])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  function switchTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  function askVoice(question: string) {
    const trimmed = question.trim()
    if (!trimmed) return

    cancelVoiceTimers()
    setVoiceQuestion(trimmed)
    setVoiceOrbState('thinking')
    voiceTimersRef.current.push(
      window.setTimeout(() => {
        setVoiceAnswer(voiceAnswers[trimmed] ?? t('voiceAnswers.fallback'))
        setVoiceOrbState('speaking')
        voiceTimersRef.current.push(
          window.setTimeout(() => setVoiceOrbState('idle'), 700)
        )
      }, 260)
    )
  }

  function submitVoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    askVoice(voiceQuestion)
  }

  const iconButton =
    'inline-flex h-[31px] min-w-[31px] cursor-pointer items-center justify-center rounded-md border border-hairline bg-surface text-inherit max-sm:h-[30px] max-sm:w-[30px] max-sm:min-w-[30px] max-[420px]:h-[29px] max-[420px]:w-[29px] max-[420px]:min-w-[29px]'

  return (
    <div className="min-h-screen [--ld-muted:var(--ld-shell-muted)] [&_button:focus-visible]:outline-ink [&_a:focus-visible]:outline-ink [&_input:focus-visible]:outline-ink [&_:focus]:scroll-mt-20 max-sm:block sm:grid sm:grid-cols-[214px_minmax(0,1fr)]">
      <a
        className="fixed top-3 left-3 z-[110] -translate-y-24 rounded-md bg-ink px-4 py-2 text-surface focus:translate-y-0"
        href="#dashboard-content"
      >
        {t('skipContent')}
      </a>
      <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-hairline bg-surface px-2.5 py-3.5 sm:flex">
        <DashboardNavigation />
      </aside>

      {mobileNavOpen ? (
        <OverlayDialog
          label={t('mobileNavigation')}
          mobileOnly
          onClose={() => setMobileNavOpen(false)}
          className="fixed inset-y-0 left-0 m-0 flex h-dvh max-h-none w-[min(320px,88vw)] max-w-none flex-col overflow-y-auto border-0 border-r border-hairline bg-surface px-3 pt-[calc(14px+env(safe-area-inset-top,0))] pb-[calc(16px+env(safe-area-inset-bottom,0))] text-ink shadow-[18px_0_48px_rgba(0,0,0,.16)] backdrop:bg-scrim/35"
          id="dashboard-mobile-navigation"
        >
          <button
            aria-label={t('closeNavigation')}
            className="mb-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center self-end rounded-full border border-hairline bg-transparent text-inherit"
            onClick={() => setMobileNavOpen(false)}
            type="button"
          >
            <X aria-hidden="true" size={17} />
          </button>
          <DashboardNavigation
            mobile
            onNavigate={() => setMobileNavOpen(false)}
          />
        </OverlayDialog>
      ) : null}

      <div className="relative min-w-0">
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-hairline bg-background/92 px-[18px] max-sm:h-14 max-sm:gap-2 max-sm:px-2.5">
          <div className="flex min-w-0 items-center gap-2 max-sm:flex-1">
            <button
              aria-controls="dashboard-mobile-navigation"
              aria-expanded={mobileNavOpen}
              aria-label={t('openNavigation')}
              className="hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-hairline bg-surface text-inherit max-sm:inline-flex"
              onClick={() => setMobileNavOpen(true)}
              type="button"
            >
              <List aria-hidden="true" size={18} />
            </button>
            <nav
              aria-label={t('breadcrumb')}
              className="flex items-center gap-[7px] text-[10px] text-muted max-sm:min-w-0 max-sm:overflow-hidden max-sm:whitespace-nowrap"
            >
              <span className="max-sm:hidden">LangDrift</span>
              <span className="max-sm:hidden">/</span>
              <strong className="truncate text-ink max-sm:max-w-[120px] max-[420px]:hidden">
                {selectedProduct}
              </strong>
              <span className="max-[420px]:hidden">/</span>
              <strong className="text-ink">{currentSection}</strong>
            </nav>
          </div>
          <div className="flex items-center gap-[5px] max-sm:shrink-0 max-sm:gap-0.5 max-[420px]:gap-px">
            <Tooltip content={t('askLangDrift')}>
              <button
                aria-controls={voiceOpen ? 'dashboard-voice' : undefined}
                aria-expanded={voiceOpen}
                aria-label={t('askLangDrift')}
                className={cn(iconButton, 'border-0 bg-transparent p-0')}
                onClick={() => setVoiceOpen((open) => !open)}
                type="button"
              >
                <AgentOrb size="28px" speed={0.72} state="idle" />
              </button>
            </Tooltip>
            <button
              aria-label={t('notifications')}
              className={iconButton}
              onClick={() => setNotificationsOpen((open) => !open)}
              type="button"
            >
              <Bell aria-hidden="true" size={14} />
            </button>
            <ThemeToggle
              label={t(theme === 'dark' ? 'switchLight' : 'switchDark')}
              onToggle={switchTheme}
              theme={theme}
            />
            <div className="relative">
              <Tooltip content={t('account')}>
                <button
                  aria-expanded={accountMenuOpen}
                  aria-label={t('openAccount')}
                  className={cn(iconButton, 'border-0 bg-transparent p-0')}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="block h-7 w-7 rounded-full object-cover"
                    height={28}
                    src={aiAvatars.jonny}
                    unoptimized
                    width={28}
                  />
                </button>
              </Tooltip>
              {accountMenuOpen ? (
                <div className="absolute top-[calc(100%+6px)] right-0 z-50 grid min-w-40 rounded-lg border border-hairline bg-surface p-1 shadow-[0_12px_30px_rgba(0,0,0,.1)]">
                  <Link
                    className="flex items-center rounded-[7px] px-2 py-2 text-[11px] no-underline hover:bg-subtle"
                    href="/settings"
                  >
                    {t('navigation.settings')}
                  </Link>
                  <button
                    className="cursor-pointer rounded-[5px] border-0 bg-transparent px-2 py-2 text-left text-[10px] text-inherit hover:bg-subtle"
                    onClick={() => {
                      setAccountMenuOpen(false)
                      setProductMenuOpen(true)
                    }}
                    type="button"
                  >
                    {t('switchProduct')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {notificationsOpen ? (
          <section
            aria-label={t('notifications')}
            className="fixed top-[58px] right-[18px] z-[60] grid max-w-[280px] gap-2 rounded-[9px] border border-hairline bg-surface p-[13px] text-[10px] shadow-[0_12px_34px_rgba(0,0,0,.12)] max-sm:inset-x-2.5 max-sm:top-[62px] max-sm:max-w-none"
          >
            <strong>{t('attention')}</strong>
            <span className="leading-snug text-muted">
              {t('attentionDescription')}
            </span>
            <button
              className="min-h-[30px] cursor-pointer rounded-md border-0 bg-ink text-surface"
              onClick={() => setNotificationsOpen((open) => !open)}
              type="button"
            >
              {t('markReviewed')}
            </button>
          </section>
        ) : null}

        {voiceOpen ? (
          <OverlayDialog
            id="dashboard-voice"
            labelledBy="dashboard-voice-title"
            onClose={() => setVoiceOpen(false)}
            className="fixed inset-y-0 right-0 left-auto z-[80] m-0 flex h-dvh max-h-none w-[min(360px,92vw)] max-w-none flex-col items-center gap-3 overflow-y-auto border-0 border-l border-hairline bg-surface px-6 pt-[70px] pb-6 text-center text-ink shadow-[-16px_0_50px_rgba(0,0,0,.08)] backdrop:bg-scrim/35 max-sm:w-screen max-sm:border-l-0 max-sm:px-[18px] max-sm:pt-[calc(66px+env(safe-area-inset-top,0))] max-sm:pb-[calc(20px+env(safe-area-inset-bottom,0))]"
          >
            <button
              aria-label={t('closeVoice')}
              className="absolute top-3.5 right-3.5 inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border border-hairline bg-transparent text-inherit"
              onClick={() => setVoiceOpen((open) => !open)}
              type="button"
            >
              <X aria-hidden="true" size={14} />
            </button>
            <button
              aria-label={
                voiceOrbState === 'listening'
                  ? t('stopListening')
                  : t('startVoice')
              }
              className="cursor-pointer rounded-full border-0 bg-transparent p-0"
              onClick={() =>
                setVoiceOrbState(
                  voiceOrbState === 'listening' ? 'idle' : 'listening'
                )
              }
              type="button"
            >
              <AgentOrb
                size="88px"
                speed={voiceOrbState === 'listening' ? 1.1 : 0.72}
                state={voiceOrbState}
              />
            </button>
            <span className="font-mono text-[8px] tracking-[0.08em] text-muted uppercase">
              {voiceOrbState === 'listening'
                ? t('listening')
                : t('executiveInquiry')}
            </span>
            <strong className="text-lg font-medium" id="dashboard-voice-title">
              {t('askLangDrift')}
            </strong>
            <p className="m-0 text-[11px] leading-normal text-muted">
              {t('voiceDescription')}
            </p>
            <div className="mt-1 grid w-full gap-1.5">
              {voicePrompts.map((prompt) => (
                <button
                  className="min-h-[34px] cursor-pointer rounded-[7px] border border-hairline bg-subtle px-[9px] py-[7px] text-left text-[9px] text-inherit"
                  key={prompt}
                  onClick={() => askVoice(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
            {voiceAnswer ? (
              <output
                aria-live="polite"
                className="block w-full rounded-lg border border-hairline bg-subtle p-[11px] text-left text-[10px] leading-normal text-muted"
              >
                {voiceAnswer}
              </output>
            ) : null}
            <form
              className="mt-auto grid w-full min-w-0 gap-[7px] border-t border-hairline pt-3.5 text-left"
              onSubmit={submitVoice}
            >
              <label
                className="text-[8px] text-muted uppercase"
                htmlFor="dashboard-voice-question"
              >
                {t('askProduct')}
              </label>
              <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-1.5">
                <input
                  className="min-h-9 min-w-0 rounded-[7px] border border-hairline bg-background px-[9px] text-inherit"
                  id="dashboard-voice-question"
                  onChange={(event) =>
                    setVoiceQuestion(event.currentTarget.value)
                  }
                  placeholder={t('voiceQuestions.week')}
                  value={voiceQuestion}
                />
                <button
                  className="min-w-[54px] cursor-pointer rounded-[7px] border-0 bg-brand px-2.5"
                  disabled={voiceOrbState === 'thinking'}
                  type="submit"
                >
                  {t('ask')}
                </button>
              </div>
            </form>
          </OverlayDialog>
        ) : null}

        <main
          id="dashboard-content"
          tabIndex={-1}
          className="mx-auto max-w-[1180px] px-7 pt-[30px] pb-[70px] outline-none max-sm:px-3 max-sm:pt-5 max-sm:pb-14"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
