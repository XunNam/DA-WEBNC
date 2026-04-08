'use client'

import Link from 'next/link'

import { formatCartCurrency } from '@/lib/cart/cartMath'

import styles from './page.module.css'

export type OrderManagementListEntry = {
  createdAt: string
  deliveredAt?: string | null
  email: string
  fullName: string
  id: string
  orderCode: string
  phoneNumber: string
  totalAmount: number
  totalQuantity: number
}

type OrderManagementPageClientProps = {
  activeView: 'delivered' | 'pending'
  bodyFontClassName: string
  detailHrefBase: `/${string}`
  displayFontClassName: string
  emptyStateHeading: string
  emptyStateText: string
  orders: OrderManagementListEntry[]
  searchValue: string
  searchViewHref: `/${string}`
}

function formatOrderDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function OrderManagementPageClient({
  activeView,
  bodyFontClassName,
  detailHrefBase,
  displayFontClassName,
  emptyStateHeading,
  emptyStateText,
  orders,
  searchValue,
  searchViewHref,
}: OrderManagementPageClientProps) {
  return (
    <div className={styles.pageSections}>
      <section className={styles.toolbarSection}>
        <div className={styles.viewSwitch}>
          <Link
            className={`${bodyFontClassName} ${styles.viewLink} ${
              activeView === 'pending' ? styles.viewLinkActive : ''
            }`}
            href="/order-management"
          >
            Đơn đang giao
          </Link>
          <Link
            className={`${bodyFontClassName} ${styles.viewLink} ${
              activeView === 'delivered' ? styles.viewLinkActive : ''
            }`}
            href="/order-management/delivered"
          >
            Đơn đã giao
          </Link>
        </div>

        <form action={searchViewHref} className={styles.searchForm} method="get">
          <label className={`${bodyFontClassName} ${styles.searchLabel}`} htmlFor="order-management-search">
            Tìm theo mã đơn hàng
          </label>
          <div className={styles.searchInputGroup}>
            <span aria-hidden="true" className={`${bodyFontClassName} ${styles.searchPrefix}`}>
              #
            </span>
            <input
              className={`${bodyFontClassName} ${styles.searchInput}`}
              defaultValue={searchValue}
              id="order-management-search"
              name="orderCode"
              placeholder="Nhập phần mã cần tìm"
              type="search"
            />
            <button className={`${bodyFontClassName} ${styles.searchButton}`} type="submit">
              Tìm kiếm
            </button>
          </div>
          <p className={`${bodyFontClassName} ${styles.searchHint}`}>Chỉ nhập phần sau dấu #. Hệ thống hỗ trợ tìm một phần mã.</p>
        </form>
      </section>

      {orders.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyStateCard}>
            <h2 className={`${displayFontClassName} ${styles.sectionHeading}`}>{emptyStateHeading}</h2>
            <p className={`${bodyFontClassName} ${styles.sectionText}`}>{emptyStateText}</p>
          </div>
        </section>
      ) : (
        <section className={styles.listSection}>
          <div className={styles.list}>
            {orders.map((order) => (
              <article className={styles.card} key={order.id}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderText}>
                    <p className={`${bodyFontClassName} ${styles.eyebrow}`}>
                      {activeView === 'pending' ? 'Đơn hàng' : 'Đã giao'}
                    </p>
                    <h2 className={`${displayFontClassName} ${styles.orderCode}`}>{order.orderCode}</h2>
                  </div>

                  <Link className={`${bodyFontClassName} ${styles.detailLink}`} href={`${detailHrefBase}/${order.id}`}>
                    Xem chi tiết
                  </Link>
                </div>

                <dl className={styles.metaList}>
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Khách hàng</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.fullName}</dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Số điện thoại</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.phoneNumber}</dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Email</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.email}</dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Tổng số lượng</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.totalQuantity}</dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Tổng tiền</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                      {formatCartCurrency(order.totalAmount)}
                    </dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thời gian đặt</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{formatOrderDateTime(order.createdAt)}</dd>
                  </div>
                  {activeView === 'delivered' && order.deliveredAt && (
                    <div className={styles.metaRow}>
                      <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thời gian giao</dt>
                      <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                        {formatOrderDateTime(order.deliveredAt)}
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
