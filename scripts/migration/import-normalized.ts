import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { getPayload } from 'payload'

import type { SiteSetting } from '../../src/payload-types'

type PassFailStatus = 'pass' | 'fail'
type ReportStatus = 'pass' | 'fail' | 'blocked'

type NormalizedBook = {
  key: string
  title: string
  slug: string
  authorKey: string
  coverImagePath: string | null
  typeLabel: 'Tiểu thuyết' | 'Truyện ngắn' | 'Truyện dài' | 'Truyện thơ' | null
  catalogVisible: boolean
  price: number | null
  compareAtPrice: number | null
  metaTitle?: string | null
  metaDescription?: string | null
}

type NormalizedAuthor = {
  key: string
  name: string
  slug: string
  portraitPath: string | null
  lifeDatesDisplay: string | null
  metaTitle: string | null
  metaDescription: string | null
}

type HomepageNormalized = {
  hero: {
    eyebrow: string | null
    featuredBookKey: string
    reviewedShortCopy: string | null
    shortCopyEditorialHoldKey: string
    buyLinkUrl: string | null
    sampleLinkUrl: string | null
  }
  authorSpotlight: {
    eyebrow: string | null
    featuredAuthorKey: string
    reviewedShortCopy: string | null
    shortCopyEditorialHoldKey: string
  }
  bestSellers: {
    bookKeys: string[]
  }
  awards: Array<{
    iconKey: 'ultra' | 'mega' | 'hyper-best' | 'ultimate-winer'
    title: string | null
    body: string | null
  }>
  newsletterCta: {
    heading: string | null
    body: string | null
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
    platform: 'instagram' | 'facebook' | 'youtube' | 'twitter-x'
    url: string
  }>
  review?: Record<string, unknown>
}

type AssetMapEntry = {
  assetPath: string
  assetType: string
  migrationRole: 'payload-media-candidate' | 'static-code-managed' | 'manual-review'
}

type EditorialHold = {
  holdKey: string
  targetField: string
  linkedEntityType: 'author' | 'book' | 'homepage'
  linkedEntityKey: string
}

type MigrationReport = {
  status: ReportStatus
  summary: {
    dbWritesAttempted: boolean
    dbWritesCompleted: boolean
    preconditionsPassed: boolean
  }
  dbTarget: {
    rawUrl: string | null
    protocol: string | null
    hostname: string | null
    pathname: string | null
    safeForImport: boolean
  }
  counts: {
    media: { created: number; updated: number }
    authors: { created: number; updated: number }
    books: { created: number; updated: number }
    homepage: { created: number; updated: number }
    siteSettings: { created: number; updated: number }
  }
  mediaMappingSummary: {
    candidateAssets: number
    importedAssets: number
    skippedAssets: string[]
  }
  warnings: Array<{
    code: string
    message: string
    details?: unknown
  }>
  errors: Array<{
    code: string
    message: string
    details?: unknown
  }>
  readBack?: {
    mediaResolved: number
    authorsResolved: number
    booksResolved: number
    homepageExists: boolean
    siteSettingsExists: boolean
    heroBookCatalogVisible: boolean | null
    heroBookTypeLabel: string | null
  }
}

type PayloadLike = Awaited<ReturnType<typeof getPayload>>

type MediaDoc = {
  id: string
  filename?: string | null
}

type AuthorDoc = {
  id: string
  slug: string
}

type BookDoc = {
  id: string
  slug: string
  catalogVisible: boolean
  typeLabel?: string | null
}

const repoRoot = process.cwd()
const migrationDataDir = path.join(repoRoot, 'migration-data')
const legacyPublicDir = path.join(repoRoot, 'legacy', 'public')
const importReportPath = path.join(migrationDataDir, 'import-report.json')
const heroOnlyBookTitle = 'Ngày xưa có một chuyện tình'

