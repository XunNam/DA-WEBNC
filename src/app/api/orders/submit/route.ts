import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Book, Media } from '@/payload-types'
import { CART_COOKIE_NAME, expireCartCookieString, parseCartCookie } from '@/lib/cart/cartCookie'
import type { CartCookieItem } from '@/lib/cart/cartTypes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORDER_CODE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const ORDER_CODE_LENGTH = 5
const ORDER_CODE_MAX_ATTEMPTS = 10
const ORDER_SUCCESS_MESSAGE = 'Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thông tin'
const REVIEW_CART_ERROR_MESSAGE = 'Giỏ hàng có sản phẩm không còn hợp lệ. Vui lòng kiểm tra lại trước khi đặt hàng.'
const ORDER_CODE_FAILURE_MESSAGE = 'Không thể tạo đơn hàng lúc này. Vui lòng thử lại sau.'
const GENERIC_SERVER_ERROR_MESSAGE = 'Không thể hoàn tất đặt hàng. Vui lòng thử lại sau.'

type OrderRequestBody = {
  email: string
  fullName: string
  phoneNumber: string
  shippingAddress: string
}

type OrderCustomerFields = {
  email: string
  fullName: string
  phoneNumber: string
  shippingAddress: string
}

type RebuiltOrderItem = {
  book?: string
  bookSlug: string
  bookTitle: string
  compareAtPrice?: number
  coverImageAlt: string
  coverImageUrl: string
  lineTotal: number
  quantity: number
  unitPrice: number
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isUsableBookId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value.trim())
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function normalizeCustomerFields(input: unknown): OrderCustomerFields | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Partial<OrderRequestBody>
  const normalized: OrderCustomerFields = {
    email: typeof candidate.email === 'string' ? candidate.email.trim() : '',
    fullName: typeof candidate.fullName === 'string' ? candidate.fullName.trim() : '',
    phoneNumber: typeof candidate.phoneNumber === 'string' ? candidate.phoneNumber.trim() : '',
    shippingAddress: typeof candidate.shippingAddress === 'string' ? candidate.shippingAddress.trim() : '',
  }

  return normalized
}

function validateCustomerFields(fields: OrderCustomerFields | null): string | null {
  if (!fields) {
    return 'Dữ liệu đặt hàng không hợp lệ.'
  }

  if (!fields.fullName) {
    return 'Vui lòng nhập họ và tên.'
  }

  if (!fields.email) {
    return 'Vui lòng nhập email.'
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return 'Email chưa đúng định dạng.'
  }

  if (!fields.phoneNumber) {
    return 'Vui lòng nhập số điện thoại.'
  }

  if (!fields.shippingAddress) {
    return 'Vui lòng nhập địa chỉ giao hàng.'
  }

  return null
}

function readCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) {
    return null
  }

  for (const cookieSegment of cookieHeader.split(';')) {
    const trimmedSegment = cookieSegment.trim()

    if (trimmedSegment.startsWith(`${cookieName}=`)) {
      return trimmedSegment.slice(cookieName.length + 1)
    }
  }

  return null
}

function getCoverSnapshot(coverImage: Book['coverImage']): { alt: string; url: string } | null {
  if (!coverImage || typeof coverImage !== 'object') {
    return null
  }

  const media = coverImage as Media

  if (!isNonEmptyString(media.url) || !isNonEmptyString(media.alt)) {
    return null
  }

  return {
    alt: media.alt.trim(),
    url: media.url.trim(),
  }
}

function toOptionalFiniteNumber(value: unknown): number | undefined {
  return isFiniteNumber(value) ? value : undefined
}

function rebuildOrderItem(book: Book, cartItem: CartCookieItem): RebuiltOrderItem | null {
  if (!isNonEmptyString(book.id) || !isNonEmptyString(book.title) || !isNonEmptyString(book.slug) || !isFiniteNumber(book.price)) {
    return null
  }

  const coverSnapshot = getCoverSnapshot(book.coverImage)

  if (!coverSnapshot) {
    return null
  }

  const lineTotal = book.price * cartItem.quantity

  return {
    book: book.id,
    bookSlug: book.slug.trim(),
    bookTitle: book.title.trim(),
    compareAtPrice: toOptionalFiniteNumber(book.compareAtPrice),
    coverImageAlt: coverSnapshot.alt,
    coverImageUrl: coverSnapshot.url,
    lineTotal,
    quantity: cartItem.quantity,
    unitPrice: book.price,
  }
}

