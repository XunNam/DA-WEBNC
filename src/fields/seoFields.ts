import type { Field } from 'payload'

export const createSEOFields = (): Field[] => [
  {
    name: 'metaTitle',
    type: 'text',
  },
  {
    name: 'metaDescription',
    type: 'textarea',
  },
]
