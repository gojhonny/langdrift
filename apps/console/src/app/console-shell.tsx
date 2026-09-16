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
import { AgentOrb, type AgentOrbState } from '@repo/react/ui/agent-orb'
import { aiAvatars } from '@repo/react/ui/ai-avatars'
import { Brand } from '@repo/react/ui/brand'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import { Tooltip } from '@repo/react/vendors/shadcn'
import { usePathname } from 'next/navigation'
import type { FormEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { StateLogger } from './state-logger'
import { useConsoleStore } from './state'

const navigation = [
  { href: '/overview', icon: House, label: 'Overview' },
  { href: '/evolution', icon: ChartLineUp, label: 'Evolution' },
  { href: '/decisions', icon: GitBranch, label: 'Decisions' },
  { href: '/people', icon: Users, label: 'People' },
  { href: '/reports', icon: FileText, label: 'Reports' }
]

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

const voiceAnswers: Record<string, string> = {
  'Why did Product Vision fall?':
    'Product Vision moved from 91% to 73%. Pricing changed intentionally, authentication remains unexplained, and export behavior is still under review.',
  'What changed this week?':
    'Authentication was the largest contributor this week. Four points were intentional evolution and two points remain unexplained.',
  'Which changes are unexplained?':
    'Authentication is currently classified as Unexplained Drift. Export behavior remains Under Review rather than being classified prematurely.'
}

const voicePrompts = Object.keys(voiceAnswers)

export function ConsoleShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const state = useConsoleStore()
  const [voiceQuestion, setVoiceQuestion] = useState('')
  const [voiceAnswer, setVoiceAnswer] = useState('')
  const [voiceOrbState, setVoiceOrbState] = useState<AgentOrbState>('idle')
  const currentSection = sectionLabels[pathname] ?? 'Overview'

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.style.colorScheme = state.theme
  }, [state.theme])

  function switchTheme() {
    state.setTheme(state.theme === 'light' ? 'dark' : 'light')
  }

  function askVoice(question: string) {
    const trimmed = question.trim()
    if (!trimmed) return

    setVoiceQuestion(trimmed)
    setVoiceOrbState('thinking')
    window.setTimeout(() => {
      setVoiceAnswer(
        voiceAnswers[trimmed] ??
          'LangDrift can answer bounded questions over Product Vision, Drift events, decisions, people, and linked evidence.'
      )
      setVoiceOrbState('speaking')
      window.setTimeout(() => setVoiceOrbState('idle'), 700)
    }, 260)
  }

  function submitVoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    askVoice(voiceQuestion)
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
          <div className="console-breadcrumb" aria-label="Breadcrumb">
            <span>LangDrift</span>
            <span>/</span>
            <strong>{state.selectedProduct}</strong>
            <span>/</span>
            <strong>{currentSection}</strong>
          </div>
          <div className="console-actions">
            <Tooltip content="Ask LangDrift">
              <button
                aria-label="Ask LangDrift"
                className="console-orb-button"
                onClick={state.toggleVoice}
                type="button"
              >
                <AgentOrb size="28px" speed={0.72} state="idle" />
              </button>
            </Tooltip>
            <button
              aria-label="Notifications"
              onClick={state.toggleNotifications}
              type="button"
            >
              <Bell aria-hidden="true" />
            </button>
            <ThemeToggle onToggle={switchTheme} theme={state.theme} />
            <div className="console-account">
              <Tooltip content="Account">
                <button
                  aria-expanded={state.accountMenuOpen}
                  aria-label="Open account menu"
                  className="console-profile-button"
                  onClick={state.toggleAccountMenu}
                  type="button"
                >
                  <img alt="" aria-hidden="true" src={aiAvatars.jonny} />
                </button>
              </Tooltip>
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
            <div className="voice-drawer-orb-wrap">
              <button
                aria-label={voiceOrbState === 'listening' ? 'Stop listening' : 'Start voice inquiry'}
                onClick={() => setVoiceOrbState(voiceOrbState === 'listening' ? 'idle' : 'listening')}
                type="button"
              >
                <AgentOrb size="88px" speed={voiceOrbState === 'listening' ? 1.1 : 0.72} state={voiceOrbState} />
              </button>
            </div>
            <span>{voiceOrbState === 'listening' ? 'Listening' : 'Executive inquiry'}</span>
            <strong>Ask LangDrift</strong>
            <p>Ask over the same structured events, decisions, people, and evidence shown visually.</p>
            <div className="voice-drawer-prompts">
              {voicePrompts.map((prompt) => (
                <button key={prompt} onClick={() => askVoice(prompt)} type="button">
                  {prompt}
                </button>
              ))}
            </div>
            {voiceAnswer ? (
              <output className="voice-drawer-answer" aria-live="polite">
                {voiceAnswer}
              </output>
            ) : null}
            <form className="voice-drawer-composer" onSubmit={submitVoice}>
              <label htmlFor="console-voice-question">Ask about this product</label>
              <div>
                <input
                  id="console-voice-question"
                  onChange={(event) => setVoiceQuestion(event.currentTarget.value)}
                  placeholder="What changed this week?"
                  value={voiceQuestion}
                />
                <button disabled={voiceOrbState === 'thinking'} type="submit">Ask</button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="console-content">{children}</div>
      </section>
    </main>
  )
}
