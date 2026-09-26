import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Tooltip } from './tooltip'
import { FigmaComment } from '@repo/react/vendors/smoothui'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('shared accessible disclosures', () => {
  it('supports fragment children and preserves an existing description', () => {
    render(
      <Tooltip content="Account">
        <>
          <button aria-describedby="profile-description" type="button">
            Profile
          </button>
          <span id="profile-description">Signed in</span>
        </>
      </Tooltip>
    )
    const trigger = screen.getByRole('button')
    fireEvent.focus(trigger)
    expect(trigger.getAttribute('aria-describedby')).toContain(
      screen.getByRole('tooltip').id
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(trigger.getAttribute('aria-describedby')).toBe('profile-description')
  })
  it('names comments and associates the expanded content', () => {
    render(<FigmaComment author="Ana" initials="AN" message="Under review" />)
    const trigger = screen.getByRole('button', { name: 'Comment from Ana' })
    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(
      document.getElementById(trigger.getAttribute('aria-controls') ?? '')
        ?.textContent
    ).toContain('Under review')
  })

  it('describes focused controls and dismisses on Escape', () => {
    render(
      <Tooltip content="Account">
        <button type="button">Profile</button>
      </Tooltip>
    )
    const trigger = screen.getByRole('button')
    fireEvent.focus(trigger)
    expect(trigger.getAttribute('aria-describedby')).toBe(
      screen.getByRole('tooltip').id
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('stays hoverable and cleans up delayed closure on unmount', () => {
    vi.useFakeTimers()
    const { unmount } = render(
      <Tooltip content="Account">
        <button type="button">Profile</button>
      </Tooltip>
    )
    const wrapper = screen.getByRole('button').parentElement
    if (!wrapper) throw new Error('Expected tooltip trigger wrapper')
    fireEvent.mouseEnter(wrapper)
    const tooltip = screen.getByRole('tooltip')
    fireEvent.mouseLeave(wrapper)
    fireEvent.mouseEnter(tooltip)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByRole('tooltip')).toBeTruthy()
    fireEvent.mouseLeave(tooltip)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('clamps a right-edge tooltip inside the viewport', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return this.getAttribute('role') === 'tooltip'
          ? new DOMRect(0, 0, 90, 25)
          : new DOMRect(290, 0, 30, 30)
      }
    )
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(
      320
    )
    render(
      <Tooltip content="Account">
        <button type="button">Profile</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByRole('button'))
    expect(screen.getByRole('tooltip').style.left).toBe('222px')
  })
})
