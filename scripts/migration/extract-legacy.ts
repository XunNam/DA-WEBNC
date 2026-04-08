import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

import { assertLegacyAssetExists, inferSocialPlatformFromClassName } from './lib/assets'
import { maybeRawPrice } from './lib/price'
import { toComparisonKey } from './lib/slug'
import {
  collectTextsByTagName,
  findExportedObjectLiteral,
  findJsxElementsByName,
  findJsxNodesByName,
  findJsxSelfClosingElementsByName,
  getJsxAttributeStringValue,
  getNestedObjectLiteralStringProperty,
  getObjectLiteralStringProperty,
  parseTsxFile,
} from './lib/tsx'

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

const repoRoot = process.cwd()
const legacyPublicDir = path.join(repoRoot, 'legacy', 'public')
const migrationDataDir = path.join(repoRoot, 'migration-data')

const booksPagePath = 'legacy/src/app/booksPage/page.tsx'
const bestSellersPath = 'legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx'
const newReleasePath = 'legacy/src/app/components/body/newRelease/NewRelease.tsx'
const buyNowPath = 'legacy/src/app/components/body/newRelease/BuyNow.tsx'
const readSamplePath = 'legacy/src/app/components/body/newRelease/ReadSample.tsx'

const authorsIndexPath = 'legacy/src/app/authorsPage/page.tsx'
const biographyPath = 'legacy/src/app/components/body/bioGraphy/Biography.tsx'
const biographyReadMorePath = 'legacy/src/app/components/body/bioGraphy/ReadMore.tsx'

const homepagePath = 'legacy/src/app/page.tsx'
const awardsPath = 'legacy/src/app/components/body/adWards/Adwards.tsx'

const layoutPath = 'legacy/src/app/layout.tsx'
const footerPath = 'legacy/src/app/components/Footer.tsx'
const navbarLinksPath = 'legacy/src/app/components/NavbarLink.tsx'
const navbarPath = 'legacy/src/app/components/Navbar.tsx'

const toAbsolutePath = (relativePath: string): string => path.join(repoRoot, relativePath)
const toRepoRelativePath = (absolutePath: string): string =>
  path.relative(repoRoot, absolutePath).split(path.sep).join('/')

