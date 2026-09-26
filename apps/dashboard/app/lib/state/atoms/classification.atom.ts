'use client'

import { atomWithImmer } from 'jotai-immer'

import type { EvolutionClassification } from '@domain'

export const classificationAtom = atomWithImmer<EvolutionClassification>('all')
