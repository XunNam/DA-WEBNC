'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { useRef } from 'react'

import type { BookCommerceData } from '@/lib/bookCommerce/useBookCommerceActions'
import { useBookCommerceActions } from '@/lib/bookCommerce/useBookCommerceActions'
import { formatCartCurrency } from '@/lib/cart/cartMath'
import type { HomepageBookData } from '@/lib/getPublishedHomepageData'

import styles from './page.module.css'

type HomepageBestSellersClientProps = {
  bodyFontClassName: string
  books: HomepageBookData[]
  displayFontClassName: string
}

type InteractionSource = 'keyboard' | 'pointer' | null

function toCommerceBookData(book: HomepageBookData): BookCommerceData {
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

export function HomepageBestSellersClient({
  bodyFontClassName,
  books,
  displayFontClassName,
}: HomepageBestSellersClientProps) {
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
    <div className={styles.bookGrid}>
      {books.map((book) => {
        const commerceBook = toCommerceBookData(book)
        const canPurchase = book.price !== null
        const isCardPending = isActionPending(book.id)
        const price = book.price === null ? null : formatCartCurrency(book.price)
        const compareAtPrice =
          book.compareAtPrice === null ? null : formatCartCurrency(book.compareAtPrice)

        const renderActionButtons = (actionGroupClassName: string) => (
          <div className={actionGroupClassName}>
            <Link
              className={`${bodyFontClassName} ${styles.bookActionLink}`}
              href={`/detail/${book.slug}`}
            >
              Đọc thêm
            </Link>

            <button
              className={`${bodyFontClassName} ${styles.bookActionButton}`}
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
              className={`${bodyFontClassName} ${styles.bookActionButton} ${styles.bookPrimaryActionButton}`}
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
          <article className={styles.bookCard} data-purchasable={canPurchase} key={book.id}>
            <div className={styles.bookCoverWrap}>
              <Image
                alt={book.coverImage.alt}
                className={styles.bookImage}
                height={book.coverImage.height}
                src={book.coverImage.url}
                unoptimized
                width={book.coverImage.width}
              />

              <div className={styles.bookOverlay}>
                {renderActionButtons(styles.bookOverlayActions)}
              </div>
            </div>

            {book.typeLabel && (
              <p className={`${bodyFontClassName} ${styles.bookType}`}>{book.typeLabel}</p>
            )}

            <h3 className={`${displayFontClassName} ${styles.bookTitle}`}>{book.title}</h3>
            <p className={`${bodyFontClassName} ${styles.bookAuthor}`}>{book.authorName}</p>

            {(price || compareAtPrice) && (
              <div className={styles.priceRow}>
                {compareAtPrice && (
                  <p className={`${bodyFontClassName} ${styles.bookPriceOriginal}`}>
                    {compareAtPrice}
                  </p>
                )}
                {price && <p className={`${bodyFontClassName} ${styles.bookPrice}`}>{price}</p>}
              </div>
            )}

            {renderActionButtons(styles.bookActionRow)}
          </article>
        )
      })}
    </div>
  )
}
