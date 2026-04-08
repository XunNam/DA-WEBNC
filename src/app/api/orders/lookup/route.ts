import configPromise from '@payload-config'
import { getPayload } from 'payload'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORDER_CODE_PATTERN = /^#[A-Z0-9]{5}$/
const NOT_FOUND_MESSAGE = 'Không tìm thấy đơn hàng'
const INVALID_REQUEST_MESSAGE = 'Dữ liệu tra cứu đơn hàng không hợp lệ.'
const GENERIC_SERVER_ERROR_MESSAGE = 'Không thể tra cứu đơn hàng lúc này. Vui lòng thử lại sau.'

type LookupRequestBody = {
  email: string
  fullName: string
  orderCode: string
  phoneNumber: string
}

type LookupFields = {
  email: string
  fullName: string
  orderCode: string
  phoneNumber: string
}

type PublicLookupOrder = {
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

function jsonResponse(body: { error: string } | { order: PublicLookupOrder }, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

function normalizeLookupFields(input: unknown): LookupFields | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Partial<LookupRequestBody>

  return {
    email: typeof candidate.email === 'string' ? candidate.email.trim() : '',
    fullName: typeof candidate.fullName === 'string' ? candidate.fullName.trim() : '',
    orderCode: typeof candidate.orderCode === 'string' ? candidate.orderCode.trim() : '',
    phoneNumber: typeof candidate.phoneNumber === 'string' ? candidate.phoneNumber.trim() : '',
  }
}

function validateLookupFields(fields: LookupFields | null): string | null {
  if (!fields) {
    return INVALID_REQUEST_MESSAGE
  }

  if (!fields.orderCode || !fields.fullName || !fields.phoneNumber || !fields.email) {
    return INVALID_REQUEST_MESSAGE
  }

  if (!ORDER_CODE_PATTERN.test(fields.orderCode)) {
    return 'Mã đơn hàng không hợp lệ.'
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return 'Email chưa đúng định dạng.'
  }

  return null
}

function toPublicLookupOrder(
  order: Record<string, unknown>,
  deliveryStatus: PublicLookupOrder['deliveryStatus'],
): PublicLookupOrder | null {
  if (
    typeof order.orderCode !== 'string' ||
    typeof order.fullName !== 'string' ||
    typeof order.shippingAddress !== 'string' ||
    typeof order.createdAt !== 'string' ||
    typeof order.totalAmount !== 'number' ||
    !Array.isArray(order.items)
  ) {
    return null
  }

  const items = order.items.map((item) => {
    if (
      !item ||
      typeof item.bookTitle !== 'string' ||
      typeof item.coverImageUrl !== 'string' ||
      typeof item.quantity !== 'number' ||
      typeof item.unitPrice !== 'number'
    ) {
      return null
    }

    return {
      coverImageAlt: typeof item.coverImageAlt === 'string' ? item.coverImageAlt : '',
      coverImageUrl: item.coverImageUrl,
      quantity: item.quantity,
      title: item.bookTitle,
      unitPrice: item.unitPrice,
    }
  })

  if (items.some((item) => item === null)) {
    return null
  }

  return {
    createdAt: order.createdAt,
    deliveredAt: deliveryStatus === 'delivered' && typeof order.deliveredAt === 'string' ? order.deliveredAt : null,
    deliveryStatus,
    fullName: order.fullName,
    items: items as PublicLookupOrder['items'],
    orderCode: order.orderCode,
    shippingAddress: order.shippingAddress,
    totalAmount: order.totalAmount,
  }
}

export const POST = async (request: Request) => {
  let rawBody: unknown

  try {
    rawBody = await request.json()
  } catch {
    return jsonResponse({ error: INVALID_REQUEST_MESSAGE }, 400)
  }

  const lookupFields = normalizeLookupFields(rawBody)
  const validationError = validateLookupFields(lookupFields)

  if (validationError) {
    return jsonResponse({ error: validationError }, 400)
  }

  if (!lookupFields) {
    return jsonResponse({ error: INVALID_REQUEST_MESSAGE }, 400)
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const orders = await payload.find({
      collection: 'orders',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        orderCode: {
          equals: lookupFields.orderCode,
        },
      },
    })

    const pendingOrder = orders.docs[0]

    const matchedOrder =
      pendingOrder ??
      (
        await payload.find({
          collection: 'deliveredOrders',
          depth: 0,
          limit: 1,
          pagination: false,
          where: {
            orderCode: {
              equals: lookupFields.orderCode,
            },
          },
        })
      ).docs[0]

    if (!matchedOrder || typeof matchedOrder !== 'object') {
      return jsonResponse({ error: NOT_FOUND_MESSAGE }, 404)
    }

    if (
      matchedOrder.fullName !== lookupFields.fullName ||
      matchedOrder.phoneNumber !== lookupFields.phoneNumber ||
      matchedOrder.email !== lookupFields.email
    ) {
      return jsonResponse({ error: NOT_FOUND_MESSAGE }, 404)
    }

    const publicOrder = toPublicLookupOrder(
      matchedOrder as unknown as Record<string, unknown>,
      pendingOrder ? 'in_transit' : 'delivered',
    )

    if (!publicOrder) {
      return jsonResponse({ error: GENERIC_SERVER_ERROR_MESSAGE }, 500)
    }

    return jsonResponse({ order: publicOrder }, 200)
  } catch (error) {
    console.error('Public order lookup failed:', error)
    return jsonResponse({ error: GENERIC_SERVER_ERROR_MESSAGE }, 500)
  }
}
