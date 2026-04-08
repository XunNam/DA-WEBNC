export type CartCookieItem = {
  bookId: string
  slug: string
  title: string
  price: number
  compareAtPrice: number | null
  coverImageUrl: string
  coverImageAlt: string
  quantity: number
}

export type CartCookie = {
  version: 1
  items: CartCookieItem[]
}

export type CartTotals = {
  totalAmount: number
  totalQuantity: number
}
