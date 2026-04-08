import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload, type Payload, type TypedUser } from 'payload'
import { formatAdminURL } from 'payload/shared'

type PayloadAdminUser = TypedUser & {
  collection: 'users'
}

type GetPayloadAdminSessionOptions = {
  redirectPath: `/${string}`
}

export type PayloadAdminSession = {
  isAuthenticated: boolean
  loginRedirectURL: string
  payload: Payload
  user: PayloadAdminUser | null
}

export async function buildPayloadAdminLoginRedirectURL(redirectPath: `/${string}`): Promise<string> {
  const config = await configPromise
  const loginPath = formatAdminURL({
    adminRoute: config.routes.admin,
    path: '/login',
    relative: true,
    serverURL: config.serverURL,
  })
  const separator = loginPath.includes('?') ? '&' : '?'

  return `${loginPath}${separator}redirect=${encodeURIComponent(redirectPath)}`
}

export async function getPayloadAdminSession(
  options: GetPayloadAdminSessionOptions,
): Promise<PayloadAdminSession> {
  const payload = await getPayload({ config: configPromise })
  const authResult = await payload.auth({ headers: await getHeaders() })
  const user =
    authResult.user && authResult.user.collection === 'users'
      ? (authResult.user as PayloadAdminUser)
      : null

  return {
    isAuthenticated: Boolean(user),
    loginRedirectURL: await buildPayloadAdminLoginRedirectURL(options.redirectPath),
    payload,
    user,
  }
}
