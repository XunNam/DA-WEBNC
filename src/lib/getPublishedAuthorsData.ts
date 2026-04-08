import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Author, Media } from '@/payload-types'

type AuthorMedia = {
  alt: string
  height: number
  url: string
  width: number
}

export type PublishedAuthorCardData = {
  id: string
  lifeDatesDisplay: string | null
  metaDescription: string | null
  metaTitle: string | null
  name: string
  portrait: AuthorMedia
  slug: string
}

function ensurePublishedAuthor(
  value: string | Author,
  label: string,
): Author {
  if (typeof value === 'string') {
    throw new Error(`${label} was not populated for the published authors read.`)
  }

  if (value._status !== 'published') {
    throw new Error(`${label} is not publicly readable as published content.`)
  }

  return value
}

function resolvePortrait(value: string | Media, label: string): AuthorMedia {
  if (typeof value === 'string') {
    throw new Error(`${label} portrait relation was not populated for the authors read.`)
  }

  if (!value.url) {
    throw new Error(`${label} portrait is missing a public URL.`)
  }

  return {
    alt: value.alt || label,
    height: value.height || 1000,
    url: value.url,
    width: value.width || 700,
  }
}

function mapAuthor(author: Author, label: string): PublishedAuthorCardData {
  const safeAuthor = ensurePublishedAuthor(author, label)

  return {
    id: safeAuthor.id,
    lifeDatesDisplay: safeAuthor.lifeDatesDisplay || null,
    metaDescription: safeAuthor.metaDescription || null,
    metaTitle: safeAuthor.metaTitle || null,
    name: safeAuthor.name,
    portrait: resolvePortrait(safeAuthor.portrait, `${label} portrait`),
    slug: safeAuthor.slug,
  }
}

export const getPublishedAuthorsData = cache(async (): Promise<PublishedAuthorCardData[]> => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'authors',
    depth: 1,
    draft: false,
    limit: 20,
    overrideAccess: false,
    sort: 'name',
  })

  return result.docs.map((doc, index) => mapAuthor(doc, `Authors listing item #${index + 1}`))
})

export const getPublishedAuthorBySlug = cache(
  async (slug: string): Promise<PublishedAuthorCardData | null> => {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const result = await payload.find({
      collection: 'authors',
      depth: 1,
      draft: false,
      limit: 1,
      overrideAccess: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const author = result.docs[0]

    if (!author) {
      return null
    }

    return mapAuthor(author, `Author detail ${slug}`)
  },
)
