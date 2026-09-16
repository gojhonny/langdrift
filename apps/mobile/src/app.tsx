import { X } from '@phosphor-icons/react'
import { AgentOrb } from '@repo/react/ui/agent-orb'
import { aiAvatars } from '@repo/react/ui/ai-avatars'
import { Brand } from '@repo/react/ui/brand'
import { ChartLineUp } from '@repo/react/ui/icons'
import {
  ProductVisionCurve,
  type VisionPoint
} from '@repo/react/ui/product-vision-curve'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import {
  AIMessage,
  AnimatedAvatarGroup
} from '@repo/react/vendors/smoothui'
import { useAtom } from 'jotai'
import type { FormEvent } from 'react'
import { useEffect, useRef } from 'react'

import {
  evolutionOpenAtom,
  inputAtom,
  messagesAtom,
  themeAtom,
  voiceStateAtom
} from './state'
import { StateLogger } from './state-logger'

interface VoiceIntent {
  answer: string
  id:
    | 'drift_this_week'
    | 'explain_product_vision'
    | 'unexplained_changes'
  prompt: string
}

// Illustrative frontend fixture data. The disclosure remains internal rather than customer-facing.
const visionPoints: VisionPoint[] = [
  { label: 'Apr', value: 91 },
  { label: 'May', value: 88 },
  {
    label: 'Jun',
    value: 84,
    event: {
      actors: [
        { initials: 'AN', name: 'Ana', src: aiAvatars.ana, team: 'Product' },
        { initials: 'CA', name: 'Carlos', src: aiAvatars.carlos, team: 'Platform' }
      ],
      classification: 'intentional',
      date: 'Jun 28',
      decision: 'Decision recorded',
      delta: -9,
      id: 'pricing',
      productArea: 'Pricing',
      reason: 'Enterprise customers required a different packaging model.',
      title: 'Pricing strategy changed'
    }
  },
  {
    label: 'Jul',
    value: 79,
    event: {
      actors: [{ initials: 'CA', name: 'Carlos', src: aiAvatars.carlos, team: 'Platform' }],
      classification: 'unexplained',
      date: 'Jul 22',
      decision: 'Decision not found',
      delta: -6,
      id: 'authentication',
      productArea: 'Authentication',
      reason: 'No matching product decision was found.',
      title: 'Authentication redesigned'
    }
  },
  {
    label: 'Aug',
    value: 73,
    event: {
      actors: [{ initials: 'AN', name: 'Ana', src: aiAvatars.ana, team: 'Product' }],
      classification: 'review',
      date: 'Aug 20',
      decision: 'Review pending',
      delta: -3,
      id: 'exports',
      productArea: 'Exports',
      reason: 'Evidence exists, but the product rationale is still incomplete.',
      title: 'Export behavior changed'
    }
  }
]

const intents: VoiceIntent[] = [
  {
    answer:
      'Product Vision moved six points this week. Authentication was the largest contributor; four points were intentional evolution and two remain unexplained.',
    id: 'drift_this_week',
    prompt: 'What changed this week?'
  },
  {
    answer:
      'Product Vision is at 73%, down from the 91% baseline. Pricing moved intentionally, authentication is unexplained, and export behavior remains under review.',
    id: 'explain_product_vision',
    prompt: 'Why did Product Vision fall?'
  },
  {
    answer:
      'Authentication is currently classified as Unexplained Drift. Export behavior remains Under Review rather than being treated as unexplained by default.',
    id: 'unexplained_changes',
    prompt: 'Which changes are unexplained?'
  }
]

function deterministicAnswer(question: string) {
  const knownIntent = intents.find((intent) => intent.prompt === question)
  return knownIntent?.answer ??
    'This experience resolves bounded executive questions over Product Vision, Drift events, decisions, people, and linked evidence.'
}

const voiceLabels = {
  idle: 'Ask LangDrift',
  listening: 'Listening…',
  querying: 'Checking product history…',
  speaking: 'Answering…'
} as const

