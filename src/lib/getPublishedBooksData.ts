import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Author, Book, Media } from '@/payload-types'

type BooksListingMedia = {
  alt: string
  height: number
  url: string
  width: number
}

export type PublishedBookCardData = {
  authorName: string
  compareAtPrice: number | null
  coverImage: BooksListingMedia
  id: string
  price: number | null
  slug: string
  title: string
  typeLabel: Book['typeLabel']
}

function ensurePublishedRecord<T extends { _status?: 'draft' | 'published' | null; id: string }>(
  value: string | T,
  label: string,
): T {
  if (typeof value === 'string') {
    throw new Error(`${label} was not populated for the published books read.`)
  }

  if (value._status !== 'published') {
    throw new Error(`${label} is not publicly readable as published content.`)
  }

  return value
}

function resolveMedia(value: string | Media, label: string): BooksListingMedia {
  if (typeof value === 'string') {
    throw new Error(`${label} media relation was not populated for the books read.`)
  }

  if (!value.url) {
    throw new Error(`${label} media is missing a public URL.`)
  }

  return {
    alt: value.alt || label,
    height: value.height || 1000,
    url: value.url,
    width: value.width || 700,
  }
}

function resolveBook(value: string | Book, label: string): PublishedBookCardData {
  const book = ensurePublishedRecord(value, label)
  const author =
    typeof book.author === 'string'
      ? null
      : ensurePublishedRecord(book.author, `${label} author relation`)

  if (!author) {
    throw new Error(`${label} author relation was not populated for the books read.`)
  }

  return {
    authorName: author.name,
    compareAtPrice: book.compareAtPrice ?? null,
    coverImage: resolveMedia(book.coverImage, `${label} cover`),
    id: book.id,
    price: book.price ?? null,
    slug: book.slug,
    title: book.title,
    typeLabel: book.typeLabel ?? null,
  }
}

export const getPublishedBooksData = cache(async (): Promise<PublishedBookCardData[]> => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'books',
    depth: 2,
    draft: false,
    limit: 20,
    overrideAccess: false,
    sort: 'title',
    where: {
      catalogVisible: {
        equals: true,
      },
    },
  })

  const books = result.docs.map((doc, index) => resolveBook(doc, `Books listing item #${index + 1}`))

  if (books.some((book) => book.title === 'Ngày xưa có một chuyện tình')) {
    throw new Error('Hero-only book leaked into the public books listing.')
  }

  return books
})
