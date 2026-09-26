'use client'

import { atomWithImmer } from 'jotai-immer'

import type { EvolutionGroup } from '@domain'

export const groupByAtom = atomWithImmer<EvolutionGroup>('event')
