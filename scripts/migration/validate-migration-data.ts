import fs from 'node:fs'
import path from 'node:path'

import { parseRawPriceToVnd } from './lib/price'
import { toSlugValue } from './lib/slug'
import { QACollector, readJsonArtifact, writeQaReport } from './lib/qa'

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
  provenance: Array<{
    sourcePath: string
    sourceSection: string
    sourceRoute: string
    rawTitle: string | null
    rawAuthorName: string | null
    rawTypeLabel: string | null
    rawPrice: string | null
    rawCompareAtPrice: string | null
    rawImagePath: string | null
  }>
  review: {
    reviewRequired: boolean
    notes: Array<{ code: string; message: string }>
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
  provenance: Array<{
    sourcePath: string
    sourceSection: string
    sourceRoute: string
    rawLegacyRoute: string | null
    rawPortraitPath: string | null
  }>
  review: {
    reviewRequired: boolean
    notes: Array<{ code: string; message: string }>
  }
}

type HomepageNormalized = {
  hero: {
    eyebrow: string | null
    featuredBookKey: string
    reviewedShortCopy: string | null
    shortCopyEditorialHoldKey: string
    buyLinkUrl: string | null
    sampleLinkUrl: string | null
    provenance: {
      sourcePath: string
      sourceRoute: string
    }
  }
  authorSpotlight: {
    eyebrow: string | null
    featuredAuthorKey: string
    reviewedShortCopy: string | null
    shortCopyEditorialHoldKey: string
    provenance: {
      sourcePath: string
      sourceRoute: string
    }
  }
  bestSellers: {
    bookKeys: string[]
    provenance: {
      sourcePath: string
      sourceRoute: string
    }
  }
  awards: Array<{
    iconKey: string
    title: string | null
    body: string | null
    provenance: {
      sourcePath: string
      sourceRoute: string
      rawIconPath: string | null
      rawIconAlt: string | null
    }
  }>
  newsletterCta: {
    heading: string | null
    body: string | null
    provenance: {
      sourcePath: string
      sourceRoute: string
    }
  }
}

type SiteSettingsNormalized = {
  siteName: string | null
  defaultMetaTitle: string | null
  defaultMetaDescription: string | null
  footerLegalText: string | null
  footerLinks: Array<{
    label: string
    href: string
  }>
  socialLinks: Array<{
    platform: string
    url: string
  }>
  review?: {
    siteName?: {
      reviewRequired: boolean
      evidenceType: string
      sourcePath: string
      rawValue: string | null
      note: string
    }
    defaultMetaTitle?: {
      reviewRequired: boolean
      evidenceType: string
      sourcePath: string
      rawValue: string | null
      note: string
    }
    defaultMetaDescription?: {
      reviewRequired: boolean
      evidenceType: string
      sourcePath: string
      rawValue: string | null
      note: string
    }
    footerLinks?: {
      reviewRequired: boolean
      evidenceType: string
      sourcePath: string
      note: string
    }
    socialLinks?: {
      reviewRequired: boolean
      evidenceType: string
      sourcePath: string
      note: string
    }
    exclusions?: string[]
  }
}

