'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useCart } from '@/components/cart/CartProvider'
import { formatCartCurrency, getLineTotal, getTotalAmount, getTotalQuantity } from '@/lib/cart/cartMath'

import styles from './page.module.css'

type CartPageClientProps = {
  bodyFontClassName: string
  displayFontClassName: string
}

export function CartPageClient({ bodyFontClassName, displayFontClassName }: CartPageClientProps) {
  const { items, removeItem, setQuantity } = useCart()

  if (items.length === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyStateCard}>
          <h2 className={`${displayFontClassName} ${styles.emptyStateHeading}`}>Giỏ hàng đang trống</h2>
          <p className={`${bodyFontClassName} ${styles.emptyStateText}`}>
            Hãy chọn thêm sách để tiếp tục hành trình mua sắm.
          </p>
          <Link className={`${bodyFontClassName} ${styles.emptyStateLink}`} href="/books">
            Tiếp tục xem sách
          </Link>
        </div>
      </section>
    )
  }

  const totalQuantity = getTotalQuantity(items)
  const totalAmount = getTotalAmount(items)

  return (
    <div className={styles.layout}>
      <section className={styles.itemsColumn}>
        <div className={styles.itemList}>
          {items.map((item) => {
            const lineTotal = getLineTotal(item)

            return (
              <article className={styles.itemCard} key={item.bookId}>
                <div className={styles.coverFrame}>
                  <Image
                    alt={item.coverImageAlt}
                    className={styles.coverImage}
                    height={700}
                    src={item.coverImageUrl}
                    unoptimized
                    width={500}
                  />
                </div>

                <div className={styles.itemBody}>
                  <div className={styles.itemText}>
                    <h2 className={`${displayFontClassName} ${styles.itemTitle}`}>{item.title}</h2>

                    <div className={styles.priceBlock}>
                      {item.compareAtPrice !== null && (
                        <p className={`${bodyFontClassName} ${styles.compareAtPrice}`}>
                          {formatCartCurrency(item.compareAtPrice)}
                        </p>
                      )}
                      <p className={`${bodyFontClassName} ${styles.price}`}>
                        {formatCartCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button
                        aria-label={`Giảm số lượng ${item.title}`}
                        className={`${bodyFontClassName} ${styles.quantityButton}`}
                        onClick={() => {
                          if (item.quantity > 1) {
                            setQuantity(item.bookId, item.quantity - 1)
                            return
                          }

                          removeItem(item.bookId)
                        }}
                        type="button"
                      >
                        -
                      </button>
                      <span className={`${bodyFontClassName} ${styles.quantityValue}`}>{item.quantity}</span>
                      <button
                        aria-label={`Tăng số lượng ${item.title}`}
                        className={`${bodyFontClassName} ${styles.quantityButton}`}
                        onClick={() => setQuantity(item.bookId, item.quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.lineTotalBlock}>
                      <p className={`${bodyFontClassName} ${styles.lineTotalLabel}`}>Thành tiền</p>
                      <p className={`${bodyFontClassName} ${styles.lineTotalValue}`}>
                        {formatCartCurrency(lineTotal)}
                      </p>
                    </div>

                    <button
                      className={`${bodyFontClassName} ${styles.removeButton}`}
                      onClick={() => removeItem(item.bookId)}
                      type="button"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <aside className={styles.summaryColumn}>
        <div className={styles.summaryCard}>
          <h2 className={`${displayFontClassName} ${styles.summaryHeading}`}>Tóm tắt đơn hàng</h2>

          <dl className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <dt className={`${bodyFontClassName} ${styles.summaryLabel}`}>Tổng số lượng</dt>
              <dd className={`${bodyFontClassName} ${styles.summaryValue}`}>{totalQuantity}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt className={`${bodyFontClassName} ${styles.summaryLabel}`}>Tổng tiền</dt>
              <dd className={`${bodyFontClassName} ${styles.summaryValue}`}>
                {formatCartCurrency(totalAmount)}
              </dd>
            </div>
          </dl>

          <Link className={`${bodyFontClassName} ${styles.checkoutLink}`} href="/purchase">
            Tiến hành đặt hàng
          </Link>
        </div>
      </aside>
    </div>
  )
}
