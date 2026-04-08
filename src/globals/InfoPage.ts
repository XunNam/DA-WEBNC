import type { Access, GlobalConfig } from 'payload'

import { createSEOFields } from '@/fields/seoFields'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'

function hasEnabledLink(siblingData: unknown): boolean {
  if (!siblingData || typeof siblingData !== 'object') {
    return false
  }

  return Boolean((siblingData as { enableLink?: unknown }).enableLink)
}

function validateExternalUrl(value: unknown, siblingData: unknown): true | string {
  if (!hasEnabledLink(siblingData)) {
    return true
  }

  if (typeof value !== 'string' || !value.trim()) {
    return 'Vui lòng nhập URL http:// hoặc https:// khi bật liên kết ngoài.'
  }

  try {
    const parsedUrl = new URL(value.trim())

    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return true
    }
  } catch {
    // Validation falls through to the error message below.
  }

  return 'URL ngoài phải là địa chỉ hợp lệ bắt đầu bằng http:// hoặc https://.'
}

export const InfoPage: GlobalConfig = {
  slug: 'infoPage',
  label: 'Giới thiệu',
  access: {
    read: () => true,
    update: usersCollectionOnly,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
    },
    {
      name: 'lead',
      type: 'richText',
    },
    {
      name: 'introBlocks',
      type: 'array',
      fields: [
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'body',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'toolSections',
      type: 'array',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'sectionDescription',
          type: 'richText',
        },
        {
          name: 'tools',
          type: 'array',
          fields: [
            {
              name: 'enableLink',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (_, siblingData) => hasEnabledLink(siblingData),
              },
              validate: (
                value: unknown,
                { siblingData }: { siblingData?: unknown },
              ) => validateExternalUrl(value, siblingData),
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'toolName',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
            },
          ],
        },
      ],
    },
    ...createSEOFields(),
  ],
  versions: {
    drafts: true,
  },
}
