import type { Access, CollectionConfig } from 'payload'

import { publicPublishedRead } from '@/access/publicPublishedRead'
import { createSEOFields } from '@/fields/seoFields'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    read: publicPublishedRead,
    create: usersCollectionOnly,
    update: usersCollectionOnly,
    delete: usersCollectionOnly,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'lifeDatesDisplay',
      type: 'text',
    },
    ...createSEOFields(),
  ],
  versions: {
    drafts: true,
  },
}
