import { atom } from 'jotai'
import type { Atom, createStore } from 'jotai/vanilla'

export const themeAtom = atom<'dark' | 'light'>('light')
export const selectedPlanAtom = atom('plan-01')
export const signInAttemptsAtom = atom(0)
export const accountEmailAtom = atom('')
export const organizationNameAtom = atom('')
export const setupStepAtom = atom<'account' | 'organization' | 'plan' | 'product' | 'setup'>('account')
export const toastAtom = atom({ message: '', open: false })

const atoms: Record<string, Atom<unknown>> = {
  accountEmailAtom,
  organizationNameAtom,
  selectedPlanAtom,
  setupStepAtom,
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
      const safeLatest = name === 'accountEmailAtom' ? '[redacted identity]' : latest
      const safePrevious = name === 'accountEmailAtom' ? '[redacted identity]' : previous
      console.log('LangDrift atoms:', {
        atom: name,
        latest: safeLatest,
        previous: safePrevious,
        state: { ...Object.fromEntries(state), [name]: safeLatest }
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