const report: MigrationReport = {
  status: 'blocked',
  summary: {
    dbWritesAttempted: false,
    dbWritesCompleted: false,
    preconditionsPassed: false,
  },
  dbTarget: {
    rawUrl: null,
    protocol: null,
    hostname: null,
    pathname: null,
    safeForImport: false,
  },
  counts: {
    media: { created: 0, updated: 0 },
    authors: { created: 0, updated: 0 },
    books: { created: 0, updated: 0 },
    homepage: { created: 0, updated: 0 },
    siteSettings: { created: 0, updated: 0 },
  },
  mediaMappingSummary: {
    candidateAssets: 0,
    importedAssets: 0,
    skippedAssets: [],
  },
  warnings: [],
  errors: [],
}

const writeReport = (): void => {
  fs.writeFileSync(importReportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

const addWarning = (code: string, message: string, details?: unknown): void => {
  report.warnings.push({ code, message, details })
}

const addError = (code: string, message: string, details?: unknown): void => {
  report.errors.push({ code, message, details })
}

const fail = (code: string, message: string, details?: unknown, status: ReportStatus = 'fail'): never => {
  report.status = status
  addError(code, message, details)
  writeReport()
  throw new Error(message)
}

const readJson = <T>(fileName: string): T => {
  const filePath = path.join(migrationDataDir, fileName)

  if (!fs.existsSync(filePath)) {
    fail('artifacts:missing', `Missing required artifact: ${fileName}`, { filePath }, 'blocked')
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

const loadConfig = async () => {
  const configPath = path.join(repoRoot, 'src', 'payload.config.ts')
  const configModule = await import(pathToFileURL(configPath).href)
  return await Promise.resolve(configModule.default)
}

const analyzeDatabaseTarget = (databaseURL: string | undefined) => {
  if (!databaseURL) {
    return {
      rawUrl: null,
      protocol: null,
      hostname: null,
      pathname: null,
      safeForImport: false,
      reason: 'DATABASE_URL is missing.',
    }
  }

  let parsed: URL

  try {
    parsed = new URL(databaseURL)
  } catch (error) {
    return {
      rawUrl: databaseURL,
      protocol: null,
      hostname: null,
      pathname: null,
      safeForImport: false,
      reason: 'DATABASE_URL is not a valid URL.',
      details: error instanceof Error ? error.message : String(error),
    }
  }

  const localHostnames = new Set(['localhost', '127.0.0.1', '::1'])
  const hasExplicitDatabaseName = parsed.pathname !== '' && parsed.pathname !== '/'
  const protocol = parsed.protocol
  const hostname = parsed.hostname
  const redactedURL = `${protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`

  const looksLocalMongo =
    protocol === 'mongodb:' && localHostnames.has(hostname) && hasExplicitDatabaseName

  return {
    rawUrl: redactedURL,
    protocol,
    hostname,
    pathname: parsed.pathname,
    safeForImport: looksLocalMongo,
    reason: looksLocalMongo
      ? null
      : 'Import is limited to an explicit local MongoDB database URL (mongodb://localhost/... or equivalent) for this phase.',
  }
}

const getFilename = (assetPath: string): string => path.posix.basename(assetPath)

const getAbsoluteLegacyAssetPath = (assetPath: string): string =>
  path.join(legacyPublicDir, assetPath.replace(/^\//, '').split('/').join(path.sep))

const unique = <T>(values: T[]): T[] => [...new Set(values)]

const createRichTextFromPlainText = (value: string): SiteSetting['footerLegalText'] => ({
  root: {
    children: value.split(/\r?\n/).map((line) => ({
      children: line
        ? [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: line,
              type: 'text',
              version: 1,
            },
          ]
        : [],
      direction: null,
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1,
    })),
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const getMediaAltByAssetPath = (
  assetPath: string,
  authors: NormalizedAuthor[],
  books: NormalizedBook[],
): string => {
  const matchingAuthor = authors.find((author) => author.portraitPath === assetPath)

  if (matchingAuthor) {
    return matchingAuthor.name
  }

  const matchingBooks = books.filter((book) => book.coverImagePath === assetPath)
  const titles = unique(matchingBooks.map((book) => book.title))

  if (titles.length === 1) {
    return titles[0]
  }

  fail(
    'media:alt-resolution',
    'Unable to derive a deterministic alt value for a media asset from normalized artifacts.',
    { assetPath, matchingBookTitles: titles },
  )

  return ''
}

const assertPreconditions = (
  qaReport: { status: PassFailStatus },
  dryRunReport: { status: PassFailStatus },
): void => {
  if (qaReport.status !== 'pass') {
    fail('preconditions:qa-report', 'qa-report.json must be PASS before import can begin.', {
      observed: qaReport.status,
    }, 'blocked')
  }

  if (dryRunReport.status !== 'pass') {
    fail(
      'preconditions:dry-run-report',
      'dry-run-report.json must be PASS before import can begin.',
      { observed: dryRunReport.status },
      'blocked',
    )
  }

  report.summary.preconditionsPassed = true
}

const assertRuntimeEnvironment = (): void => {
  if (!process.env.PAYLOAD_SECRET) {
    fail(
      'runtime-env:missing-payload-secret',
      'PAYLOAD_SECRET must be present before real import can initialize Payload.',
      undefined,
      'blocked',
    )
  }
}

const ensureMediaCandidateFilenamesAreUnique = (assets: AssetMapEntry[]): void => {
  const filenameMap = new Map<string, string[]>()

  for (const asset of assets.filter((entry) => entry.migrationRole === 'payload-media-candidate')) {
    const filename = getFilename(asset.assetPath)
    filenameMap.set(filename, [...(filenameMap.get(filename) ?? []), asset.assetPath])
  }

  const duplicates = [...filenameMap.entries()].filter(([, assetPaths]) => assetPaths.length > 1)

  if (duplicates.length > 0) {
    fail(
      'media:ambiguous-filenames',
      'Payload media candidates must have unique filenames for rerun-safe import without schema changes.',
      { duplicates },
    )
  }
}

const upsertMedia = async (
  payload: PayloadLike,
  asset: AssetMapEntry,
  authors: NormalizedAuthor[],
  books: NormalizedBook[],
): Promise<MediaDoc> => {
  const filename = getFilename(asset.assetPath)
  const filePath = getAbsoluteLegacyAssetPath(asset.assetPath)

  if (!fs.existsSync(filePath)) {
    fail('media:file-missing', 'Required media asset file is missing on disk.', {
      assetPath: asset.assetPath,
      filePath,
    })
  }

  const alt = getMediaAltByAssetPath(asset.assetPath, authors, books)

  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    select: {
      filename: true,
    },
    where: {
      filename: {
        equals: filename,
      },
    },
  })

  if (existing.docs.length > 1) {
    fail('media:duplicate-documents', 'Multiple media documents already match the same filename.', {
      filename,
      assetPath: asset.assetPath,
    })
  }

  if (existing.docs.length === 1) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: {
        alt,
      },
      depth: 0,
      filePath,
      overrideAccess: true,
      overwriteExistingFiles: true,
      select: {
        filename: true,
      },
    })

    report.counts.media.updated += 1
    return updated as MediaDoc
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt,
    },
    depth: 0,
    filePath,
    overrideAccess: true,
    overwriteExistingFiles: true,
    select: {
      filename: true,
    },
  })

  report.counts.media.created += 1
  return created as MediaDoc
}

const upsertAuthor = async (
  payload: PayloadLike,
  author: NormalizedAuthor,
  mediaLookup: Map<string, string>,
): Promise<AuthorDoc> => {
  if (!author.portraitPath || !mediaLookup.has(author.portraitPath)) {
    fail('authors:portrait-resolution', 'Required author portrait media mapping is missing.', {
      authorKey: author.key,
      portraitPath: author.portraitPath,
    })
  }

  const portraitPath = author.portraitPath!
  const portraitID = mediaLookup.get(portraitPath)

  const data = {
    name: author.name,
    slug: author.slug,
    portrait: portraitID!,
    lifeDatesDisplay: author.lifeDatesDisplay ?? null,
    metaTitle: author.metaTitle ?? null,
    metaDescription: author.metaDescription ?? null,
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'authors',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    select: {
      slug: true,
    },
    where: {
      slug: {
        equals: author.slug,
      },
    },
  })

  if (existing.docs.length > 1) {
    fail('authors:duplicate-documents', 'Multiple author documents already match the same slug.', {
      slug: author.slug,
    })
  }

  if (existing.docs.length === 1) {
    const updated = await payload.update({
      collection: 'authors',
      id: existing.docs[0].id,
      data,
      depth: 0,
      draft: false,
      overrideAccess: true,
      select: {
        slug: true,
      },
    })

    report.counts.authors.updated += 1
    return updated as AuthorDoc
  }

  const created = await payload.create({
    collection: 'authors',
    data,
    depth: 0,
    draft: false,
    overrideAccess: true,
    select: {
      slug: true,
    },
  })

  report.counts.authors.created += 1
  return created as AuthorDoc
}

