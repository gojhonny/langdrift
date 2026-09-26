import type { WebsiteLocale } from '@i18n/routing'
import type { VisionLoopMessages } from '@lib/vision-loop-content'

import { enVisionLoopMessages } from './en'
import { jaVisionLoopMessages } from './ja'
import { ptBrVisionLoopMessages } from './pt-br'
import { zhHantVisionLoopMessages } from './zh-hant'

// Selected on the server; only this locale's interactive copy crosses to the client.
export const visionLoopMessages: Record<WebsiteLocale, VisionLoopMessages> = {
  en: enVisionLoopMessages,
  'pt-BR': ptBrVisionLoopMessages,
  'zh-Hant': zhHantVisionLoopMessages,
  ja: jaVisionLoopMessages
}
