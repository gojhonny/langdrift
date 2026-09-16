'use client'

import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export type ToastTone = 'info' | 'success' | 'warning'

export interface BasicToastProps {
  message: string
  onClose: () => void
  open: boolean
  tone?: ToastTone
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: WarningCircle
}

export function BasicToast({
  message,
  onClose,
  open,
  tone = 'info'
}: BasicToastProps) {
  const reduceMotion = useReducedMotion()
  const Icon = icons[tone]

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={`smooth-toast smooth-toast-${tone}`}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          role="status"
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <Icon aria-hidden="true" size={18} weight="duotone" />
          <span>{message}</span>
          <button aria-label="Dismiss notification" onClick={onClose} type="button">
            <X aria-hidden="true" size={14} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
