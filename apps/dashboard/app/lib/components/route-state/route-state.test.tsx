import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routeStateMessages } from '@i18n/route-state.messages'

import { DashboardNotFound } from './dashboard-not-found'
import { DashboardPageGate } from './dashboard-page-gate'
import { DashboardPageSkeleton } from './dashboard-page-skeleton'
import { DashboardRouteError } from './dashboard-route-error'

const navigation = vi.hoisted(() => ({ pathname: '/overview' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname
}))

function WithMessages({
  children,
  locale = 'en'
}: {
  children: ReactNode
  locale?: keyof typeof routeStateMessages
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{ routeState: routeStateMessages[locale] }}
      timeZone="UTC"
    >
      {children}
    </NextIntlClientProvider>
  )
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  navigation.pathname = '/overview'
})

describe('Dashboard route states', () => {
  it('shows one named skeleton for one second, then exposes the page', () => {
    vi.useFakeTimers()
    render(
      <WithMessages>
        <DashboardPageGate section="overview">
          <button type="button">Loaded control</button>
        </DashboardPageGate>
      </WithMessages>
    )

    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(
      screen.getByRole('status', { name: 'Loading Overview' })
    ).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
    act(() => vi.advanceTimersByTime(999))
    expect(screen.queryByRole('button')).toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByRole('button', { name: 'Loaded control' })).toBeTruthy()
  })

  it('restarts on a new pathname with the same section and cancels on unmount', () => {
    vi.useFakeTimers()
    navigation.pathname = '/intentional-drift'
    const page = (
      <WithMessages>
        <DashboardPageGate section="evolution">
          <p>Evolution content</p>
        </DashboardPageGate>
      </WithMessages>
    )
    const result = render(page)
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('Evolution content')).toBeTruthy()

    navigation.pathname = '/unexplained-drift'
    result.rerender(
      <WithMessages>
        <DashboardPageGate section="evolution">
          <p>Evolution content</p>
        </DashboardPageGate>
      </WithMessages>
    )
    expect(
      screen.getByRole('status', { name: 'Loading Evolution' })
    ).toBeTruthy()
    expect(screen.queryByText('Evolution content')).toBeNull()
    expect(vi.getTimerCount()).toBe(1)
    result.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('keeps completed content visible through a locale refresh', () => {
    vi.useFakeTimers()
    const result = render(
      <WithMessages>
        <DashboardPageGate section="settings">
          <p>Settings content</p>
        </DashboardPageGate>
      </WithMessages>
    )
    act(() => vi.advanceTimersByTime(1000))
    result.rerender(
      <WithMessages locale="pt-BR">
        <DashboardPageGate section="settings">
          <p>Configurações</p>
        </DashboardPageGate>
      </WithMessages>
    )
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByText('Configurações')).toBeTruthy()
  })

  it('localizes loading and not-found recovery text', () => {
    const result = render(
      <WithMessages locale="pt-BR">
        <DashboardPageSkeleton section="settings" />
      </WithMessages>
    )
    expect(
      screen.getByRole('status', { name: 'Carregando Configurações' })
    ).toBeTruthy()
    result.rerender(
      <WithMessages locale="ja">
        <DashboardNotFound />
      </WithMessages>
    )
    expect(
      screen.getByRole('heading', { name: 'ページが見つかりません' })
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: '概要に戻る' }).getAttribute('href')
    ).toBe('/overview')
  })

  it('provides a generic, localized alert and retries only when activated', () => {
    const retry = vi.fn()
    render(
      <WithMessages locale="zh-Hant">
        <DashboardRouteError retry={retry} />
      </WithMessages>
    )
    expect(screen.getByRole('alert').textContent).toContain('無法載入此頁面')
    expect(retry).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '再試一次' }))
    expect(retry).toHaveBeenCalledOnce()
  })
})
