'use server'

import axios from 'axios'
import { earlyAccessServerEnv } from '../../env.server'
import type { EarlyAccessActionResult } from './form.types'
import { earlyAccessSubmissionSchema, getEmailError } from './form.validation'

export async function submitEarlyAccess(
  input: unknown
): Promise<EarlyAccessActionResult> {
  const parsed = earlyAccessSubmissionSchema.safeParse(input)
  if (!parsed.success) {
    const email =
      typeof input === 'object' && input !== null && 'email' in input
        ? input.email
        : undefined
    const error = getEmailError(email)
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      ...(error ? { fieldErrors: { email: error } } : {})
    }
  }
  try {
    const response = await axios.post(
      `${earlyAccessServerEnv.serviceUrl}/v1/emails`,
      parsed.data,
      {
        headers: {
          Authorization: `Bearer ${earlyAccessServerEnv.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 4000,
        maxRedirects: 0,
        maxBodyLength: 1024,
        maxContentLength: 4096,
        validateStatus: (status) => status === 202
      }
    )
    return response.status === 202
      ? { ok: true }
      : { ok: false, code: 'UNAVAILABLE' }
  } catch {
    return { ok: false, code: 'UNAVAILABLE' }
  }
}
