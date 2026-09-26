import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SkeletonLoader } from './skeleton-loader'

afterEach(cleanup)

describe('SkeletonLoader', () => {
  it('keeps loading blocks decorative and disables animation for reduced motion', () => {
    const result = render(<SkeletonLoader className="h-6 w-20" />)
    const block = result.container.firstElementChild
    expect(block?.getAttribute('aria-hidden')).toBe('true')
    expect(block?.className).toContain('motion-reduce:animate-none')
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('keeps wrapped content inert while loading and exposes it when ready', () => {
    const result = render(
      <SkeletonLoader>
        <button type="button">Open details</button>
      </SkeletonLoader>
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(result.container.querySelector('[inert]')).not.toBeNull()
    result.rerender(
      <SkeletonLoader loading={false}>
        <button type="button">Open details</button>
      </SkeletonLoader>
    )
    expect(screen.getByRole('button', { name: 'Open details' })).toBeTruthy()
    expect(result.container.querySelector('[inert]')).toBeNull()
  })
})
