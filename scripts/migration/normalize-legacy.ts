import fs from 'node:fs'
import path from 'node:path'

import { listFilesRecursive, normalizeAssetPath } from './lib/assets'
import { parseRawPriceToVnd } from './lib/price'
import { toComparisonKey, toSlugValue } from './lib/slug'

type RawBook = {
  sourcePath: string
  sourceSection: string
  sourceRoute: string
  rawTitle: string | null
  rawAuthorName: string | null
  rawTypeLabel: string | null
  rawPrice: string | null
  rawCompareAtPrice: string | null
  rawImagePath: string | null
  rawHeroSummary: string | null
  rawBuyLinkUrl: string | null
  rawSampleLinkUrl: string | null
}

type RawAuthor = {
  sourcePath: string
  sourceSection: string
  sourceRoute: string
  rawName: string | null
  rawLegacyRoute: string | null
  rawPortraitPath: string | null
  rawLifeDatesDisplay: string | null
  rawMetaTitle: string | null
  rawMetaDescription: string | null
  rawShortSummary: string | null
  rawLongFormParagraphs: string[]
  rawExternalLink: string | null
}

type RawHomepage = {
  hero: {
    sourcePath: string
    sourceRoute: string
    rawEyebrow: string | null
    rawTitle: string | null
    rawSummary: string | null
    rawImagePath: string | null
    rawBuyLinkUrl: string | null
    rawSampleLinkUrl: string | null
  }
  authorSpotlight: {
    sourcePath: string
    sourceRoute: string
    rawEyebrow: string | null
    rawName: string | null
    rawSummary: string | null
    rawPortraitPath: string | null
    rawExternalLink: string | null
  }
  awards: {
    sourcePath: string
    sourceRoute: string
    items: Array<{
      rawIconPath: string | null
      rawIconAlt: string | null
      rawTitle: string | null
      rawBody: string | null
    }>
  }
  bestSellers: {
    sourcePath: string
    sourceRoute: string
    rawHeading: string | null
    rawBody: string | null
    items: Array<{
      rawTitle: string | null
      rawAuthorName: string | null
      rawTypeLabel: string | null
      rawPrice: string | null
      rawCompareAtPrice: string | null
      rawImagePath: string | null
    }>
  }
  newsletterCta: {
    sourcePath: string
    sourceRoute: string
    rawHeading: string | null
    rawBody: string | null
  }
}

type RawSiteSettings = {
  layoutMetadata: {
    sourcePath: string
    rawMetaTitle: string | null
    rawMetaDescription: string | null
    rawIconPath: string | null
  }
  navbar: {
    sourcePath: string
    rawLogoPath: string | null
    rawCartDisplayText: string | null
  }
  navLinks: {
    sourcePath: string
    items: Array<{
      rawHref: string | null
      rawTarget: string | null
      rawText: string | null
    }>
  }
  footer: {
    sourcePath: string
    rawLogoPath: string | null
    rawFooterLegalText: string | null
    rawFooterLinks: Array<{
      rawText: string | null
      rawHref: string | null
    }>
    rawSocialIcons: Array<{
      rawClassName: string | null
      rawPlatform: string | null
    }>
  }
}

type ReviewNote = {
  code: string
  message: string
}

type BookProvenance = {
  sourcePath: string
  sourceSection: string
  sourceRoute: string
  rawTitle: string | null
  rawAuthorName: string | null
  rawTypeLabel: string | null
  rawPrice: string | null
  rawCompareAtPrice: string | null
  rawImagePath: string | null
}

type AuthorProvenance = {
  sourcePath: string
  sourceSection: string
  sourceRoute: string
  rawLegacyRoute: string | null
  rawPortraitPath: string | null
}

type SlugAssignment = {
  finalSlug: string
  collisionStrategy: string
}

type NormalizedBook = {
  key: string
  title: string
  slugCandidate: string
  slug: string
  slugCollisionStrategy: string
  authorName: string
  authorKey: string
  authorSlug: string
  coverImagePath: string | null
  typeLabel: string | null
  price: number | null
  compareAtPrice: number | null
  catalogVisible: boolean
  provenance: BookProvenance[]
  review: {
    reviewRequired: boolean
    notes: ReviewNote[]
  }
}

type NormalizedAuthor = {
  key: string
  name: string
  slugCandidate: string
  slug: string
  slugCollisionStrategy: string
  portraitPath: string | null
  lifeDatesDisplay: string | null
  metaTitle: string | null
  metaDescription: string | null
  legacyRoutes: string[]
  provenance: AuthorProvenance[]
  review: {
    reviewRequired: boolean
    notes: ReviewNote[]
  }
}

