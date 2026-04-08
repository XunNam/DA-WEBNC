import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Authors } from './collections/Authors'
import { Books } from './collections/Books'
import { DeliveredOrders } from './collections/DeliveredOrders'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Users } from './collections/Users'
import { Homepage } from './globals/Homepage'
import { InfoPage } from './globals/InfoPage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const normalizeEnv = (value: string | undefined): string | undefined => {
  const normalized = value?.trim()

  return normalized ? normalized : undefined
}

const r2Bucket = normalizeEnv(process.env.R2_BUCKET)
const r2AccountID = normalizeEnv(process.env.R2_ACCOUNT_ID)
const r2AccessKeyID = normalizeEnv(process.env.R2_ACCESS_KEY_ID)
const r2SecretAccessKey = normalizeEnv(process.env.R2_SECRET_ACCESS_KEY)
const r2PublicURL = normalizeEnv(process.env.R2_PUBLIC_URL)?.replace(/\/+$/, '')
const r2Endpoint = r2AccountID ? `https://${r2AccountID}.r2.cloudflarestorage.com` : undefined
const r2MediaStorageEnabled = process.env.R2_MEDIA_STORAGE_ENABLED === 'true'
const hasCompleteR2Config = Boolean(
  r2Bucket &&
    r2AccountID &&
    r2AccessKeyID &&
    r2SecretAccessKey &&
    r2PublicURL,
)
const shouldEnableR2MediaStorage = r2MediaStorageEnabled && hasCompleteR2Config
const fallbackR2Bucket = 'r2-media-disabled'
const fallbackR2Endpoint = 'https://example.invalid'
const fallbackR2PublicURL = 'https://example.invalid'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Books, Authors, Orders, DeliveredOrders],
  editor: lexicalEditor(),
  globals: [Homepage, SiteSettings, InfoPage],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: shouldEnableR2MediaStorage,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${encodeURIComponent(filename)}` : encodeURIComponent(filename)

            return `${r2PublicURL || fallbackR2PublicURL}/${key}`
          },
        },
      },
      bucket: r2Bucket || fallbackR2Bucket,
      config: {
        credentials: {
          accessKeyId: r2AccessKeyID || 'disabled',
          secretAccessKey: r2SecretAccessKey || 'disabled',
        },
        endpoint: r2Endpoint || fallbackR2Endpoint,
        forcePathStyle: true,
        region: 'auto',
      },
    }),
  ],
})
