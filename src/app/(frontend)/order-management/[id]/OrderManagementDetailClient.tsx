'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { formatCartCurrency } from '@/lib/cart/cartMath'

import styles from './page.module.css'

type OrderManagementDetailItem = {
  coverImageAlt: string
  coverImageUrl: string
  lineTotal: number
  quantity: number
  title: string
  unitPrice: number
}

export type OrderManagementDetailData = {
  createdAt: string
  deliveredAt?: string | null
  email: string
  fullName: string
  items: OrderManagementDetailItem[]
  orderCode: string
  paymentMethod: string
  phoneNumber: string
  shippingAddress: string
  totalAmount: number
  totalQuantity: number
}

type OrderManagementDetailClientProps = {
  backHref: `/${string}`
  bodyFontClassName: string
  displayFontClassName: string
  order: OrderManagementDetailData
  viewMode: 'delivered' | 'pending'
}

type DeleteApiResponse =
  | {
      success: true
    }
  | {
      error: string
    }

type DeliverApiResponse =
  | {
      success: true
    }
  | {
      error: string
    }

type ActionKind = 'delete' | 'deliver'

const GENERIC_DELETE_ERROR_MESSAGE = 'Không thể xóa đơn hàng lúc này. Vui lòng thử lại sau.'
const GENERIC_DELIVER_ERROR_MESSAGE = 'Không thể cập nhật trạng thái giao hàng lúc này. Vui lòng thử lại sau.'

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

function formatPaymentMethod(value: string): string {
  if (value === 'cod') {
    return 'Thanh toán khi nhận hàng'
  }

  return value
}