type AssetMapEntry = {
  assetPath: string
  assetType: string
  migrationRole: 'payload-media-candidate' | 'static-code-managed' | 'manual-review'
  referenceStatus: 'used' | 'duplicate-reference' | 'orphan'
  referenceCount: number
  referencedBy: Array<{
    sourceArtifact: string
    location: string
    sourcePath: string
    sourceSection: string
    sourceRoute: string
  }>
  notes: string[]
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

type RedirectEntry = {
  source: string
  destination: string
  permanent: true
}

type ManualRedirectEntry = {
  source: string
  reason: string
  suggestedAction: 'manual-review'
}

const repoRoot = process.cwd()
const migrationDataDir = path.join(repoRoot, 'migration-data')
const qa = new QACollector()

const requiredArtifacts = [
  'books.raw.json',
  'authors.raw.json',
  'homepage.raw.json',
  'site-settings.raw.json',
  'books.normalized.json',
  'authors.normalized.json',
  'homepage.normalized.json',
  'site-settings.normalized.json',
  'assets-map.json',
  'slug-map.json',
  'editorial-holds.json',
  'redirects.generated.json',
  'redirects.manual-review.json',
]

for (const artifactName of requiredArtifacts) {
  qa.assert(
    `artifact:${artifactName}`,
    fs.existsSync(path.join(migrationDataDir, artifactName)),
    `Missing required artifact: migration-data/${artifactName}`,
  )
}

const booksRaw = readJsonArtifact<RawBook[]>(migrationDataDir, 'books.raw.json')
const authorsRaw = readJsonArtifact<RawAuthor[]>(migrationDataDir, 'authors.raw.json')
const homepageRaw = readJsonArtifact<Record<string, unknown>>(migrationDataDir, 'homepage.raw.json')
const siteSettingsRaw = readJsonArtifact<Record<string, unknown>>(migrationDataDir, 'site-settings.raw.json')
const booksNormalized = readJsonArtifact<NormalizedBook[]>(migrationDataDir, 'books.normalized.json')
const authorsNormalized = readJsonArtifact<NormalizedAuthor[]>(migrationDataDir, 'authors.normalized.json')
const homepageNormalized = readJsonArtifact<HomepageNormalized>(migrationDataDir, 'homepage.normalized.json')
const siteSettingsNormalized = readJsonArtifact<SiteSettingsNormalized>(
  migrationDataDir,
  'site-settings.normalized.json',
)
const assetsMap = readJsonArtifact<AssetMapEntry[]>(migrationDataDir, 'assets-map.json')
const slugMap = readJsonArtifact<SlugMapEntry[]>(migrationDataDir, 'slug-map.json')
const editorialHolds = readJsonArtifact<EditorialHold[]>(migrationDataDir, 'editorial-holds.json')
const redirectsGenerated = readJsonArtifact<RedirectEntry[]>(migrationDataDir, 'redirects.generated.json')
const redirectsManualReview = readJsonArtifact<ManualRedirectEntry[]>(
  migrationDataDir,
  'redirects.manual-review.json',
)

qa.assert(
  'raw-counts:books',
  booksRaw.length === 17,
  'books.raw.json must contain exactly 17 rows.',
  { expected: 17, observed: booksRaw.length },
)
qa.assert(
  'raw-counts:authors',
  authorsRaw.length === 17,
  'authors.raw.json must contain exactly 17 rows.',
  { expected: 17, observed: authorsRaw.length },
)
qa.assert(
  'raw-structure:homepage',
  ['hero', 'authorSpotlight', 'awards', 'bestSellers', 'newsletterCta'].every((key) =>
    Object.prototype.hasOwnProperty.call(homepageRaw, key),
  ),
  'homepage.raw.json is missing one or more required top-level sections.',
  { observed: Object.keys(homepageRaw) },
)
qa.assert(
  'raw-structure:site-settings',
  ['layoutMetadata', 'navbar', 'navLinks', 'footer'].every((key) =>
    Object.prototype.hasOwnProperty.call(siteSettingsRaw, key),
  ),
  'site-settings.raw.json is missing one or more required top-level sections.',
  { observed: Object.keys(siteSettingsRaw) },
)

qa.assert(
  'normalized-counts:books',
  booksNormalized.length === 13,
  'books.normalized.json must contain exactly 13 rows.',
  { expected: 13, observed: booksNormalized.length },
)
qa.assert(
  'normalized-counts:authors',
  authorsNormalized.length === 8,
  'authors.normalized.json must contain exactly 8 rows.',
  { expected: 8, observed: authorsNormalized.length },
)
qa.assert(
  'normalized-counts:assets',
  assetsMap.length === 28,
  'assets-map.json must contain exactly 28 assets.',
  { expected: 28, observed: assetsMap.length },
)

const uniqueTypeLabels = [...new Set(booksNormalized.map((book) => book.typeLabel).filter(Boolean))].sort()
const expectedTypeLabels = ['Tiểu thuyết', 'Truyện dài', 'Truyện ngắn', 'Truyện thơ']
qa.assert(
  'books:type-labels',
  JSON.stringify(uniqueTypeLabels) === JSON.stringify(expectedTypeLabels),
  'Normalized books must contain exactly the approved four type labels.',
  { expected: expectedTypeLabels, observed: uniqueTypeLabels },
)

const booksWithMissingTypeLabel = booksNormalized.filter((book) => book.typeLabel === null)

const heroBook = booksNormalized.find((book) => book.title === 'Ngày xưa có một chuyện tình')
qa.assert(
  'books:hero-exists',
  Boolean(heroBook),
  'Hero-only book is missing from books.normalized.json.',
)
qa.assert(
  'books:hero-catalog-visible-false',
  heroBook?.catalogVisible === false,
  'Hero-only book must have catalogVisible=false.',
  { observed: heroBook?.catalogVisible ?? null },
)
qa.assert(
  'books:type-label-null-policy',
  booksWithMissingTypeLabel.length === 1 &&
    booksWithMissingTypeLabel[0]?.title === 'Ngày xưa có một chuyện tình' &&
    booksWithMissingTypeLabel[0]?.catalogVisible === false,
  'Only the hero-only book may have a null typeLabel at this stage, and it must remain catalogVisible=false.',
  {
    observed: booksWithMissingTypeLabel.map((book) => ({
      key: book.key,
      title: book.title,
      catalogVisible: book.catalogVisible,
    })),
  },
)

const hiddenBooks = booksNormalized.filter((book) => book.catalogVisible === false)
qa.assert(
  'books:only-hero-hidden',
  hiddenBooks.length === 1 && hiddenBooks[0]?.title === 'Ngày xưa có một chuyện tình',
  'Only the hero-only book may be normalized with catalogVisible=false at this stage.',
  { observed: hiddenBooks.map((book) => ({ title: book.title, key: book.key })) },
)

const bookSlugs = booksNormalized.map((book) => book.slug)
qa.assert(
  'books:slug-uniqueness',
  new Set(bookSlugs).size === bookSlugs.length,
  'Normalized book slugs must be unique.',
  { observed: bookSlugs },
)

qa.assert(
  'books:price-types',
  booksNormalized.every(
    (book) =>
      (book.price === null || typeof book.price === 'number') &&
      (book.compareAtPrice === null || typeof book.compareAtPrice === 'number'),
  ),
  'Normalized book prices must be numeric where present.',
)

const observedRawPriceStrings = booksRaw.flatMap((book) =>
  [book.rawPrice, book.rawCompareAtPrice].filter((value): value is string => typeof value === 'string'),
)
const parsedRawPrices = observedRawPriceStrings.map((value, index) =>
  parseRawPriceToVnd(value, `validation raw price #${index + 1}`),
)
qa.assert(
  'books:raw-price-count',
  observedRawPriceStrings.length === 23,
  'Expected exactly 23 observed raw price strings across raw book artifacts.',
  { expected: 23, observed: observedRawPriceStrings.length },
)
qa.assert(
  'books:raw-prices-parseable',
  parsedRawPrices.every((value) => typeof value === 'number'),
  'All observed raw price strings must parse successfully.',
)

const authorSlugs = authorsNormalized.map((author) => author.slug)
qa.assert(
  'authors:slug-uniqueness',
  new Set(authorSlugs).size === authorSlugs.length,
  'Normalized author slugs must be unique.',
  { observed: authorSlugs },
)

const authorPublicFieldLeak = authorsNormalized.some((author) =>
  ['rawShortSummary', 'rawLongFormParagraphs', 'biography'].some((field) =>
    Object.prototype.hasOwnProperty.call(author as unknown as Record<string, unknown>, field),
  ),
)
qa.assert(
  'authors:no-public-biography-leak',
  !authorPublicFieldLeak,
  'Normalized authors must not include suspicious long-form biography content in public fields.',
)

const authorBiographyHolds = editorialHolds.filter(
  (hold) => hold.linkedEntityType === 'author' && hold.contentKind === 'long-form-biography',
)
qa.assert(
  'authors:biography-editorial-holds',
  authorBiographyHolds.length === 8,
  'Author detail long-form biography material must be preserved in editorial-holds.json.',
  { expected: 8, observed: authorBiographyHolds.length },
)

const bookKeys = new Set(booksNormalized.map((book) => book.key))
const authorKeys = new Set(authorsNormalized.map((author) => author.key))
const editorialHoldKeys = new Set(editorialHolds.map((hold) => hold.holdKey))

qa.assert(
  'homepage:top-level-structure',
  ['hero', 'authorSpotlight', 'bestSellers', 'awards', 'newsletterCta'].every((key) =>
    Object.prototype.hasOwnProperty.call(homepageNormalized, key),
  ),
  'homepage.normalized.json is missing one or more required top-level sections.',
  { observed: Object.keys(homepageNormalized as Record<string, unknown>) },
)
qa.assert(
  'homepage:hero-reference',
  bookKeys.has(homepageNormalized.hero.featuredBookKey),
  'Homepage hero.featuredBookKey must point to an existing normalized book.',
  { observed: homepageNormalized.hero.featuredBookKey },
)
qa.assert(
  'homepage:author-spotlight-reference',
  authorKeys.has(homepageNormalized.authorSpotlight.featuredAuthorKey),
  'Homepage authorSpotlight.featuredAuthorKey must point to an existing normalized author.',
  { observed: homepageNormalized.authorSpotlight.featuredAuthorKey },
)
qa.assert(
  'homepage:best-sellers-references',
  homepageNormalized.bestSellers.bookKeys.every((key) => bookKeys.has(key)),
  'Homepage bestSellers.bookKeys must all point to existing normalized books.',
  { observed: homepageNormalized.bestSellers.bookKeys },
)
qa.assert(
  'homepage:hero-short-copy-held',
  homepageNormalized.hero.reviewedShortCopy === null &&
    editorialHoldKeys.has(homepageNormalized.hero.shortCopyEditorialHoldKey),
  'Homepage hero short copy must stay review-held instead of being published directly.',
)
qa.assert(
  'homepage:author-spotlight-short-copy-held',
  homepageNormalized.authorSpotlight.reviewedShortCopy === null &&
    editorialHoldKeys.has(homepageNormalized.authorSpotlight.shortCopyEditorialHoldKey),
  'Homepage author spotlight short copy must stay review-held instead of being published directly.',
)

qa.assert(
  'site-settings:no-nav-links',
  !Object.prototype.hasOwnProperty.call(siteSettingsNormalized as Record<string, unknown>, 'navLinks'),
  'site-settings.normalized.json must exclude navLinks.',
)
qa.assert(
  'site-settings:social-links-empty',
  Array.isArray(siteSettingsNormalized.socialLinks) && siteSettingsNormalized.socialLinks.length === 0,
  'site-settings.normalized.json must normalize socialLinks to an empty array.',
  { observed: siteSettingsNormalized.socialLinks },
)

const normalizedFooterHrefs = siteSettingsNormalized.footerLinks.map((item) => item.href)
qa.assert(
  'site-settings:footer-links-stable-subset',
  JSON.stringify(normalizedFooterHrefs) === JSON.stringify(['/', '/books', '/authors']),
  'site-settings.normalized.json must contain only the approved stable footer link subset.',
  { expected: ['/', '/books', '/authors'], observed: normalizedFooterHrefs },
)

qa.assert(
  'site-settings:required-values-present',
  Boolean(
    siteSettingsNormalized.siteName &&
      siteSettingsNormalized.defaultMetaTitle &&
      siteSettingsNormalized.defaultMetaDescription,
  ),
  'Normalized site settings must contain siteName, defaultMetaTitle, and defaultMetaDescription.',
  {
    observed: {
      siteName: siteSettingsNormalized.siteName,
      defaultMetaTitle: siteSettingsNormalized.defaultMetaTitle,
      defaultMetaDescription: siteSettingsNormalized.defaultMetaDescription,
    },
  },
)

qa.assert(
  'site-settings:reviewable-metadata',
  Boolean(siteSettingsNormalized.review?.siteName?.reviewRequired) &&
    Boolean(siteSettingsNormalized.review?.defaultMetaTitle?.reviewRequired),
  'Weakly evidenced site-wide metadata must remain reviewable in normalized output.',
)

if (siteSettingsNormalized.review?.siteName?.reviewRequired) {
  qa.warn(
    'site-settings:site-name-inferred',
    'siteName is inferred from layout metadata title prefix and should be manually reviewed.',
    {
      rawValue: siteSettingsNormalized.review.siteName.rawValue,
      sourcePath: siteSettingsNormalized.review.siteName.sourcePath,
    },
  )
}

if (siteSettingsNormalized.review?.defaultMetaTitle?.reviewRequired) {
  qa.warn(
    'site-settings:default-meta-title-inferred',
    'defaultMetaTitle is inferred from layout metadata title prefix and should be manually reviewed.',
    {
      rawValue: siteSettingsNormalized.review.defaultMetaTitle.rawValue,
      sourcePath: siteSettingsNormalized.review.defaultMetaTitle.sourcePath,
    },
  )
}

qa.assert(
  'assets:count',
  assetsMap.length === 28,
  'assets-map.json must cover all 28 legacy assets.',
  { expected: 28, observed: assetsMap.length },
)

const orphanAsset = assetsMap.find((asset) => asset.assetPath === '/book-store.png')
qa.assert(
  'assets:orphan-book-store',
  orphanAsset?.referenceStatus === 'orphan' && orphanAsset?.migrationRole === 'manual-review',
  'The orphan asset /book-store.png must be present and classified as manual-review/orphan.',
  { observed: orphanAsset ?? null },
)

const portraitsValid = assetsMap
  .filter((asset) => asset.assetPath.startsWith('/author/'))
  .every((asset) => asset.migrationRole === 'payload-media-candidate')
qa.assert(
  'assets:author-portraits-role',
  portraitsValid,
  'Author portrait assets must be classified as payload-media-candidate.',
)

const coversValid = assetsMap
  .filter((asset) => asset.assetPath.startsWith('/books/') || asset.assetPath.startsWith('/home/'))
  .every((asset) => asset.migrationRole === 'payload-media-candidate')
qa.assert(
  'assets:book-covers-role',
  coversValid,
  'Book cover assets must be classified as payload-media-candidate.',
)

const staticAssetsValid = assetsMap
  .filter(
    (asset) =>
      asset.assetPath === '/site-logo.svg' ||
      asset.assetPath === '/site-logo-white.svg' ||
      ['/ultra.svg', '/mega.svg', '/hyper-best.svg', '/ultimate-winer.svg'].includes(asset.assetPath),
  )
  .every((asset) => asset.migrationRole === 'static-code-managed')
qa.assert(
  'assets:static-assets-role',
  staticAssetsValid,
  'Logos and award icons must be classified as static-code-managed.',
)

const bookSlugMapEntries = slugMap.filter((entry) => entry.entityType === 'book')
const authorSlugMapEntries = slugMap.filter((entry) => entry.entityType === 'author')
qa.assert(
  'slug-map:entity-coverage',
  bookSlugMapEntries.length === 13 && authorSlugMapEntries.length === 8,
  'slug-map.json must cover both normalized books and authors.',
  {
    expected: { books: 13, authors: 8 },
    observed: { books: bookSlugMapEntries.length, authors: authorSlugMapEntries.length },
  },
)
qa.assert(
  'slug-map:author-slug-uniqueness',
  new Set(authorSlugMapEntries.map((entry) => entry.finalSlug)).size === authorSlugMapEntries.length,
  'Author slug-map entries must be unique within author scope.',
)
qa.assert(
  'slug-map:book-slug-uniqueness',
  new Set(bookSlugMapEntries.map((entry) => entry.finalSlug)).size === bookSlugMapEntries.length,
  'Book slug-map entries must be unique within book scope.',
)
qa.assert(
  'slug-map:legacy-route-context',
  authorSlugMapEntries.every((entry) => entry.legacyRoutes.length === 1),
  'Author slug-map entries must preserve legacy route mapping context for redirect generation.',
)
qa.assert(
  'slug-map:slug-shape',
  slugMap.every((entry) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.finalSlug) && entry.candidateSlug === toSlugValue(entry.displayName)),
  'Slug-map entries must use deterministic normalized slug shapes.',
)

