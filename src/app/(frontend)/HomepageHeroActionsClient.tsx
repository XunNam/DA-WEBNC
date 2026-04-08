'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'

import type { BookCommerceData } from '@/lib/bookCommerce/useBookCommerceActions'
import { useBookCommerceActions } from '@/lib/bookCommerce/useBookCommerceActions'

import styles from './page.module.css'

type HomepageHeroActionsClientProps = {
  bodyFontClassName: string
  book: BookCommerceData
}

export function HomepageHeroActionsClient({
  bodyFontClassName,
  book,
}: HomepageHeroActionsClientProps) {
  const { handleBuyNow, isActionPending } = useBookCommerceActions()
  const canPurchase = book.price !== null
  const isPending = isActionPending(book.id)

  return (
    <div className={styles.heroActions}>
      <button
        className={`${bodyFontClassName} ${styles.primaryAction} ${styles.heroActionButton}`}
        disabled={!canPurchase || isPending}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.preventDefault()
          handleBuyNow(book)
        }}
        type="button"
      >
        Mua ngay
      </button>

      <Link
        className={`${bodyFontClassName} ${styles.secondaryAction}`}
        href={`/detail/${book.slug}`}
      >
        Đọc thêm
      </Link>
    </div>
  )
}