type EditorialHold = {
  holdKey: string
  reviewStatus: 'manual-review-required'
  contentKind: string
  targetField: string
  linkedEntityType: 'book' | 'author' | 'homepage'
  linkedEntityKey: string
  sourcePath: string
  sourceSection: string
  sourceRoute: string
  rawText: string | null
  rawParagraphs: string[]
  rawExternalLink: string | null
  reason: string
}

type SlugMapEntry = {
  entityType: 'book' | 'author'
  entityKey: string
  displayName: string
  candidateSlug: string
  finalSlug: string
  collisionStrategy: string
  legacyRoutes: string[]
  sourceRoutes: string[]
  provenance: Array<{
    sourcePath: string
    sourceSection: string
    sourceRoute: string
  }>
}

type AssetReference = {
  sourceArtifact: string
  location: string
  sourcePath: string
  sourceSection: string
  sourceRoute: string
}

type AssetMapEntry = {
  assetPath: string
  assetType: string
  migrationRole: 'payload-media-candidate' | 'static-code-managed' | 'manual-review'
  referenceStatus: 'used' | 'duplicate-reference' | 'orphan'
  referenceCount: number
  referencedBy: AssetReference[]
  notes: string[]
}

const repoRoot = process.cwd()
const migrationDataDir = path.join(repoRoot, 'migration-data')
const legacyPublicDir = path.join(repoRoot, 'legacy', 'public')

