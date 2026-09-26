import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { shellMessages } from '@i18n/shell.messages'

import { setDashboardLocale } from './actions'
import { dashboardLocaleCookie } from './config'
import { DashboardLanguageSettings } from './language-settings'
import requestConfig from './request'

const cookieStore = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }))
const readCookies = vi.hoisted(() => vi.fn())

vi.mock('next/headers', () => ({ cookies: readCookies }))
vi.mock('next-intl/server', () => ({
  getRequestConfig: (configure: unknown) => configure
}))
vi.mock('./actions', async (importOriginal) => {
  const original = await importOriginal<typeof import('./actions')>()
  return { setDashboardLocale: vi.fn(original.setDashboardLocale) }
})

const originalActions =
  await vi.importActual<typeof import('./actions')>('./actions')

beforeEach(() => {
  cookieStore.get.mockReset()
  cookieStore.set.mockReset()
  readCookies.mockReset().mockResolvedValue(cookieStore)
  vi.mocked(setDashboardLocale)
    .mockReset()
    .mockImplementation(originalActions.setDashboardLocale)
})

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

function settings(locale: 'en' | 'pt-BR' = 'en') {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{ shell: shellMessages[locale] }}
      timeZone="UTC"
    >
      <DashboardLanguageSettings />
    </NextIntlClientProvider>
  )
}

describe('Dashboard locale preferences', () => {
  it.each([
    { cookie: undefined, expected: 'en' },
    { cookie: 'unsupported-locale', expected: 'en' },
    { cookie: 'pt-BR', expected: 'pt-BR' }
  ])('uses $expected for cookie $cookie', async ({ cookie, expected }) => {
    cookieStore.get.mockReturnValue(
      cookie === undefined ? undefined : { value: cookie }
    )
    const configuration = await requestConfig({
      requestLocale: Promise.resolve(undefined)
    })
    expect(configuration.locale).toBe(expected)
    expect(cookieStore.get).toHaveBeenCalledWith(dashboardLocaleCookie)
  })

  it('rejects an unsupported locale without opening or writing a cookie store', async () => {
    await expect(setDashboardLocale('fr')).resolves.toEqual({ ok: false })
    expect(readCookies).not.toHaveBeenCalled()
    expect(cookieStore.set).not.toHaveBeenCalled()
  })

  it('stores a valid locale as a scoped, HTTP-only production preference', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    await expect(setDashboardLocale('ja')).resolves.toEqual({ ok: true })
    expect(cookieStore.set).toHaveBeenCalledWith(dashboardLocaleCookie, 'ja', {
      path: '/',
      maxAge: 31_536_000,
      sameSite: 'lax',
      httpOnly: true,
      secure: true
    })
  })

  it('exposes all four language choices and does not resubmit the selected language', () => {
    render(settings('pt-BR'))
    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'English' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '繁體中文' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '日本語' })).toBeTruthy()
    const current = screen.getByRole('button', { name: 'Português (Brasil)' })
    expect(current.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(current)
    expect(setDashboardLocale).not.toHaveBeenCalled()
  })

  it('disables choices while saving and allows retry after a rejected change', async () => {
    let finish: (result: { ok: boolean }) => void = () => {}
    vi.mocked(setDashboardLocale).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        })
    )
    render(settings())
    fireEvent.click(screen.getByRole('button', { name: 'Português (Brasil)' }))
    expect(setDashboardLocale).toHaveBeenCalledWith('pt-BR')
    expect(screen.getByText(shellMessages.en.savingLanguage)).toBeTruthy()
    for (const choice of screen.getAllByRole('button')) {
      expect(choice.hasAttribute('disabled')).toBe(true)
    }

    await act(async () => {
      finish({ ok: false })
    })
    expect(screen.getByRole('alert').textContent).toBe(
      shellMessages.en.languageError
    )
    for (const choice of screen.getAllByRole('button')) {
      expect(choice.hasAttribute('disabled')).toBe(false)
    }

    vi.mocked(setDashboardLocale).mockResolvedValueOnce({ ok: true })
    fireEvent.click(screen.getByRole('button', { name: '日本語' }))
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
    expect(setDashboardLocale).toHaveBeenLastCalledWith('ja')
  })

  it('announces a failed request without changing the selected language', async () => {
    vi.mocked(setDashboardLocale).mockRejectedValueOnce(new Error('Offline'))
    render(settings())
    fireEvent.click(screen.getByRole('button', { name: '日本語' }))
    expect((await screen.findByRole('alert')).textContent).toBe(
      shellMessages.en.languageError
    )
    expect(
      screen
        .getByRole('button', { name: 'English' })
        .getAttribute('aria-pressed')
    ).toBe('true')
  })
})
