// AGENT: There's no need for 'use client' in atoms
'use client'

import { atomWithImmer } from 'jotai-immer'

import type { EvolutionGroup } from '@domain'

export const groupByAtom = atomWithImmer<EvolutionGroup>('event')
