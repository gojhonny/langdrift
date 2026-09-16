import { atom } from 'jotai'
import type { Atom, createStore } from 'jotai/vanilla'

export interface ConversationMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
}

export const themeAtom = atom<'dark' | 'light'>('light')
export const inputAtom = atom('')
export const voiceStateAtom = atom<'idle' | 'listening'>('idle')
export const messagesAtom = atom<ConversationMessage[]>([
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Product Vision is at 73%. Four points remain unexplained. Ask me what changed.'
  }
])
export const toastAtom = atom({ message: '', open: false })

const atoms: Record<string, Atom<unknown>> = {
  inputAtom,
  messagesAtom,
  themeAtom,
  toastAtom,
  voiceStateAtom
}

const initialized = new WeakSet<ReturnType<typeof createStore>>()

export function subscribeToAtoms(store: ReturnType<typeof createStore>) {
  const state = new Map<string, unknown>()
  const stops = Object.entries(atoms).map(([name, target]) => {
    let previous = store.get(target)
    state.set(name, previous)
    return store.sub(target, () => {
      const latest = store.get(target)
      if (Object.is(previous, latest)) return
      const safeLatest = name === 'inputAtom' ? `[${String(latest).length} chars]` : latest
      console.log('LangDrift atoms:', {
        atom: name,
        latest: safeLatest,
        previous: name === 'inputAtom' ? '[redacted input]' : previous,
        state: Object.fromEntries(state)
      })
      previous = latest
      state.set(name, safeLatest)
    })
  })

  if (!initialized.has(store)) {
    initialized.add(store)
    console.log('LangDrift atoms:', {
      updates: 0,
      state: Object.fromEntries(state)
    })
  }

  return () => {
    for (const stop of stops) stop()
  }
}
