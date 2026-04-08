'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'

import Image from 'next/image'

import { formatCartCurrency } from '@/lib/cart/cartMath'

import styles from './page.module.css'

type LookupPageClientProps = {
  bodyFontClassName: string
  displayFontClassName: string
}

type FormValues = {
  email: string
  fullName: string
  orderCode: string
  phoneNumber: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type LookupResult = {
  createdAt: string
  deliveredAt: null | string
  deliveryStatus: 'delivered' | 'in_transit'
  fullName: string
  items: Array<{
    coverImageAlt: string
    coverImageUrl: string
    quantity: number
    title: string
    unitPrice: number
  }>
  orderCode: string
  shippingAddress: string
  totalAmount: number
}

type LookupApiResponse =
  | {
      order: LookupResult
    }
  | {
      error: string
    }

type ToastState = {
  message: string
  version: number
  visible: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORDER_CODE_PATTERN = /^#[A-Z0-9]{5}$/
const NOT_FOUND_MESSAGE = 'Không tìm thấy đơn hàng'
const GENERIC_SERVER_ERROR_MESSAGE = 'Không thể tra cứu đơn hàng lúc này. Vui lòng thử lại sau.'

const INITIAL_FORM_VALUES: FormValues = {
  email: '',
  fullName: '',
  orderCode: '',
  phoneNumber: '',
}

function normalizeFormValues(values: FormValues): FormValues {
  return {
    email: values.email.trim(),
    fullName: values.fullName.trim(),
    orderCode: values.orderCode.trim(),
    phoneNumber: values.phoneNumber.trim(),
  }
}

function validateForm(values: FormValues): FormErrors {
  const trimmedValues = normalizeFormValues(values)
  const nextErrors: FormErrors = {}

  if (!trimmedValues.orderCode) {
    nextErrors.orderCode = 'Vui lòng nhập mã đơn hàng.'
  } else if (!ORDER_CODE_PATTERN.test(trimmedValues.orderCode)) {
    nextErrors.orderCode = 'Mã đơn hàng phải theo định dạng #ABCDE.'
  }

  if (!trimmedValues.fullName) {
    nextErrors.fullName = 'Vui lòng nhập họ tên lúc đặt hàng.'
  }

  if (!trimmedValues.phoneNumber) {
    nextErrors.phoneNumber = 'Vui lòng nhập số điện thoại lúc đặt hàng.'
  }

  if (!trimmedValues.email) {
    nextErrors.email = 'Vui lòng nhập email lúc đặt hàng.'
  } else if (!EMAIL_PATTERN.test(trimmedValues.email)) {
    nextErrors.email = 'Email chưa đúng định dạng.'
  }

  return nextErrors
}

function isLookupResult(value: unknown): value is LookupResult {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<LookupResult>

  return (
    typeof candidate.orderCode === 'string' &&
    typeof candidate.fullName === 'string' &&
    typeof candidate.shippingAddress === 'string' &&
    typeof candidate.createdAt === 'string' &&
    (candidate.deliveredAt === null || typeof candidate.deliveredAt === 'string') &&
    (candidate.deliveryStatus === 'delivered' || candidate.deliveryStatus === 'in_transit') &&
    typeof candidate.totalAmount === 'number' &&
    Array.isArray(candidate.items) &&
    candidate.items.every((item) => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const typedItem = item as LookupResult['items'][number]

      return (
        typeof typedItem.coverImageAlt === 'string' &&
        typeof typedItem.coverImageUrl === 'string' &&
        typeof typedItem.quantity === 'number' &&
        typeof typedItem.title === 'string' &&
        typeof typedItem.unitPrice === 'number'
      )
    })
  )
}

function formatLookupDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function LookupPageClient({ bodyFontClassName, displayFontClassName }: LookupPageClientProps) {
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    version: 0,
    visible: false,
  })

  useEffect(() => {
    if (!toastState.visible) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToastState((currentState) => ({
        ...currentState,
        visible: false,
      }))
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toastState.version, toastState.visible])

  const closeToast = () => {
    setToastState((currentState) => ({
      ...currentState,
      visible: false,
    }))
  }

  const showNotFoundToast = () => {
    setToastState((currentState) => ({
      message: NOT_FOUND_MESSAGE,
      version: currentState.version + 1,
      visible: true,
    }))
  }

  const handleFieldChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
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
    setLookupResult(null)

    const trimmedValues = normalizeFormValues(formValues)
    const nextErrors = validateForm(trimmedValues)

    setFormValues(trimmedValues)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedValues),
      })

      const payload = (await response.json().catch(() => null)) as LookupApiResponse | null

      if (!response.ok) {
        if (response.status === 404 && payload && 'error' in payload && payload.error === NOT_FOUND_MESSAGE) {
          showNotFoundToast()
          return
        }

        setSubmitError(
          payload && 'error' in payload && typeof payload.error === 'string' && payload.error.trim().length > 0
            ? payload.error
            : GENERIC_SERVER_ERROR_MESSAGE,
        )
        return
      }

      if (!payload || !('order' in payload) || !isLookupResult(payload.order)) {
        setSubmitError(GENERIC_SERVER_ERROR_MESSAGE)
        return
      }

      setFormErrors({})
      setLookupResult(payload.order)
    } catch {
      setSubmitError(GENERIC_SERVER_ERROR_MESSAGE)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.layout}>
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <h2 className={`${displayFontClassName} ${styles.sectionHeading}`}>Thông tin tra cứu</h2>
            <p className={`${bodyFontClassName} ${styles.sectionText}`}>
              Nhập đúng thông tin đã dùng khi đặt hàng để xem chi tiết đơn.
            </p>

            <form className={styles.form} noValidate onSubmit={handleSubmit}>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="lookup-order-code">
                    Mã đơn hàng
                  </label>
                  <input
                    aria-describedby={formErrors.orderCode ? 'lookup-order-code-error' : undefined}
                    aria-invalid={Boolean(formErrors.orderCode)}
                    className={`${bodyFontClassName} ${styles.input}`}
                    id="lookup-order-code"
                    name="orderCode"
                    onChange={handleFieldChange('orderCode')}
                    placeholder="#ABCDE"
                    type="text"
                    value={formValues.orderCode}
                  />
                  {formErrors.orderCode && (
                    <p className={`${bodyFontClassName} ${styles.errorText}`} id="lookup-order-code-error" role="alert">
                      {formErrors.orderCode}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="lookup-full-name">
                    Họ tên lúc đặt hàng
                  </label>
                  <input
                    aria-describedby={formErrors.fullName ? 'lookup-full-name-error' : undefined}
                    aria-invalid={Boolean(formErrors.fullName)}
                    className={`${bodyFontClassName} ${styles.input}`}
                    id="lookup-full-name"
                    name="fullName"
                    onChange={handleFieldChange('fullName')}
                    type="text"
                    value={formValues.fullName}
                  />
                  {formErrors.fullName && (
                    <p className={`${bodyFontClassName} ${styles.errorText}`} id="lookup-full-name-error" role="alert">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="lookup-phone-number">
                    SĐT lúc đặt hàng
                  </label>
                  <input
                    aria-describedby={formErrors.phoneNumber ? 'lookup-phone-number-error' : undefined}
                    aria-invalid={Boolean(formErrors.phoneNumber)}
                    className={`${bodyFontClassName} ${styles.input}`}
                    id="lookup-phone-number"
                    name="phoneNumber"
                    onChange={handleFieldChange('phoneNumber')}
                    type="tel"
                    value={formValues.phoneNumber}
                  />
                  {formErrors.phoneNumber && (
                    <p
                      className={`${bodyFontClassName} ${styles.errorText}`}
                      id="lookup-phone-number-error"
                      role="alert"
                    >
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={`${bodyFontClassName} ${styles.label}`} htmlFor="lookup-email">
                    Email lúc đặt hàng
                  </label>
                  <input
                    aria-describedby={formErrors.email ? 'lookup-email-error' : undefined}
                    aria-invalid={Boolean(formErrors.email)}
                    className={`${bodyFontClassName} ${styles.input}`}
                    id="lookup-email"
                    name="email"
                    onChange={handleFieldChange('email')}
                    type="email"
                    value={formValues.email}
                  />
                  {formErrors.email && (
                    <p className={`${bodyFontClassName} ${styles.errorText}`} id="lookup-email-error" role="alert">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.submitSection}>
                {submitError && (
                  <div className={styles.submitErrorBox} role="alert">
                    <p className={`${bodyFontClassName} ${styles.submitErrorText}`}>{submitError}</p>
                  </div>
                )}

                <button className={`${bodyFontClassName} ${styles.submitButton}`} disabled={isSubmitting} type="submit">
                  {isSubmitting ? 'Đang tra cứu...' : 'Tra cứu đơn hàng'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {lookupResult && (
          <section className={styles.resultSection}>
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.resultHeaderText}>
                  <p className={`${bodyFontClassName} ${styles.resultEyebrow}`}>Kết quả tra cứu</p>
                  <h2 className={`${displayFontClassName} ${styles.sectionHeading}`}>Chi tiết đơn hàng</h2>
                </div>
              </div>

              <dl className={styles.metaList}>
                <div className={styles.metaRow}>
                  <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Mã đơn hàng</dt>
                  <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{lookupResult.orderCode}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Trạng thái giao hàng</dt>
                  <dd className={styles.metaValue}>
                    <span
                      className={`${bodyFontClassName} ${styles.statusBadge} ${
                        lookupResult.deliveryStatus === 'delivered'
                          ? styles.statusBadgeDelivered
                          : styles.statusBadgeInTransit
                      }`}
                    >
                      {lookupResult.deliveryStatus === 'delivered' ? 'Đã giao hàng' : 'Đang giao hàng'}
                    </span>
                  </dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Khách hàng</dt>
                  <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{lookupResult.fullName}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Địa chỉ giao hàng</dt>
                  <dd className={`${bodyFontClassName} ${styles.metaValue}`}>{lookupResult.shippingAddress}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thời gian đặt</dt>
                  <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                    {formatLookupDateTime(lookupResult.createdAt)}
                  </dd>
                </div>
                {lookupResult.deliveryStatus === 'delivered' && lookupResult.deliveredAt && (
                  <div className={styles.metaRow}>
                    <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Thời gian giao</dt>
                    <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                      {formatLookupDateTime(lookupResult.deliveredAt)}
                    </dd>
                  </div>
                )}
                <div className={styles.metaRow}>
                  <dt className={`${bodyFontClassName} ${styles.metaLabel}`}>Tổng tiền</dt>
                  <dd className={`${bodyFontClassName} ${styles.metaValue}`}>
                    {formatCartCurrency(lookupResult.totalAmount)}
                  </dd>
                </div>
              </dl>

              <div className={styles.itemList}>
                {lookupResult.items.map((item, index) => (
                  <article className={styles.itemCard} key={`${lookupResult.orderCode}-${index}-${item.title}`}>
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
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {toastState.visible && (
        <div className={styles.toast} role="alert">
          <p className={`${bodyFontClassName} ${styles.toastMessage}`}>{toastState.message}</p>
          <button
            aria-label="Đóng thông báo"
            className={`${bodyFontClassName} ${styles.toastCloseButton}`}
            onClick={closeToast}
            type="button"
          >
            Đóng
          </button>
        </div>
      )}
    </>
  )
}
