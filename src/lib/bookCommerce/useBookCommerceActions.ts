'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { useCart } from '@/components/cart/CartProvider'
import { startRouteLoadingIndicator } from '@/components/site-shell/RouteLoadingIndicator'
import type { CartCookieItem } from '@/lib/cart/cartTypes'

export type BookCommerceData = {
  compareAtPrice: number | null
  coverImageAlt: string
  coverImageUrl: string
  id: string
  price: number | null
  slug: string
  title: string
}

type PendingAction = `${string}:add` | `${string}:buy` | null

function normalizeBookToCartItem(book: BookCommerceData): CartCookieItem | null {
  if (book.price === null) {
    return null
  }

  return {
    bookId: book.id,
    slug: book.slug,
    title: book.title,
    price: book.price,
    compareAtPrice: book.compareAtPrice,
    coverImageUrl: book.coverImageUrl,
    coverImageAlt: book.coverImageAlt,
    quantity: 1,
  }
}

function getPendingActionKey(bookId: string, action: 'add' | 'buy'): PendingAction {
  return `${bookId}:${action}`
}

export function useBookCommerceActions() {
  const router = useRouter()
  const { addOrIncrement } = useCart()
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const pendingActionRef = useRef<PendingAction>(null)

  const commitPendingAction = (nextPendingAction: PendingAction) => {
    pendingActionRef.current = nextPendingAction
    setPendingAction(nextPendingAction)
  }

  const handleAddToCart = (book: BookCommerceData) => {
    const cartItem = normalizeBookToCartItem(book)
    const pendingKey = getPendingActionKey(book.id, 'add')

    if (!cartItem || pendingActionRef.current?.startsWith(`${book.id}:`)) {
      return false
    }

    commitPendingAction(pendingKey)
    addOrIncrement(cartItem, 1)
    commitPendingAction(null)
    return true
  }

  const handleBuyNow = (book: BookCommerceData) => {
    const cartItem = normalizeBookToCartItem(book)
    const pendingKey = getPendingActionKey(book.id, 'buy')

    if (!cartItem || pendingActionRef.current?.startsWith(`${book.id}:`)) {
      return false
    }

    commitPendingAction(pendingKey)
    addOrIncrement(cartItem, 1)
    startRouteLoadingIndicator()
    router.push('/purchase')
    return true
  }

  const isActionPending = (bookId: string) => pendingAction?.startsWith(`${bookId}:`) ?? false

  return {
    handleAddToCart,
    handleBuyNow,
    isActionPending,
  }
}