const redirectSources = redirectsGenerated.map((entry) => entry.source)
const redirectDestinations = redirectsGenerated.map((entry) => entry.destination)
const expectedRedirectSources = [
  '/authorsPage',
  '/authorsPage/kimLan',
  '/authorsPage/namCao',
  '/authorsPage/ngoTatTo',
  '/authorsPage/nguyenDu',
  '/authorsPage/nguyenNgocTu',
  '/authorsPage/nguyenNhatAnh',
  '/authorsPage/nguyenTuan',
  '/authorsPage/vuTrongPhung',
  '/booksPage',
]
const redirectMap = new Map(redirectsGenerated.map((entry) => [entry.source, entry.destination]))
const expectedAuthorRedirects = authorSlugMapEntries.map((entry) => ({
  source: entry.legacyRoutes[0] ?? null,
  destination: `/authors/${entry.finalSlug}`,
}))

qa.assert(
  'redirects:generated-count',
  redirectsGenerated.length === 10,
  'redirects.generated.json must contain exactly 10 approved automatic redirects.',
  { expected: 10, observed: redirectsGenerated.length },
)
qa.assert(
  'redirects:generated-scope',
  JSON.stringify(redirectSources) === JSON.stringify(expectedRedirectSources) &&
    redirectDestinations.includes('/books') &&
    redirectDestinations.includes('/authors'),
  'redirects.generated.json must contain only the approved listing and author-detail redirects.',
  { observed: redirectSources },
)
qa.assert(
  'redirects:author-detail-destinations',
  expectedAuthorRedirects.every(
    (entry) => typeof entry.source === 'string' && redirectMap.get(entry.source) === entry.destination,
  ),
  'Each legacy author detail route must map exactly to /authors/{finalSlug} from slug-map.json.',
  { observed: expectedAuthorRedirects },
)
qa.assert(
  'redirects:sorted-and-unique',
  JSON.stringify(redirectSources) === JSON.stringify([...redirectSources].sort()) &&
    new Set(redirectSources).size === redirectSources.length,
  'redirects.generated.json must be sorted and duplicate-free.',
)
qa.assert(
  'redirects:manual-review-buy-book-page',
  redirectsManualReview.some((entry) => entry.source === '/buyBookPage'),
  'redirects.manual-review.json must include /buyBookPage.',
  { observed: redirectsManualReview.map((entry) => entry.source) },
)
qa.assert(
  'redirects:no-manual-review-leak',
  !redirectSources.includes('/buyBookPage'),
  'Manual-review routes must not leak into redirects.generated.json.',
)

if (fs.existsSync(path.join(repoRoot, 'scripts', 'migration', 'dry-run-import.ts'))) {
  qa.warn(
    'pipeline-boundary:dry-run-tooling-present',
    'dry-run-import.ts exists. This is expected once later stages are implemented and should not fail artifact validation.',
  )
}

if (fs.existsSync(path.join(repoRoot, 'scripts', 'migration', 'import-normalized.ts'))) {
  qa.warn(
    'pipeline-boundary:import-tooling-present',
    'import-normalized.ts exists. This is expected once later stages are implemented and should not fail artifact validation.',
  )
}

const report = qa.toReport()
const reportPath = writeQaReport(migrationDataDir, report)

console.log(`Wrote ${path.relative(repoRoot, reportPath).split(path.sep).join('/')}`)
console.log(JSON.stringify(report.summary, null, 2))

if (qa.hasFailures()) {
  throw new Error('Migration artifact validation failed. Inspect migration-data/qa-report.json for details.')
}
