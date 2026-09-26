'use client'

import { ChatCenteredDots } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'

export interface FigmaCommentProps {
  label?: string
  author: string
  initials: string
  message: string
  onOpenChange?: (open: boolean) => void
  src?: string
  timestamp?: string
}

export function FigmaComment({
  label,
  author,
  initials,
  message,
  onOpenChange,
  src,
  timestamp = 'Just now'
}: FigmaCommentProps) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const commentId = useId()

  function toggle() {
    const next = !open
    setOpen(next)
    onOpenChange?.(next)
  }

  return (
    <span className="figma-comment">
      <button
        aria-label={label ?? `Comment from ${author}`}
        aria-controls={open ? commentId : undefined}
        aria-expanded={open}
        onClick={toggle}
        type="button"
      >
        <span className="figma-comment-avatar">
          {src ? <img alt="" aria-hidden="true" src={src} /> : initials}
        </span>
        <ChatCenteredDots aria-hidden="true" size={14} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.span
            animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
            className="figma-comment-card"
            id={commentId}
            exit={{
              filter: reduceMotion ? 'blur(0px)' : 'blur(3px)',
              opacity: 0,
              scale: reduceMotion ? 1 : 0.98
            }}
            initial={{
              filter: reduceMotion ? 'blur(0px)' : 'blur(6px)',
              opacity: 0,
              scale: reduceMotion ? 1 : 0.98
            }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <span className="figma-comment-meta">
              <strong>{author}</strong> {timestamp}
            </span>
            <span>{message}</span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
