import { en } from './en'
import { ja } from './ja'
import { ptBR } from './pt-br'
import { zhHant } from './zh-hant'

export function getViewMessages(locale: string) {
  if (locale === 'pt-BR') return ptBR
  if (locale === 'zh-Hant') return zhHant
  if (locale === 'ja') return ja
  return en
}
