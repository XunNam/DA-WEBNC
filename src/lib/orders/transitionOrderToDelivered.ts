import { commitTransaction, type Payload, type PayloadRequest, type TypedUser } from 'payload'

const TRANSITION_NOT_FOUND_MESSAGE = 'Không tìm thấy đơn hàng này.'
const TRANSITION_FAILURE_MESSAGE = 'Không thể cập nhật trạng thái giao hàng lúc này. Vui lòng thử lại sau.'

type TransitionRequestLike = Partial<PayloadRequest> & {
  payload: Payload
  user?: PayloadRequest['user']
}

type TransitionOrderToDeliveredArgs = {
  orderId: string
  req: TransitionRequestLike
  user?: TypedUser | null
}

type PendingOrderRecord = {
  createdAt: string
  email: string
  fullName: string
  id: string
  items: Array<{
    book?: string | { id?: string | null } | null
    bookSlug: string
    bookTitle: string
    compareAtPrice?: number | null
    coverImageAlt?: string | null
    coverImageUrl: string
    lineTotal: number
    quantity: number
    unitPrice: number
  }>
  orderCode: string
  paymentMethod: 'cod'
  phoneNumber: string
  shippingAddress: string
  totalAmount: number
  totalQuantity: number
}

type DeliveredOrderRecord = {
  deliveredAt: string
  id: string
  orderCode: string
  sourceOrderId: string
}

export type TransitionOrderToDeliveredResult = {
  deliveredAt: string
  deliveredOrderId: string
  orderCode: string
  status: 'already-delivered' | 'reconciled' | 'transitioned'
}

export class TransitionOrderToDeliveredError extends Error {
  readonly status: number
  readonly userMessage: string

