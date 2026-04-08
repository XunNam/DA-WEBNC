import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { QACollector, readJsonArtifact } from './lib/qa'

type FieldLike = {
  name?: string
  type?: string
  required?: boolean
  relationTo?: string | string[]
  defaultValue?: unknown
  options?: Array<string | { label?: string; value: string }>
  fields?: FieldLike[]
}

type CollectionLike = {
  slug: string
  fields: FieldLike[]
  upload?: boolean
  versions?: {
    drafts?: boolean | Record<string, unknown>
  }
}

type GlobalLike = {
  slug: string
  fields: FieldLike[]
  versions?: {
    drafts?: boolean | Record<string, unknown>
  }
}

type ConfigLike = {
  collections?: CollectionLike[]
  globals?: GlobalLike[]
}

type NormalizedBook = {
  key: string
  title: string
  slug: string
  authorKey: string
  coverImagePath: string | null
  typeLabel: string | null
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
    iconKey: string
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
    platform: string
    url: string
  }>
  review?: {
    siteName?: { reviewRequired: boolean; rawValue: string | null; sourcePath: string }
    defaultMetaTitle?: { reviewRequired: boolean; rawValue: string | null; sourcePath: string }
  }
}

type AssetMapEntry = {
  assetPath: string
  assetType: string
  migrationRole: 'payload-media-candidate' | 'static-code-managed' | 'manual-review'
  referenceStatus: 'used' | 'duplicate-reference' | 'orphan'
}

type SlugMapEntry = {
  entityType: 'book' | 'author'
  entityKey: string
  finalSlug: string
  legacyRoutes: string[]
}

type EditorialHold = {
  holdKey: string
  linkedEntityType: 'book' | 'author' | 'homepage'
  linkedEntityKey: string
  rawText: string | null
  rawParagraphs: string[]
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

const readJson = <T>(fileName: string): T => readJsonArtifact<T>(migrationDataDir, fileName)

const writeDryRunReport = (data: unknown): string => {
  const filePath = path.join(migrationDataDir, 'dry-run-report.json')
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  return filePath
}

const findCollection = (config: ConfigLike, slug: string): CollectionLike | undefined =>
  config.collections?.find((collection) => collection.slug === slug)

const findGlobal = (config: ConfigLike, slug: string): GlobalLike | undefined =>
  config.globals?.find((globalConfig) => globalConfig.slug === slug)

const findField = (fields: FieldLike[] | undefined, name: string): FieldLike | undefined =>
  fields?.find((field) => field.name === name)

const findFieldPath = (fields: FieldLike[] | undefined, pathSegments: string[]): FieldLike | undefined => {
  let currentFields = fields
  let currentField: FieldLike | undefined

  for (const segment of pathSegments) {
    currentField = findField(currentFields, segment)

    if (!currentField) {
      return undefined
    }

    currentFields = currentField.fields
  }

  return currentField
}

const getOptionValues = (field: FieldLike | undefined): string[] => {
  if (!field || !Array.isArray(field.options)) {
    return []
  }

  return field.options.map((option) => (typeof option === 'string' ? option : option.value))
}

const isDraftsEnabled = (entity: CollectionLike | GlobalLike | undefined): boolean =>
  Boolean(entity?.versions?.drafts)

const isSlugLike = (value: string | null | undefined): boolean =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

const payloadHasForbiddenKeys = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.some((item) => payloadHasForbiddenKeys(item))
  }

  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>
  const forbiddenKeys = ['review', 'provenance', 'shortCopyEditorialHoldKey', 'rawText', 'rawParagraphs']

  if (forbiddenKeys.some((key) => Object.prototype.hasOwnProperty.call(record, key))) {
    return true
  }

  return Object.values(record).some((child) => payloadHasForbiddenKeys(child))
}

const loadConfig = async (): Promise<ConfigLike> => {
  const configPath = path.join(repoRoot, 'src', 'payload.config.ts')
  const configModule = await import(pathToFileURL(configPath).href)
  return await Promise.resolve(configModule.default)
}