const readJsonFile = <T>(fileName: string): T => {
  const filePath = path.join(migrationDataDir, fileName)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Required raw artifact is missing: migration-data/${fileName}`)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

const writeJsonFile = (fileName: string, data: unknown): void => {
  fs.mkdirSync(migrationDataDir, { recursive: true })
  fs.writeFileSync(path.join(migrationDataDir, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const requireString = (value: string | null | undefined, context: string): string => {
  if (!value) {
    throw new Error(`Missing required string for ${context}`)
  }

  return value
}

const normalizeOptionalString = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const uniqueStrings = (values: Array<string | null | undefined>): string[] =>
  [...new Set(values.map((value) => normalizeOptionalString(value)).filter((value): value is string => Boolean(value)))]

const pickCanonicalString = (
  values: Array<string | null | undefined>,
  fallback: string | null,
  reviewNotes: ReviewNote[],
  fieldName: string,
): string | null => {
  const normalizedValues = values
    .map((value) => normalizeOptionalString(value))
    .filter((value): value is string => Boolean(value))

  if (normalizedValues.length === 0) {
    return fallback
  }

  const counts = new Map<string, number>()

  for (const value of normalizedValues) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  const ordered = [...counts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1]
    }

    return toComparisonKey(left[0]).localeCompare(toComparisonKey(right[0]))
  })

  if (ordered.length > 1) {
    reviewNotes.push({
      code: `${fieldName}-conflict`,
      message: `Conflicting raw values detected for ${fieldName}: ${ordered.map(([value]) => value).join(' | ')}`,
    })
  }

  return ordered[0]?.[0] ?? fallback
}

const pickCanonicalNumber = (
  values: Array<number | null | undefined>,
  reviewNotes: ReviewNote[],
  fieldName: string,
): number | null => {
  const normalizedValues = values.filter((value): value is number => typeof value === 'number')

  if (normalizedValues.length === 0) {
    return null
  }

  const counts = new Map<number, number>()

  for (const value of normalizedValues) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  const ordered = [...counts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1]
    }

    return left[0] - right[0]
  })

  if (ordered.length > 1) {
    reviewNotes.push({
      code: `${fieldName}-conflict`,
      message: `Conflicting numeric values detected for ${fieldName}: ${ordered.map(([value]) => value).join(', ')}`,
    })
  }

  return ordered[0]?.[0] ?? null
}

const inferAuthorNameFromHeroSummary = (
  rawSummary: string | null,
  candidateAuthorNames: string[],
): { authorName: string; reviewNote: ReviewNote } => {
  const summary = requireString(rawSummary, 'hero summary author inference')
  const comparisonSummary = toComparisonKey(summary)
  const matches = candidateAuthorNames.filter((candidate) =>
    comparisonSummary.includes(toComparisonKey(candidate)),
  )

  if (matches.length !== 1) {
    throw new Error(
      `Hero-only book author inference was not deterministic. Matches found: ${matches.join(', ') || 'none'}`,
    )
  }

  return {
    authorName: matches[0],
    reviewNote: {
      code: 'author-inferred-from-summary',
      message: 'Author name was inferred from hero summary text because the raw hero record omitted rawAuthorName.',
    },
  }
}

const buildSlugAssignments = <
  T extends {
    slugCandidate: string
    authorSlugCandidate?: string
  },
>(
  records: T[],
  entityType: 'book' | 'author',
): SlugAssignment[] => {
  const usedSlugs = new Set<string>()

  return records.map((record) => {
    const baseSlug = record.slugCandidate

    if (!usedSlugs.has(baseSlug)) {
      usedSlugs.add(baseSlug)
      return {
        finalSlug: baseSlug,
        collisionStrategy: 'base',
      }
    }

    if (entityType === 'book' && record.authorSlugCandidate) {
      const authorBasedSlug = `${baseSlug}-${record.authorSlugCandidate}`

      if (!usedSlugs.has(authorBasedSlug)) {
        usedSlugs.add(authorBasedSlug)
        return {
          finalSlug: authorBasedSlug,
          collisionStrategy: 'base-plus-author',
        }
      }
    }

    let counter = 2

    while (usedSlugs.has(`${baseSlug}-${counter}`)) {
      counter += 1
    }

    const numericSlug = `${baseSlug}-${counter}`
    usedSlugs.add(numericSlug)

    return {
      finalSlug: numericSlug,
      collisionStrategy: 'base-plus-numeric',
    }
  })
}

const rawBooks = readJsonFile<RawBook[]>('books.raw.json')
const rawAuthors = readJsonFile<RawAuthor[]>('authors.raw.json')
const rawHomepage = readJsonFile<RawHomepage>('homepage.raw.json')
const rawSiteSettings = readJsonFile<RawSiteSettings>('site-settings.raw.json')

if (!Array.isArray(rawBooks) || !Array.isArray(rawAuthors)) {
  throw new Error('Raw artifact arrays are malformed.')
}

const knownAuthorNames = uniqueStrings(rawAuthors.map((row) => row.rawName))
const heroInferredAuthor = inferAuthorNameFromHeroSummary(rawHomepage.hero.rawSummary, knownAuthorNames)

const authorGroupOrder: string[] = []
const authorGroups = new Map<string, RawAuthor[]>()

for (const row of rawAuthors) {
  const rawName = requireString(row.rawName, `${row.sourcePath} rawName`)
  const groupKey = toComparisonKey(rawName)

  if (!authorGroups.has(groupKey)) {
    authorGroupOrder.push(groupKey)
    authorGroups.set(groupKey, [])
  }

  authorGroups.get(groupKey)?.push(row)
}

const authorDraftRecords = authorGroupOrder.map((groupKey) => {
  const rows = authorGroups.get(groupKey) ?? []
  const reviewNotes: ReviewNote[] = []
  const name = requireString(
    pickCanonicalString(rows.map((row) => row.rawName), null, reviewNotes, 'name'),
    `author group ${groupKey} canonical name`,
  )

  const metaTitle = pickCanonicalString(
    rows.map((row) => row.rawMetaTitle),
    null,
    reviewNotes,
    'metaTitle',
  )
  const metaDescription = pickCanonicalString(
    rows.map((row) => row.rawMetaDescription),
    null,
    reviewNotes,
    'metaDescription',
  )

  if (metaTitle && !toComparisonKey(metaTitle).includes(groupKey)) {
    reviewNotes.push({
      code: 'meta-title-name-mismatch',
      message: 'Meta title does not match the canonical author name and should be reviewed manually.',
    })
  }

  if (metaDescription && !toComparisonKey(metaDescription).includes(groupKey)) {
    reviewNotes.push({
      code: 'meta-description-name-mismatch',
      message: 'Meta description does not match the canonical author name and should be reviewed manually.',
    })
  }

  return {
    name,
    slugCandidate: toSlugValue(name),
    portraitPath: pickCanonicalString(
      rows.map((row) => row.rawPortraitPath),
      null,
      reviewNotes,
      'portraitPath',
    ),
    lifeDatesDisplay: pickCanonicalString(
      rows.map((row) => row.rawLifeDatesDisplay),
      null,
      reviewNotes,
      'lifeDatesDisplay',
    ),
    metaTitle,
    metaDescription,
    legacyRoutes: uniqueStrings(rows.map((row) => row.rawLegacyRoute)).sort((left, right) =>
      toComparisonKey(left).localeCompare(toComparisonKey(right)),
    ),
    provenance: rows.map((row) => ({
      sourcePath: row.sourcePath,
      sourceSection: row.sourceSection,
      sourceRoute: row.sourceRoute,
      rawLegacyRoute: row.rawLegacyRoute,
      rawPortraitPath: row.rawPortraitPath,
    })),
    reviewNotes,
  }
})

const authorSlugAssignments = buildSlugAssignments(
  authorDraftRecords.map((record) => ({
    slugCandidate: record.slugCandidate,
  })),
  'author',
)

const authorsNormalized: NormalizedAuthor[] = authorDraftRecords
  .map((record, index) => {
    const slugAssignment = authorSlugAssignments[index]

    return {
      key: `author:${slugAssignment.finalSlug}`,
      name: record.name,
      slugCandidate: record.slugCandidate,
      slug: slugAssignment.finalSlug,
      slugCollisionStrategy: slugAssignment.collisionStrategy,
      portraitPath: record.portraitPath,
      lifeDatesDisplay: record.lifeDatesDisplay,
      metaTitle: record.metaTitle,
      metaDescription: record.metaDescription,
      legacyRoutes: record.legacyRoutes,
      provenance: record.provenance,
      review: {
        reviewRequired: record.reviewNotes.length > 0,
        notes: record.reviewNotes,
      },
    }
  })
  .sort((left, right) => left.slug.localeCompare(right.slug))

const authorByComparisonKey = new Map(
  authorsNormalized.map((author) => [toComparisonKey(author.name), author]),
)

const bookGroupOrder: string[] = []
const bookGroups = new Map<string, Array<RawBook & { resolvedAuthorName: string; inferenceNote?: ReviewNote }>>()

for (const row of rawBooks) {
  const title = requireString(row.rawTitle, `${row.sourcePath} rawTitle`)
  const resolvedAuthorName =
    normalizeOptionalString(row.rawAuthorName) ?? heroInferredAuthor.authorName
  const groupKey = `${toComparisonKey(title)}::${toComparisonKey(resolvedAuthorName)}`

  if (!bookGroups.has(groupKey)) {
    bookGroupOrder.push(groupKey)
    bookGroups.set(groupKey, [])
  }

  bookGroups.get(groupKey)?.push({
    ...row,
    resolvedAuthorName,
    inferenceNote: row.rawAuthorName ? undefined : heroInferredAuthor.reviewNote,
  })
}

const bookDraftRecords = bookGroupOrder.map((groupKey) => {
  const rows = bookGroups.get(groupKey) ?? []
  const reviewNotes: ReviewNote[] = []
  const title = requireString(
    pickCanonicalString(rows.map((row) => row.rawTitle), null, reviewNotes, 'title'),
    `book group ${groupKey} canonical title`,
  )
  const authorName = requireString(
    pickCanonicalString(rows.map((row) => row.resolvedAuthorName), null, reviewNotes, 'authorName'),
    `book group ${groupKey} canonical authorName`,
  )
  const author = authorByComparisonKey.get(toComparisonKey(authorName))

  if (!author) {
    throw new Error(`No normalized author found for book "${title}" with author "${authorName}"`)
  }

  const typeLabel = pickCanonicalString(
    rows.map((row) => row.rawTypeLabel),
    null,
    reviewNotes,
    'typeLabel',
  )

  if (!typeLabel) {
    reviewNotes.push({
      code: 'missing-type-label',
      message: 'No raw typeLabel exists for this book. Manual review is required before import.',
    })
  }

  const price = pickCanonicalNumber(
    rows.map((row, index) => parseRawPriceToVnd(row.rawPrice, `${groupKey} rawPrice occurrence #${index + 1}`)),
    reviewNotes,
    'price',
  )
  const compareAtPrice = pickCanonicalNumber(
    rows.map((row, index) =>
      parseRawPriceToVnd(row.rawCompareAtPrice, `${groupKey} rawCompareAtPrice occurrence #${index + 1}`),
    ),
    reviewNotes,
    'compareAtPrice',
  )

  if (price === null) {
    reviewNotes.push({
      code: 'missing-price',
      message: 'No raw price exists for this book. This is expected only for the hero-only book.',
    })
  }

  for (const row of rows) {
    if (row.inferenceNote) {
      reviewNotes.push(row.inferenceNote)
    }
  }

  const catalogVisible = rows.some((row) => row.sourceSection !== 'hero')

  if (!catalogVisible) {
    reviewNotes.push({
      code: 'hero-only-book',
      message: 'This book exists only in the homepage hero source and is normalized with catalogVisible=false.',
    })
  }

  return {
    title,
    slugCandidate: toSlugValue(title),
    authorName,
    author,
    coverImagePath: pickCanonicalString(
      rows.map((row) => row.rawImagePath),
      null,
      reviewNotes,
      'coverImagePath',
    ),
    typeLabel,
    price,
    compareAtPrice,
    catalogVisible,
    provenance: rows.map((row) => ({
      sourcePath: row.sourcePath,
      sourceSection: row.sourceSection,
      sourceRoute: row.sourceRoute,
      rawTitle: row.rawTitle,
      rawAuthorName: row.rawAuthorName,
      rawTypeLabel: row.rawTypeLabel,
      rawPrice: row.rawPrice,
      rawCompareAtPrice: row.rawCompareAtPrice,
      rawImagePath: row.rawImagePath,
    })),
    reviewNotes,
  }
})

