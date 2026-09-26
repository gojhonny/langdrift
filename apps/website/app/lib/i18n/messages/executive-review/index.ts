import { enExecutiveReviewMessages } from './en'
import { jaExecutiveReviewMessages } from './ja'
import { ptBrExecutiveReviewMessages } from './pt-br'
import { zhHantExecutiveReviewMessages } from './zh-hant'

export const executiveReviewMessages = {
  en: enExecutiveReviewMessages,
  'pt-BR': ptBrExecutiveReviewMessages,
  'zh-Hant': zhHantExecutiveReviewMessages,
  ja: jaExecutiveReviewMessages
}

export type { ExecutiveReviewMessages } from '@lib/executive-review-data'
