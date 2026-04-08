const RAW_PRICE_PATTERN = /^\d{1,3}(?:\.\d{3})* VNĐ$/

export const looksLikeRawPrice = (value: string): boolean => RAW_PRICE_PATTERN.test(value)

export const maybeRawPrice = (value: string | null | undefined, context: string): string | null => {
  if (!value) {
    return null
  }

  if (!looksLikeRawPrice(value)) {
    throw new Error(`Unexpected raw price string in ${context}: ${value}`)
  }

  return value
}

export const parseRawPriceToVnd = (value: string | null | undefined, context: string): number | null => {
  const rawValue = maybeRawPrice(value, context)

  if (!rawValue) {
    return null
  }

  return Number.parseInt(rawValue.replace(/\./g, '').replace(/ VNĐ$/, ''), 10)
}
