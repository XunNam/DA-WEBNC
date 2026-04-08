import type { Metadata } from 'next'
import { Baloo_Paaji_2, EB_Garamond, Open_Sans } from 'next/font/google'
import Image from 'next/image'

import { getPublishedHomepageData } from '@/lib/getPublishedHomepageData'

import { HomepageBestSellersClient } from './HomepageBestSellersClient'
import { HomepageHeroActionsClient } from './HomepageHeroActionsClient'
import styles from './page.module.css'

const balooPaaji = Baloo_Paaji_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const awardIconPath = {
  'hyper-best': '/hyper-best.svg',
  mega: '/mega.svg',
  ultra: '/ultra.svg',
  'ultimate-winer': '/ultimate-winer.svg',
} as const

const awardIconSize = {
  'hyper-best': { height: 32, width: 66 },
  mega: { height: 32, width: 79 },
  ultra: { height: 32, width: 67 },
  'ultimate-winer': { height: 32, width: 40 },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublishedHomepageData()

  return {
    description: data.metaDescription,
    title: data.metaTitle,
  }
}

export default async function HomePage() {
  const data = await getPublishedHomepageData()
  const heroBook = data.hero.featuredBook
  const spotlightAuthor = data.authorSpotlight.featuredAuthor

  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.heroContent}>
          <p className={`${balooPaaji.className} ${styles.eyebrow}`}>{data.hero.eyebrow}</p>
          <h1 className={`${ebGaramond.className} ${styles.heroTitle}`}>{heroBook.title}</h1>
          <p className={`${openSans.className} ${styles.heroAuthor}`}>{heroBook.authorName}</p>

          {data.hero.summaryOverride && (
            <p className={`${openSans.className} ${styles.heroSummary}`}>
              {data.hero.summaryOverride}
            </p>
          )}

          <HomepageHeroActionsClient
            bodyFontClassName={openSans.className}
            book={{
              compareAtPrice: heroBook.compareAtPrice,
              coverImageAlt: heroBook.coverImage.alt,
              coverImageUrl: heroBook.coverImage.url,
              id: heroBook.id,
              price: heroBook.price,
              slug: heroBook.slug,
              title: heroBook.title,
            }}
          />
        </div>

        <div className={styles.heroMedia}>
          <Image
            alt={heroBook.coverImage.alt}
            className={styles.heroImage}
            height={heroBook.coverImage.height}
            priority
            src={heroBook.coverImage.url}
            unoptimized
            width={heroBook.coverImage.width}
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.spotlightSection}`}>
        <div className={styles.spotlightMedia}>
          <Image
            alt={spotlightAuthor.portrait.alt}
            className={styles.spotlightImage}
            height={spotlightAuthor.portrait.height}
            src={spotlightAuthor.portrait.url}
            unoptimized
            width={spotlightAuthor.portrait.width}
          />
        </div>

        <div className={styles.spotlightContent}>
          <p className={`${balooPaaji.className} ${styles.eyebrow}`}>
            {data.authorSpotlight.eyebrow}
          </p>
          <h2 className={`${ebGaramond.className} ${styles.spotlightTitle}`}>
            {spotlightAuthor.name}
          </h2>

          {spotlightAuthor.lifeDatesDisplay && (
            <p className={`${openSans.className} ${styles.spotlightMeta}`}>
              {spotlightAuthor.lifeDatesDisplay}
            </p>
          )}

          {data.authorSpotlight.summary && (
            <p className={`${openSans.className} ${styles.spotlightSummary}`}>
              {data.authorSpotlight.summary}
            </p>
          )}
        </div>
      </section>

      <section className={`${styles.section} ${styles.awardsSection}`}>
        <div className={styles.awardsGrid}>
          {data.awards.map((award) => (
            <article className={styles.awardCard} key={award.id || award.title}>
              <Image
                alt={award.title}
                className={styles.awardIcon}
                height={awardIconSize[award.iconKey].height}
                src={awardIconPath[award.iconKey]}
                width={awardIconSize[award.iconKey].width}
              />
              <h3 className={`${openSans.className} ${styles.awardTitle}`}>{award.title}</h3>
              <p className={`${openSans.className} ${styles.awardBody}`}>{award.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.bestSellerSection}`}>
        <div className={styles.bestSellerHeader}>
          <h2 className={`${ebGaramond.className} ${styles.sectionTitle}`}>Sách Bán Chạy</h2>
          <p className={`${openSans.className} ${styles.sectionLead}`}>
            Các tác phẩm văn học bán chạy nhất của chúng tôi
          </p>
        </div>

        <HomepageBestSellersClient
          bodyFontClassName={openSans.className}
          books={data.bestSellers}
          displayFontClassName={ebGaramond.className}
        />
      </section>

      <section className={styles.newsletterSection}>
        <div className={styles.newsletterInner}>
          <h2 className={`${ebGaramond.className} ${styles.newsletterHeading}`}>
            {data.newsletterCta.heading}
          </h2>
          <p className={`${openSans.className} ${styles.newsletterBody}`}>
            {data.newsletterCta.body}
          </p>
        </div>
      </section>
    </div>
  )
}
