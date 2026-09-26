import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import { Card, Kicker } from '@repo/react/ui/primitives'

afterEach(cleanup)

it('preserves the chosen card element and lets consumer classes override defaults', () => {
  render(
    <Card as="article" className="rounded-none border-0 bg-transparent p-4">
      Product vision
    </Card>
  )

  const card = screen.getByRole('article')

  expect(card.textContent).toBe('Product vision')
  expect(card.className.split(' ')).toEqual([
    'border-hairline',
    'rounded-none',
    'border-0',
    'bg-transparent',
    'p-4'
  ])
})

it('preserves kicker text semantics and independent size and color overrides', () => {
  render(<Kicker className="text-lg text-ink normal-case">Overview</Kicker>)

  const kicker = screen.getByText('Overview')

  expect(kicker.tagName).toBe('SPAN')
  expect(kicker.className.split(' ')).toEqual([
    'font-mono',
    'tracking-[0.08em]',
    'text-lg',
    'text-ink',
    'normal-case'
  ])
})
