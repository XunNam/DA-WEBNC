import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import type { SiteSetting } from '../../src/payload-types'

type FooterLegalTextValue = SiteSetting['footerLegalText']

function isRichTextValue(value: unknown): value is FooterLegalTextValue {
  if (!value || typeof value !== 'object') {
    return false
  }

  const root = (value as { root?: unknown }).root

  return Boolean(root && typeof root === 'object' && Array.isArray((root as { children?: unknown }).children))
}

function createRichTextFromPlainText(value: string): FooterLegalTextValue {
  const lines = value.split(/\r?\n/)

  return {
    root: {
      children: lines.map((line) => ({
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
  }
}

const payload = await getPayload({ config: await Promise.resolve(config) })

try {
  const siteSettings = await payload.findGlobal({
    depth: 0,
    overrideAccess: true,
    slug: 'siteSettings',
  })

  const currentValue = siteSettings.footerLegalText

  if (isRichTextValue(currentValue)) {
    console.log(
      JSON.stringify(
        {
          changed: false,
          reason: 'footerLegalText is already valid rich text.',
          storedType: 'object',
        },
        null,
        2,
      ),
    )
  } else if (typeof currentValue === 'string') {
    const repairedValue = createRichTextFromPlainText(currentValue)

    await payload.updateGlobal({
      slug: 'siteSettings',
      data: {
        footerLegalText: repairedValue,
      },
      depth: 0,
      overrideAccess: true,
    })

    const updated = await payload.findGlobal({
      depth: 0,
      overrideAccess: true,
      slug: 'siteSettings',
    })

    console.log(
      JSON.stringify(
        {
          changed: true,
          previousType: 'string',
          previousValue: currentValue,
          storedType: typeof updated.footerLegalText,
          storedValue: updated.footerLegalText,
        },
        null,
        2,
      ),
    )
  } else {
    throw new Error(
      `footerLegalText has unsupported stored type: ${currentValue === null ? 'null' : typeof currentValue}`,
    )
  }
} finally {
  await payload.destroy()
}
