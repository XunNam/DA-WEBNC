import type { Access, GlobalConfig } from 'payload'

import { createSEOFields } from '@/fields/seoFields'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'

const awardIconOptions = ['ultra', 'mega', 'hyper-best', 'ultimate-winer'] as const

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: usersCollectionOnly,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          required: true,
        },
        {
          name: 'featuredBook',
          type: 'relationship',
          relationTo: 'books',
          required: true,
        },
        {
          name: 'summaryOverride',
          type: 'textarea',
        },
        {
          name: 'buyLinkUrl',
          type: 'text',
        },
        {
          name: 'sampleLinkUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'authorSpotlight',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          required: true,
        },
        {
          name: 'featuredAuthor',
          type: 'relationship',
          relationTo: 'authors',
          required: true,
        },
        {
          name: 'summary',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'bestSellers',
      type: 'array',
      fields: [
        {
          name: 'book',
          type: 'relationship',
          relationTo: 'books',
          required: true,
        },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      fields: [
        {
          name: 'iconKey',
          type: 'select',
          required: true,
          options: awardIconOptions.map((value) => ({
            label: value,
            value,
          })),
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'newsletterCta',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
      ],
    },
    ...createSEOFields(),
  ],
  versions: {
    drafts: true,
  },
}
