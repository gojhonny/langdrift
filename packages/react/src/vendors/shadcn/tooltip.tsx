'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface TooltipProps {
  children: ReactNode
  content: ReactNode
}

export function Tooltip({ children, content }: TooltipProps) {
  const id = useId()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const dismissed = useRef(false)
  const mounted = useRef(true)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  function show() {
    if (!mounted.current) return
    clearTimeout(closeTimer.current)
    if (!dismissed.current) setOpen(true)
  }

  function hide() {
    if (!mounted.current) return
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
    dismissed.current = false
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(closeTimer.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    // Associate DOM controls without imposing extra props on fragments/custom children.
    const controls =
      triggerRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]'
      ) ?? []
    for (const control of controls) {
      const existing =
        control
          .getAttribute('aria-describedby')
          ?.split(/\s+/)
          .filter(Boolean) ?? []
      control.setAttribute(
        'aria-describedby',
        [...new Set([...existing, id])].join(' ')
      )
    }
    function positionTooltip() {
      const trigger = triggerRef.current?.getBoundingClientRect()
      const tooltip = tooltipRef.current?.getBoundingClientRect()
      if (!trigger || !tooltip) return
      setPosition({
        left: Math.max(
          8,
          Math.min(
            trigger.left + (trigger.width - tooltip.width) / 2,
            document.documentElement.clientWidth - tooltip.width - 8
          )
        ),
        top:
          trigger.bottom + tooltip.height + 8 <= window.innerHeight
            ? trigger.bottom + 8
            : Math.max(8, trigger.top - tooltip.height - 8)
      })
    }
    function dismiss(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dismissed.current = true
        setOpen(false)
      }
    }
    positionTooltip()
    window.addEventListener('resize', positionTooltip)
    window.addEventListener('scroll', positionTooltip, true)
    window.addEventListener('keydown', dismiss)
    return () => {
      for (const control of controls) {
        const remaining =
          control
            .getAttribute('aria-describedby')
            ?.split(/\s+/)
            .filter((value) => value && value !== id) ?? []
        if (remaining.length)
          control.setAttribute('aria-describedby', remaining.join(' '))
        else control.removeAttribute('aria-describedby')
      }
      window.removeEventListener('resize', positionTooltip)
      window.removeEventListener('scroll', positionTooltip, true)
      window.removeEventListener('keydown', dismiss)
    }
  }, [open, id])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: only bubbles hover/focus from the child's native interactive element.
    <span
      className="inline-flex"
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide()
      }}
    >
      {children}
      {open
        ? createPortal(
            <span
              className="fixed z-[120] max-w-[calc(100vw-16px)] rounded-md bg-[var(--ld-ink,#171717)] px-[9px] py-[7px] text-[11px] leading-tight break-words text-[var(--ld-surface,#fff)] shadow-sm motion-reduce:transition-none"
              id={id}
              onMouseEnter={show}
              onMouseLeave={hide}
              ref={tooltipRef}
              role="tooltip"
              style={position}
            >
              {content}
            </span>,
            triggerRef.current?.closest('dialog, header, main, aside, nav') ??
              document.body
          )
        : null}
    </span>
  )
}