const upsertBook = async (
  payload: PayloadLike,
  book: NormalizedBook,
  authorLookup: Map<string, string>,
  mediaLookup: Map<string, string>,
): Promise<BookDoc> => {
  if (!authorLookup.has(book.authorKey)) {
    fail('books:author-resolution', 'Required book author relation could not be resolved.', {
      bookKey: book.key,
      authorKey: book.authorKey,
    })
  }

  if (!book.coverImagePath || !mediaLookup.has(book.coverImagePath)) {
    fail('books:cover-image-resolution', 'Required book cover image mapping is missing.', {
      bookKey: book.key,
      coverImagePath: book.coverImagePath,
    })
  }

  const coverImagePath = book.coverImagePath!
  const coverImageID = mediaLookup.get(coverImagePath)

  const data = {
    title: book.title,
    slug: book.slug,
    author: authorLookup.get(book.authorKey)!,
    coverImage: coverImageID!,
    typeLabel: book.typeLabel,
    catalogVisible: book.catalogVisible,
    price: book.price ?? null,
    compareAtPrice: book.compareAtPrice ?? null,
    metaTitle: book.metaTitle ?? null,
    metaDescription: book.metaDescription ?? null,
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'books',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    select: {
      slug: true,
      catalogVisible: true,
      typeLabel: true,
    },
    where: {
      slug: {
        equals: book.slug,
      },
    },
  })

  if (existing.docs.length > 1) {
    fail('books:duplicate-documents', 'Multiple book documents already match the same slug.', {
      slug: book.slug,
    })
  }

  if (existing.docs.length === 1) {
    const updated = await payload.update({
      collection: 'books',
      id: existing.docs[0].id,
      data,
      depth: 0,
      draft: false,
      overrideAccess: true,
      select: {
        slug: true,
        catalogVisible: true,
        typeLabel: true,
      },
    })

    report.counts.books.updated += 1
    return updated as BookDoc
  }

  const created = await payload.create({
    collection: 'books',
    data,
    depth: 0,
    draft: false,
    overrideAccess: true,
    select: {
      slug: true,
      catalogVisible: true,
      typeLabel: true,
    },
  })

  report.counts.books.created += 1
  return created as BookDoc
}

