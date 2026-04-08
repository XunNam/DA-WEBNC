import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { EB_Garamond, Open_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPublishedBookDetailBySlug } from '@/lib/getPublishedBookDetailBySlug'

import { BookDetailActionRow } from './BookDetailActionRow'
import styles from './page.module.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

type BookDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

function normalizeSlug(value: string): string | null {
  const normalized = value.trim()

  return normalized ? normalized : null
}

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)

  if (!normalizedSlug) {
    return {
      description: 'Chi tiết sách',
      title: 'Bookstore | Chi tiết sách',
    }
  }

  const book = await getPublishedBookDetailBySlug(normalizedSlug)

  if (!book) {
    return {
      description: 'Chi tiết sách',
      title: 'Bookstore | Chi tiết sách',
    }
  }

  return {
    description: book.metaDescription || `Chi tiết sách ${book.title}`,
    title: book.metaTitle || `Chi tiết sách | ${book.title}`,
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)

  if (!normalizedSlug) {
    notFound()
  }

  const book = await getPublishedBookDetailBySlug(normalizedSlug)

  if (!book) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link className={`${openSans.className} ${styles.backLink}`} href="/books">
          Quay lại
        </Link>

        <section className={styles.heroSection}>
          <div className={styles.coverCard}>
            <Image
              alt={book.coverImage.alt}
              className={styles.coverImage}
              height={book.coverImage.height}
              src={book.coverImage.url}
              unoptimized
              width={book.coverImage.width}
            />
          </div>

          <div className={styles.detailCard}>
            <p className={`${openSans.className} ${styles.eyebrow}`}>Tên sách</p>
            <h1 className={`${ebGaramond.className} ${styles.title}`}>{book.title}</h1>

            <dl className={styles.metaList}>
              {book.typeLabel && (
                <div className={styles.metaRow}>
                  <dt className={`${openSans.className} ${styles.metaLabel}`}>Thể loại</dt>
                  <dd className={`${openSans.className} ${styles.metaValue}`}>{book.typeLabel}</dd>
                </div>
              )}

              <div className={styles.metaRow}>
                <dt className={`${openSans.className} ${styles.metaLabel}`}>Tác giả</dt>
                <dd className={`${openSans.className} ${styles.metaValue}`}>{book.authorName}</dd>
              </div>

              {book.price !== null && (
                <div className={styles.metaRow}>
                  <dt className={`${openSans.className} ${styles.metaLabel}`}>Giá bán</dt>
                  <dd className={`${openSans.className} ${styles.priceValue}`}>
                    {formatVnd(book.price)}
                  </dd>
                </div>
              )}

              {book.compareAtPrice !== null && (
                <div className={styles.metaRow}>
                  <dt className={`${openSans.className} ${styles.metaLabel}`}>Giá gốc</dt>
                  <dd className={`${openSans.className} ${styles.compareAtPrice}`}>
                    {formatVnd(book.compareAtPrice)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionCard}>
            <h2 className={`${ebGaramond.className} ${styles.sectionTitle}`}>Tổng quan về sách</h2>

            {book.detailContent ? (
              <RichText
                className={`${openSans.className} ${styles.richText}`}
                data={book.detailContent}
              />
            ) : (
              <p className={`${openSans.className} ${styles.fallbackText}`}>
                Nội dung đang được cập nhật
              </p>
            )}
          </div>
        </section>

        <section className={styles.actionSection}>
          <BookDetailActionRow
            bodyFontClassName={openSans.className}
            book={{
              compareAtPrice: book.compareAtPrice,
              coverImageAlt: book.coverImage.alt,
              coverImageUrl: book.coverImage.url,
              id: book.id,
              price: book.price,
              slug: book.slug,
              title: book.title,
            }}
          />
        </section>
      </div>
    </div>
  )
}
