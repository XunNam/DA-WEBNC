import fs from 'node:fs'
import path from 'node:path'

import {
  AUTHOR_DETAIL_REDIRECT_DESTINATION_PREFIX,
  AUTHOR_DETAIL_REDIRECT_SOURCE_PREFIX,
  AUTO_LISTING_REDIRECTS,
  MANUAL_REVIEW_ROUTE_CANDIDATES,
  type ManualReviewRedirectEntry,
  type RuntimeRedirectEntry,
} from './config/redirect-policy'

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

const repoRoot = process.cwd()
const migrationDataDir = path.join(repoRoot, 'migration-data')
const slugMapPath = path.join(migrationDataDir, 'slug-map.json')
const redirectsGeneratedPath = path.join(migrationDataDir, 'redirects.generated.json')
const redirectsManualReviewPath = path.join(migrationDataDir, 'redirects.manual-review.json')

const writeJsonFile = (filePath: string, data: unknown): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

if (!fs.existsSync(slugMapPath)) {
  throw new Error('Required normalization artifact is missing: migration-data/slug-map.json')
}

const slugMap = JSON.parse(fs.readFileSync(slugMapPath, 'utf8')) as SlugMapEntry[]

if (!Array.isArray(slugMap)) {
  throw new Error('migration-data/slug-map.json is malformed: expected an array.')
}

const authorEntries = slugMap.filter((entry) => entry.entityType === 'author')

if (authorEntries.length !== 8) {
  throw new Error(`Expected 8 author entries in slug-map.json, found ${authorEntries.length}`)
}

const authorRedirects: RuntimeRedirectEntry[] = authorEntries.flatMap((entry) => {
  if (!entry.finalSlug) {
    throw new Error(`Missing finalSlug for author slug-map entry: ${entry.entityKey}`)
  }

  const legacyRoutes = entry.legacyRoutes.filter((route) =>
    route.startsWith(AUTHOR_DETAIL_REDIRECT_SOURCE_PREFIX),
  )

  if (legacyRoutes.length !== 1) {
    throw new Error(
      `Expected exactly one legacy author detail route for ${entry.entityKey}, found ${legacyRoutes.length}`,
    )
  }

  return legacyRoutes.map((legacyRoute) => ({
    source: legacyRoute,
    destination: `${AUTHOR_DETAIL_REDIRECT_DESTINATION_PREFIX}${entry.finalSlug}`,
    permanent: true as const,
  }))
})

const runtimeRedirects = [...AUTO_LISTING_REDIRECTS, ...authorRedirects]
  .sort((left, right) => left.source.localeCompare(right.source))
  .filter((entry, index, entries) => index === 0 || entry.source !== entries[index - 1]?.source)

const expectedSources = new Set([
  '/authorsPage',
  '/booksPage',
  ...authorEntries.flatMap((entry) => entry.legacyRoutes),
])

if (runtimeRedirects.length !== expectedSources.size) {
  throw new Error(
    `Redirect generation produced ${runtimeRedirects.length} runtime redirects, expected ${expectedSources.size}`,
  )
}

const manualReviewEntries: ManualReviewRedirectEntry[] = [...MANUAL_REVIEW_ROUTE_CANDIDATES]
  .sort((left, right) => left.source.localeCompare(right.source))
  .filter((entry, index, entries) => index === 0 || entry.source !== entries[index - 1]?.source)

writeJsonFile(redirectsGeneratedPath, runtimeRedirects)
writeJsonFile(redirectsManualReviewPath, manualReviewEntries)

console.log(`Wrote migration-data/redirects.generated.json (${runtimeRedirects.length} rows)`)
console.log(`Wrote migration-data/redirects.manual-review.json (${manualReviewEntries.length} rows)`)
