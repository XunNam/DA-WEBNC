import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { EB_Garamond, Open_Sans } from 'next/font/google'
import Image from 'next/image'

import { getPublishedInfoPageData } from '@/lib/getPublishedInfoPageData'

import styles from './page.module.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublishedInfoPageData()

  return {
    description: data.metaDescription,
    title: data.metaTitle,
  }
}

export default async function InfoPage() {
  const data = await getPublishedInfoPageData()
  const hasIntroContent = Boolean(data.lead) || data.introBlocks.length > 0
  const hasToolSections = data.toolSections.length > 0

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>{data.pageTitle}</h1>

          {data.lead && <RichText className={`${openSans.className} ${styles.lead}`} data={data.lead} />}
        </header>

        <div className={styles.contentStack}>
          {hasIntroContent && (
            <section className={styles.section}>
              <div className={styles.introStack}>
                {data.introBlocks.map((block) => (
                  <article className={styles.introBlock} key={block.id}>
                    {block.heading && (
                      <h2 className={`${ebGaramond.className} ${styles.blockHeading}`}>
                        {block.heading}
                      </h2>
                    )}

                    {block.body && (
                      <RichText className={`${openSans.className} ${styles.richText}`} data={block.body} />
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {hasToolSections && (
            <section className={styles.section}>
              <div className={styles.sectionStack}>
                {data.toolSections.map((section) => (
                  <article className={styles.toolSection} key={section.id}>
                    {(section.sectionTitle || section.sectionDescription) && (
                      <div className={styles.sectionHeader}>
                        {section.sectionTitle && (
                          <h2 className={`${ebGaramond.className} ${styles.sectionTitle}`}>
                            {section.sectionTitle}
                          </h2>
                        )}

                        {section.sectionDescription && (
                          <RichText
                            className={`${openSans.className} ${styles.sectionDescription}`}
                            data={section.sectionDescription}
                          />
                        )}
                      </div>
                    )}

                    {section.tools.length > 0 && (
                      <div className={styles.toolGrid}>
                        {section.tools.map((tool) => {
                          const hasLink = Boolean(tool.enableLink && tool.externalUrl && tool.toolName)

                          return (
                            <article className={styles.toolCard} key={tool.id}>
                              {tool.logo && (
                                <div className={styles.logoFrame}>
                                  <Image
                                    alt={tool.logo.alt}
                                    className={styles.logoImage}
                                    height={tool.logo.height}
                                    src={tool.logo.url}
                                    unoptimized
                                    width={tool.logo.width}
                                  />
                                </div>
                              )}

                              <div className={styles.toolBody}>
                                {tool.toolName && hasLink ? (
                                  <a
                                    className={`${openSans.className} ${styles.toolLink}`}
                                    href={tool.externalUrl!}
                                    rel="noreferrer noopener"
                                    target="_blank"
                                  >
                                    <span>{tool.toolName}</span>
                                    <span aria-hidden="true" className={styles.linkIndicator}>
                                      ↗
                                    </span>
                                  </a>
                                ) : (
                                  tool.toolName && (
                                    <h3 className={`${openSans.className} ${styles.toolName}`}>
                                      {tool.toolName}
                                    </h3>
                                  )
                                )}

                                {tool.description && (
                                  <RichText
                                    className={`${openSans.className} ${styles.toolDescription}`}
                                    data={tool.description}
                                  />
                                )}
                              </div>
                            </article>
                          )
                        })}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
