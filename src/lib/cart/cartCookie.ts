import type { CartCookie, CartCookieItem } from './cartTypes'

export const CART_COOKIE_NAME = 'bookstore-cart'

const CART_COOKIE_VERSION = 1 as const
const EMPTY_CART: CartCookie = {
  version: CART_COOKIE_VERSION,
  items: [],
}

const MAX_QUANTITY = 99
const MIN_QUANTITY = 1

function isRequiredString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

function clampQuantity(value: number): number {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(value)))
}

function normalizeQuantity(value: unknown): number {
  const parsed = toFiniteNumber(value)

  if (parsed === null) {
    return MIN_QUANTITY
  }

  return clampQuantity(parsed)
}

function sanitizeCartCookieItem(value: unknown): CartCookieItem | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Partial<CartCookieItem>
  const price = toFiniteNumber(candidate.price)

  if (
    !isRequiredString(candidate.bookId) ||
    !isRequiredString(candidate.slug) ||
    !isRequiredString(candidate.title) ||
    !isRequiredString(candidate.coverImageUrl) ||
    !isRequiredString(candidate.coverImageAlt) ||
    price === null
  ) {
    return null
  }

  const compareAtPrice = toFiniteNumber(candidate.compareAtPrice)

  return {
    bookId: candidate.bookId.trim(),
    slug: candidate.slug.trim(),
    title: candidate.title.trim(),
    price,
    compareAtPrice: compareAtPrice === null ? null : compareAtPrice,
    coverImageUrl: candidate.coverImageUrl.trim(),
    coverImageAlt: candidate.coverImageAlt.trim(),
    quantity: normalizeQuantity(candidate.quantity),
  }
}

export function mergeDuplicateItems(items: CartCookieItem[]): CartCookieItem[] {
  const merged = new Map<string, CartCookieItem>()

  for (const item of items) {
    const existing = merged.get(item.bookId)

    if (!existing) {
      merged.set(item.bookId, {
        ...item,
        quantity: clampQuantity(item.quantity),
      })
      continue
    }

    merged.set(item.bookId, {
      ...existing,
      quantity: clampQuantity(existing.quantity + item.quantity),
    })
  }

  return Array.from(merged.values())
}

export function sanitizeCartCookie(input: unknown): CartCookie {
  if (!input || typeof input !== 'object') {
    return EMPTY_CART
  }

  const candidate = input as Partial<CartCookie>

  if (candidate.version !== CART_COOKIE_VERSION || !Array.isArray(candidate.items)) {
    return EMPTY_CART
  }

  const sanitizedItems = mergeDuplicateItems(
    candidate.items
      .map((item) => sanitizeCartCookieItem(item))
      .filter((item): item is CartCookieItem => item !== null),
  )

  return {
    version: CART_COOKIE_VERSION,
    items: sanitizedItems,
  }
}

export function parseCartCookie(raw: string | null | undefined): CartCookie {
  if (!raw) {
    return EMPTY_CART
  }

  try {
    const decoded = decodeURIComponent(raw)
    const parsed = JSON.parse(decoded)

    return sanitizeCartCookie(parsed)
  } catch {
    return EMPTY_CART
  }
}

export function serializeCartCookie(cart: CartCookie): string {
  return encodeURIComponent(JSON.stringify(sanitizeCartCookie(cart)))
}

export function expireCartCookieString(): string {
  return `${CART_COOKIE_NAME}=; path=/; samesite=lax; max-age=0`
}
