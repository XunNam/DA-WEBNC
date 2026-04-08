import type { Metadata } from 'next'
import React from 'react'
import { cookies } from 'next/headers'

import { CartProvider } from '@/components/cart/CartProvider'
import { Footer } from '@/components/site-shell/Footer'
import { Navbar } from '@/components/site-shell/Navbar'
import { RouteLoadingIndicator } from '@/components/site-shell/RouteLoadingIndicator'
import { CART_COOKIE_NAME, parseCartCookie } from '@/lib/cart/cartCookie'
import { getPublicSiteShellData } from '@/lib/getPublicSiteShellData'

import './styles.css'

export const dynamic = 'force-dynamic'

const fallbackMetadata: Metadata = {
  description: 'Bookstore Website',
  title: 'Bookstore',
}

export async function generateMetadata(): Promise<Metadata> {
  const shell = await getPublicSiteShellData()

  return {
    ...fallbackMetadata,
    ...(shell.faviconUrl
      ? {
          icons: {
            icon: shell.faviconUrl,
          },
        }
      : {}),
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const cookieStore = await cookies()
  const initialCart = parseCartCookie(cookieStore.get(CART_COOKIE_NAME)?.value)
  const shell = await getPublicSiteShellData()

  return (
    <html lang="vi">
      <body>
        <CartProvider initialCart={initialCart}>
          <RouteLoadingIndicator />
          <Navbar brandName={shell.brandName} links={shell.navbar.links} logo={shell.navbar.logo} />
          <main>{children}</main>
          <Footer
            brandName={shell.footer.brandName}
            legalText={shell.footer.legalText}
            links={shell.footer.links}
            socialLinks={shell.footer.socialLinks}
          />
        </CartProvider>
      </body>
    </html>
  )
}
