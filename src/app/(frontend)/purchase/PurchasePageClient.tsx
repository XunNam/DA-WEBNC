'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { useCart } from '@/components/cart/CartProvider'
import { formatCartCurrency, getLineTotal, getTotalAmount, getTotalQuantity } from '@/lib/cart/cartMath'

import styles from './page.module.css'

type PurchasePageClientProps = {
  bodyFontClassName: string
  displayFontClassName: string
}

type FormValues = {
  email: string
  fullName: string
  phoneNumber: string
  shippingAddress: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type OrderSuccessState = {
  message: string
  orderCode: string
}

const INITIAL_FORM_VALUES: FormValues = {
  email: '',
  fullName: '',
  phoneNumber: '',
  shippingAddress: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeFormValues(values: FormValues): FormValues {
  return {
    email: values.email.trim(),
    fullName: values.fullName.trim(),
    phoneNumber: values.phoneNumber.trim(),
    shippingAddress: values.shippingAddress.trim(),
  }
}

function validateForm(values: FormValues): FormErrors {
  const trimmedValues = normalizeFormValues(values)

  const nextErrors: FormErrors = {}

  if (!trimmedValues.fullName) {
    nextErrors.fullName = 'Vui lòng nhập họ và tên.'
  }

  if (!trimmedValues.email) {
    nextErrors.email = 'Vui lòng nhập email.'
  } else if (!EMAIL_PATTERN.test(trimmedValues.email)) {
    nextErrors.email = 'Email chưa đúng định dạng.'
  }

  if (!trimmedValues.phoneNumber) {
    nextErrors.phoneNumber = 'Vui lòng nhập số điện thoại.'
  }

  if (!trimmedValues.shippingAddress) {
    nextErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng.'
  }

  return nextErrors
}

export function PurchasePageClient({ bodyFontClassName, displayFontClassName }: PurchasePageClientProps) {
  const { clearCart, items } = useCart()
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successState, setSuccessState] = useState<OrderSuccessState | null>(null)

  const renderEmptyState = () => (
    <section className={styles.emptyState}>
      <div className={styles.emptyStateCard}>
        <h2 className={`${displayFontClassName} ${styles.emptyStateHeading}`}>Chưa có sản phẩm để đặt hàng</h2>
        <p className={`${bodyFontClassName} ${styles.emptyStateText}`}>
          Hãy quay lại danh mục sách để thêm sản phẩm trước khi tiếp tục.
        </p>
        <Link className={`${bodyFontClassName} ${styles.emptyStateLink}`} href="/books">
          Tiếp tục xem sách
        </Link>
      </div>
    </section>
  )

  const renderSuccessModal = () => {
    if (!successState) {
      return null
    }

    return (
      <div className={styles.successOverlay} role="presentation">
        <div
          aria-labelledby="purchase-success-heading"
          aria-modal="true"
          className={styles.successModal}
          role="dialog"
        >
          <p className={`${bodyFontClassName} ${styles.successEyebrow}`}>Đặt hàng thành công</p>
          <h2 className={`${displayFontClassName} ${styles.successHeading}`} id="purchase-success-heading">
            {successState.message}
          </h2>
          <div className={styles.successCodeBlock}>
            <p className={`${bodyFontClassName} ${styles.successCodeLabel}`}>Mã đơn hàng</p>
            <p className={`${bodyFontClassName} ${styles.successCodeValue}`}>{successState.orderCode}</p>
          </div>
          <Link className={`${bodyFontClassName} ${styles.successLink}`} href="/books">
            Tiếp tục xem sách
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <>
        {renderEmptyState()}
        {renderSuccessModal()}
      </>
    )
  }

  const totalQuantity = getTotalQuantity(items)
  const totalAmount = getTotalAmount(items)

  const handleFieldChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value

      if (submitError) {
        setSubmitError(null)
      }

      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: nextValue,
      }))

      setFormErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors
        }

        const nextErrors = { ...currentErrors }
        delete nextErrors[field]

        return nextErrors
      })
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const trimmedValues = normalizeFormValues(formValues)
    const nextErrors = validateForm(trimmedValues)

    setFormValues(trimmedValues)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedValues),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; message?: string; orderCode?: string }
        | null

      if (!response.ok) {
        setSubmitError(
          typeof payload?.error === 'string' && payload.error.trim().length > 0
            ? payload.error
            : 'Không thể hoàn tất đặt hàng. Vui lòng thử lại sau.',
        )
        return
      }

      if (
        typeof payload?.message !== 'string' ||
        payload.message.trim().length === 0 ||
        typeof payload?.orderCode !== 'string' ||
        payload.orderCode.trim().length === 0
      ) {
        setSubmitError('Không thể hoàn tất đặt hàng. Vui lòng thử lại sau.')
        return
      }

      clearCart()
      setFormErrors({})
      setSuccessState({
        message: payload.message.trim(),
        orderCode: payload.orderCode.trim(),
      })
    } catch {
      setSubmitError('Không thể hoàn tất đặt hàng. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.layout}>
      <section className={styles.formColumn}>
        <div className={styles.formCard}>
          <h2 className={`${displayFontClassName} ${styles.sectionHeading}`}>Thông tin người nhận</h2>

          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="purchase-full-name">
                  Họ và tên
                </label>
                <input
                  aria-describedby={formErrors.fullName ? 'purchase-full-name-error' : undefined}
                  aria-invalid={Boolean(formErrors.fullName)}
                  className={`${bodyFontClassName} ${styles.input}`}
                  id="purchase-full-name"
                  name="fullName"
                  onChange={handleFieldChange('fullName')}
                  type="text"
                  value={formValues.fullName}
                />
                {formErrors.fullName && (
                  <p className={`${bodyFontClassName} ${styles.errorText}`} id="purchase-full-name-error" role="alert">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="purchase-email">
                  Email
                </label>
                <input
                  aria-describedby={formErrors.email ? 'purchase-email-error' : undefined}
                  aria-invalid={Boolean(formErrors.email)}
                  className={`${bodyFontClassName} ${styles.input}`}
                  id="purchase-email"
                  name="email"
                  onChange={handleFieldChange('email')}
                  type="email"
                  value={formValues.email}
                />
                {formErrors.email && (
                  <p className={`${bodyFontClassName} ${styles.errorText}`} id="purchase-email-error" role="alert">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="purchase-phone-number">
                  Số điện thoại
                </label>
                <input
                  aria-describedby={formErrors.phoneNumber ? 'purchase-phone-number-error' : undefined}
                  aria-invalid={Boolean(formErrors.phoneNumber)}
                  className={`${bodyFontClassName} ${styles.input}`}
                  id="purchase-phone-number"
                  name="phoneNumber"
                  onChange={handleFieldChange('phoneNumber')}
                  type="tel"
                  value={formValues.phoneNumber}
                />
                {formErrors.phoneNumber && (
                  <p
                    className={`${bodyFontClassName} ${styles.errorText}`}
                    id="purchase-phone-number-error"
                    role="alert"
                  >
                    {formErrors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="purchase-shipping-address">
                Địa chỉ giao hàng
              </label>
              <textarea
                aria-describedby={formErrors.shippingAddress ? 'purchase-shipping-address-error' : undefined}
                aria-invalid={Boolean(formErrors.shippingAddress)}
                className={`${bodyFontClassName} ${styles.textarea}`}
                id="purchase-shipping-address"
                name="shippingAddress"
                onChange={handleFieldChange('shippingAddress')}
                rows={5}
                value={formValues.shippingAddress}
              />
              {formErrors.shippingAddress && (
                <p
                  className={`${bodyFontClassName} ${styles.errorText}`}
                  id="purchase-shipping-address-error"
                  role="alert"
                >
                  {formErrors.shippingAddress}
                </p>
              )}
            </div>

            <div className={styles.submitSection}>
              {submitError && (
                <div className={styles.submitErrorBox} role="alert">
                  <p className={`${bodyFontClassName} ${styles.submitErrorText}`}>{submitError}</p>
                </div>
              )}
              <button
                className={`${bodyFontClassName} ${styles.submitButton}`}
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
              </button>
              <p className={`${bodyFontClassName} ${styles.codNote}`}>
                Thanh toán khi nhận hàng (COD). Chúng tôi sẽ liên hệ để xác nhận đơn trước khi giao.
              </p>
            </div>
          </form>
        </div>
      </section>

      <aside className={styles.summaryColumn}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <h2 className={`${displayFontClassName} ${styles.sectionHeading}`}>Tóm tắt đơn hàng</h2>
            <button
              aria-controls="purchase-summary-details"
              aria-expanded={isSummaryOpen}
              className={`${bodyFontClassName} ${styles.summaryToggle}`}
              onClick={() => setIsSummaryOpen((currentValue) => !currentValue)}
              type="button"
            >
              {isSummaryOpen ? 'Ẩn chi tiết' : 'Hiện chi tiết'}
            </button>
          </div>

          {isSummaryOpen && (
            <div className={styles.summaryDetails} id="purchase-summary-details">
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

                      <div className={styles.itemContent}>
                        <h3 className={`${displayFontClassName} ${styles.itemTitle}`}>{item.title}</h3>

                        <dl className={styles.itemMeta}>
                          <div className={styles.itemMetaRow}>
                            <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Số lượng</dt>
                            <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{item.quantity}</dd>
                          </div>
                          <div className={styles.itemMetaRow}>
                            <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Đơn giá</dt>
                            <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                              {formatCartCurrency(item.price)}
                            </dd>
                          </div>
                          <div className={styles.itemMetaRow}>
                            <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thành tiền</dt>
                            <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                              {formatCartCurrency(lineTotal)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          <dl className={styles.summaryTotals}>
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
        </div>
      </aside>

      {renderSuccessModal()}
    </div>
  )
}
