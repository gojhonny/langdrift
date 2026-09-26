'use client'

import { Brand } from '@repo/react/ui/brand'
import { LanguageSwitcher } from '@repo/react/ui/language-switcher'
import { useAtom } from 'jotai'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import { websiteLinks } from '@/app/app-links'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { themeAtom } from '@/state'

import './website-header.css'

const languages = [
  { locale: 'en', label: 'EN', name: 'english' },
  { locale: 'pt-BR', label: 'PT-BR', name: 'portuguese' },
  { locale: 'zh-Hant', label: '中文', name: 'chinese' },
  { locale: 'ja', label: 'あ', name: 'japanese' }
] as const

// Only set by a drawer interaction in the browser; survives the locale route
// remount long enough to return focus to the replacement navigation trigger.
let pendingDrawerFocusLocale: (typeof languages)[number]['locale'] | undefined

const sections = [
  { label: 'product', href: '/#why' },
  { label: 'attribution', href: '/#attribution' },
  { label: 'integrations', href: '/#integrations' },
  { label: 'voice', href: '/#voice' },
  { label: 'plans', href: '/pricing' }
] as const

function LanguagePill({ fromDrawer = false }: { fromDrawer?: boolean }) {
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
      pendingDrawerFocusLocale = nextLocale
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

function AccessLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations('header')

  return (
    <>
      {/* Docs is an external, environment-configured origin: a plain anchor
          keeps the i18n router from prefixing or rewriting it. */}
      <a className="website-docs-link" href={websiteLinks.docs}>
        {t('docs')}
      </a>
      <Link
        className="website-get-started"
        href="/#early-access"
        onClick={onNavigate}
      >
        {t('getStarted')}
      </Link>
    </>
  )
}

export function WebsiteHeader() {
  const t = useTranslations('header')
  const locale = useLocale()
  const [theme, setTheme] = useAtom(themeAtom)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousLocale = useRef(locale)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f7f6f2')
  }, [theme])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting)
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (previousLocale.current !== locale) {
      previousLocale.current = locale
      setDrawerOpen(false)
    }
  }, [locale])

  useEffect(() => {
    if (pendingDrawerFocusLocale !== locale) return
    const frame = requestAnimationFrame(() => {
      if (pendingDrawerFocusLocale !== locale) return
      triggerRef.current?.focus({ preventScroll: true })
      pendingDrawerFocusLocale = undefined
    })
    return () => cancelAnimationFrame(frame)
  }, [locale])

  useEffect(() => {
    if (!drawerOpen) return
    const drawer = drawerRef.current
    if (!drawer) return
    const previousOverflow = document.body.style.overflow
    drawer.showModal()
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      drawer.close()
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [drawerOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1440px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setDrawerOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  function closeDrawer() {
    setDrawerOpen(false)
  }

  const themeLabel = t(theme === 'dark' ? 'lightTheme' : 'darkTheme')

  return (
    <>
      <div
        aria-hidden="true"
        className="website-header-sentinel"
        ref={sentinelRef}
      />
      <header className="website-header" data-scrolled={scrolled}>
        <div className="website-header-inner">
          <Brand className="website-header-brand" compact tone={theme} />
          <nav aria-label={t('navigation')} className="website-desktop-nav">
            {sections.map((section) => (
              <Link href={section.href} key={section.label}>
                {t(section.label)}
              </Link>
            ))}
          </nav>
          <div className="website-header-controls">
            <div className="website-header-access">
              <LanguagePill />
              <AccessLinks />
            </div>
            <button
              aria-controls="website-navigation-drawer"
              aria-expanded={drawerOpen}
              aria-label={t('openNavigation')}
              className="website-header-icon website-navigation-trigger"
              onClick={() => setDrawerOpen(true)}
              ref={triggerRef}
              type="button"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <button
              aria-label={themeLabel}
              className="website-header-icon website-theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={themeLabel}
              type="button"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                {theme === 'light' ? (
                  <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      <dialog
        aria-label={t('navigation')}
        className="website-navigation-drawer"
        id="website-navigation-drawer"
        onCancel={closeDrawer}
        onClose={closeDrawer}
        ref={drawerRef}
      >
        <div className="website-drawer-heading">
          <Brand compact tone={theme} />
          <button
            aria-label={t('closeNavigation')}
            className="website-header-icon"
            onClick={closeDrawer}
            ref={closeRef}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </div>
        <nav aria-label={t('navigation')} className="website-drawer-nav">
          {sections.map((section) => (
            <Link href={section.href} key={section.label} onClick={closeDrawer}>
              {t(section.label)}
            </Link>
          ))}
        </nav>
        <div className="website-drawer-access">
          <LanguagePill fromDrawer />
          <div className="website-drawer-buttons">
            <AccessLinks onNavigate={closeDrawer} />
          </div>
        </div>
      </dialog>
    </>
  )
}
