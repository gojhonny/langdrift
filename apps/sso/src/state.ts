import { atom } from 'jotai'
import type { Atom, createStore } from 'jotai/vanilla'

export const themeAtom = atom<'dark' | 'light'>('light')
export const selectedPlanAtom = atom('executive')
export const signInAttemptsAtom = atom(0)
export const toastAtom = atom({ message: '', open: false })

const atoms: Record<string, Atom<unknown>> = {
  selectedPlanAtom,
  signInAttemptsAtom,
  themeAtom,
  toastAtom
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
      console.log('LangDrift atoms:', {
        atom: name,
        latest,
        previous,
        state: { ...Object.fromEntries(state), [name]: latest }
      })
      previous = latest
      state.set(name, latest)
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
