import configPromise from '@payload-config'
import { getPayload, type TypedUser } from 'payload'

import {
  TransitionOrderToDeliveredError,
  transitionOrderToDelivered,
} from '@/lib/orders/transitionOrderToDelivered'

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/
const AUTH_FAILURE_MESSAGE = 'Không có quyền truy cập.'
const DELIVER_FAILURE_MESSAGE = 'Không thể cập nhật trạng thái giao hàng cho đơn hàng này.'
const GENERIC_SERVER_ERROR_MESSAGE = 'Không thể cập nhật trạng thái giao hàng lúc này. Vui lòng thử lại sau.'

type PayloadAdminUser = TypedUser & {
  collection: 'users'
}

type DeliverOrderRouteContext = {
  params: Promise<{
    id: string
  }>
}

function jsonResponse(body: { error: string } | { success: true }, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

export const POST = async (request: Request, { params }: DeliverOrderRouteContext) => {
  const { id } = await params

  if (!OBJECT_ID_PATTERN.test(id)) {
    return jsonResponse({ error: DELIVER_FAILURE_MESSAGE }, 404)
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const authResult = await payload.auth({ headers: request.headers })
    const user =
      authResult.user && authResult.user.collection === 'users'
        ? (authResult.user as PayloadAdminUser)
        : null

    if (!user) {
      return jsonResponse({ error: AUTH_FAILURE_MESSAGE }, 401)
    }

    await transitionOrderToDelivered({
      orderId: id,
      req: {
        payload,
        user,
      },
      user,
    })

    return jsonResponse({ success: true }, 200)
  } catch (error) {
    if (error instanceof TransitionOrderToDeliveredError) {
      return jsonResponse({ error: error.userMessage }, error.status)
    }

    console.error('Order management deliver failed:', error)
    return jsonResponse({ error: GENERIC_SERVER_ERROR_MESSAGE }, 500)
  }
}
