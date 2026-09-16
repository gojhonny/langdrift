import { AgentOrb } from '@repo/react/ui/agent-orb'
import { Brand } from '@repo/react/ui/brand'
import {
  ProductVisionCurve,
  type VisionPoint
} from '@repo/react/ui/product-vision-curve'
import {
  AIMessage,
  AnimatedAvatarGroup,
  BasicToast
} from '@repo/react/vendors/smoothui'
import { useAtom } from 'jotai'
import type { FormEvent } from 'react'
import { useEffect, useRef } from 'react'

import {
  evolutionOpenAtom,
  inputAtom,
  messagesAtom,
  themeAtom,
  toastAtom,
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

const visionPoints: VisionPoint[] = [
  { label: 'Apr', value: 91 },
  { label: 'May', value: 88 },
  {
    label: 'Jun',
    value: 84,
    event: {
      actors: [
        { initials: 'AN', name: 'Ana', team: 'Product' },
        { initials: 'CA', name: 'Carlos', team: 'Platform' }
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
      actors: [{ initials: 'CA', name: 'Carlos', team: 'Platform' }],
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
      actors: [{ initials: 'AN', name: 'Ana', team: 'Product' }],
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
      'In this demo period, Product Vision moved six points this week. Authentication was the largest contributor; four points were intentional evolution and two remain unexplained.',
    id: 'drift_this_week',
    prompt: 'What changed this week?'
  },
  {
    answer:
      'Product Vision is at 73%, down from the 91% demo baseline. Pricing moved intentionally, authentication is unexplained, and export behavior remains under review.',
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
    'This preview resolves bounded executive questions over Product Vision, Drift events, decisions, people, and linked evidence.'
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
  const [toast, setToast] = useAtom(toastAtom)
  const messageEndRef = useRef<HTMLDivElement>(null)
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
  }, [hasConversation, messages.length])

  useEffect(() => {
    if (!evolutionOpen) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setEvolutionOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
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
          <span>Atlas Home Hub · Demo</span>
        </div>
        <button
          onClick={() => {
            const next = theme === 'light' ? 'dark' : 'light'
            setTheme(next)
            setToast({ message: `${next} theme enabled`, open: true })
          }}
          type="button"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
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
          <button onClick={() => setEvolutionOpen(true)} type="button">
            View evolution →
          </button>
        </div>

        <div className="conversation-orb">
          <button
            aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start voice inquiry'}
            onClick={() => {
              const next = voiceState === 'listening' ? 'idle' : 'listening'
              setVoiceState(next)
              setToast({
                message: next === 'listening' ? 'Listening for a product question' : 'Voice inquiry stopped',
                open: true
              })
            }}
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
            { initials: 'AN', name: 'Ana', role: 'Product' },
            { initials: 'CA', name: 'Carlos', role: 'Platform' }
          ]}
          size={26}
        />
        <button onClick={() => setEvolutionOpen(true)} type="button">
          View →
        </button>
      </section>

      {evolutionOpen ? (
        <div className="mobile-sheet-backdrop">
          <section
            aria-label="Product Vision evolution"
            aria-modal="true"
            className="mobile-evolution-sheet"
            role="dialog"
          >
            <div className="mobile-sheet-handle" />
            <div className="mobile-sheet-header">
              <div>
                <span>Evolution</span>
                <strong>Product Vision · 91% → 73%</strong>
              </div>
              <button aria-label="Close evolution" onClick={() => setEvolutionOpen(false)} type="button">Close</button>
            </div>
            <ProductVisionCurve compact data={visionPoints} />
            <div className="mobile-sheet-event">
              <strong>Pricing strategy changed · −9</strong>
              <span>Ana + Carlos · Intentional Evolution</span>
              <p>Enterprise customers required a different packaging model.</p>
            </div>
            <small>Illustrative data · final Product Vision formula remains open.</small>
          </section>
        </div>
      ) : null}

      <BasicToast
        message={toast.message}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
        open={toast.open}
        tone="info"
      />
    </main>
  )
}
