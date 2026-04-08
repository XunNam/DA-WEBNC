import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { withPayload } from '@payloadcms/next/withPayload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function loadGeneratedRedirects() {
  const redirectsPath = path.join(dirname, 'migration-data', 'redirects.generated.json')
  const parsed = JSON.parse(readFileSync(redirectsPath, 'utf8'))

  if (!Array.isArray(parsed)) {
    throw new TypeError('migration-data/redirects.generated.json must export an array.')
  }

  const seenSources = new Set()

  for (const [index, redirect] of parsed.entries()) {
    if (
      !redirect ||
      typeof redirect !== 'object' ||
      typeof redirect.source !== 'string' ||
      typeof redirect.destination !== 'string' ||
      typeof redirect.permanent !== 'boolean'
    ) {
      throw new TypeError(
        `migration-data/redirects.generated.json entry #${index + 1} is malformed.`,
      )
    }

    if (!redirect.source.startsWith('/')) {
      throw new TypeError(
        `migration-data/redirects.generated.json entry #${index + 1} has a source that must start with "/".`,
      )
    }

    if (!redirect.destination.startsWith('/')) {
      throw new TypeError(
        `migration-data/redirects.generated.json entry #${index + 1} has a destination that must start with "/".`,
      )
    }

    if (seenSources.has(redirect.source)) {
      throw new TypeError(
        `migration-data/redirects.generated.json contains a duplicate source: ${redirect.source}`,
      )
    }

    seenSources.add(redirect.source)
  }

  return parsed
}

const generatedRedirects = loadGeneratedRedirects()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  redirects: async () => generatedRedirects,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
