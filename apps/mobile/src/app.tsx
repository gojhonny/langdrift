import { AgentOrb } from '@repo/react/ui/agent-orb'
import { Brand } from '@repo/react/ui/brand'
import { AIMessage, BasicToast } from '@repo/react/vendors/smoothui'
import { useAtom } from 'jotai'
import type { FormEvent } from 'react'
import { useEffect } from 'react'

import {
  inputAtom,
  messagesAtom,
  themeAtom,
  toastAtom,
  voiceStateAtom
} from './state'
import { StateLogger } from './state-logger'

const answers: Record<string, string> = {
  'What changed?':
    'Three high-impact movements explain most of the change: pricing strategy −9, authentication −6, and export rules −3.',
  'Why did Vision move?':
    'Fourteen points are recorded as intentional evolution. Four points remain unexplained and need review.',
  'Who changed pricing?':
    'Ana and Carlos changed pricing on Aug 14. The recorded reason was enterprise packaging requirements.'
}

export function App() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [input, setInput] = useAtom(inputAtom)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [voiceState, setVoiceState] = useAtom(voiceStateAtom)
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
    const answer = answers[trimmed] ??
      'I can answer from Product Vision, Drift events, decisions, people, and linked evidence. This preview stays inside that structured context.'
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
        <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
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

      <section className="conversation" aria-label="LangDrift conversation">
        <div className="conversation-orb">
          <button
            aria-label={voiceState === 'idle' ? 'Start voice inquiry' : 'Stop listening'}
            onClick={() => {
              const next = voiceState === 'idle' ? 'listening' : 'idle'
              setVoiceState(next)
              setToast({
                message: next === 'listening' ? 'Listening for a product question' : 'Voice inquiry stopped',
                open: true
              })
            }}
            type="button"
          >
            <AgentOrb
              size="78px"
              speed={voiceState === 'listening' ? 1.15 : 0.55}
              state={voiceState === 'listening' ? 'listening' : 'idle'}
            />
          </button>
          <span>{voiceState === 'listening' ? 'Listening…' : 'Ask LangDrift'}</span>
        </div>

        <div className="message-list">
          {messages.map((message) => (
            <AIMessage key={message.id} role={message.role}>
              {message.text}
            </AIMessage>
          ))}
        </div>

        <div className="quick-prompts">
          {Object.keys(answers).map((question) => (
            <button key={question} onClick={() => ask(question)} type="button">
              {question}
            </button>
          ))}
        </div>

        <form className="composer" onSubmit={submit}>
          <label htmlFor="question">Ask about this product</label>
          <div>
            <input
              id="question"
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Why did Vision move?"
              value={input}
            />
            <button type="submit">Ask</button>
          </div>
        </form>
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