export function App() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [input, setInput] = useAtom(inputAtom)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [voiceState, setVoiceState] = useAtom(voiceStateAtom)
  const [evolutionOpen, setEvolutionOpen] = useAtom(evolutionOpenAtom)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const evolutionTriggerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const hasConversation = messages.length > 1

  useEffect(() => {
    const root = document.documentElement
    const themeColor = document.querySelector<HTMLMetaElement>('#app-theme-color')
    root.dataset.theme = theme
    root.style.colorScheme = theme
    themeColor?.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f7f6f2')
  }, [theme])

  useEffect(() => {
    if (!hasConversation) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    messageEndRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' })
  }, [hasConversation])

  useEffect(() => {
    if (!evolutionOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setEvolutionOpen(false)
        return
      }
      if (event.key !== 'Tab' || !sheetRef.current) return

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((element) => !element.hasAttribute('disabled'))

      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = previousOverflow
      evolutionTriggerRef.current?.focus()
    }
  }, [evolutionOpen, setEvolutionOpen])

  function ask(question: string) {
    const trimmed = question.trim()
    if (!trimmed) return

    const answer = deterministicAnswer(trimmed)
    const stamp = Date.now().toString()
    setVoiceState('querying')
    setMessages((current) => [
      ...current,
      { id: `${stamp}-user`, role: 'user', text: trimmed }
    ])
    setInput('')

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `${stamp}-assistant`, role: 'assistant', text: answer }
      ])
      setVoiceState('speaking')
      window.setTimeout(() => setVoiceState('idle'), 700)
    }, 260)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    ask(input)
  }

  const orbState =
    voiceState === 'querying'
      ? 'thinking'
      : voiceState === 'speaking'
        ? 'speaking'
        : voiceState

  return (
    <main className="mobile-shell">
      <StateLogger />
      <header className="mobile-header">
        <div>
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
          <span>Atlas Home Hub</span>
        </div>
        <ThemeToggle
          onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          theme={theme}
        />
      </header>

      <section className="mobile-inquiry" aria-labelledby="mobile-product-vision">
        <div className="mobile-glance">
          <div>
            <span>Product Vision</span>
            <h1 id="mobile-product-vision">73%</h1>
            <strong>↓ 6 this week</strong>
          </div>
          <p>
            <span>14 intentional</span>
            <span>4 unexplained</span>
          </p>
          <button ref={evolutionTriggerRef} onClick={() => setEvolutionOpen(true)} type="button">
            <ChartLineUp aria-hidden="true" size={14} /> View evolution
          </button>
        </div>

        <div className="conversation-orb">
          <button
            aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start voice inquiry'}
            onClick={() => setVoiceState(voiceState === 'listening' ? 'idle' : 'listening')}
            type="button"
          >
            <AgentOrb
              size="92px"
              speed={voiceState === 'listening' ? 1.15 : voiceState === 'querying' ? 0.95 : 0.62}
              state={orbState}
            />
          </button>
          <span>{voiceLabels[voiceState]}</span>
          <small>“What changed this week?”</small>
        </div>

        <fieldset className={`quick-prompts ${hasConversation ? 'quick-prompts-compact' : ''}`}>
          <legend className="ld-visually-hidden">Suggested executive questions</legend>
          {intents.map((intent) => (
            <button key={intent.id} onClick={() => ask(intent.prompt)} type="button">
              {intent.prompt}
            </button>
          ))}
        </fieldset>
      </section>

      <section aria-label="LangDrift conversation" className="conversation">
        <div className="message-list">
          {messages.map((message) => (
            <AIMessage key={message.id} role={message.role}>
              {message.text}
            </AIMessage>
          ))}
          <div aria-hidden="true" ref={messageEndRef} />
        </div>

        <form className="composer" onSubmit={submit}>
          <label htmlFor="question">Ask about this product</label>
          <div>
            <input
              id="question"
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Why did Product Vision fall?"
              value={input}
            />
            <button disabled={voiceState === 'querying'} type="submit">Ask</button>
          </div>
        </form>
      </section>

      <section className="mobile-largest-movement">
        <div>
          <span>Largest movement</span>
          <strong>Pricing strategy changed · −9</strong>
          <small>Jun 28 · Intentional Evolution · Ana + Carlos</small>
        </div>
        <AnimatedAvatarGroup
          people={[
            { initials: 'AN', name: 'Ana', role: 'Product', src: aiAvatars.ana },
            { initials: 'CA', name: 'Carlos', role: 'Platform', src: aiAvatars.carlos }
          ]}
          size={26}
        />
        <button onClick={() => setEvolutionOpen(true)} type="button">
          <ChartLineUp aria-hidden="true" size={14} /> Show evolution
        </button>
      </section>

      {evolutionOpen ? (
        <div className="mobile-sheet-backdrop">
          <section
            aria-label="Product Vision evolution"
            aria-modal="true"
            className="mobile-evolution-sheet"
            ref={sheetRef}
            role="dialog"
          >
            <div className="mobile-sheet-handle" />
            <div className="mobile-sheet-header">
              <div>
                <span>Evolution</span>
                <strong>Product Vision · 91% → 73%</strong>
              </div>
              <button ref={closeRef} aria-label="Close evolution" onClick={() => setEvolutionOpen(false)} type="button">
                <X aria-hidden="true" size={14} />
              </button>
            </div>
            <ProductVisionCurve compact data={visionPoints} />
            <div className="mobile-sheet-event">
              <strong>Pricing strategy changed · −9</strong>
              <span>Ana + Carlos · Intentional Evolution</span>
              <p>Enterprise customers required a different packaging model.</p>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}
