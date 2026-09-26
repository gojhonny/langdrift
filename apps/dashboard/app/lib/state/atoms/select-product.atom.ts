'use client'

import { atom } from 'jotai'

import { productMenuOpenAtom } from './product-menu-open.atom'
import { selectedProductAtom } from './selected-product.atom'

export const selectProductAtom = atom(null, (_get, set, product: string) => {
  set(selectedProductAtom, product)
  set(productMenuOpenAtom, false)
})