const upsertHomepage = async (
  payload: PayloadLike,
  homepage: HomepageNormalized,
  bookLookup: Map<string, string>,
  authorLookup: Map<string, string>,
  holds: EditorialHold[],
): Promise<void> => {
  if (!bookLookup.has(homepage.hero.featuredBookKey)) {
    fail('homepage:hero-book-resolution', 'Homepage hero featuredBook could not be resolved.', {
      featuredBookKey: homepage.hero.featuredBookKey,
    })
  }

  if (!authorLookup.has(homepage.authorSpotlight.featuredAuthorKey)) {
    fail('homepage:author-spotlight-resolution', 'Homepage authorSpotlight featuredAuthor could not be resolved.', {
      featuredAuthorKey: homepage.authorSpotlight.featuredAuthorKey,
    })
  }

  const missingBestSellerKeys = homepage.bestSellers.bookKeys.filter((bookKey) => !bookLookup.has(bookKey))
  if (missingBestSellerKeys.length > 0) {
    fail('homepage:best-sellers-resolution', 'Homepage bestSellers references could not be resolved.', {
      missingBestSellerKeys,
    })
  }

  const holdKeys = new Set(holds.map((hold) => hold.holdKey))
  const missingHoldKeys = [
    homepage.hero.shortCopyEditorialHoldKey,
    homepage.authorSpotlight.shortCopyEditorialHoldKey,
  ].filter((holdKey) => !holdKeys.has(holdKey))

  if (missingHoldKeys.length > 0) {
    fail('homepage:editorial-holds-resolution', 'Homepage editorial hold references are missing.', {
      missingHoldKeys,
    })
  }

  const existing = await payload.findGlobal({
    slug: 'homepage',
    depth: 0,
    draft: false,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        eyebrow: homepage.hero.eyebrow ?? '',
        featuredBook: bookLookup.get(homepage.hero.featuredBookKey)!,
        summaryOverride: homepage.hero.reviewedShortCopy ?? null,
        buyLinkUrl: homepage.hero.buyLinkUrl ?? null,
        sampleLinkUrl: homepage.hero.sampleLinkUrl ?? null,
      },
      authorSpotlight: {
        eyebrow: homepage.authorSpotlight.eyebrow ?? '',
        featuredAuthor: authorLookup.get(homepage.authorSpotlight.featuredAuthorKey)!,
        summary: homepage.authorSpotlight.reviewedShortCopy ?? null,
      },
      bestSellers: homepage.bestSellers.bookKeys.map((bookKey) => ({
        book: bookLookup.get(bookKey)!,
      })),
      awards: homepage.awards.map((award) => ({
        iconKey: award.iconKey,
        title: award.title ?? '',
        body: award.body ?? '',
      })),
      newsletterCta: {
        heading: homepage.newsletterCta.heading ?? '',
        body: homepage.newsletterCta.body ?? '',
      },
      metaTitle: null,
      metaDescription: null,
      _status: 'published' as const,
    },
    depth: 0,
    draft: false,
    overrideAccess: true,
  })

  if (existing?.id) {
    report.counts.homepage.updated += 1
  } else {
    report.counts.homepage.created += 1
  }

  addWarning(
    'homepage:editorial-holds-not-imported',
    'Homepage held short-copy content was intentionally left out of public fields during import.',
    {
      heroHoldKey: homepage.hero.shortCopyEditorialHoldKey,
      authorSpotlightHoldKey: homepage.authorSpotlight.shortCopyEditorialHoldKey,
    },
  )
}

