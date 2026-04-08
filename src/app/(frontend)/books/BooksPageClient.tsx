'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { useRef } from 'react'

import type { BookCommerceData } from '@/lib/bookCommerce/useBookCommerceActions'
import { useBookCommerceActions } from '@/lib/bookCommerce/useBookCommerceActions'
import { formatCartCurrency } from '@/lib/cart/cartMath'
import type { PublishedBookCardData } from '@/lib/getPublishedBooksData'

import styles from './page.module.css'

type BooksPageClientProps = {
  books: PublishedBookCardData[]
  bodyFontClassName: string
  displayFontClassName: string
}

type InteractionSource = 'keyboard' | 'pointer' | null

function toCommerceBookData(book: PublishedBookCardData): BookCommerceData {
  return {
    compareAtPrice: book.compareAtPrice,
    coverImageAlt: book.coverImage.alt,
    coverImageUrl: book.coverImage.url,
    id: book.id,
    price: book.price,
    slug: book.slug,
    title: book.title,
  }
}

export function BooksPageClient({
  books,
  bodyFontClassName,
  displayFontClassName,
}: BooksPageClientProps) {
  const { handleAddToCart, handleBuyNow, isActionPending } = useBookCommerceActions()
  const interactionSourceRef = useRef<InteractionSource>(null)

  const markPointerInteraction = (_event: PointerEvent<HTMLButtonElement>) => {
    interactionSourceRef.current = 'pointer'
  }

  const markKeyboardInteraction = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      interactionSourceRef.current = 'keyboard'
    }
  }

  const blurAfterPointerActivation = (button: HTMLButtonElement) => {
    if (interactionSourceRef.current === 'pointer') {
      button.blur()
    }

    interactionSourceRef.current = null
  }

  return (
    <div className={styles.grid}>
      {books.map((book) => {
        const commerceBook = toCommerceBookData(book)
        const canPurchase = book.price !== null
        const price = book.price === null ? null : formatCartCurrency(book.price)
        const compareAtPrice =
          book.compareAtPrice === null ? null : formatCartCurrency(book.compareAtPrice)
        const isCardPending = isActionPending(book.id)

        const renderActionButtons = (actionGroupClassName: string) => (
          <div className={actionGroupClassName}>
            <Link
              className={`${bodyFontClassName} ${styles.actionLink}`}
              href={`/detail/${book.slug}`}
            >
              Đọc thêm
            </Link>
            <button
              className={`${bodyFontClassName} ${styles.actionButton}`}
              disabled={!canPurchase || isCardPending}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                const didAdd = handleAddToCart(commerceBook)

                if (didAdd) {
                  blurAfterPointerActivation(event.currentTarget)
                } else {
                  interactionSourceRef.current = null
                }
              }}
              onKeyDown={markKeyboardInteraction}
              onPointerDown={markPointerInteraction}
              type="button"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              className={`${bodyFontClassName} ${styles.actionButton} ${styles.primaryActionButton}`}
              disabled={!canPurchase || isCardPending}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                handleBuyNow(commerceBook)
                interactionSourceRef.current = null
              }}
              onKeyDown={markKeyboardInteraction}
              onPointerDown={markPointerInteraction}
              type="button"
            >
              Mua ngay
            </button>
          </div>
        )

        return (
          <article className={styles.card} data-purchasable={canPurchase} key={book.id}>
            <div className={styles.imageWrap}>
              <Image
                alt={book.coverImage.alt}
                className={styles.image}
                height={book.coverImage.height}
                src={book.coverImage.url}
                unoptimized
                width={book.coverImage.width}
              />

              <div className={styles.overlay}>
                {renderActionButtons(styles.overlayActions)}
              </div>
            </div>

            {book.typeLabel && (
              <p className={`${bodyFontClassName} ${styles.typeLabel}`}>{book.typeLabel}</p>
            )}

            <h2 className={`${displayFontClassName} ${styles.title}`}>{book.title}</h2>
            <p className={`${bodyFontClassName} ${styles.author}`}>{book.authorName}</p>

            {(price || compareAtPrice) && (
              <div className={styles.priceRow}>
                {compareAtPrice && (
                  <p className={`${bodyFontClassName} ${styles.compareAtPrice}`}>
                    {compareAtPrice}
                  </p>
                )}
                {price && <p className={`${bodyFontClassName} ${styles.price}`}>{price}</p>}
              </div>
            )}

            {renderActionButtons(styles.actionRow)}
          </article>
        )
      })}
    </div>
  )
}
