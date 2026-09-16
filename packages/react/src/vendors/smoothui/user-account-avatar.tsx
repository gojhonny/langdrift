'use client'

import {
  CaretDown,
  Gear,
  SignOut,
  UserCircle
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export interface UserAccountAvatarProps {
  detail?: string
  initials: string
  name: string
  onAction?: (action: 'account' | 'settings' | 'signout') => void
}

export function UserAccountAvatar({
  detail,
  initials,
  name,
  onAction
}: UserAccountAvatarProps) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <span className="account-avatar-menu">
      <button
        aria-expanded={open}
        className="account-avatar-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="account-avatar-circle">{initials}</span>
        <span className="account-avatar-copy">
          <strong>{name}</strong>
          {detail ? <small>{detail}</small> : null}
        </span>
        <CaretDown aria-hidden="true" size={13} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.span
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="account-avatar-dropdown"
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, y: 4 }}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, y: 4 }}
          >
            <button onClick={() => onAction?.('account')} type="button">
              <UserCircle aria-hidden="true" size={16} /> Account
            </button>
            <button onClick={() => onAction?.('settings')} type="button">
              <Gear aria-hidden="true" size={16} /> Settings
            </button>
            <button onClick={() => onAction?.('signout')} type="button">
              <SignOut aria-hidden="true" size={16} /> Sign out
            </button>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
