'use client'

import type { MouseEvent } from 'react'

import type { BookCommerceData } from '@/lib/bookCommerce/useBookCommerceActions'
import { useBookCommerceActions } from '@/lib/bookCommerce/useBookCommerceActions'

import styles from './page.module.css'

type BookDetailActionRowProps = {
  bodyFontClassName: string
  book: BookCommerceData
}

export function BookDetailActionRow({ bodyFontClassName, book }: BookDetailActionRowProps) {
  const { handleAddToCart, handleBuyNow, isActionPending } = useBookCommerceActions()
  const canPurchase = book.price !== null
  const isPending = isActionPending(book.id)

  return (
    <div className={styles.actionRow}>
      <button
        className={`${bodyFontClassName} ${styles.actionButton}`}
        disabled={!canPurchase || isPending}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.preventDefault()
          handleAddToCart(book)
        }}
        type="button"
      >
        Thêm vào giỏ hàng
      </button>

      <button
        className={`${bodyFontClassName} ${styles.actionButton} ${styles.primaryActionButton}`}
        disabled={!canPurchase || isPending}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.preventDefault()
          handleBuyNow(book)
        }}
        type="button"
      >
        Mua sách
      </button>
    </div>
  )
}
