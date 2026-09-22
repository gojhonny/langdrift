import { z } from 'zod'
import type { EmailErrorCode } from './form.types'

export const earlyAccessEmailSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'emailRequired' : 'emailInvalid'
  })
  .trim()
  .min(1, { error: 'emailRequired' })
  .max(254, { error: 'emailTooLong' })
  .pipe(z.email({ error: 'emailInvalid' }))

export const earlyAccessFormSchema = z.object({
  email: earlyAccessEmailSchema
})

export type EarlyAccessFormData = z.output<typeof earlyAccessFormSchema>

export function getEmailError(email: unknown): EmailErrorCode | null {
  const result = earlyAccessEmailSchema.safeParse(email)
  if (result.success) return null

  switch (result.error.issues[0]?.message) {
    case 'emailRequired':
      return 'emailRequired'
    case 'emailTooLong':
      return 'emailTooLong'
    default:
      return 'emailInvalid'
  }
}

export const earlyAccessSubmissionSchema = earlyAccessFormSchema
  .extend({
    locale: z.enum(['en', 'pt-BR', 'zh-Hant', 'ja']),
    source: z.enum(['landing', 'pricing']),
    turnstileToken: z.string().min(1).max(2048)
  })
  .strict()
