import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { PublicSiteShellData } from '@/lib/getPublicSiteShellData'

import styles from './Footer.module.css'

type FooterProps = {
  brandName: string
  legalText: PublicSiteShellData['footer']['legalText']
  links: PublicSiteShellData['footer']['links']
  socialLinks: PublicSiteShellData['footer']['socialLinks']
}

const socialPlatformLabels = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  'twitter-x': 'X',
  youtube: 'YouTube',
} as const

export function Footer({ brandName, legalText, links, socialLinks }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link className={styles.brandLink} href="/">
            {brandName}
          </Link>

          {legalText?.kind === 'plainText' && <p className={styles.legalText}>{legalText.value}</p>}
          {legalText?.kind === 'lexical' && (
            <RichText className={styles.legalText} data={legalText.value} />
          )}
        </div>

        {links.length > 0 && (
          <nav aria-label="Liên kết chân trang" className={styles.nav}>
            <ul className={styles.linkList}>
              {links.map((link) => {
                const isExternal = /^https?:\/\//.test(link.href)

                return (
                  <li className={styles.linkItem} key={`${link.label}-${link.href}`}>
                    {isExternal ? (
                      <a className={styles.link} href={link.href} rel="noopener noreferrer" target="_blank">
                        {link.label}
                      </a>
                    ) : (
                      <Link className={styles.link} href={link.href}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        {socialLinks.length > 0 && (
          <div className={styles.socialRow}>
            {socialLinks.map((link) => (
              <a
                className={styles.socialLink}
                href={link.url}
                key={`${link.platform}-${link.url}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {socialPlatformLabels[link.platform]}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
