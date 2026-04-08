import fs from 'node:fs'
import path from 'node:path'

export const normalizeAssetPath = (value: string | null | undefined): string | null => {
  if (!value) {
    return null
  }

  return value.startsWith('/') ? value : `/${value}`
}

export const assertLegacyAssetExists = (
  legacyPublicDir: string,
  assetPath: string | null | undefined,
  context: string,
): string | null => {
  const normalized = normalizeAssetPath(assetPath)

  if (!normalized) {
    return null
  }

  const absolutePath = path.join(legacyPublicDir, normalized.replace(/^\//, ''))

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing legacy asset for ${context}: ${normalized}`)
  }

  return normalized
}

export const inferSocialPlatformFromClassName = (className: string | null): string | null => {
  if (!className) {
    return null
  }

  const match = className.match(/\bbi bi-([a-z0-9-]+)/i)
  return match ? match[1].toLowerCase() : null
}

export const listFilesRecursive = (directory: string): string[] => {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return listFilesRecursive(absolutePath)
    }

    return [absolutePath]
  })
}
