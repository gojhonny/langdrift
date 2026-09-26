import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within
} from '@testing-library/react'
import { createStore, Provider } from 'jotai'
import { NextIntlClientProvider } from 'next-intl'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { themeAtom } from '@atoms'
import { DashboardShell } from '@components'
import { getViewMessages } from '@i18n/messages'
import { routeStateMessages } from '@i18n/route-state.messages'
import { shellMessages } from '@i18n/shell.messages'
import EvolutionPage from '@menu/evolution/page'

const route = vi.hoisted(() => ({ pathname: '/overview' }))
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }))
vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: a jsdom-only replacement for Next Image.
  default: (props: ComponentProps<'img'>) => <img alt="" {...props} />
}))
vi.mock('next/link', () => ({
  default: (props: ComponentProps<'a'>) => <a {...props} />
}))
vi.mock('@repo/react/ui/agent-orb', () => ({ AgentOrb: () => <span /> }))

function TestIntlProvider({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider
      locale="en"
      timeZone="UTC"
      messages={{
        shell: shellMessages.en,
        view: getViewMessages('en'),
        routeState: routeStateMessages.en
      }}
    >
      {children}
    </NextIntlClientProvider>
  )
}

beforeEach(() => {
  route.pathname = '/overview'
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  )
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
    new DOMRect(0, 0, 32, 32)
  ] as unknown as DOMRectList)
  // jsdom does not implement the native dialog API; actual modality is checked in Chromium.
  Object.defineProperties(HTMLDialogElement.prototype, {
    close: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.removeAttribute('open')
      }
    },
    show: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.setAttribute('open', '')
      }
    },
    showModal: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.setAttribute('open', '')
        this.setAttribute('aria-modal', 'true')
      }
    }
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function mount() {
  const store = createStore()
  const tree = () => (
    <Provider store={store}>
      <DashboardShell>
        <h1>Overview</h1>
      </DashboardShell>
    </Provider>
  )
  return { store, tree, ...render(tree(), { wrapper: TestIntlProvider }) }
}

describe('Dashboard accessibility and voice lifecycle', () => {
  it('provides a content landmark, skip link and current navigation', () => {
    mount()
    expect(screen.getByRole('main').id).toBe('dashboard-content')
    expect(
      screen
        .getByRole('link', { name: 'Skip to main content' })
        .getAttribute('href')
    ).toBe('#dashboard-content')
    expect(
      screen
        .getByRole('link', { name: 'Overview' })
        .getAttribute('aria-current')
    ).toBe('page')
  })

  it('contains navigation focus, dismisses and restores the trigger', () => {
    mount()
    const trigger = screen.getByRole('button', { name: 'Open navigation' })
    trigger.focus()
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Mobile navigation' })
    const close = within(dialog).getByRole('button', {
      name: 'Close navigation'
    })
    expect(document.activeElement).toBe(close)
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(
      within(dialog).getByRole('link', { name: 'Settings' })
    )
    fireEvent.keyDown(within(dialog).getByRole('link', { name: 'Settings' }), {
      key: 'Tab'
    })
    expect(document.activeElement).toBe(close)
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps desktop voice nonmodal and supports Escape outside the panel', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaQueryList)
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Ask LangDrift' }))
    const dialog = screen.getByRole('dialog', { name: 'Ask LangDrift' })
    expect(dialog.getAttribute('aria-modal')).not.toBe('true')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('cancels replaced responses, closed-panel work and unmounted timers', () => {
    vi.useFakeTimers()
    const { unmount } = mount()
    fireEvent.click(screen.getByRole('button', { name: 'Ask LangDrift' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Why did Product Vision fall?' })
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'What changed this week?' })
    )
    act(() => {
      vi.advanceTimersByTime(260)
    })
    expect(
      screen.getByText(/Authentication was the largest contributor/)
    ).toBeTruthy()
    expect(screen.queryByText(/Product Vision moved from 91%/)).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: 'Which changes are unexplained?' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close voice' }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(vi.getTimerCount()).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: 'Ask LangDrift' }))
    expect(
      screen.queryByText(/Authentication is currently classified/)
    ).toBeNull()
    const schedule = vi.spyOn(window, 'setTimeout')
    fireEvent.click(
      screen.getByRole('button', { name: 'What changed this week?' })
    )
    const responseTimer = schedule.mock.results.at(-1)?.value
    const clear = vi.spyOn(window, 'clearTimeout')
    unmount()
    expect(clear).toHaveBeenCalledWith(responseTimer)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('preserves shared state and closes transient UI on route changes', () => {
    const { store, rerender, tree } = mount()
    act(() => store.set(themeAtom, 'dark'))
    fireEvent.click(screen.getByRole('button', { name: 'Open account menu' }))
    route.pathname = '/settings'
    rerender(tree())
    expect(store.get(themeAtom)).toBe('dark')
    expect(
      screen
        .getByRole('button', { name: 'Open account menu' })
        .getAttribute('aria-expanded')
    ).toBe('false')
    expect(document.activeElement).toBe(screen.getByRole('main'))
  })

  it('exposes filter selections to assistive technology', () => {
    vi.useFakeTimers()
    render(
      <Provider>
        <EvolutionPage />
      </Provider>,
      { wrapper: TestIntlProvider }
    )
    act(() => vi.advanceTimersByTime(1000))
    const classification = screen.getByRole('group', { name: 'Classification' })
    const unexplained = within(classification).getByRole('button', {
      name: 'Unexplained'
    })
    fireEvent.click(unexplained)
    expect(unexplained.getAttribute('aria-pressed')).toBe('true')
    const team = screen.getByRole('button', { name: 'Team' })
    fireEvent.click(team)
    expect(team.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: '30d' }))
    expect(
      screen.getByRole('button', { name: '30d' }).getAttribute('aria-pressed')
    ).toBe('true')
  })
})