const bookSlugAssignments = buildSlugAssignments(
  bookDraftRecords.map((record) => ({
    slugCandidate: record.slugCandidate,
    authorSlugCandidate: record.author.slug,
  })),
  'book',
)

const booksNormalized: NormalizedBook[] = bookDraftRecords
  .map((record, index) => {
    const slugAssignment = bookSlugAssignments[index]

    return {
      key: `book:${slugAssignment.finalSlug}`,
      title: record.title,
      slugCandidate: record.slugCandidate,
      slug: slugAssignment.finalSlug,
      slugCollisionStrategy: slugAssignment.collisionStrategy,
      authorName: record.authorName,
      authorKey: record.author.key,
      authorSlug: record.author.slug,
      coverImagePath: record.coverImagePath,
      typeLabel: record.typeLabel,
      price: record.price,
      compareAtPrice: record.compareAtPrice,
      catalogVisible: record.catalogVisible,
      provenance: record.provenance,
      review: {
        reviewRequired: record.reviewNotes.length > 0,
        notes: record.reviewNotes,
      },
    }
  })
  .sort((left, right) => left.slug.localeCompare(right.slug))

const bookByCompositeKey = new Map(
  booksNormalized.map((book) => [
    `${toComparisonKey(book.title)}::${toComparisonKey(book.authorName)}`,
    book,
  ]),
)

