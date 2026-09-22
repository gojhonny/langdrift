// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/script', () => ({
  default: ({ onReady }: { onReady: () => void }) => {
    queueMicrotask(onReady)
    return null
  }
}))
vi.mock('./form.action', () => ({ submitEarlyAccess: vi.fn() }))
vi.mock('../../env', () => ({
  websiteEnv: {
    docsUrl: 'http://localhost:3004',
    ssoUrl: 'http://localhost:3002',
    turnstileSiteKey: '1x00000000000000000000AA'
  }
}))

import { earlyAccessMessages } from '../../messages/early-access'
import { submitEarlyAccess } from './form.action'
import { EarlyAccessForm } from './form'
import { EarlyAccessSection } from './section'

beforeEach(() => {
  vi.clearAllMocks()
  window.turnstile = {
    render: vi.fn((_element, options) => {
      options.callback('challenge-token')
      return 'widget-id'
    }),
    reset: vi.fn()
  }
})
afterEach(cleanup)

describe('early access form', () => {
  it('submits a local email with its challenge token and clears on acceptance', async () => {
    vi.mocked(submitEarlyAccess).mockResolvedValue({ ok: true })
    render(
      <EarlyAccessForm
        copy={earlyAccessMessages.en}
        helperId="helper"
        locale="en"
        source="landing"
      />
    )
    await waitFor(() => expect(window.turnstile?.render).toBeDefined())
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'a@example.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: /join early access/i }))
    await waitFor(() =>
      expect(submitEarlyAccess).toHaveBeenCalledWith({
        email: 'a@example.com',
        locale: 'en',
        source: 'landing',
        turnstileToken: 'challenge-token'
      })
    )
    await waitFor(() =>
      expect(screen.getByText(earlyAccessMessages.en.success)).toBeTruthy()
    )
    expect(
      (screen.getByLabelText('Email address') as HTMLInputElement).value
    ).toBe('')
  })

  it('does not submit without a challenge', async () => {
    window.turnstile = undefined
    render(
      <EarlyAccessForm
        copy={earlyAccessMessages.en}
        helperId="helper"
        locale="en"
        source="landing"
      />
    )
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'a@example.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: /join early access/i }))
    expect(
      screen.getByText(earlyAccessMessages.en.challengeFailed)
    ).toBeTruthy()
    expect(submitEarlyAccess).not.toHaveBeenCalled()
  })

  it('validates on blur and keeps invalid email out of the Server Function', async () => {
    render(
      <EarlyAccessForm
        copy={earlyAccessMessages.en}
        helperId="helper"
        locale="en"
        source="landing"
      />
    )
    const email = screen.getByLabelText('Email address')
    fireEvent.change(email, { target: { value: 'invalid' } })
    fireEvent.blur(email)
    expect(
      screen.getByText(earlyAccessMessages.en.errors.emailInvalid)
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /join early access/i }))
    expect(submitEarlyAccess).not.toHaveBeenCalled()
  })

  it('shows challenge failure and resets the spent widget', async () => {
    vi.mocked(submitEarlyAccess).mockResolvedValue({
      ok: false,
      code: 'CHALLENGE_FAILED'
    })
    render(
      <EarlyAccessForm
        copy={earlyAccessMessages.en}
        helperId="helper"
        locale="en"
        source="landing"
      />
    )
    await waitFor(() => expect(window.turnstile?.render).toBeDefined())
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'a@example.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: /join early access/i }))
    await waitFor(() =>
      expect(
        screen.getByText(earlyAccessMessages.en.challengeFailed)
      ).toBeTruthy()
    )
    expect(window.turnstile?.reset).toHaveBeenCalledWith('widget-id')
  })

  it('renders the pricing form with its own source', () => {
    render(<EarlyAccessSection locale="pt-BR" source="pricing" compact />)
    expect(
      screen.getByText(earlyAccessMessages['pt-BR'].pricingHeading)
    ).toBeTruthy()
  })

  it('shows an accessible retry message after a broker failure', async () => {
    vi.mocked(submitEarlyAccess).mockResolvedValue({
      ok: false,
      code: 'UNAVAILABLE'
    })
    render(<EarlyAccessSection locale="en" source="landing" />)
    await waitFor(() => expect(window.turnstile?.render).toHaveBeenCalled())
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'a@example.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: /join early access/i }))
    await waitFor(() =>
      expect(screen.getByText(earlyAccessMessages.en.unavailable)).toBeTruthy()
    )
    expect(screen.getByText(earlyAccessMessages.en.homeHeading)).toBeTruthy()
  })
})
