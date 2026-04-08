import configPromise from '@payload-config'
import { getPayload, type TypedUser } from 'payload'

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/
const AUTH_FAILURE_MESSAGE = 'Không có quyền truy cập.'
const DELETE_FAILURE_MESSAGE = 'Không thể xóa đơn hàng này.'
const GENERIC_SERVER_ERROR_MESSAGE = 'Không thể xóa đơn hàng lúc này. Vui lòng thử lại sau.'

type PayloadAdminUser = TypedUser & {
  collection: 'users'
}

type DeleteOrderRouteContext = {
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

export const DELETE = async (request: Request, { params }: DeleteOrderRouteContext) => {
  const { id } = await params

  if (!OBJECT_ID_PATTERN.test(id)) {
    return jsonResponse({ error: DELETE_FAILURE_MESSAGE }, 404)
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

    const existingOrder = await payload.find({
      collection: 'orders',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      user,
      where: {
        id: {
          equals: id,
        },
      },
    })

    if (existingOrder.docs.length === 0) {
      return jsonResponse({ error: DELETE_FAILURE_MESSAGE }, 404)
    }

    await payload.delete({
      collection: 'orders',
      id,
      overrideAccess: false,
      user,
    })

    return jsonResponse({ success: true }, 200)
  } catch (error) {
    console.error('Order management delete failed:', error)
    return jsonResponse({ error: GENERIC_SERVER_ERROR_MESSAGE }, 500)
  }
}
