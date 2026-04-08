import type { Access, GlobalConfig } from 'payload'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'

const socialPlatformOptions = ['instagram', 'facebook', 'youtube', 'twitter-x'] as const

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true,
    update: usersCollectionOnly,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultMetaTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'navbarLogo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      label: 'Favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'footerLegalText',
      type: 'richText',
      required: true,
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: socialPlatformOptions.map((value) => ({
            label: value,
            value,
          })),
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
