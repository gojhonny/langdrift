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
import { useEffect } from 'react'

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
      delta: -9,
      id: 'pricing',
      productArea: 'Pricing',
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
      delta: -6,
      id: 'authentication',
      productArea: 'Authentication',
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
      delta: -3,
      id: 'exports',
      productArea: 'Exports',
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
    'This prototype only resolves known executive intents over Product Vision, Drift events, decisions, people, and linked evidence.'
}

export function App() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [input, setInput] = useAtom(inputAtom)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [voiceState, setVoiceState] = useAtom(voiceStateAtom)
  const [evolutionOpen, setEvolutionOpen] = useAtom(evolutionOpenAtom)
  const [toast, setToast] = useAtom(toastAtom)

  useEffect(() => {
    const root = document.documentElement
    const themeColor = document.querySelector<HTMLMetaElement>('#app-theme-color')
    root.dataset.theme = theme
    root.style.colorScheme = theme
    themeColor?.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f7f6f2')
  }, [theme])

  function ask(question: string) {
    const trimmed = question.trim()
    if (!trimmed) return
    const answer = deterministicAnswer(trimmed)
    const stamp = Date.now().toString()
    setMessages((current) => [
      ...current,
      { id: `${stamp}-user`, role: 'user', text: trimmed },
      { id: `${stamp}-assistant`, role: 'assistant', text: answer }
    ])
    setInput('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    ask(input)
  }

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

      <section aria-labelledby="mobile-product-vision" className="mobile-glance">
        <div>
          <span>Product Vision</span>
          <h1 id="mobile-product-vision">73%</h1>
          <strong>↓ 6 this week</strong>
        </div>
        <p>
          <span>14 intentional</span>
          <span>4 unexplained</span>
        </p>
        <button
          onClick={() => setEvolutionOpen((open) => !open)}
          type="button"
        >
          {evolutionOpen ? 'Hide evolution' : 'View evolution →'}
        </button>
      </section>

      {evolutionOpen ? (
        <section aria-label="Product Vision evolution" className="mobile-evolution-detail">
          <ProductVisionCurve compact data={visionPoints} />
          <small>Illustrative data · final Product Vision formula remains open.</small>
        </section>
      ) : null}

      <section aria-label="LangDrift conversation" className="conversation">
        <div className="conversation-orb">
          <button
            aria-label={voiceState === 'idle' ? 'Start voice inquiry' : 'Stop listening'}
            onClick={() => {
              const next = voiceState === 'idle' ? 'listening' : 'idle'
              setVoiceState(next)
              setToast({
                message:
                  next === 'listening'
                    ? 'Listening for a product question'
                    : 'Voice inquiry stopped',
                open: true
              })
            }}
            type="button"
          >
            <AgentOrb
              size="88px"
              speed={voiceState === 'listening' ? 1.15 : 0.55}
              state={voiceState === 'listening' ? 'listening' : 'idle'}
            />
          </button>
          <span>{voiceState === 'listening' ? 'Listening…' : 'Ask LangDrift'}</span>
          <small>“What changed this week?”</small>
        </div>

        <fieldset className="quick-prompts">
          <legend className="ld-visually-hidden">Suggested executive questions</legend>
          {intents.map((intent) => (
            <button key={intent.id} onClick={() => ask(intent.prompt)} type="button">
              {intent.prompt}
            </button>
          ))}
        </fieldset>

        <div className="message-list">
          {messages.map((message) => (
            <AIMessage key={message.id} role={message.role}>
              {message.text}
            </AIMessage>
          ))}
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
            <button type="submit">Ask</button>
          </div>
        </form>
      </section>

      <section className="mobile-largest-movement">
        <div>
          <span>Largest movement</span>
          <strong>Pricing strategy changed · −9</strong>
          <small>Jun 28 · Intentional Evolution</small>
        </div>
        <AnimatedAvatarGroup
          people={[
            { initials: 'AN', name: 'Ana', role: 'Product' },
            { initials: 'CA', name: 'Carlos', role: 'Platform' }
          ]}
          size={26}
        />
        <button
          onClick={() => {
            setEvolutionOpen(true)
            setToast({ message: 'Evolution detail opened', open: true })
          }}
          type="button"
        >
          View →
        </button>
      </section>

      <BasicToast
        message={toast.message}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
        open={toast.open}
        tone="info"
      />
    </main>
  )
}