const bookByTitleComparisonKey = new Map(
  booksNormalized.map((book) => [toComparisonKey(book.title), book]),
)

if (booksNormalized.length !== 13) {
  throw new Error(`Expected 13 normalized books, found ${booksNormalized.length}`)
}

if (authorsNormalized.length !== 8) {
  throw new Error(`Expected 8 normalized authors, found ${authorsNormalized.length}`)
}

const heroBook = bookByTitleComparisonKey.get(
  toComparisonKey(requireString(rawHomepage.hero.rawTitle, 'homepage hero title')),
)

if (!heroBook) {
  throw new Error('Homepage hero book could not be resolved to a normalized book record.')
}

const spotlightAuthor = authorByComparisonKey.get(
  toComparisonKey(requireString(rawHomepage.authorSpotlight.rawName, 'homepage author spotlight rawName')),
)

if (!spotlightAuthor) {
  throw new Error('Homepage author spotlight could not be resolved to a normalized author record.')
}

const editorialHolds: EditorialHold[] = [
  {
    holdKey: 'homepage-hero-summary',
    reviewStatus: 'manual-review-required' as const,
    contentKind: 'uncertain-short-copy',
    targetField: 'homepage.hero.reviewedShortCopy',
    linkedEntityType: 'book' as const,
    linkedEntityKey: heroBook.key,
    sourcePath: rawHomepage.hero.sourcePath,
    sourceSection: 'hero',
    sourceRoute: rawHomepage.hero.sourceRoute,
    rawText: rawHomepage.hero.rawSummary,
    rawParagraphs: [],
    rawExternalLink: rawHomepage.hero.rawBuyLinkUrl,
    reason: 'Hero summary is external-link-derived marketing copy and must be manually reviewed before publication.',
  },
  {
    holdKey: 'homepage-author-spotlight-summary',
    reviewStatus: 'manual-review-required' as const,
    contentKind: 'uncertain-short-copy',
    targetField: 'homepage.authorSpotlight.reviewedShortCopy',
    linkedEntityType: 'author' as const,
    linkedEntityKey: spotlightAuthor.key,
    sourcePath: rawHomepage.authorSpotlight.sourcePath,
    sourceSection: 'authorSpotlight',
    sourceRoute: rawHomepage.authorSpotlight.sourceRoute,
    rawText: rawHomepage.authorSpotlight.rawSummary,
    rawParagraphs: [],
    rawExternalLink: rawHomepage.authorSpotlight.rawExternalLink,
    reason: 'Author spotlight summary appears to be external-source-derived biographical copy and must stay out of public content.',
  },
  ...authorsNormalized.flatMap((author) => {
    const detailRows = rawAuthors.filter(
      (row) =>
        toComparisonKey(requireString(row.rawName, `${row.sourcePath} rawName`)) ===
          toComparisonKey(author.name) &&
        row.sourceSection === 'authorDetail' &&
        row.rawLongFormParagraphs.length > 0,
    )

    return detailRows.map<EditorialHold>((row) => ({
      holdKey: `author-biography:${author.slug}`,
      reviewStatus: 'manual-review-required',
      contentKind: 'long-form-biography',
      targetField: 'authors.biography',
      linkedEntityType: 'author',
      linkedEntityKey: author.key,
      sourcePath: row.sourcePath,
      sourceSection: row.sourceSection,
      sourceRoute: row.sourceRoute,
      rawText: null,
      rawParagraphs: row.rawLongFormParagraphs,
      rawExternalLink: row.rawExternalLink,
      reason: 'Long-form biography copy is external-source-derived and must remain in review-only artifacts.',
    }))
  }),
].sort((left, right) => left.holdKey.localeCompare(right.holdKey))