  constructor(userMessage: string, status: number) {
    super(userMessage)
    this.name = 'TransitionOrderToDeliveredError'
    this.status = status
    this.userMessage = userMessage
  }
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function toPendingOrderRecord(value: unknown): PendingOrderRecord | null {
  if (!isRecordObject(value)) {
    return null
  }

  const items = Array.isArray(value.items) ? value.items : null

  if (
    typeof value.id !== 'string' ||
    typeof value.orderCode !== 'string' ||
    typeof value.fullName !== 'string' ||
    typeof value.email !== 'string' ||
    typeof value.phoneNumber !== 'string' ||
    typeof value.shippingAddress !== 'string' ||
    value.paymentMethod !== 'cod' ||
    typeof value.totalQuantity !== 'number' ||
    typeof value.totalAmount !== 'number' ||
    typeof value.createdAt !== 'string' ||
    !items
  ) {
    return null
  }

  const normalizedItems = items.map((item) => {
    if (
      !isRecordObject(item) ||
      typeof item.bookTitle !== 'string' ||
      typeof item.bookSlug !== 'string' ||
      typeof item.coverImageUrl !== 'string' ||
      typeof item.quantity !== 'number' ||
      typeof item.unitPrice !== 'number' ||
      typeof item.lineTotal !== 'number'
    ) {
      return null
    }

    return {
      book:
        typeof item.book === 'string' || item.book === null || isRecordObject(item.book)
          ? (item.book as PendingOrderRecord['items'][number]['book'])
          : undefined,
      bookSlug: item.bookSlug,
      bookTitle: item.bookTitle,
      compareAtPrice: typeof item.compareAtPrice === 'number' ? item.compareAtPrice : null,
      coverImageAlt: typeof item.coverImageAlt === 'string' ? item.coverImageAlt : null,
      coverImageUrl: item.coverImageUrl,
      lineTotal: item.lineTotal,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }
  })

  if (normalizedItems.some((item) => item === null)) {
    return null
  }

  return {
    createdAt: value.createdAt,
    email: value.email,
    fullName: value.fullName,
    id: value.id,
    items: normalizedItems as PendingOrderRecord['items'],
    orderCode: value.orderCode,
    paymentMethod: 'cod',
    phoneNumber: value.phoneNumber,
    shippingAddress: value.shippingAddress,
    totalAmount: value.totalAmount,
    totalQuantity: value.totalQuantity,
  }
}

function toDeliveredOrderRecord(value: unknown): DeliveredOrderRecord | null {
  if (!isRecordObject(value)) {
    return null
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.orderCode !== 'string' ||
    typeof value.sourceOrderId !== 'string' ||
    typeof value.deliveredAt !== 'string'
  ) {
    return null
  }

  return {
    deliveredAt: value.deliveredAt,
    id: value.id,
    orderCode: value.orderCode,
    sourceOrderId: value.sourceOrderId,
  }
}

async function findPendingOrderById({
  orderId,
  req,
  user,
}: {
  orderId: string
  req: TransitionRequestLike
  user?: TypedUser | null
}): Promise<PendingOrderRecord | null> {
  const result = await req.payload.find({
    collection: 'orders',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    req,
    user: user ?? undefined,
    where: {
      id: {
        equals: orderId,
      },
    },
  })

  return toPendingOrderRecord(result.docs[0] ?? null)
}

async function findDeliveredOrderBySourceOrderId({
  orderId,
  req,
  user,
}: {
  orderId: string
  req: TransitionRequestLike
  user?: TypedUser | null
}): Promise<DeliveredOrderRecord | null> {
  const result = await req.payload.find({
    collection: 'deliveredOrders',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    req,
    user: user ?? undefined,
    where: {
      sourceOrderId: {
        equals: orderId,
      },
    },
  })

  return toDeliveredOrderRecord(result.docs[0] ?? null)
}

async function findDeliveredOrderByOrderCode({
  orderCode,
  req,
  user,
}: {
  orderCode: string
  req: TransitionRequestLike
  user?: TypedUser | null
}): Promise<DeliveredOrderRecord | null> {
  const result = await req.payload.find({
    collection: 'deliveredOrders',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    req,
    user: user ?? undefined,
    where: {
      orderCode: {
        equals: orderCode,
      },
    },
  })

  return toDeliveredOrderRecord(result.docs[0] ?? null)
}

async function deletePendingOrder({
  orderId,
  req,
  user,
}: {
  orderId: string
  req: TransitionRequestLike
  user?: TypedUser | null
}) {
  await req.payload.delete({
    collection: 'orders',
    id: orderId,
    overrideAccess: false,
    req,
    user: user ?? undefined,
  })
}

function mapDeliveredOrderData(order: PendingOrderRecord, deliveredAt: string) {
  return {
    sourceOrderId: order.id,
    deliveredAt,
    orderCode: order.orderCode,
    fullName: order.fullName,
    email: order.email,
    phoneNumber: order.phoneNumber,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    totalQuantity: order.totalQuantity,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
      book: typeof item.book === 'string' ? item.book : item.book && typeof item.book.id === 'string' ? item.book.id : undefined,
      bookSlug: item.bookSlug,
      bookTitle: item.bookTitle,
      coverImageUrl: item.coverImageUrl,
      coverImageAlt: item.coverImageAlt ?? undefined,
      unitPrice: item.unitPrice,
      compareAtPrice: typeof item.compareAtPrice === 'number' ? item.compareAtPrice : undefined,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    createdAt: order.createdAt,
  }
}

async function rollbackManagedTransaction(req: TransitionRequestLike) {
  if (!req.transactionID) {
    return
  }

  try {
    await req.payload.db.rollbackTransaction(req.transactionID)
  } finally {
    delete req.transactionID
  }
}

export async function transitionOrderToDelivered({
  orderId,
  req,
  user,
}: TransitionOrderToDeliveredArgs): Promise<TransitionOrderToDeliveredResult> {
  const actingUser = user ?? req.user ?? null
  const alreadyManagedTransaction = Boolean(req.transactionID)
  let createdDeliveredOrderId: string | null = null
  let startedTransaction = false

  if (!alreadyManagedTransaction) {
    const transactionID = await req.payload.db.beginTransaction()

    if (transactionID) {
      req.transactionID = transactionID
      startedTransaction = true
    }
  }

  try {
    const pendingOrder = await findPendingOrderById({
      orderId,
      req,
      user: actingUser,
    })
    const deliveredBySourceOrderId = await findDeliveredOrderBySourceOrderId({
      orderId,
      req,
      user: actingUser,
    })

    if (!pendingOrder) {
      if (deliveredBySourceOrderId) {
        if (startedTransaction) {
          await commitTransaction(req)
        }

        return {
          deliveredAt: deliveredBySourceOrderId.deliveredAt,
          deliveredOrderId: deliveredBySourceOrderId.id,
          orderCode: deliveredBySourceOrderId.orderCode,
          status: 'already-delivered',
        }
      }

      throw new TransitionOrderToDeliveredError(TRANSITION_NOT_FOUND_MESSAGE, 404)
    }

    const existingDeliveredOrder =
      deliveredBySourceOrderId ??
      (await findDeliveredOrderByOrderCode({
        orderCode: pendingOrder.orderCode,
        req,
        user: actingUser,
      }))

    if (existingDeliveredOrder) {
      await deletePendingOrder({
        orderId: pendingOrder.id,
        req,
        user: actingUser,
      })

      if (startedTransaction) {
        await commitTransaction(req)
      }

      return {
        deliveredAt: existingDeliveredOrder.deliveredAt,
        deliveredOrderId: existingDeliveredOrder.id,
        orderCode: existingDeliveredOrder.orderCode,
        status: 'reconciled',
      }
    }

    const deliveredAt = new Date().toISOString()
    const createdDeliveredOrder = await req.payload.create({
      collection: 'deliveredOrders',
      data: mapDeliveredOrderData(pendingOrder, deliveredAt),
      overrideAccess: true,
      req,
    })
    const normalizedDeliveredOrder = toDeliveredOrderRecord(createdDeliveredOrder)

    if (!normalizedDeliveredOrder) {
      throw new TransitionOrderToDeliveredError(TRANSITION_FAILURE_MESSAGE, 500)
    }

    createdDeliveredOrderId = normalizedDeliveredOrder.id

    await deletePendingOrder({
      orderId: pendingOrder.id,
      req,
      user: actingUser,
    })

    if (startedTransaction) {
      await commitTransaction(req)
    }

    return {
      deliveredAt: normalizedDeliveredOrder.deliveredAt,
      deliveredOrderId: normalizedDeliveredOrder.id,
      orderCode: normalizedDeliveredOrder.orderCode,
      status: 'transitioned',
    }
  } catch (error) {
    if (startedTransaction) {
      await rollbackManagedTransaction(req)
    } else if (createdDeliveredOrderId) {
      try {
        await req.payload.delete({
          collection: 'deliveredOrders',
          id: createdDeliveredOrderId,
          overrideAccess: true,
          req,
        })
      } catch (rollbackError) {
        console.error('Delivered order rollback failed:', rollbackError)
      }
    }

    if (error instanceof TransitionOrderToDeliveredError) {
      throw error
    }

    console.error('Order delivery transition failed:', error)
    throw new TransitionOrderToDeliveredError(TRANSITION_FAILURE_MESSAGE, 500)
  }
}
