import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { InfoPage, Media, SiteSetting } from '@/payload-types'

type LexicalRichText = Exclude<InfoPage['lead'], null | undefined>
type IntroBlockRecord = NonNullable<InfoPage['introBlocks']>[number]
type ToolSectionRecord = NonNullable<InfoPage['toolSections']>[number]
type ToolRecord = NonNullable<ToolSectionRecord['tools']>[number]

type InfoPageMedia = {
  alt: string
  height: number
  url: string
  width: number
}

export type PublishedInfoPageData = {
  introBlocks: Array<{
    body: LexicalRichText | null
    heading: string | null
    id: string
  }>
  lead: LexicalRichText | null
  metaDescription: string
  metaTitle: string
  pageTitle: string
  toolSections: Array<{
    id: string
    sectionDescription: LexicalRichText | null
    sectionTitle: string | null
    tools: Array<{
      description: LexicalRichText | null
      enableLink: boolean
      externalUrl: string | null
      id: string
      logo: InfoPageMedia | null
      toolName: string | null
    }>
  }>
}

const fallbackPageTitle = 'Giới thiệu'

const fallbackData: PublishedInfoPageData = {
  introBlocks: [],
  lead: null,
  metaDescription: '',
  metaTitle: fallbackPageTitle,
  pageTitle: fallbackPageTitle,
  toolSections: [],
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function isSerializedEditorState(value: unknown): value is LexicalRichText {
  if (!value || typeof value !== 'object') {
    return false
  }

  const root = (value as { root?: unknown }).root

  return Boolean(root && typeof root === 'object' && Array.isArray((root as { children?: unknown }).children))
}

function lexicalNodeHasVisibleContent(node: unknown): boolean {
  if (!node || typeof node !== 'object') {
    return false
  }

  const text = (node as { text?: unknown }).text

  if (typeof text === 'string' && text.trim()) {
    return true
  }

  const children = (node as { children?: unknown }).children

  return Array.isArray(children) && children.some(lexicalNodeHasVisibleContent)
}

function normalizeRichText(value: unknown): LexicalRichText | null {
  if (!isSerializedEditorState(value)) {
    return null
  }

  return value.root.children.some(lexicalNodeHasVisibleContent) ? value : null
}

function normalizeMedia(value: string | Media | null | undefined, label: string): InfoPageMedia | null {
  if (!value || typeof value === 'string' || !value.url) {
    return null
  }

  return {
    alt: normalizeText(value.alt) || label,
    height: value.height || 256,
    url: value.url,
    width: value.width || 256,
  }
}

function normalizeExternalUrl(value: string | null | undefined): string | null {
  const normalized = normalizeText(value)

  if (!normalized) {
    return null
  }

  try {
    const parsedUrl = new URL(normalized)

    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return normalized
    }
  } catch {
    return null
  }

  return null
}

function normalizeIntroBlocks(value: InfoPage['introBlocks']): PublishedInfoPageData['introBlocks'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item: IntroBlockRecord, index) => {
      const heading = normalizeText(item.heading)
      const body = normalizeRichText(item.body)

      if (!heading && !body) {
        return null
      }

      return {
        body,
        heading,
        id: item.id || `intro-${index + 1}`,
      }
    })
    .filter((item): item is PublishedInfoPageData['introBlocks'][number] => item !== null)
}

function normalizeTools(value: ToolSectionRecord['tools']): PublishedInfoPageData['toolSections'][number]['tools'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item: ToolRecord, index) => {
      const toolName = normalizeText(item.toolName)
      const description = normalizeRichText(item.description)
      const enableLink = Boolean(item.enableLink)
      const externalUrl = enableLink ? normalizeExternalUrl(item.externalUrl) : null
      const logo = normalizeMedia(item.logo, toolName || `Tool logo ${index + 1}`)

      if (!toolName && !description && !logo) {
        return null
      }

      return {
        description,
        enableLink: Boolean(enableLink && externalUrl),
        externalUrl,
        id: item.id || `tool-${index + 1}`,
        logo,
        toolName,
      }
    })
    .filter((item): item is PublishedInfoPageData['toolSections'][number]['tools'][number] => item !== null)
}

function normalizeToolSections(value: InfoPage['toolSections']): PublishedInfoPageData['toolSections'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item: ToolSectionRecord, index) => {
      const sectionTitle = normalizeText(item.sectionTitle)
      const sectionDescription = normalizeRichText(item.sectionDescription)
      const tools = normalizeTools(item.tools)

      if (!sectionTitle && !sectionDescription && tools.length === 0) {
        return null
      }

      return {
        id: item.id || `tool-section-${index + 1}`,
        sectionDescription,
        sectionTitle,
        tools,
      }
    })
    .filter((item): item is PublishedInfoPageData['toolSections'][number] => item !== null)
}

function buildFallback(siteSettings?: Pick<SiteSetting, 'defaultMetaDescription' | 'defaultMetaTitle'>): PublishedInfoPageData {
  return {
    ...fallbackData,
    metaDescription: normalizeText(siteSettings?.defaultMetaDescription) || '',
    metaTitle: normalizeText(siteSettings?.defaultMetaTitle) || fallbackPageTitle,
  }
}

export const getPublishedInfoPageData = cache(async (): Promise<PublishedInfoPageData> => {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const [infoPage, siteSettings] = await Promise.all([
      payload.findGlobal({
        depth: 1,
        draft: false,
        overrideAccess: false,
        slug: 'infoPage',
      }),
      payload.findGlobal({
        depth: 0,
        overrideAccess: false,
        slug: 'siteSettings',
      }),
    ])

    if (infoPage._status !== 'published') {
      return buildFallback(siteSettings)
    }

    return {
      introBlocks: normalizeIntroBlocks(infoPage.introBlocks),
      lead: normalizeRichText(infoPage.lead),
      metaDescription:
        normalizeText(infoPage.metaDescription) ||
        normalizeText(siteSettings.defaultMetaDescription) ||
        '',
      metaTitle:
        normalizeText(infoPage.metaTitle) ||
        normalizeText(siteSettings.defaultMetaTitle) ||
        fallbackPageTitle,
      pageTitle: normalizeText(infoPage.pageTitle) || fallbackPageTitle,
      toolSections: normalizeToolSections(infoPage.toolSections),
    }
  } catch (error) {
    console.error('Failed to read published info page data.', error)
    return fallbackData
  }
})
