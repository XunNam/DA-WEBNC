import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { SiteSetting } from '@/payload-types'

type ShellMedia = {
  alt: string
  height: number
  url: string
  width: number
}

type ShellNavLink = {
  href: string
  label: string
  openInNewTab: boolean
}

type ShellFooterLink = {
  href: string
  label: string
}

type ShellSocialLink = {
  platform: 'instagram' | 'facebook' | 'youtube' | 'twitter-x'
  url: string
}

type ShellRichText = SiteSetting['footerLegalText']

type ShellFooterLegalText =
  | {
      kind: 'lexical'
      value: ShellRichText
    }
  | {
      kind: 'plainText'
      value: string
    }
  | null

export type PublicSiteShellData = {
  brandName: string
  faviconUrl: string | null
  footer: {
    brandName: string
    legalText: ShellFooterLegalText
    links: ShellFooterLink[]
    socialLinks: ShellSocialLink[]
  }
  navbar: {
    links: ShellNavLink[]
    logo: ShellMedia | null
  }
}

const fallbackBrandName = 'Bookstore'

const fallbackSiteShellData: PublicSiteShellData = {
  brandName: fallbackBrandName,
  faviconUrl: null,
  footer: {
    brandName: fallbackBrandName,
    legalText: null,
    links: [],
    socialLinks: [],
  },
  navbar: {
    links: [],
    logo: null,
  },
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function normalizeBrandName(value: string | null | undefined): string {
  return normalizeText(value) || fallbackBrandName
}

function isSerializedEditorState(value: unknown): value is ShellRichText {
  if (!value || typeof value !== 'object') {
    return false
  }

  const root = (value as { root?: unknown }).root

  return Boolean(root && typeof root === 'object' && Array.isArray((root as { children?: unknown }).children))
}

function normalizeLogo(
  value: SiteSetting['navbarLogo'],
  brandName: string,
): ShellMedia | null {
  if (!value || typeof value === 'string' || !value.url) {
    return null
  }

  return {
    alt: normalizeText(value.alt) || `${brandName} logo`,
    height: value.height || 60,
    url: value.url,
    width: value.width || 180,
  }
}

function normalizeFaviconUrl(value: SiteSetting['favicon']): string | null {
  if (!value || typeof value === 'string') {
    return null
  }

  return normalizeText(value.url) || null
}

function normalizeNavLinks(value: SiteSetting['navLinks']): ShellNavLink[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      const label = normalizeText(item?.label)
      const href = normalizeText(item?.href)

      if (!label || !href) {
        return null
      }

      return {
        href,
        label,
        openInNewTab: Boolean(item?.openInNewTab),
      }
    })
    .filter((item): item is ShellNavLink => item !== null)
}

function normalizeFooterLinks(value: SiteSetting['footerLinks']): ShellFooterLink[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      const label = normalizeText(item?.label)
      const href = normalizeText(item?.href)

      if (!label || !href) {
        return null
      }

      return {
        href,
        label,
      }
    })
    .filter((item): item is ShellFooterLink => item !== null)
}

function normalizeSocialLinks(value: SiteSetting['socialLinks']): ShellSocialLink[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      const url = normalizeText(item?.url)

      if (!item?.platform || !url) {
        return null
      }

      return {
        platform: item.platform,
        url,
      }
    })
    .filter((item): item is ShellSocialLink => item !== null)
}

function normalizeFooterLegalText(value: unknown): ShellFooterLegalText {
  if (typeof value === 'string') {
    const normalized = normalizeText(value)

    return normalized
      ? {
          kind: 'plainText',
          value: normalized,
        }
      : null
  }

  if (isSerializedEditorState(value)) {
    return {
      kind: 'lexical',
      value,
    }
  }

  return null
}

export const getPublicSiteShellData = cache(async (): Promise<PublicSiteShellData> => {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const siteSettings = await payload.findGlobal({
      depth: 1,
      overrideAccess: false,
      slug: 'siteSettings',
    })

    const brandName = normalizeBrandName(siteSettings.siteName)

    return {
      brandName,
      faviconUrl: normalizeFaviconUrl(siteSettings.favicon),
      footer: {
        brandName,
        legalText: normalizeFooterLegalText(siteSettings.footerLegalText),
        links: normalizeFooterLinks(siteSettings.footerLinks),
        socialLinks: normalizeSocialLinks(siteSettings.socialLinks),
      },
      navbar: {
        links: normalizeNavLinks(siteSettings.navLinks),
        logo: normalizeLogo(siteSettings.navbarLogo, brandName),
      },
    }
  } catch (error) {
    console.error('Failed to read public site shell data.', error)
    return fallbackSiteShellData
  }
})
