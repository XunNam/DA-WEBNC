import type { Access, CollectionConfig } from 'payload'

import { publicPublishedRead } from '@/access/publicPublishedRead'
import { createSEOFields } from '@/fields/seoFields'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'

export const Books: CollectionConfig = {
  slug: 'books',
  access: {
    read: publicPublishedRead,
    create: usersCollectionOnly,
    update: usersCollectionOnly,
    delete: usersCollectionOnly,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
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
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'typeLabel',
      type: 'text',
      admin: {
        description:
          'Ví dụ nhãn cũ: Tiểu thuyết, Truyện ngắn, Truyện dài, Truyện thơ.',
      },
    },
    {
      name: 'catalogVisible',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      name: 'compareAtPrice',
      type: 'number',
    },
    {
      name: 'detailContent',
      label: 'Tổng quan về sách',
      type: 'richText',
    },
    ...createSEOFields(),
  ],
  versions: {
    drafts: true,
  },
}