const homepageNormalized = {
  hero: {
    eyebrow: rawHomepage.hero.rawEyebrow,
    featuredBookKey: heroBook.key,
    reviewedShortCopy: null,
    shortCopyEditorialHoldKey: 'homepage-hero-summary',
    buyLinkUrl: rawHomepage.hero.rawBuyLinkUrl,
    sampleLinkUrl: rawHomepage.hero.rawSampleLinkUrl,
    provenance: {
      sourcePath: rawHomepage.hero.sourcePath,
      sourceRoute: rawHomepage.hero.sourceRoute,
    },
  },
  authorSpotlight: {
    eyebrow: rawHomepage.authorSpotlight.rawEyebrow,
    featuredAuthorKey: spotlightAuthor.key,
    reviewedShortCopy: null,
    shortCopyEditorialHoldKey: 'homepage-author-spotlight-summary',
    provenance: {
      sourcePath: rawHomepage.authorSpotlight.sourcePath,
      sourceRoute: rawHomepage.authorSpotlight.sourceRoute,
    },
  },
  bestSellers: {
    bookKeys: rawHomepage.bestSellers.items.map((item, index) => {
      const compositeKey = `${toComparisonKey(requireString(item.rawTitle, `homepage bestSellers #${index + 1} rawTitle`))}::${toComparisonKey(requireString(item.rawAuthorName, `homepage bestSellers #${index + 1} rawAuthorName`))}`
      const book = bookByCompositeKey.get(compositeKey)

      if (!book) {
        throw new Error(`Unable to resolve homepage best seller book #${index + 1}`)
      }

      return book.key
    }),
    provenance: {
      sourcePath: rawHomepage.bestSellers.sourcePath,
      sourceRoute: rawHomepage.bestSellers.sourceRoute,
    },
  },
  awards: rawHomepage.awards.items.map((item, index) => ({
    iconKey: requireString(
      normalizeOptionalString(item.rawIconPath)?.replace(/^\//, '').replace(/\.svg$/, ''),
      `homepage awards #${index + 1} iconKey`,
    ),
    title: item.rawTitle,
    body: item.rawBody,
    provenance: {
      sourcePath: rawHomepage.awards.sourcePath,
      sourceRoute: rawHomepage.awards.sourceRoute,
      rawIconPath: item.rawIconPath,
      rawIconAlt: item.rawIconAlt,
    },
  })),
  newsletterCta: {
    heading: rawHomepage.newsletterCta.rawHeading,
    body: rawHomepage.newsletterCta.rawBody,
    provenance: {
      sourcePath: rawHomepage.newsletterCta.sourcePath,
      sourceRoute: rawHomepage.newsletterCta.sourceRoute,
    },
  },
}

const rawLayoutTitle = normalizeOptionalString(rawSiteSettings.layoutMetadata.rawMetaTitle)
const inferredSiteName = normalizeOptionalString(rawLayoutTitle?.split('|')[0] ?? null)
const normalizedFooterLinks = rawSiteSettings.footer.rawFooterLinks
  .map((item) => ({
    label: normalizeOptionalString(item.rawText),
    rawHref: normalizeOptionalString(item.rawHref),
  }))
  .filter(
    (item): item is { label: string; rawHref: string } =>
      Boolean(item.label) && Boolean(item.rawHref),
  )
  .flatMap((item) => {
    if (item.rawHref === '/' && item.label === 'Trang chủ') {
      return [{ label: item.label, href: '/' }]
    }

    if (item.rawHref === '/booksPage' && item.label === 'Sách') {
      return [{ label: item.label, href: '/books' }]
    }

    if (item.rawHref === '/authorsPage' && item.label === 'Tác giả') {
      return [{ label: item.label, href: '/authors' }]
    }

    return []
  })

const normalizedSiteSettings = {
  siteName: inferredSiteName,
  defaultMetaTitle: inferredSiteName,
  defaultMetaDescription: rawSiteSettings.layoutMetadata.rawMetaDescription,
  footerLegalText: rawSiteSettings.footer.rawFooterLegalText,
  footerLinks: normalizedFooterLinks,
  socialLinks: [] as Array<{ platform: string; url: string }>,
  review: {
    siteName: {
      reviewRequired: true,
      evidenceType: 'inferred-from-layout-title-prefix',
      sourcePath: rawSiteSettings.layoutMetadata.sourcePath,
      rawValue: rawSiteSettings.layoutMetadata.rawMetaTitle,
      note: 'Derived from the layout metadata title prefix because no stronger site-wide title source exists in raw artifacts.',
    },
    defaultMetaTitle: {
      reviewRequired: true,
      evidenceType: 'inferred-from-layout-title-prefix',
      sourcePath: rawSiteSettings.layoutMetadata.sourcePath,
      rawValue: rawSiteSettings.layoutMetadata.rawMetaTitle,
      note: 'Default meta title is inferred from the layout title prefix and should be reviewed manually.',
    },
    defaultMetaDescription: {
      reviewRequired: false,
      evidenceType: 'direct-from-layout-metadata',
      sourcePath: rawSiteSettings.layoutMetadata.sourcePath,
      rawValue: rawSiteSettings.layoutMetadata.rawMetaDescription,
      note: 'Layout metadata description is directly evidenced in raw extraction.',
    },
    footerLinks: {
      reviewRequired: false,
      evidenceType: 'normalized-stable-subset',
      sourcePath: rawSiteSettings.footer.sourcePath,
      note: 'Footer links were normalized to the approved stable subset only.',
    },
    socialLinks: {
      reviewRequired: false,
      evidenceType: 'icons-without-urls',
      sourcePath: rawSiteSettings.footer.sourcePath,
      note: 'Social links normalize to an empty array because legacy raw evidence contains icons but no URLs.',
    },
    exclusions: [
      'navLinks intentionally excluded from normalized site settings per v1 boundary.',
      'Navbar and footer logo assets remain code-managed and are excluded from normalized site settings.',
      'Layout icon evidence is excluded from v1 site settings.',
    ],
  },
  provenance: {
    layoutMetadata: rawSiteSettings.layoutMetadata.sourcePath,
    footer: rawSiteSettings.footer.sourcePath,
  },
}

const slugMap: SlugMapEntry[] = [
  ...authorsNormalized.map((author) => ({
    entityType: 'author' as const,
    entityKey: author.key,
    displayName: author.name,
    candidateSlug: author.slugCandidate,
    finalSlug: author.slug,
    collisionStrategy: author.slugCollisionStrategy,
    legacyRoutes: author.legacyRoutes,
    sourceRoutes: uniqueStrings(author.provenance.map((item) => item.sourceRoute)),
    provenance: author.provenance.map((item) => ({
      sourcePath: item.sourcePath,
      sourceSection: item.sourceSection,
      sourceRoute: item.sourceRoute,
    })),
  })),
  ...booksNormalized.map((book) => ({
    entityType: 'book' as const,
    entityKey: book.key,
    displayName: book.title,
    candidateSlug: book.slugCandidate,
    finalSlug: book.slug,
    collisionStrategy: book.slugCollisionStrategy,
    legacyRoutes: [],
    sourceRoutes: uniqueStrings(book.provenance.map((item) => item.sourceRoute)),
    provenance: book.provenance.map((item) => ({
      sourcePath: item.sourcePath,
      sourceSection: item.sourceSection,
      sourceRoute: item.sourceRoute,
    })),
  })),
].sort((left, right) => {
  if (left.entityType !== right.entityType) {
    return left.entityType.localeCompare(right.entityType)
  }

  return left.finalSlug.localeCompare(right.finalSlug)
})

const assetReferences = new Map<string, AssetReference[]>()

const addAssetReference = (assetPath: string | null | undefined, reference: AssetReference): void => {
  const normalizedPath = normalizeAssetPath(assetPath)

  if (!normalizedPath) {
    return
  }

  if (!assetReferences.has(normalizedPath)) {
    assetReferences.set(normalizedPath, [])
  }

  assetReferences.get(normalizedPath)?.push(reference)
}

for (const row of rawBooks) {
  addAssetReference(row.rawImagePath, {
    sourceArtifact: 'books.raw.json',
    location: 'rawImagePath',
    sourcePath: row.sourcePath,
    sourceSection: row.sourceSection,
    sourceRoute: row.sourceRoute,
  })
}

for (const row of rawAuthors) {
  addAssetReference(row.rawPortraitPath, {
    sourceArtifact: 'authors.raw.json',
    location: 'rawPortraitPath',
    sourcePath: row.sourcePath,
    sourceSection: row.sourceSection,
    sourceRoute: row.sourceRoute,
  })
}

addAssetReference(rawHomepage.hero.rawImagePath, {
  sourceArtifact: 'homepage.raw.json',
  location: 'hero.rawImagePath',
  sourcePath: rawHomepage.hero.sourcePath,
  sourceSection: 'hero',
  sourceRoute: rawHomepage.hero.sourceRoute,
})
addAssetReference(rawHomepage.authorSpotlight.rawPortraitPath, {
  sourceArtifact: 'homepage.raw.json',
  location: 'authorSpotlight.rawPortraitPath',
  sourcePath: rawHomepage.authorSpotlight.sourcePath,
  sourceSection: 'authorSpotlight',
  sourceRoute: rawHomepage.authorSpotlight.sourceRoute,
})

for (const item of rawHomepage.awards.items) {
  addAssetReference(item.rawIconPath, {
    sourceArtifact: 'homepage.raw.json',
    location: 'awards.rawIconPath',
    sourcePath: rawHomepage.awards.sourcePath,
    sourceSection: 'awards',
    sourceRoute: rawHomepage.awards.sourceRoute,
  })
}

for (const item of rawHomepage.bestSellers.items) {
  addAssetReference(item.rawImagePath, {
    sourceArtifact: 'homepage.raw.json',
    location: 'bestSellers.rawImagePath',
    sourcePath: rawHomepage.bestSellers.sourcePath,
    sourceSection: 'bestSellers',
    sourceRoute: rawHomepage.bestSellers.sourceRoute,
  })
}

addAssetReference(rawSiteSettings.navbar.rawLogoPath, {
  sourceArtifact: 'site-settings.raw.json',
  location: 'navbar.rawLogoPath',
  sourcePath: rawSiteSettings.navbar.sourcePath,
  sourceSection: 'navbar',
  sourceRoute: '/',
})
addAssetReference(rawSiteSettings.footer.rawLogoPath, {
  sourceArtifact: 'site-settings.raw.json',
  location: 'footer.rawLogoPath',
  sourcePath: rawSiteSettings.footer.sourcePath,
  sourceSection: 'footer',
  sourceRoute: '/',
})

const assetInventory = listFilesRecursive(legacyPublicDir)
  .filter((absolutePath) => fs.statSync(absolutePath).isFile())
  .map((absolutePath) => `/${path.relative(legacyPublicDir, absolutePath).split(path.sep).join('/')}`)
  .sort((left, right) => left.localeCompare(right))

const assetsMap: AssetMapEntry[] = assetInventory.map((assetPath) => {
  const references = assetReferences.get(assetPath) ?? []
  const notes: string[] = []
  let assetType = 'unclassified'
  let migrationRole: AssetMapEntry['migrationRole'] = 'manual-review'

  if (assetPath.startsWith('/author/')) {
    assetType = 'author-portrait'
    migrationRole = 'payload-media-candidate'
  } else if (assetPath.startsWith('/books/') || assetPath.startsWith('/home/')) {
    assetType = 'book-cover'
    migrationRole = 'payload-media-candidate'
  } else if (assetPath === '/site-logo.svg' || assetPath === '/site-logo-white.svg') {
    assetType = 'site-logo'
    migrationRole = 'static-code-managed'
  } else if (
    assetPath === '/ultra.svg' ||
    assetPath === '/mega.svg' ||
    assetPath === '/hyper-best.svg' ||
    assetPath === '/ultimate-winer.svg'
  ) {
    assetType = 'award-icon'
    migrationRole = 'static-code-managed'
  } else if (assetPath === '/book-store.png') {
    assetType = 'orphan-asset'
    migrationRole = 'manual-review'
    notes.push('Legacy public asset exists on disk but is not referenced by the approved raw artifacts.')
  }

  if (assetPath === '/ultimate-winer.svg') {
    notes.push('Legacy filename retains the "ultimate-winer" typo and should be reviewed, not renamed in-place.')
  }

  const referenceStatus: AssetMapEntry['referenceStatus'] =
    references.length === 0 ? 'orphan' : references.length === 1 ? 'used' : 'duplicate-reference'

  if (referenceStatus === 'duplicate-reference') {
    notes.push('Asset is reused across multiple legacy surfaces; this is a repeated reference, not a duplicate file.')
  }

  return {
    assetPath,
    assetType,
    migrationRole,
    referenceStatus,
    referenceCount: references.length,
    referencedBy: references,
    notes,
  }
})

writeJsonFile('books.normalized.json', booksNormalized)
writeJsonFile('authors.normalized.json', authorsNormalized)
writeJsonFile('homepage.normalized.json', homepageNormalized)
writeJsonFile('site-settings.normalized.json', normalizedSiteSettings)
writeJsonFile('assets-map.json', assetsMap)
writeJsonFile('slug-map.json', slugMap)
writeJsonFile('editorial-holds.json', editorialHolds)

console.log(`Wrote migration-data/books.normalized.json (${booksNormalized.length} rows)`)
console.log(`Wrote migration-data/authors.normalized.json (${authorsNormalized.length} rows)`)
console.log('Wrote migration-data/homepage.normalized.json')
console.log('Wrote migration-data/site-settings.normalized.json')
console.log(`Wrote migration-data/assets-map.json (${assetsMap.length} rows)`)
console.log(`Wrote migration-data/slug-map.json (${slugMap.length} rows)`)
console.log(`Wrote migration-data/editorial-holds.json (${editorialHolds.length} rows)`)
