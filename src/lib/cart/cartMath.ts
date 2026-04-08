import type { CartCookieItem } from './cartTypes'

export function getLineTotal(item: CartCookieItem): number {
  return item.price * item.quantity
}

export function getTotalQuantity(items: CartCookieItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function getTotalAmount(items: CartCookieItem[]): number {
  return items.reduce((total, item) => total + getLineTotal(item), 0)
}

export function formatCartCurrency(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0

  return `${new Intl.NumberFormat('vi-VN').format(safeValue)} VNĐ`
}
