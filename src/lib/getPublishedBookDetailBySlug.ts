import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Author, Book, Media } from '@/payload-types'

type BookDetailMedia = {
  alt: string
  height: number
  url: string
  width: number
}

type BookDetailRichText = Exclude<Book['detailContent'], null | undefined>

export type PublishedBookDetailData = {
  authorName: string
  compareAtPrice: number | null
  coverImage: BookDetailMedia
  detailContent: BookDetailRichText | null
  id: string
  metaDescription: string | null
  metaTitle: string | null
  price: number | null
  slug: string
  title: string
  typeLabel: string | null
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function isPublishedRecord<T extends { _status?: 'draft' | 'published' | null; id?: string | null }>(
  value: unknown,
): value is T {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as T

  return typeof candidate.id === 'string' && candidate._status === 'published'
}

function isSerializedEditorState(value: unknown): value is BookDetailRichText {
  if (!value || typeof value !== 'object') {
    return false
  }

  const root = (value as { root?: unknown }).root

  return Boolean(
    root &&
      typeof root === 'object' &&
      Array.isArray((root as { children?: unknown }).children),
  )
}

function lexicalNodeHasVisibleContent(node: unknown): boolean {
  if (!node || typeof node !== 'object') {
    return false
  }

  const text = (node as { text?: unknown }).text

  if (typeof text === 'string' && text.trim()) {
    return true
  }

  const children = (node as { children?: unknown }).children

  return Array.isArray(children) && children.some(lexicalNodeHasVisibleContent)
}

function normalizeRichText(value: unknown): BookDetailRichText | null {
  if (!isSerializedEditorState(value)) {
    return null
  }

  return value.root.children.some(lexicalNodeHasVisibleContent) ? value : null
}

function normalizeMedia(value: unknown, label: string): BookDetailMedia | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const media = value as Media

  if (!normalizeText(media.url)) {
    return null
  }

  return {
    alt: normalizeText(media.alt) || label,
    height: media.height || 1000,
    url: media.url!,
    width: media.width || 700,
  }
}

function normalizeAuthorName(value: unknown): string | null {
  if (!isPublishedRecord<Author>(value)) {
    return null
  }

  return normalizeText(value.name)
}

function normalizeBookDetail(value: unknown): PublishedBookDetailData | null {
  if (!isPublishedRecord<Book>(value)) {
    return null
  }

  const title = normalizeText(value.title)
  const slug = normalizeText(value.slug)

  if (!title || !slug) {
    return null
  }

  const authorName = normalizeAuthorName(value.author)
  const coverImage = normalizeMedia(value.coverImage, `${title} cover`)

  if (!authorName || !coverImage) {
    return null
  }

  return {
    authorName,
    compareAtPrice: typeof value.compareAtPrice === 'number' ? value.compareAtPrice : null,
    coverImage,
    detailContent: normalizeRichText(value.detailContent),
    id: value.id,
    metaDescription: normalizeText(value.metaDescription),
    metaTitle: normalizeText(value.metaTitle),
    price: typeof value.price === 'number' ? value.price : null,
    slug,
    title,
    typeLabel: normalizeText(value.typeLabel),
  }
}

export const getPublishedBookDetailBySlug = cache(
  async (slug: string): Promise<PublishedBookDetailData | null> => {
    const normalizedSlug = normalizeText(slug)

    if (!normalizedSlug) {
      return null
    }

    try {
      const payloadConfig = await config
      const payload = await getPayload({ config: payloadConfig })

      const result = await payload.find({
        collection: 'books',
        depth: 1,
        draft: false,
        limit: 1,
        overrideAccess: false,
        where: {
          slug: {
            equals: normalizedSlug,
          },
        },
      })

      return normalizeBookDetail(result.docs[0] ?? null)
    } catch (error) {
      console.error(`Failed to read published book detail for slug "${normalizedSlug}".`, error)
      return null
    }
  },
)