export function OrderManagementDetailClient({
  backHref,
  bodyFontClassName,
  displayFontClassName,
  order,
  viewMode,
}: OrderManagementDetailClientProps) {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [activeAction, setActiveAction] = useState<ActionKind | null>(null)
  const [actionError, setActionError] = useState<{
    kind: ActionKind
    message: string
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDelivering, setIsDelivering] = useState(false)

  const orderId = typeof params.id === 'string' ? params.id : ''
  const currentPanel = actionError?.kind ?? activeAction
  const isMutating = isDeleting || isDelivering

  const handleStartDelete = () => {
    if (isMutating || viewMode !== 'pending') {
      return
    }

    setActionError(null)
    setActiveAction('delete')
  }

  const handleStartDeliver = () => {
    if (isMutating || viewMode !== 'pending') {
      return
    }

    setActionError(null)
    setActiveAction('deliver')
  }

  const handleCancelAction = () => {
    if (isMutating) {
      return
    }

    setActionError(null)
    setActiveAction(null)
  }

  const handleConfirmDelete = async () => {
    if (isDeleting || viewMode !== 'pending') {
      return
    }

    if (!orderId) {
      setActiveAction(null)
      setActionError({
        kind: 'delete',
        message: GENERIC_DELETE_ERROR_MESSAGE,
      })
      return
    }

    setActionError(null)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/order-management/${orderId}`, {
        method: 'DELETE',
      })
      const payload = (await response.json().catch(() => null)) as DeleteApiResponse | null

      if (!response.ok) {
        setActiveAction(null)
        setActionError({
          kind: 'delete',
          message:
            payload && 'error' in payload && typeof payload.error === 'string' && payload.error.trim().length > 0
              ? payload.error
              : GENERIC_DELETE_ERROR_MESSAGE,
        })
        return
      }

      if (!payload || !('success' in payload) || payload.success !== true) {
        setActiveAction(null)
        setActionError({
          kind: 'delete',
          message: GENERIC_DELETE_ERROR_MESSAGE,
        })
        return
      }

      router.push('/order-management')
    } catch {
      setActiveAction(null)
      setActionError({
        kind: 'delete',
        message: GENERIC_DELETE_ERROR_MESSAGE,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleConfirmDeliver = async () => {
    if (isDelivering || viewMode !== 'pending') {
      return
    }

    if (!orderId) {
      setActiveAction(null)
      setActionError({
        kind: 'deliver',
        message: GENERIC_DELIVER_ERROR_MESSAGE,
      })
      return
    }

    setActionError(null)
    setIsDelivering(true)

    try {
      const response = await fetch(`/api/order-management/${orderId}/deliver`, {
        method: 'POST',
      })
      const payload = (await response.json().catch(() => null)) as DeliverApiResponse | null

      if (!response.ok) {
        setActiveAction(null)
        setActionError({
          kind: 'deliver',
          message:
            payload && 'error' in payload && typeof payload.error === 'string' && payload.error.trim().length > 0
              ? payload.error
              : GENERIC_DELIVER_ERROR_MESSAGE,
        })
        return
      }

      if (!payload || !('success' in payload) || payload.success !== true) {
        setActiveAction(null)
        setActionError({
          kind: 'deliver',
          message: GENERIC_DELIVER_ERROR_MESSAGE,
        })
        return
      }

      router.push('/order-management')
    } catch {
      setActiveAction(null)
      setActionError({
        kind: 'deliver',
        message: GENERIC_DELIVER_ERROR_MESSAGE,
      })
    } finally {
      setIsDelivering(false)
    }
  }

  return (
    <div className={styles.layout}>
      <section className={styles.detailSection}>
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderText}>
              <p className={`${bodyFontClassName} ${styles.eyebrow}`}>Chi tiết đơn hàng</p>
              <h2 className={`${displayFontClassName} ${styles.orderCode}`}>{order.orderCode}</h2>
            </div>

            <div className={styles.actionGroup}>
              {viewMode === 'pending' && (
                <>
                  <button
                    className={`${bodyFontClassName} ${styles.deliverButton}`}
                    disabled={isMutating}
                    onClick={handleStartDeliver}
                    type="button"
                  >
                    Đã giao hàng
                  </button>

                  <button
                    className={`${bodyFontClassName} ${styles.deleteButton}`}
                    disabled={isMutating}
                    onClick={handleStartDelete}
                    type="button"
                  >
                    Xóa đơn hàng
                  </button>
                </>
              )}

              <Link className={`${bodyFontClassName} ${styles.backLink}`} href={backHref}>
                Quay lại danh sách
              </Link>
            </div>
          </div>

          {currentPanel && (
            <div className={styles.deletePanel}>
              <p className={`${bodyFontClassName} ${styles.confirmText}`}>
                {currentPanel === 'delete'
                  ? activeAction === 'delete'
                    ? 'Xác nhận xóa đơn hàng này khỏi hệ thống quản lý?'
                    : 'Không thể hoàn tất thao tác xóa đơn hàng này.'
                  : activeAction === 'deliver'
                    ? 'Xác nhận chuyển đơn hàng này sang danh sách đã giao?'
                    : 'Không thể hoàn tất thao tác cập nhật trạng thái giao hàng.'}
              </p>

              {actionError && actionError.kind === currentPanel && (
                <div className={styles.deleteErrorBox} role="alert">
                  <p className={`${bodyFontClassName} ${styles.deleteErrorText}`}>{actionError.message}</p>
                </div>
              )}

              {activeAction === currentPanel && (
                <div className={styles.confirmActions}>
                  {currentPanel === 'delete' ? (
                    <button
                      className={`${bodyFontClassName} ${styles.confirmDeleteButton}`}
                      disabled={isMutating}
                      onClick={handleConfirmDelete}
                      type="button"
                    >
                      {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                    </button>
                  ) : (
                    <button
                      className={`${bodyFontClassName} ${styles.confirmDeliverButton}`}
                      disabled={isMutating}
                      onClick={handleConfirmDeliver}
                      type="button"
                    >
                      {isDelivering ? 'Đang cập nhật...' : 'Xác nhận đã giao'}
                    </button>
                  )}
                  <button
                    className={`${bodyFontClassName} ${styles.cancelButton}`}
                    disabled={isMutating}
                    onClick={handleCancelAction}
                    type="button"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          )}

          <dl className={styles.metaList}>
            <div className={styles.metaRow}>
              <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thời gian đặt</dt>
              <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{formatOrderDateTime(order.createdAt)}</dd>
            </div>
            {viewMode === 'delivered' && order.deliveredAt && (
              <div className={styles.metaRow}>
                <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thời gian giao</dt>
                <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                  {formatOrderDateTime(order.deliveredAt)}
                </dd>
              </div>
            )}
            <div className={styles.metaRow}>
              <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Khách hàng</dt>
              <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.fullName}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Email</dt>
              <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.email}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Số điện thoại</dt>
              <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.phoneNumber}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Địa chỉ giao hàng</dt>
              <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{order.shippingAddress}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Phương thức thanh toán</dt>
              <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{formatPaymentMethod(order.paymentMethod)}</dd>
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
          </dl>
        </div>
      </section>

      <section className={styles.itemsSection}>
        <div className={styles.itemsCard}>
          <h2 className={`${displayFontClassName} ${styles.sectionHeading}`}>Sản phẩm trong đơn</h2>

          <div className={styles.itemList}>
            {order.items.map((item, index) => (
              <article className={styles.itemCard} key={`${order.orderCode}-${index}-${item.title}`}>
                <div className={styles.coverFrame}>
                  <Image
                    alt={item.coverImageAlt || item.title}
                    className={styles.coverImage}
                    height={700}
                    src={item.coverImageUrl}
                    unoptimized
                    width={500}
                  />
                </div>

                <div className={styles.itemBody}>
                  <h3 className={`${displayFontClassName} ${styles.itemTitle}`}>{item.title}</h3>

                  <dl className={styles.itemMeta}>
                    <div className={styles.itemMetaRow}>
                      <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Số lượng</dt>
                      <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{item.quantity}</dd>
                    </div>
                    <div className={styles.itemMetaRow}>
                      <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Đơn giá</dt>
                      <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                        {formatCartCurrency(item.unitPrice)}
                      </dd>
                    </div>
                    <div className={styles.itemMetaRow}>
                      <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thành tiền</dt>
                      <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                        {formatCartCurrency(item.lineTotal)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