const main = async (): Promise<void> => {
  const books = readJson<NormalizedBook[]>('books.normalized.json')
  const authors = readJson<NormalizedAuthor[]>('authors.normalized.json')
  const homepage = readJson<HomepageNormalized>('homepage.normalized.json')
  const siteSettings = readJson<SiteSettingsNormalized>('site-settings.normalized.json')
  const assets = readJson<AssetMapEntry[]>('assets-map.json')
  const slugMap = readJson<SlugMapEntry[]>('slug-map.json')
  const editorialHolds = readJson<EditorialHold[]>('editorial-holds.json')
  const redirectsGenerated = readJson<RedirectEntry[]>('redirects.generated.json')
  const redirectsManualReview = readJson<ManualRedirectEntry[]>('redirects.manual-review.json')
  const qaReport = readJson<{ status: 'pass' | 'fail' }>('qa-report.json')

  let config: ConfigLike | null = null

  try {
    config = await loadConfig()
    qa.pass('config:import')
  } catch (error) {
    qa.fail('config:import', 'Failed to import the real Payload config safely.', {
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    })
  }

  qa.assert(
    'validation:qa-report-pass',
    qaReport.status === 'pass',
    'qa-report.json must already be PASS before dry-run import simulation begins.',
    { observed: qaReport.status },
  )
  qa.assert(
    'artifacts:redirects-available',
    redirectsGenerated.length > 0 && redirectsManualReview.length > 0,
    'Redirect artifacts must exist before dry-run execution.',
  )

  const assetMap = new Map(assets.map((asset) => [asset.assetPath, asset]))
  const authorMap = new Map(authors.map((author) => [author.key, author]))
  const bookMap = new Map(books.map((book) => [book.key, book]))
  const holdMap = new Map(editorialHolds.map((hold) => [hold.holdKey, hold]))

  if (config) {
    const booksCollection = findCollection(config, 'books')
    const authorsCollection = findCollection(config, 'authors')
    const mediaCollection = findCollection(config, 'media')
    const homepageGlobal = findGlobal(config, 'homepage')
    const siteSettingsGlobal = findGlobal(config, 'siteSettings')

    qa.assert('runtime:collection-books', Boolean(booksCollection), 'Missing books collection in Payload config.')
    qa.assert('runtime:collection-authors', Boolean(authorsCollection), 'Missing authors collection in Payload config.')
    qa.assert('runtime:collection-media', Boolean(mediaCollection), 'Missing media collection in Payload config.')
    qa.assert('runtime:global-homepage', Boolean(homepageGlobal), 'Missing homepage global in Payload config.')
    qa.assert('runtime:global-siteSettings', Boolean(siteSettingsGlobal), 'Missing siteSettings global in Payload config.')

    if (booksCollection) {
      qa.assert('drafts:books-enabled', isDraftsEnabled(booksCollection), 'Books collection must have drafts enabled.')
      qa.assert(
        'books-config:title-field',
        findField(booksCollection.fields, 'title')?.required === true &&
          findField(booksCollection.fields, 'title')?.type === 'text',
        'Books collection title field is missing or has drifted.',
      )
      qa.assert(
        'books-config:slug-field',
        findField(booksCollection.fields, 'slug')?.required === true &&
          findField(booksCollection.fields, 'slug')?.type === 'text',
        'Books collection slug field is missing or has drifted.',
      )
      qa.assert(
        'books-config:author-field',
        findField(booksCollection.fields, 'author')?.required === true &&
          findField(booksCollection.fields, 'author')?.type === 'relationship' &&
          findField(booksCollection.fields, 'author')?.relationTo === 'authors',
        'Books collection author field is missing or has drifted.',
      )
      qa.assert(
        'books-config:cover-image-field',
        findField(booksCollection.fields, 'coverImage')?.required === true &&
          findField(booksCollection.fields, 'coverImage')?.type === 'upload' &&
          findField(booksCollection.fields, 'coverImage')?.relationTo === 'media',
        'Books collection coverImage field is missing or has drifted.',
      )
      qa.assert(
        'books-config:type-label-field',
        findField(booksCollection.fields, 'typeLabel')?.type === 'select',
        'Books collection typeLabel field is missing or has drifted.',
      )
      qa.assert(
        'books-config:catalog-visible-field',
        findField(booksCollection.fields, 'catalogVisible')?.required === true &&
          findField(booksCollection.fields, 'catalogVisible')?.type === 'checkbox' &&
          findField(booksCollection.fields, 'catalogVisible')?.defaultValue === true,
        'Books collection catalogVisible field is missing or has drifted.',
      )
      qa.assert(
        'books-config:price-fields',
        findField(booksCollection.fields, 'price')?.type === 'number' &&
          findField(booksCollection.fields, 'compareAtPrice')?.type === 'number',
        'Books collection price fields are missing or have drifted.',
      )
      qa.assert(
        'books-config:seo-fields',
        findField(booksCollection.fields, 'metaTitle')?.type === 'text' &&
          findField(booksCollection.fields, 'metaDescription')?.type === 'textarea',
        'Books collection SEO fields are missing or have drifted.',
      )

      const allowedTypeLabels = getOptionValues(findField(booksCollection.fields, 'typeLabel'))
      const bookPayloads = books.map((book) => ({
        title: book.title,
        slug: book.slug,
        author: book.authorKey,
        coverImage: book.coverImagePath,
        typeLabel: book.typeLabel,
        catalogVisible: book.catalogVisible,
        price: book.price ?? undefined,
        compareAtPrice: book.compareAtPrice ?? undefined,
        metaTitle: book.metaTitle ?? undefined,
        metaDescription: book.metaDescription ?? undefined,
      }))

      qa.assert(
        'books-dry-run:required-fields',
        bookPayloads.every(
          (payload) =>
            Boolean(payload.title) &&
            isSlugLike(payload.slug) &&
            Boolean(payload.author) &&
            Boolean(payload.coverImage) &&
            typeof payload.catalogVisible === 'boolean',
        ),
        'Every normalized book must satisfy required Books collection fields for dry-run import.',
        {
          observed: books
            .filter(
              (book) =>
                !book.title || !isSlugLike(book.slug) || !book.authorKey || !book.coverImagePath,
            )
            .map((book) => ({ key: book.key, slug: book.slug, typeLabel: book.typeLabel })),
        },
      )
      qa.assert(
        'books-dry-run:type-label-presence-policy',
        books.filter((book) => book.typeLabel === null).length === 1 &&
          books.find((book) => book.typeLabel === null)?.title === 'Ngày xưa có một chuyện tình' &&
          books.find((book) => book.typeLabel === null)?.catalogVisible === false,
        'Only the hero-only book may omit typeLabel in the dry-run payload simulation, and it must remain catalogVisible=false.',
        {
          observed: books
            .filter((book) => book.typeLabel === null)
            .map((book) => ({ key: book.key, title: book.title, catalogVisible: book.catalogVisible })),
        },
      )
      qa.assert(
        'books-dry-run:type-label-options',
        books.every((book) => book.typeLabel === null || allowedTypeLabels.includes(book.typeLabel)),
        'Normalized book typeLabel values must match the real Books select options exactly.',
        { observed: books.map((book) => ({ key: book.key, typeLabel: book.typeLabel })) },
      )
      qa.assert(
        'books-dry-run:author-resolution',
        books.every((book) => authorMap.has(book.authorKey)),
        'Every normalized book authorKey must resolve to a normalized author record.',
      )
      qa.assert(
        'books-dry-run:cover-image-resolution',
        books.every((book) => {
          const asset = book.coverImagePath ? assetMap.get(book.coverImagePath) : null
          return Boolean(asset) && asset?.migrationRole === 'payload-media-candidate'
        }),
        'Every normalized book coverImagePath must resolve to a payload-media-candidate asset.',
      )
      qa.assert(
        'books-dry-run:hero-catalog-visible',
        books.find((book) => book.title === 'Ngày xưa có một chuyện tình')?.catalogVisible === false,
        'Hero-only book must remain catalogVisible=false in dry-run payload simulation.',
      )
      qa.assert(
        'books-dry-run:no-editorial-hold-leak',
        !payloadHasForbiddenKeys(bookPayloads),
        'Book import payloads must not leak review/provenance/editorial-hold fields.',
      )
    }

    if (authorsCollection) {
      qa.assert('drafts:authors-enabled', isDraftsEnabled(authorsCollection), 'Authors collection must have drafts enabled.')
      qa.assert(
        'authors-config:name-field',
        findField(authorsCollection.fields, 'name')?.required === true &&
          findField(authorsCollection.fields, 'name')?.type === 'text',
        'Authors collection name field is missing or has drifted.',
      )
      qa.assert(
        'authors-config:slug-field',
        findField(authorsCollection.fields, 'slug')?.required === true &&
          findField(authorsCollection.fields, 'slug')?.type === 'text',
        'Authors collection slug field is missing or has drifted.',
      )
      qa.assert(
        'authors-config:portrait-field',
        findField(authorsCollection.fields, 'portrait')?.required === true &&
          findField(authorsCollection.fields, 'portrait')?.type === 'upload' &&
          findField(authorsCollection.fields, 'portrait')?.relationTo === 'media',
        'Authors collection portrait field is missing or has drifted.',
      )
      qa.assert(
        'authors-config:life-dates-field',
        findField(authorsCollection.fields, 'lifeDatesDisplay')?.type === 'text',
        'Authors collection lifeDatesDisplay field is missing or has drifted.',
      )
      qa.assert(
        'authors-config:seo-fields',
        findField(authorsCollection.fields, 'metaTitle')?.type === 'text' &&
          findField(authorsCollection.fields, 'metaDescription')?.type === 'textarea',
        'Authors collection SEO fields are missing or have drifted.',
      )

      const authorPayloads = authors.map((author) => ({
        name: author.name,
        slug: author.slug,
        portrait: author.portraitPath,
        lifeDatesDisplay: author.lifeDatesDisplay ?? undefined,
        metaTitle: author.metaTitle ?? undefined,
        metaDescription: author.metaDescription ?? undefined,
      }))

      qa.assert(
        'authors-dry-run:required-fields',
        authorPayloads.every((payload) => Boolean(payload.name) && isSlugLike(payload.slug) && Boolean(payload.portrait)),
        'Every normalized author must satisfy required Authors collection fields for dry-run import.',
      )
      qa.assert(
        'authors-dry-run:portrait-resolution',
        authors.every((author) => {
          const asset = author.portraitPath ? assetMap.get(author.portraitPath) : null
          return Boolean(asset) && asset?.migrationRole === 'payload-media-candidate'
        }),
        'Every normalized author portraitPath must resolve to a payload-media-candidate asset.',
      )
      qa.assert(
        'authors-dry-run:no-biography-field-leak',
        !payloadHasForbiddenKeys(authorPayloads),
        'Author import payloads must not leak review/provenance/editorial-hold fields.',
      )
    }

    if (homepageGlobal) {
      qa.assert('drafts:homepage-enabled', isDraftsEnabled(homepageGlobal), 'Homepage global must have drafts enabled.')
      qa.assert(
        'homepage-config:hero-fields',
        findFieldPath(homepageGlobal.fields, ['hero'])?.type === 'group' &&
          findFieldPath(homepageGlobal.fields, ['hero', 'eyebrow'])?.required === true &&
          findFieldPath(homepageGlobal.fields, ['hero', 'featuredBook'])?.required === true &&
          findFieldPath(homepageGlobal.fields, ['hero', 'featuredBook'])?.relationTo === 'books' &&
          findFieldPath(homepageGlobal.fields, ['hero', 'summaryOverride'])?.type === 'textarea',
        'Homepage hero field structure is missing or has drifted.',
      )
      qa.assert(
        'homepage-config:author-spotlight-fields',
        findFieldPath(homepageGlobal.fields, ['authorSpotlight'])?.type === 'group' &&
          findFieldPath(homepageGlobal.fields, ['authorSpotlight', 'eyebrow'])?.required === true &&
          findFieldPath(homepageGlobal.fields, ['authorSpotlight', 'featuredAuthor'])?.relationTo === 'authors' &&
          findFieldPath(homepageGlobal.fields, ['authorSpotlight', 'summary'])?.type === 'textarea',
        'Homepage authorSpotlight field structure is missing or has drifted.',
      )
      qa.assert(
        'homepage-config:best-sellers-fields',
        findFieldPath(homepageGlobal.fields, ['bestSellers'])?.type === 'array' &&
          findFieldPath(homepageGlobal.fields, ['bestSellers', 'book'])?.relationTo === 'books',
        'Homepage bestSellers field structure is missing or has drifted.',
      )
      qa.assert(
        'homepage-config:awards-fields',
        findFieldPath(homepageGlobal.fields, ['awards'])?.type === 'array' &&
          findFieldPath(homepageGlobal.fields, ['awards', 'iconKey'])?.type === 'select' &&
          findFieldPath(homepageGlobal.fields, ['awards', 'title'])?.required === true &&
          findFieldPath(homepageGlobal.fields, ['awards', 'body'])?.required === true,
        'Homepage awards field structure is missing or has drifted.',
      )
      qa.assert(
        'homepage-config:newsletter-fields',
        findFieldPath(homepageGlobal.fields, ['newsletterCta'])?.type === 'group' &&
          findFieldPath(homepageGlobal.fields, ['newsletterCta', 'heading'])?.required === true &&
          findFieldPath(homepageGlobal.fields, ['newsletterCta', 'body'])?.required === true,
        'Homepage newsletterCta field structure is missing or has drifted.',
      )
      qa.assert(
        'homepage-config:seo-fields',
        findField(homepageGlobal.fields, 'metaTitle')?.type === 'text' &&
          findField(homepageGlobal.fields, 'metaDescription')?.type === 'textarea',
        'Homepage SEO fields are missing or have drifted.',
      )

      const allowedAwardIconKeys = getOptionValues(findFieldPath(homepageGlobal.fields, ['awards', 'iconKey']))
      const homepagePayload = {
        hero: {
          eyebrow: homepage.hero.eyebrow,
          featuredBook: homepage.hero.featuredBookKey,
          summaryOverride: homepage.hero.reviewedShortCopy ?? undefined,
          buyLinkUrl: homepage.hero.buyLinkUrl ?? undefined,
          sampleLinkUrl: homepage.hero.sampleLinkUrl ?? undefined,
        },
        authorSpotlight: {
          eyebrow: homepage.authorSpotlight.eyebrow,
          featuredAuthor: homepage.authorSpotlight.featuredAuthorKey,
          summary: homepage.authorSpotlight.reviewedShortCopy ?? undefined,
        },
        bestSellers: homepage.bestSellers.bookKeys.map((bookKey) => ({ book: bookKey })),
        awards: homepage.awards.map((award) => ({
          iconKey: award.iconKey,
          title: award.title,
          body: award.body,
        })),
        newsletterCta: {
          heading: homepage.newsletterCta.heading,
          body: homepage.newsletterCta.body,
        },
      }

      qa.assert(
        'homepage-dry-run:references-resolve',
        bookMap.has(homepage.hero.featuredBookKey) &&
          authorMap.has(homepage.authorSpotlight.featuredAuthorKey) &&
          homepage.bestSellers.bookKeys.every((bookKey) => bookMap.has(bookKey)),
        'Homepage normalized references must resolve to normalized books/authors.',
      )
      qa.assert(
        'homepage-dry-run:award-icon-options',
        homepage.awards.every((award) => allowedAwardIconKeys.includes(award.iconKey)),
        'Homepage award icon keys must match the real Homepage select options.',
      )
      qa.assert(
        'homepage-dry-run:editorial-holds-resolve',
        holdMap.has(homepage.hero.shortCopyEditorialHoldKey) &&
          holdMap.has(homepage.authorSpotlight.shortCopyEditorialHoldKey),
        'Homepage editorial hold references must resolve to editorial-holds.json.',
      )
      qa.assert(
        'homepage-dry-run:no-editorial-hold-leak',
        !payloadHasForbiddenKeys(homepagePayload),
        'Homepage import payload must not leak review/provenance/editorial-hold fields.',
      )
    }

    if (siteSettingsGlobal) {
      qa.assert('drafts:siteSettings-disabled', !isDraftsEnabled(siteSettingsGlobal), 'siteSettings global must not have drafts enabled.')
      qa.assert(
        'site-settings-config:fields',
        findField(siteSettingsGlobal.fields, 'siteName')?.required === true &&
          findField(siteSettingsGlobal.fields, 'defaultMetaTitle')?.required === true &&
          findField(siteSettingsGlobal.fields, 'defaultMetaDescription')?.required === true &&
          findField(siteSettingsGlobal.fields, 'footerLegalText')?.required === true &&
          findFieldPath(siteSettingsGlobal.fields, ['footerLinks'])?.type === 'array' &&
          findFieldPath(siteSettingsGlobal.fields, ['footerLinks', 'label'])?.required === true &&
          findFieldPath(siteSettingsGlobal.fields, ['footerLinks', 'href'])?.required === true &&
          findFieldPath(siteSettingsGlobal.fields, ['socialLinks'])?.type === 'array' &&
          findFieldPath(siteSettingsGlobal.fields, ['socialLinks', 'platform'])?.type === 'select' &&
          findFieldPath(siteSettingsGlobal.fields, ['socialLinks', 'url'])?.required === true,
        'SiteSettings global field structure is missing or has drifted.',
      )

      const allowedSocialPlatforms = getOptionValues(findFieldPath(siteSettingsGlobal.fields, ['socialLinks', 'platform']))
      const siteSettingsPayload = {
        siteName: siteSettings.siteName,
        defaultMetaTitle: siteSettings.defaultMetaTitle,
        defaultMetaDescription: siteSettings.defaultMetaDescription,
        footerLegalText: siteSettings.footerLegalText,
        footerLinks: siteSettings.footerLinks,
        socialLinks: siteSettings.socialLinks,
      }

      qa.assert(
        'site-settings-dry-run:required-fields',
        Boolean(
          siteSettingsPayload.siteName &&
            siteSettingsPayload.defaultMetaTitle &&
            siteSettingsPayload.defaultMetaDescription &&
            siteSettingsPayload.footerLegalText,
        ),
        'SiteSettings normalized payload must satisfy required global fields.',
      )
      qa.assert(
        'site-settings-dry-run:no-nav-links',
        !Object.prototype.hasOwnProperty.call(siteSettings as Record<string, unknown>, 'navLinks'),
        'navLinks must remain absent from the dry-run SiteSettings payload.',
      )
      qa.assert(
        'site-settings-dry-run:footer-links-shape',
        siteSettings.footerLinks.every((item) => Boolean(item.label) && Boolean(item.href)),
        'Every footerLinks item must match the real SiteSettings shape.',
      )
      qa.assert(
        'site-settings-dry-run:social-links-shape',
        siteSettings.socialLinks.every(
          (item) => allowedSocialPlatforms.includes(item.platform) && Boolean(item.url),
        ),
        'Every socialLinks item must match the real SiteSettings shape.',
      )
      qa.assert(
        'site-settings-dry-run:no-editorial-hold-leak',
        !payloadHasForbiddenKeys(siteSettingsPayload),
        'SiteSettings import payload must not leak review/provenance/editorial-hold fields.',
      )
    }

      qa.assert(
        'media-config:upload-enabled',
        Boolean(mediaCollection?.upload),
        'Media collection must exist as an upload collection for later asset import.',
      )
  }

  const manualReviewSources = redirectsManualReview.map((entry) => entry.source)
  if (manualReviewSources.length > 0) {
    qa.warn(
      'redirects:manual-review-entries-present',
      'Manual-review redirect entries remain correctly excluded from runtime redirects.',
      { sources: manualReviewSources },
    )
  }

  if (siteSettings.review?.siteName?.reviewRequired) {
    qa.warn(
      'site-settings:site-name-inferred',
      'siteName remains inferred and reviewable in site-settings.normalized.json.',
      {
        rawValue: siteSettings.review.siteName.rawValue,
        sourcePath: siteSettings.review.siteName.sourcePath,
      },
    )
  }

  if (siteSettings.review?.defaultMetaTitle?.reviewRequired) {
    qa.warn(
      'site-settings:default-meta-title-inferred',
      'defaultMetaTitle remains inferred and reviewable in site-settings.normalized.json.',
      {
        rawValue: siteSettings.review.defaultMetaTitle.rawValue,
        sourcePath: siteSettings.review.defaultMetaTitle.sourcePath,
      },
    )
  }

  const report = qa.toReport()
  const dryRunReport = {
    ...report,
    dryRunSummary: {
      candidatePayloads: {
        authors: authors.length,
        books: books.length,
        homepage: 1,
        siteSettings: 1,
      },
      importedConfig: report.checks['config:import']?.status === 'pass',
    },
  }

  const reportPath = writeDryRunReport(dryRunReport)
  console.log(`Wrote ${path.relative(repoRoot, reportPath).split(path.sep).join('/')}`)
  console.log(JSON.stringify(dryRunReport.summary, null, 2))

  if (qa.hasFailures()) {
    throw new Error('Dry-run validation failed. Inspect migration-data/dry-run-report.json for details.')
  }
}

await main()