function generateOrderCode(): string {
  let generatedCode = '#'

  for (let index = 0; index < ORDER_CODE_LENGTH; index += 1) {
    const randomIndex = Math.floor(Math.random() * ORDER_CODE_CHARACTERS.length)
    generatedCode += ORDER_CODE_CHARACTERS[randomIndex]
  }

  return generatedCode
}

async function getUniqueOrderCode(payload: Awaited<ReturnType<typeof getPayload>>): Promise<string | null> {
  for (let attempt = 0; attempt < ORDER_CODE_MAX_ATTEMPTS; attempt += 1) {
    const candidate = generateOrderCode()
    const existingOrder = await payload.find({
      collection: 'orders',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        orderCode: {
          equals: candidate,
        },
      },
    })

    if (existingOrder.docs.length > 0) {
      continue
    }

    const existingDeliveredOrder = await payload.find({
      collection: 'deliveredOrders',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        orderCode: {
          equals: candidate,
        },
      },
    })

    if (existingDeliveredOrder.docs.length === 0) {
      return candidate
    }
  }

  return null
}

function jsonResponse(body: { error: string } | { message: string; orderCode: string }, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

export const POST = async (request: Request) => {
  let rawBody: unknown

  try {
    rawBody = await request.json()
  } catch {
    return jsonResponse({ error: 'Dữ liệu đặt hàng không hợp lệ.' }, 400)
  }

  const customerFields = normalizeCustomerFields(rawBody)
  const customerFieldError = validateCustomerFields(customerFields)

  if (customerFieldError) {
    return jsonResponse({ error: customerFieldError }, 400)
  }

  if (!customerFields) {
    return jsonResponse({ error: 'Dữ liệu đặt hàng không hợp lệ.' }, 400)
  }

  const rawCartCookie = readCookieValue(request.headers.get('cookie'), CART_COOKIE_NAME)
  const cart = parseCartCookie(rawCartCookie)

  if (
    cart.items.length === 0 ||
    cart.items.some((item) => !isNonEmptyString(item.bookId) || !isUsableBookId(item.bookId))
  ) {
    return jsonResponse({ error: REVIEW_CART_ERROR_MESSAGE }, 400)
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const bookIds = cart.items.map((item) => item.bookId)
    const { docs: currentBooks } = await payload.find({
      collection: 'books',
      depth: 1,
      limit: bookIds.length,
      pagination: false,
      where: {
        and: [
          {
            id: {
              in: bookIds,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    })

    if (currentBooks.length !== bookIds.length) {
      return jsonResponse({ error: REVIEW_CART_ERROR_MESSAGE }, 400)
    }

    const booksById = new Map(currentBooks.map((book) => [book.id, book]))
    const rebuiltItems: RebuiltOrderItem[] = []

    for (const cartItem of cart.items) {
      const currentBook = booksById.get(cartItem.bookId)

      if (!currentBook) {
        return jsonResponse({ error: REVIEW_CART_ERROR_MESSAGE }, 400)
      }

      const rebuiltItem = rebuildOrderItem(currentBook, cartItem)

      if (!rebuiltItem) {
        return jsonResponse({ error: REVIEW_CART_ERROR_MESSAGE }, 400)
      }

      rebuiltItems.push(rebuiltItem)
    }

    const totalQuantity = rebuiltItems.reduce((total, item) => total + item.quantity, 0)
    const totalAmount = rebuiltItems.reduce((total, item) => total + item.lineTotal, 0)
    const orderCode = await getUniqueOrderCode(payload)

    if (!orderCode) {
      return jsonResponse({ error: ORDER_CODE_FAILURE_MESSAGE }, 409)
    }

    await payload.create({
      collection: 'orders',
      data: {
        orderCode,
        fullName: customerFields.fullName,
        email: customerFields.email,
        phoneNumber: customerFields.phoneNumber,
        shippingAddress: customerFields.shippingAddress,
        paymentMethod: 'cod',
        totalQuantity,
        totalAmount,
        items: rebuiltItems,
      },
    })

    const response = jsonResponse(
      {
        orderCode,
        message: ORDER_SUCCESS_MESSAGE,
      },
      201,
    )

    response.headers.append('Set-Cookie', expireCartCookieString())

    return response
  } catch (error) {
    console.error('Order submit failed:', error)
    return jsonResponse({ error: GENERIC_SERVER_ERROR_MESSAGE }, 500)
  }
}
