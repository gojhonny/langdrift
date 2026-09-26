// Text tones are deliberately distinct from the canonical graphic/brand colors.
export const classificationText = {
  baseline: 'text-[var(--ld-muted,#71717a)]',
  intentional:
    'text-blue-700 [&:where([data-theme=dark],[data-theme=dark]_*)]:text-blue-400',
  review:
    'text-purple-700 [&:where([data-theme=dark],[data-theme=dark]_*)]:text-purple-400',
  unexplained:
    'text-red-700 [&:where([data-theme=dark],[data-theme=dark]_*)]:text-red-400'
} as const
