import Image from 'next/image'
import Link from 'next/link'

import { CartSummary } from '@/components/cart/CartSummary'
import type { PublicSiteShellData } from '@/lib/getPublicSiteShellData'

import styles from './Navbar.module.css'

type NavbarProps = {
  brandName: string
  links: PublicSiteShellData['navbar']['links']
  logo: PublicSiteShellData['navbar']['logo']
}

export function Navbar({ brandName, links, logo }: NavbarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link aria-label="Trang chủ" className={styles.brand} href="/">
          {logo ? (
            <Image
              alt={logo.alt}
              className={styles.logo}
              height={logo.height}
              src={logo.url}
              unoptimized
              width={logo.width}
            />
          ) : (
            <span className={styles.brandText}>{brandName}</span>
          )}
        </Link>

        <div className={styles.actions}>
          {links.length > 0 && (
            <nav aria-label="Điều hướng chính" className={styles.nav}>
              <ul className={styles.linkList}>
                {links.map((link) => {
                  const isExternal = /^https?:\/\//.test(link.href)

                  return (
                    <li className={styles.linkItem} key={`${link.label}-${link.href}`}>
                      {isExternal ? (
                        <a
                          className={styles.link}
                          href={link.href}
                          rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                          target={link.openInNewTab ? '_blank' : undefined}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          className={styles.link}
                          href={link.href}
                          rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                          target={link.openInNewTab ? '_blank' : undefined}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}

          <CartSummary className={styles.cartSummaryLink} />
        </div>
      </div>
    </header>
  )
}