const ensureSourceFile = (relativePath: string): string => {
  const absolutePath = toAbsolutePath(relativePath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Required legacy source file is missing: ${relativePath}`)
  }

  return absolutePath
}

const routeFromPageFile = (relativePath: string): string =>
  `/${relativePath.replace(/^legacy\/src\/app\//, '').replace(/\/page\.tsx$/, '')}`

const getFirstImagePath = (relativePath: string, context: string): string | null => {
  const sourceFile = parseTsxFile(ensureSourceFile(relativePath))
  const imageElement = findJsxNodesByName(sourceFile, 'Image')[0]

  if (!imageElement) {
    return null
  }

  return assertLegacyAssetExists(
    legacyPublicDir,
    getJsxAttributeStringValue(imageElement, 'src'),
    context,
  )
}

const getFirstAnchorHref = (relativePath: string, context: string): string | null => {
  const sourceFile = parseTsxFile(ensureSourceFile(relativePath))
  const anchorElement = findJsxElementsByName(sourceFile, 'a')[0]

  if (!anchorElement) {
    return null
  }

  const href = getJsxAttributeStringValue(anchorElement, 'href')

  if (!href) {
    throw new Error(`Missing href in ${context}`)
  }

  return href
}

const extractBookPlaceholderRows = (
  relativePath: string,
  sourceSection: string,
  sourceRoute: string,
): RawBook[] => {
  const sourceFile = parseTsxFile(ensureSourceFile(relativePath))

  return findJsxSelfClosingElementsByName(sourceFile, 'BookPlaceHolder').map((element, index) => ({
    sourcePath: relativePath,
    sourceSection,
    sourceRoute,
    rawTitle: getJsxAttributeStringValue(element, 'bookName'),
    rawAuthorName: getJsxAttributeStringValue(element, 'author'),
    rawTypeLabel: getJsxAttributeStringValue(element, 'type'),
    rawPrice: maybeRawPrice(
      getJsxAttributeStringValue(element, 'price'),
      `${relativePath} BookPlaceHolder#${index + 1} price`,
    ),
    rawCompareAtPrice: maybeRawPrice(
      getJsxAttributeStringValue(element, 'originPrice'),
      `${relativePath} BookPlaceHolder#${index + 1} originPrice`,
    ),
    rawImagePath: assertLegacyAssetExists(
      legacyPublicDir,
      getJsxAttributeStringValue(element, 'image'),
      `${relativePath} BookPlaceHolder#${index + 1} image`,
    ),
    rawHeroSummary: null,
    rawBuyLinkUrl: null,
    rawSampleLinkUrl: null,
  }))
}

const extractHeroBookRow = (): RawBook => {
  const sourceFile = parseTsxFile(ensureSourceFile(newReleasePath))
  const texts = collectTextsByTagName(sourceFile, 'p')

  if (texts.length < 3) {
    throw new Error(`Expected hero text content in ${newReleasePath}`)
  }

  return {
    sourcePath: newReleasePath,
    sourceSection: 'hero',
    sourceRoute: '/',
    rawTitle: texts[1] ?? null,
    rawAuthorName: null,
    rawTypeLabel: null,
    rawPrice: null,
    rawCompareAtPrice: null,
    rawImagePath: getFirstImagePath(newReleasePath, `${newReleasePath} hero image`),
    rawHeroSummary: texts[2] ?? null,
    rawBuyLinkUrl: getFirstAnchorHref(buyNowPath, `${buyNowPath} hero buy link`),
    rawSampleLinkUrl: getFirstAnchorHref(readSamplePath, `${readSamplePath} hero sample link`),
  }
}

const extractAuthorsIndexRows = (): RawAuthor[] => {
  const sourceFile = parseTsxFile(ensureSourceFile(authorsIndexPath))

  return findJsxSelfClosingElementsByName(sourceFile, 'AuthorPlaceHolder').map((element, index) => ({
    sourcePath: authorsIndexPath,
    sourceSection: 'authorsIndex',
    sourceRoute: '/authorsPage',
    rawName: getJsxAttributeStringValue(element, 'name'),
    rawLegacyRoute: getJsxAttributeStringValue(element, 'page'),
    rawPortraitPath: assertLegacyAssetExists(
      legacyPublicDir,
      getJsxAttributeStringValue(element, 'image'),
      `${authorsIndexPath} AuthorPlaceHolder#${index + 1} image`,
    ),
    rawLifeDatesDisplay: null,
    rawMetaTitle: null,
    rawMetaDescription: null,
    rawShortSummary: null,
    rawLongFormParagraphs: [],
    rawExternalLink: null,
  }))
}

const extractBiographyAuthorRow = (): RawAuthor => {
  const sourceFile = parseTsxFile(ensureSourceFile(biographyPath))
  const texts = collectTextsByTagName(sourceFile, 'p')

  if (texts.length < 3) {
    throw new Error(`Expected biography text content in ${biographyPath}`)
  }

  return {
    sourcePath: biographyPath,
    sourceSection: 'authorSpotlight',
    sourceRoute: '/',
    rawName: texts[1] ?? null,
    rawLegacyRoute: null,
    rawPortraitPath: getFirstImagePath(biographyPath, `${biographyPath} biography image`),
    rawLifeDatesDisplay: null,
    rawMetaTitle: null,
    rawMetaDescription: null,
    rawShortSummary: texts[2] ?? null,
    rawLongFormParagraphs: [],
    rawExternalLink: getFirstAnchorHref(biographyReadMorePath, `${biographyReadMorePath} biography read more`),
  }
}

const getAuthorDetailPagePaths = (): string[] => {
  const authorsPageDir = ensureSourceFile('legacy/src/app/authorsPage/page.tsx')
  const authorsPageDirectory = path.dirname(authorsPageDir)

  return fs
    .readdirSync(authorsPageDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(authorsPageDirectory, entry.name, 'page.tsx'))
    .filter((absolutePath) => fs.existsSync(absolutePath))
    .map((absolutePath) => toRepoRelativePath(absolutePath))
    .sort((left, right) => toComparisonKey(left).localeCompare(toComparisonKey(right)))
}

const extractAuthorDetailRows = (): RawAuthor[] =>
  getAuthorDetailPagePaths().map((relativePath) => {
    const sourceFile = parseTsxFile(ensureSourceFile(relativePath))
    const metadata = findExportedObjectLiteral(sourceFile, 'metadata')
    const detailComponent = findJsxSelfClosingElementsByName(sourceFile, 'AuthorPagePlaceHolder')[0]

    if (!detailComponent) {
      throw new Error(`Missing AuthorPagePlaceHolder in ${relativePath}`)
    }

    const paragraphs = ['text1', 'text2', 'text3', 'text4']
      .map((attributeName) => getJsxAttributeStringValue(detailComponent, attributeName))
      .filter((value): value is string => Boolean(value))

    const sourceRoute = routeFromPageFile(relativePath)

    return {
      sourcePath: relativePath,
      sourceSection: 'authorDetail',
      sourceRoute,
      rawName: getJsxAttributeStringValue(detailComponent, 'name'),
      rawLegacyRoute: sourceRoute,
      rawPortraitPath: assertLegacyAssetExists(
        legacyPublicDir,
        getJsxAttributeStringValue(detailComponent, 'image'),
        `${relativePath} author detail image`,
      ),
      rawLifeDatesDisplay: getJsxAttributeStringValue(detailComponent, 'dateOfBrith'),
      rawMetaTitle: metadata ? getObjectLiteralStringProperty(metadata, 'title') : null,
      rawMetaDescription: metadata ? getObjectLiteralStringProperty(metadata, 'description') : null,
      rawShortSummary: null,
      rawLongFormParagraphs: paragraphs,
      rawExternalLink: getJsxAttributeStringValue(detailComponent, 'linkExternal'),
    }
  })

const extractAwardsSection = () => {
  const sourceFile = parseTsxFile(ensureSourceFile(awardsPath))
  const imageElements = findJsxNodesByName(sourceFile, 'Image')
  const texts = collectTextsByTagName(sourceFile, 'p')

  if (imageElements.length !== 4 || texts.length !== 8) {
    throw new Error(`Unexpected awards section structure in ${awardsPath}`)
  }

  return {
    sourcePath: awardsPath,
    sourceRoute: '/',
    items: imageElements.map((imageElement, index) => ({
      rawIconPath: assertLegacyAssetExists(
        legacyPublicDir,
        getJsxAttributeStringValue(imageElement, 'src'),
        `${awardsPath} award icon #${index + 1}`,
      ),
      rawIconAlt: getJsxAttributeStringValue(imageElement, 'alt'),
      rawTitle: texts[index * 2] ?? null,
      rawBody: texts[index * 2 + 1] ?? null,
    })),
  }
}

const extractBestSellersSection = () => {
  const sourceFile = parseTsxFile(ensureSourceFile(bestSellersPath))
  const texts = collectTextsByTagName(sourceFile, 'p')

  return {
    sourcePath: bestSellersPath,
    sourceRoute: '/',
    rawHeading: texts[0] ?? null,
    rawBody: texts[1] ?? null,
    items: extractBookPlaceholderRows(bestSellersPath, 'bestSellers', '/').map((row) => ({
      rawTitle: row.rawTitle,
      rawAuthorName: row.rawAuthorName,
      rawTypeLabel: row.rawTypeLabel,
      rawPrice: row.rawPrice,
      rawCompareAtPrice: row.rawCompareAtPrice,
      rawImagePath: row.rawImagePath,
    })),
  }
}

const extractNewsletterSection = () => {
  const sourceFile = parseTsxFile(ensureSourceFile(homepagePath))
  const texts = collectTextsByTagName(sourceFile, 'p')

  if (texts.length < 2) {
    throw new Error(`Expected newsletter text content in ${homepagePath}`)
  }

  return {
    sourcePath: homepagePath,
    sourceRoute: '/',
    rawHeading: texts[0] ?? null,
    rawBody: texts[1] ?? null,
  }
}

const extractHomepageRaw = () => {
  const heroSource = parseTsxFile(ensureSourceFile(newReleasePath))
  const heroTexts = collectTextsByTagName(heroSource, 'p')

  const biographySource = parseTsxFile(ensureSourceFile(biographyPath))
  const biographyTexts = collectTextsByTagName(biographySource, 'p')

  return {
    hero: {
      sourcePath: newReleasePath,
      sourceRoute: '/',
      rawEyebrow: heroTexts[0] ?? null,
      rawTitle: heroTexts[1] ?? null,
      rawSummary: heroTexts[2] ?? null,
      rawImagePath: getFirstImagePath(newReleasePath, `${newReleasePath} homepage hero image`),
      rawBuyLinkUrl: getFirstAnchorHref(buyNowPath, `${buyNowPath} homepage hero buy link`),
      rawSampleLinkUrl: getFirstAnchorHref(readSamplePath, `${readSamplePath} homepage hero sample link`),
    },
    authorSpotlight: {
      sourcePath: biographyPath,
      sourceRoute: '/',
      rawEyebrow: biographyTexts[0] ?? null,
      rawName: biographyTexts[1] ?? null,
      rawSummary: biographyTexts[2] ?? null,
      rawPortraitPath: getFirstImagePath(biographyPath, `${biographyPath} homepage author spotlight image`),
      rawExternalLink: getFirstAnchorHref(
        biographyReadMorePath,
        `${biographyReadMorePath} homepage author spotlight link`,
      ),
    },
    awards: extractAwardsSection(),
    bestSellers: extractBestSellersSection(),
    newsletterCta: extractNewsletterSection(),
  }
}

const extractLinks = (relativePath: string) => {
  const sourceFile = parseTsxFile(ensureSourceFile(relativePath))

  return findJsxElementsByName(sourceFile, 'Link').map((element) => ({
    rawHref: getJsxAttributeStringValue(element, 'href'),
    rawTarget: getJsxAttributeStringValue(element, 'target'),
    rawText: collectTextsByTagName(
      ts.createSourceFile('inline.tsx', element.getText(), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
      'Link',
    )[0] ?? null,
  }))
}

const extractFooterSocialIcons = () => {
  const sourceFile = parseTsxFile(ensureSourceFile(footerPath))

  return findJsxElementsByName(sourceFile, 'svg').map((element) => {
    const className = getJsxAttributeStringValue(element, 'className')

    return {
      rawClassName: className,
      rawPlatform: inferSocialPlatformFromClassName(className),
    }
  })
}

const extractSiteSettingsRaw = () => {
  const layoutSource = parseTsxFile(ensureSourceFile(layoutPath))
  const metadata = findExportedObjectLiteral(layoutSource, 'metadata')

  const footerTexts = collectTextsByTagName(parseTsxFile(ensureSourceFile(footerPath)), 'p')
  const navbarTexts = collectTextsByTagName(parseTsxFile(ensureSourceFile(navbarPath)), 'p')

  return {
    layoutMetadata: {
      sourcePath: layoutPath,
      rawMetaTitle: metadata ? getObjectLiteralStringProperty(metadata, 'title') : null,
      rawMetaDescription: metadata ? getObjectLiteralStringProperty(metadata, 'description') : null,
      rawIconPath: metadata ? getNestedObjectLiteralStringProperty(metadata, ['icons', 'icon']) : null,
    },
    navbar: {
      sourcePath: navbarPath,
      rawLogoPath: getFirstImagePath(navbarPath, `${navbarPath} navbar logo`),
      rawCartDisplayText: navbarTexts[0] ?? null,
    },
    navLinks: {
      sourcePath: navbarLinksPath,
      items: extractLinks(navbarLinksPath),
    },
    footer: {
      sourcePath: footerPath,
      rawLogoPath: getFirstImagePath(footerPath, `${footerPath} footer logo`),
      rawFooterLegalText: footerTexts[0] ?? null,
      rawFooterLinks: extractLinks(footerPath).map((item) => ({
        rawText: item.rawText,
        rawHref: item.rawHref,
      })),
      rawSocialIcons: extractFooterSocialIcons(),
    },
  }
}

const writeJsonFile = (fileName: string, data: unknown): void => {
  fs.mkdirSync(migrationDataDir, { recursive: true })
  fs.writeFileSync(path.join(migrationDataDir, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const booksRaw = [
  ...extractBookPlaceholderRows(booksPagePath, 'catalogGrid', '/booksPage'),
  ...extractBookPlaceholderRows(bestSellersPath, 'bestSellers', '/'),
  extractHeroBookRow(),
]

const authorsRaw = [
  ...extractAuthorsIndexRows(),
  extractBiographyAuthorRow(),
  ...extractAuthorDetailRows(),
]

if (booksRaw.length !== 17) {
  throw new Error(`Expected 17 raw book rows, found ${booksRaw.length}`)
}

if (authorsRaw.length !== 17) {
  throw new Error(`Expected 17 raw author rows, found ${authorsRaw.length}`)
}

const homepageRaw = extractHomepageRaw()
const siteSettingsRaw = extractSiteSettingsRaw()

writeJsonFile('books.raw.json', booksRaw)
writeJsonFile('authors.raw.json', authorsRaw)
writeJsonFile('homepage.raw.json', homepageRaw)
writeJsonFile('site-settings.raw.json', siteSettingsRaw)

console.log(`Wrote migration-data/books.raw.json (${booksRaw.length} rows)`)
console.log(`Wrote migration-data/authors.raw.json (${authorsRaw.length} rows)`)
console.log('Wrote migration-data/homepage.raw.json')
console.log('Wrote migration-data/site-settings.raw.json')