const upsertSiteSettings = async (
  payload: PayloadLike,
  siteSettings: SiteSettingsNormalized,
): Promise<void> => {
  if (
    !siteSettings.siteName ||
    !siteSettings.defaultMetaTitle ||
    !siteSettings.defaultMetaDescription ||
    !siteSettings.footerLegalText
  ) {
    fail('site-settings:required-values', 'siteSettings normalized artifact is missing required values.', {
      siteName: siteSettings.siteName,
      defaultMetaTitle: siteSettings.defaultMetaTitle,
      defaultMetaDescription: siteSettings.defaultMetaDescription,
      footerLegalText: siteSettings.footerLegalText,
    })
  }

  const siteName = siteSettings.siteName!
  const defaultMetaTitle = siteSettings.defaultMetaTitle!
  const defaultMetaDescription = siteSettings.defaultMetaDescription!
  const footerLegalText = createRichTextFromPlainText(siteSettings.footerLegalText!)

  if (Object.prototype.hasOwnProperty.call(siteSettings as Record<string, unknown>, 'navLinks')) {
    fail('site-settings:nav-links-present', 'navLinks must not be present in normalized site settings import data.')
  }

  const existing = await payload.findGlobal({
    slug: 'siteSettings',
    depth: 0,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      siteName,
      defaultMetaTitle,
      defaultMetaDescription,
      footerLegalText,
      footerLinks: siteSettings.footerLinks,
      socialLinks: siteSettings.socialLinks,
    },
    depth: 0,
    overrideAccess: true,
  })

  if (existing?.id) {
    report.counts.siteSettings.updated += 1
  } else {
    report.counts.siteSettings.created += 1
  }

  if (siteSettings.review) {
    addWarning(
      'site-settings:reviewable-inferred-metadata',
      'siteSettings includes inferred metadata fields that should still be manually reviewed.',
      siteSettings.review,
    )
  }
}

