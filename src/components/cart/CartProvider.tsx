'use client'

import React from 'react'

import { CART_COOKIE_NAME, expireCartCookieString, sanitizeCartCookie, serializeCartCookie } from '@/lib/cart/cartCookie'
import { getTotalAmount, getTotalQuantity } from '@/lib/cart/cartMath'
import type { CartCookie, CartCookieItem } from '@/lib/cart/cartTypes'

type CartProviderProps = {
  children: React.ReactNode
  initialCart: CartCookie
}

type CartContextValue = {
  addOrIncrement: (item: CartCookieItem, delta?: number) => void
  cart: CartCookie
  clearCart: () => void
  items: CartCookieItem[]
  removeItem: (bookId: string) => void
  setQuantity: (bookId: string, quantity: number) => void
  totalAmount: number
  totalQuantity: number
}

const CartContext = React.createContext<CartContextValue | null>(null)

const CART_COOKIE_MAX_AGE = 2592000

function buildCartCookieString(cart: CartCookie): string {
  return `${CART_COOKIE_NAME}=${serializeCartCookie(cart)}; path=/; samesite=lax; max-age=${CART_COOKIE_MAX_AGE}`
}

function normalizeDelta(delta: number | undefined): number {
  if (typeof delta !== 'number' || !Number.isFinite(delta)) {
    return 1
  }

  return Math.max(1, Math.trunc(delta))
}

export function CartProvider({ children, initialCart }: CartProviderProps) {
  const sanitizedInitialCart = sanitizeCartCookie(initialCart)
  const [cart, setCart] = React.useState<CartCookie>(sanitizedInitialCart)
  const cartRef = React.useRef<CartCookie>(sanitizedInitialCart)

  const commitCart = (nextCart: CartCookie) => {
    const sanitizedNextCart = sanitizeCartCookie(nextCart)

    cartRef.current = sanitizedNextCart
    setCart(sanitizedNextCart)
    document.cookie = buildCartCookieString(sanitizedNextCart)
  }

  const addOrIncrement = (item: CartCookieItem, delta?: number) => {
    const normalizedDelta = normalizeDelta(delta)
    const currentCart = cartRef.current
    const existingItem = currentCart.items.find((cartItem) => cartItem.bookId === item.bookId)

    if (existingItem) {
      commitCart({
        version: currentCart.version,
        items: currentCart.items.map((cartItem) =>
          cartItem.bookId === item.bookId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + normalizedDelta,
              }
            : cartItem,
        ),
      })

      return
    }

    commitCart({
      version: currentCart.version,
      items: [
        ...currentCart.items,
        {
          ...item,
          quantity: normalizedDelta,
        },
      ],
    })
  }

  const setQuantity = (bookId: string, quantity: number) => {
    if (!bookId.trim()) {
      return
    }

    const currentCart = cartRef.current

    commitCart({
      version: currentCart.version,
      items: currentCart.items.map((item) =>
        item.bookId === bookId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    })
  }

  const removeItem = (bookId: string) => {
    if (!bookId.trim()) {
      return
    }

    const currentCart = cartRef.current

    commitCart({
      version: currentCart.version,
      items: currentCart.items.filter((item) => item.bookId !== bookId),
    })
  }

  const clearCart = () => {
    const emptyCart = sanitizeCartCookie({
      items: [],
      version: 1,
    })

    cartRef.current = emptyCart
    setCart(emptyCart)
    document.cookie = expireCartCookieString()
  }

  const contextValue: CartContextValue = {
    addOrIncrement,
    cart,
    clearCart,
    items: cart.items,
    removeItem,
    setQuantity,
    totalAmount: getTotalAmount(cart.items),
    totalQuantity: getTotalQuantity(cart.items),
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.')
  }

  return context
}
