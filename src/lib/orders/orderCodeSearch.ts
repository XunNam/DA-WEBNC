import type { Where } from 'payload'

export function normalizeOrderCodeSearchInput(value: string | string[] | undefined): string {
  const rawValue = Array.isArray(value) ? value[0] : value

  if (typeof rawValue !== 'string') {
    return ''
  }

  return rawValue.trim().toUpperCase().replace(/^#+/, '')
}

export function buildOrderCodeSearchWhere(value: string): Where | undefined {
  if (!value) {
    return undefined
  }

  return {
    orderCode: {
      contains: `#${value}`,
    },
  }
}