const verifyImportedState = async (
  payload: PayloadLike,
  candidateAssets: AssetMapEntry[],
  authors: NormalizedAuthor[],
  books: NormalizedBook[],
): Promise<void> => {
  const mediaResolutionChecks = await Promise.all(
    candidateAssets.map(async (asset) => {
      const filename = getFilename(asset.assetPath)
      const result = await payload.find({
        collection: 'media',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        select: {
          filename: true,
        },
        where: {
          filename: {
            equals: filename,
          },
        },
      })

      return result.docs.length === 1
    }),
  )

  const authorsResult = await payload.find({
    collection: 'authors',
    depth: 0,
    draft: false,
    limit: 20,
    overrideAccess: true,
    select: {
      slug: true,
    },
    where: {
      slug: {
        in: authors.map((author) => author.slug),
      },
    },
  })

  const booksResult = await payload.find({
    collection: 'books',
    depth: 0,
    draft: false,
    limit: 30,
    overrideAccess: true,
    select: {
      slug: true,
      catalogVisible: true,
      typeLabel: true,
    },
    where: {
      slug: {
        in: books.map((book) => book.slug),
      },
    },
  })

  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 0,
    draft: false,
    overrideAccess: true,
  })

  const siteSettings = await payload.findGlobal({
    slug: 'siteSettings',
    depth: 0,
    overrideAccess: true,
  })

  const heroBook = booksResult.docs.find((book) => book.slug === 'ngay-xua-co-mot-chuyen-tinh') as BookDoc | undefined

  report.readBack = {
    mediaResolved: mediaResolutionChecks.filter(Boolean).length,
    authorsResolved: authorsResult.docs.length,
    booksResolved: booksResult.docs.length,
    homepageExists: Boolean(homepage?.id),
    siteSettingsExists: Boolean(siteSettings?.id),
    heroBookCatalogVisible: heroBook?.catalogVisible ?? null,
    heroBookTypeLabel: heroBook?.typeLabel ?? null,
  }

  if (report.readBack.mediaResolved !== candidateAssets.length) {
    fail('read-back:media-count', 'Not all payload-media-candidate assets resolved after import.', {
      resolved: report.readBack.mediaResolved,
      expected: candidateAssets.length,
    })
  }

  if (report.readBack.authorsResolved !== authors.length) {
    fail('read-back:authors-count', 'Imported author count does not match normalized authors count.', {
      resolved: report.readBack.authorsResolved,
      expected: authors.length,
    })
  }

  if (report.readBack.booksResolved !== books.length) {
    fail('read-back:books-count', 'Imported book count does not match normalized books count.', {
      resolved: report.readBack.booksResolved,
      expected: books.length,
    })
  }

  if (!report.readBack.homepageExists || !report.readBack.siteSettingsExists) {
    fail('read-back:globals', 'Homepage and siteSettings globals must both exist after import.', report.readBack)
  }

  if (report.readBack.heroBookCatalogVisible !== false) {
    fail('read-back:hero-book-catalog-visible', 'Hero-only book must remain catalogVisible=false after import.', {
      observed: report.readBack.heroBookCatalogVisible,
    })
  }

  if (report.readBack.heroBookTypeLabel !== null) {
    fail('read-back:hero-book-type-label', 'Hero-only book must not receive a fabricated typeLabel during import.', {
      observed: report.readBack.heroBookTypeLabel,
    })
  }
}

