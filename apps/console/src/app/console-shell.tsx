'use client'

import {
  Bell,
  CaretDown,
  ChartLineUp,
  FileText,
  Gear,
  GitBranch,
  House,
  MagnifyingGlass,
  Microphone,
  Moon,
  Sun,
  Users,
  X
} from '@phosphor-icons/react'
import { AgentOrb } from '@repo/react/ui/agent-orb'
import { Brand } from '@repo/react/ui/brand'
import { BasicToast } from '@repo/react/vendors/smoothui'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { StateLogger } from './state-logger'
import { useConsoleStore } from './state'

const navigation = [
  { href: '/overview', icon: House, label: 'Overview' },
  { href: '/evolution', icon: ChartLineUp, label: 'Evolution' },
  { href: '/decisions', icon: GitBranch, label: 'Decisions' },
  { href: '/people', icon: Users, label: 'People' },
  { href: '/reports', icon: FileText, label: 'Reports' }
]

export function ConsoleShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const state = useConsoleStore()

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.style.colorScheme = state.theme
  }, [state.theme])

  function switchTheme() {
    const next = state.theme === 'light' ? 'dark' : 'light'
    state.setTheme(next)
    state.notify(`${next === 'dark' ? 'Dark' : 'Light'} theme enabled`)
  }

  return (
    <main className="console-shell">
      <StateLogger />
      <aside className="console-sidebar">
        <a aria-label="LangDrift overview" className="console-brand" href="/overview">
          <Brand compact tone={state.theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <div className="product-picker">
          <button
            aria-expanded={state.productMenuOpen}
            className="product-picker-trigger"
            onClick={state.toggleProductMenu}
            type="button"
          >
            <span className="product-letter">A</span>
            <span>
              <small>Product</small>
              <strong>{state.selectedProduct}</strong>
            </span>
            <CaretDown aria-hidden="true" size={12} />
          </button>
          {state.productMenuOpen ? (
            <div className="shell-dropdown product-dropdown">
              {['Atlas Home Hub', 'Atlas Checkout', 'Atlas Mobile'].map((product) => (
                <button
                  key={product}
                  onClick={() => {
                    state.setSelectedProduct(product)
                    state.notify(`${product} selected`)
                  }}
                  type="button"
                >
                  {product}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <nav aria-label="Executive product navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <a
                className={pathname === item.href ? 'console-nav-active' : ''}
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" size={15} />
                {item.label}
              </a>
            )
          })}
        </nav>
        <a
          className={pathname === '/settings' ? 'console-nav-active console-settings' : 'console-settings'}
          href="/settings"
        >
          <Gear aria-hidden="true" size={15} /> Settings
        </a>
      </aside>

      <section className="console-workspace">
        <header className="console-topbar">
          <div className="console-breadcrumb">
            <span>LangDrift</span>
            <span>/</span>
            <strong>{state.selectedProduct}</strong>
          </div>
          <div className="console-actions">
            <button aria-label="Search" onClick={state.toggleSearch} type="button">
              <MagnifyingGlass aria-hidden="true" />
            </button>
            <button
              aria-label="Notifications"
              onClick={state.toggleNotifications}
              type="button"
            >
              <Bell aria-hidden="true" />
            </button>
            <button aria-label="Change theme" onClick={switchTheme} type="button">
              {state.theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <button className="console-voice-button" onClick={state.toggleVoice} type="button">
              <Microphone aria-hidden="true" size={14} /> Ask LangDrift
            </button>
            <div className="console-account">
              <button
                aria-expanded={state.accountMenuOpen}
                onClick={state.toggleAccountMenu}
                type="button"
              >
                <span>JS</span>
                <CaretDown aria-hidden="true" size={11} />
              </button>
              {state.accountMenuOpen ? (
                <div className="shell-dropdown account-dropdown">
                  <button onClick={() => state.notify('Account profile opened')} type="button">
                    Account
                  </button>
                  <button onClick={() => state.notify('Workspace switcher opened')} type="button">
                    Switch workspace
                  </button>
                  <button onClick={() => state.notify('Sign out selected', 'warning')} type="button">
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {state.searchOpen ? (
          <div className="topbar-panel search-panel">
            <MagnifyingGlass aria-hidden="true" size={15} />
            <input
              aria-label="Search product intelligence"
              onChange={(event) => state.setSearchQuery(event.currentTarget.value)}
              placeholder="Search decisions, people, product areas…"
              value={state.searchQuery}
            />
            <button aria-label="Close search" onClick={state.toggleSearch} type="button">
              <X aria-hidden="true" size={14} />
            </button>
          </div>
        ) : null}

        {state.notificationsOpen ? (
          <div className="topbar-panel notifications-panel">
            <strong>2 items need attention</strong>
            <span>Authentication is unexplained. Export behavior remains under review.</span>
            <button
              onClick={() => {
                state.toggleNotifications()
                state.notify('Attention items marked as reviewed', 'success')
              }}
              type="button"
            >
              Mark reviewed
            </button>
          </div>
        ) : null}

        {state.voiceOpen ? (
          <div className="voice-drawer">
            <button aria-label="Close voice" onClick={state.toggleVoice} type="button">
              <X aria-hidden="true" size={14} />
            </button>
            <AgentOrb size="88px" speed={0.72} state="idle" />
            <span>Executive inquiry</span>
            <strong>Why did Product Vision fall?</strong>
            <p>Ask over the same structured events, decisions, people, and evidence shown visually.</p>
            <button
              onClick={() => state.notify('Deterministic Voice prompt selected', 'success')}
              type="button"
            >
              Ask this question
            </button>
          </div>
        ) : null}

        <div className="console-content">{children}</div>
      </section>

      <BasicToast
        message={state.toast.message}
        onClose={state.closeToast}
        open={state.toast.open}
        tone={state.toast.tone}
      />
    </main>
  )
}
