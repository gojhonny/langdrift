'use client'

import { atom } from 'jotai'
import type { Atom, createStore } from 'jotai/vanilla'
import { atomWithImmer } from 'jotai-immer'

export type DashboardTheme = 'dark' | 'light'
export type EvolutionClassification =
  | 'all'
  | 'intentional'
  | 'review'
  | 'unexplained'
export type EvolutionGroup = 'event' | 'product-area' | 'team'
export type DashboardRange = '30d' | '90d' | '1y' | 'all'

export const accountMenuOpenAtom = atomWithImmer(false)
export const classificationAtom = atomWithImmer<EvolutionClassification>('all')
export const groupByAtom = atomWithImmer<EvolutionGroup>('event')
export const notificationsOpenAtom = atomWithImmer(false)
export const productMenuOpenAtom = atomWithImmer(false)
export const rangeAtom = atomWithImmer<DashboardRange>('90d')
export const selectedPointAtom = atomWithImmer(4)
export const selectedProductAtom = atomWithImmer('Atlas Home Hub')
export const themeAtom = atomWithImmer<DashboardTheme>('light')
export const voiceOpenAtom = atomWithImmer(false)

export const selectProductAtom = atom(null, (_get, set, product: string) => {
  set(selectedProductAtom, product)
  set(productMenuOpenAtom, false)
})

export const dashboardAtoms: Record<string, Atom<unknown>> = {
  accountMenuOpenAtom,
  classificationAtom,
  groupByAtom,
  notificationsOpenAtom,
  productMenuOpenAtom,
  rangeAtom,
  selectedPointAtom,
  selectedProductAtom,
  themeAtom,
  voiceOpenAtom
}

const initializedStores = new WeakSet<ReturnType<typeof createStore>>()

export function subscribeToDashboardAtoms(
  store: ReturnType<typeof createStore>
) {
  const state = new Map<string, unknown>()
  const stops = Object.entries(dashboardAtoms).map(([name, target]) => {
    let previous = store.get(target)
    state.set(name, previous)

    return store.sub(target, () => {
      const next = store.get(target)
      if (Object.is(previous, next)) return
      const previousSnapshot = previous
      previous = next
      state.set(name, next)
      console.log('LangDrift atoms:', {
        atom: name,
        latest: next,
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
