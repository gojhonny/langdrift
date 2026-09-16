import { atom } from 'jotai'
import type { Atom, createStore } from 'jotai/vanilla'

export type WebsiteTheme = 'dark' | 'light'

export interface WebsiteToast {
  message: string
  open: boolean
  tone: 'info' | 'success' | 'warning'
}

export const themeAtom = atom<WebsiteTheme>('light')
export const selectedPointAtom = atom(4)
export const toastAtom = atom<WebsiteToast>({
  message: '',
  open: false,
  tone: 'info'
})

export const websiteAtoms: Record<string, Atom<unknown>> = {
  selectedPointAtom,
  themeAtom,
  toastAtom
}

const initializedStores = new WeakSet<ReturnType<typeof createStore>>()

function snapshot(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snapshot)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        /token|password|secret/iu.test(key) ? '[redacted]' : snapshot(entry)
      ])
    )
  }
  return value
}

export function subscribeToWebsiteAtoms(
  store: ReturnType<typeof createStore>
) {
  const state = new Map<string, unknown>()
  const stops = Object.entries(websiteAtoms).map(([name, target]) => {
    let previous = store.get(target)
    state.set(name, snapshot(previous))

    return store.sub(target, () => {
      const next = store.get(target)
      if (Object.is(previous, next)) return
      const previousSnapshot = snapshot(previous)
      const nextSnapshot = snapshot(next)
      previous = next
      state.set(name, nextSnapshot)
      console.log('LangDrift atoms:', {
        atom: name,
        latest: nextSnapshot,
        previous: previousSnapshot,
        state: Object.fromEntries(state)
      })
    })
  })

  if (!initializedStores.has(store)) {
    initializedStores.add(store)
    console.log('LangDrift atoms:', {
      updates: 0,
      state: Object.fromEntries(state)
    })
  }

  return () => {
    for (const stop of stops) stop()
  }
}
