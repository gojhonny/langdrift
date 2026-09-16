'use client'

import {
  Bell,
  CaretDown,
  ChartLineUp,
  FileText,
  Gear,
  GitBranch,
  House,
  Users,
  X
} from '@phosphor-icons/react'
import { AgentOrb } from '@repo/react/ui/agent-orb'
import { aiAvatars } from '@repo/react/ui/ai-avatars'
import { Brand } from '@repo/react/ui/brand'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
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
    state.setTheme(state.theme === 'light' ? 'dark' : 'light')
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
                  onClick={() => state.setSelectedProduct(product)}
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
            <button
              aria-label="Notifications"
              onClick={state.toggleNotifications}
              type="button"
            >
              <Bell aria-hidden="true" />
            </button>
            <ThemeToggle onToggle={switchTheme} theme={state.theme} />
            <span className="console-orb-action">
              <button aria-label="Ask LangDrift" onClick={state.toggleVoice} type="button">
                <AgentOrb size="34px" speed={0.72} state="idle" />
              </button>
              <span className="console-orb-tooltip" role="tooltip">Ask LangDrift</span>
            </span>
            <div className="console-account">
              <button
                aria-expanded={state.accountMenuOpen}
                aria-label="Open account menu"
                onClick={state.toggleAccountMenu}
                type="button"
              >
                <img alt="" aria-hidden="true" src={aiAvatars.jonny} />
                <CaretDown aria-hidden="true" size={11} />
              </button>
              {state.accountMenuOpen ? (
                <div className="shell-dropdown account-dropdown">
                  <a href="/settings">Settings</a>
                  <button
                    onClick={() => {
                      state.toggleAccountMenu()
                      state.toggleProductMenu()
                    }}
                    type="button"
                  >
                    Switch product
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {state.notificationsOpen ? (
          <div className="topbar-panel notifications-panel">
            <strong>2 items need attention</strong>
            <span>Authentication is unexplained. Export behavior remains under review.</span>
            <button onClick={state.toggleNotifications} type="button">
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
          </div>
        ) : null}

        <div className="console-content">{children}</div>
      </section>
    </main>
  )
}