const main = async (): Promise<void> => {
  const books = readJson<NormalizedBook[]>('books.normalized.json')
  const authors = readJson<NormalizedAuthor[]>('authors.normalized.json')
  const homepage = readJson<HomepageNormalized>('homepage.normalized.json')
  const siteSettings = readJson<SiteSettingsNormalized>('site-settings.normalized.json')
  const assets = readJson<AssetMapEntry[]>('assets-map.json')
  const editorialHolds = readJson<EditorialHold[]>('editorial-holds.json')
  const qaReport = readJson<{ status: PassFailStatus }>('qa-report.json')
  const dryRunReport = readJson<{ status: PassFailStatus }>('dry-run-report.json')

  assertPreconditions(qaReport, dryRunReport)

  const candidateAssets = assets.filter((asset) => asset.migrationRole === 'payload-media-candidate')
  report.mediaMappingSummary.candidateAssets = candidateAssets.length
  report.mediaMappingSummary.skippedAssets = assets
    .filter((asset) => asset.migrationRole !== 'payload-media-candidate')
    .map((asset) => asset.assetPath)

  ensureMediaCandidateFilenamesAreUnique(assets)

  const dbTarget = analyzeDatabaseTarget(process.env.DATABASE_URL)
  report.dbTarget = {
    rawUrl: dbTarget.rawUrl,
    protocol: dbTarget.protocol,
    hostname: dbTarget.hostname,
    pathname: dbTarget.pathname,
    safeForImport: dbTarget.safeForImport,
  }

  if (!dbTarget.safeForImport) {
    fail(
      'database-target:unsafe',
      dbTarget.reason ?? 'Import target is unsafe or ambiguous for this phase.',
      {
        rawUrl: dbTarget.rawUrl,
        protocol: dbTarget.protocol,
        hostname: dbTarget.hostname,
        pathname: dbTarget.pathname,
      },
      'blocked',
    )
  }

  assertRuntimeEnvironment()

  report.summary.dbWritesAttempted = true

  const config = await loadConfig()
  const payload = await getPayload({ config })

  try {
    const mediaLookup = new Map<string, string>()
    for (const asset of candidateAssets) {
      const mediaDoc = await upsertMedia(payload, asset, authors, books)
      mediaLookup.set(asset.assetPath, mediaDoc.id)
    }
    report.mediaMappingSummary.importedAssets = mediaLookup.size

    const authorLookup = new Map<string, string>()
    for (const author of authors) {
      const authorDoc = await upsertAuthor(payload, author, mediaLookup)
      authorLookup.set(author.key, authorDoc.id)
    }

    const bookLookup = new Map<string, string>()
    for (const book of books) {
      const bookDoc = await upsertBook(payload, book, authorLookup, mediaLookup)
      bookLookup.set(book.key, bookDoc.id)
    }

    await upsertHomepage(payload, homepage, bookLookup, authorLookup, editorialHolds)
    await upsertSiteSettings(payload, siteSettings)

    addWarning(
      'editorial-holds:not-imported',
      'Editorial holds remain review-only artifacts and were not imported into public Payload fields.',
      {
        holdCount: editorialHolds.length,
      },
    )

    if (books.some((book) => book.title === heroOnlyBookTitle && book.typeLabel === null && book.catalogVisible === false)) {
      addWarning(
        'hero-book:type-label-still-null',
        'Hero-only book was imported without a fabricated typeLabel and remains catalogVisible=false.',
        {
          title: heroOnlyBookTitle,
        },
      )
    }

    await verifyImportedState(payload, candidateAssets, authors, books)
  } finally {
    await payload.destroy()
  }

  report.summary.dbWritesCompleted = true
  report.status = 'pass'
  writeReport()

  console.log(`Wrote ${path.relative(repoRoot, importReportPath).split(path.sep).join('/')}`)
  console.log(
    JSON.stringify(
      {
        status: report.status,
        counts: report.counts,
        warnings: report.warnings.length,
        errors: report.errors.length,
      },
      null,
      2,
    ),
  )
}

try {
  await main()
} catch (error) {
  if (report.errors.length === 0) {
    const message = error instanceof Error ? error.message : String(error)
    addError('import:unhandled', message)
    if (report.status === 'pass') {
      report.status = 'fail'
    }
    writeReport()
  }

  console.error(error)
  process.exitCode = 1
}
