import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Author, Book, Homepage, Media, SiteSetting } from '@/payload-types'

type HomepageMedia = {
  alt: string
  height: number
  url: string
  width: number
}

export type HomepageBookData = {
  authorName: string
  catalogVisible: boolean
  compareAtPrice: number | null
  coverImage: HomepageMedia
  id: string
  price: number | null
  slug: string
  title: string
  typeLabel: Book['typeLabel']
}

export type HomepageAuthorData = {
  id: string
  lifeDatesDisplay: string | null
  metaDescription: string | null
  metaTitle: string | null
  name: string
  portrait: HomepageMedia
  slug: string
}

export type PublishedHomepageData = {
  authorSpotlight: {
    eyebrow: string
    featuredAuthor: HomepageAuthorData
    summary: string | null
  }
  awards: NonNullable<Homepage['awards']>
  bestSellers: HomepageBookData[]
  hero: {
    buyLinkUrl: string | null
    eyebrow: string
    featuredBook: HomepageBookData
    sampleLinkUrl: string | null
    summaryOverride: string | null
  }
  metaDescription: string
  metaTitle: string
  newsletterCta: Homepage['newsletterCta']
  siteSettings: Pick<SiteSetting, 'defaultMetaDescription' | 'defaultMetaTitle' | 'siteName'>
}

function ensurePublishedRecord<T extends { _status?: 'draft' | 'published' | null; id: string }>(
  value: string | T,
  label: string,
): T {
  if (typeof value === 'string') {
    throw new Error(`${label} was not populated for the published homepage read.`)
  }

  if (value._status !== 'published') {
    throw new Error(`${label} is not publicly readable as published content.`)
  }

  return value
}

function resolveMedia(value: string | Media, label: string): HomepageMedia {
  if (typeof value === 'string') {
    throw new Error(`${label} media relation was not populated for the homepage read.`)
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

function resolveAuthor(value: string | Author, label: string): HomepageAuthorData {
  const author = ensurePublishedRecord(value, label)

  return {
    id: author.id,
    lifeDatesDisplay: author.lifeDatesDisplay || null,
    metaDescription: author.metaDescription || null,
    metaTitle: author.metaTitle || null,
    name: author.name,
    portrait: resolveMedia(author.portrait, `${label} portrait`),
    slug: author.slug,
  }
}

function resolveBook(value: string | Book, label: string): HomepageBookData {
  const book = ensurePublishedRecord(value, label)
  const author =
    typeof book.author === 'string'
      ? null
      : ensurePublishedRecord(book.author, `${label} author relation`)

  if (!author) {
    throw new Error(`${label} author relation was not populated for the homepage read.`)
  }

  return {
    authorName: author.name,
    catalogVisible: book.catalogVisible,
    compareAtPrice: book.compareAtPrice ?? null,
    coverImage: resolveMedia(book.coverImage, `${label} cover`),
    id: book.id,
    price: book.price ?? null,
    slug: book.slug,
    title: book.title,
    typeLabel: book.typeLabel ?? null,
  }
}

export const getPublishedHomepageData = cache(async (): Promise<PublishedHomepageData> => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const homepage = await payload.findGlobal({
    depth: 2,
    draft: false,
    overrideAccess: false,
    slug: 'homepage',
  })

  const siteSettings = await payload.findGlobal({
    depth: 0,
    overrideAccess: false,
    slug: 'siteSettings',
  })

  if (homepage._status !== 'published') {
    throw new Error('Homepage global is not publicly readable as published content.')
  }

  return {
    authorSpotlight: {
      eyebrow: homepage.authorSpotlight.eyebrow,
      featuredAuthor: resolveAuthor(
        homepage.authorSpotlight.featuredAuthor,
        'Homepage author spotlight',
      ),
      summary: homepage.authorSpotlight.summary || null,
    },
    awards: homepage.awards || [],
    bestSellers: (homepage.bestSellers || []).map(({ book }, index) =>
      resolveBook(book, `Homepage best seller #${index + 1}`),
    ),
    hero: {
      buyLinkUrl: homepage.hero.buyLinkUrl || null,
      eyebrow: homepage.hero.eyebrow,
      featuredBook: resolveBook(homepage.hero.featuredBook, 'Homepage hero featured book'),
      sampleLinkUrl: homepage.hero.sampleLinkUrl || null,
      summaryOverride: homepage.hero.summaryOverride || null,
    },
    metaDescription: homepage.metaDescription || siteSettings.defaultMetaDescription,
    metaTitle: homepage.metaTitle || siteSettings.defaultMetaTitle,
    newsletterCta: homepage.newsletterCta,
    siteSettings: {
      defaultMetaDescription: siteSettings.defaultMetaDescription,
      defaultMetaTitle: siteSettings.defaultMetaTitle,
      siteName: siteSettings.siteName,
    },
  }
})
