import type { ReactNode } from 'react'

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function Card({
  as: Tag = 'section',
  className,
  children
}: {
  as?: 'section' | 'article' | 'div'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag
      className={cx(
        'rounded-[10px] border border-hairline bg-surface',
        className
      )}
    >
      {children}
    </Tag>
  )
}

export function Kicker({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cx(
        'font-mono text-[8px] tracking-[0.08em] text-muted uppercase',
        className
      )}
    >
      {children}
    </span>
  )
}

export function Muted({
  as: Tag = 'span',
  className,
  children
}: {
  as?: 'span' | 'p' | 'small' | 'time'
  className?: string
  children: ReactNode
}) {
  return <Tag className={cx('text-muted', className)}>{children}</Tag>
}
