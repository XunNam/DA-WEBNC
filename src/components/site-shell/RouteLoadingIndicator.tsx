'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import styles from './RouteLoadingIndicator.module.css'

const START_EVENT_NAME = 'frontend-route-loading:start'
const SAFETY_TIMEOUT_MS = 10000

export function startRouteLoadingIndicator() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(START_EVENT_NAME))
}

function buildRouteKey(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

export function RouteLoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const settledRouteKeyRef = useRef('')

  const search = searchParams.toString()
  const currentRouteKey = buildRouteKey(pathname, search)

  useEffect(() => {
    if (!settledRouteKeyRef.current) {
      settledRouteKeyRef.current = currentRouteKey
      return
    }

    if (currentRouteKey === settledRouteKeyRef.current) {
      return
    }

    settledRouteKeyRef.current = currentRouteKey

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsLoading(false)
  }, [currentRouteKey])

  useEffect(() => {
    const startLoading = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }

      setIsLoading(true)
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        setIsLoading(false)
      }, SAFETY_TIMEOUT_MS)
    }

    const handleStartEvent = () => {
      startLoading()
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const anchor = target.closest('a[href]')

      if (!(anchor instanceof HTMLAnchorElement)) {
        return
      }

      if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return
      }

      const href = anchor.getAttribute('href')

      if (!href) {
        return
      }

      const url = new URL(href, window.location.href)

      if (url.origin !== window.location.origin) {
        return
      }

      const nextRouteKey = buildRouteKey(url.pathname, url.search)

      if (nextRouteKey === settledRouteKeyRef.current) {
        return
      }

      const currentHashlessUrl = new URL(window.location.href)

      if (
        url.pathname === currentHashlessUrl.pathname &&
        url.search === currentHashlessUrl.search &&
        url.hash !== currentHashlessUrl.hash
      ) {
        return
      }

      startLoading()
    }

    document.addEventListener('click', handleDocumentClick, true)
    window.addEventListener(START_EVENT_NAME, handleStartEvent)

    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
      window.removeEventListener(START_EVENT_NAME, handleStartEvent)

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isLoading) {
    return null
  }

  return (
    <div aria-live="polite" className={styles.indicator} role="status">
      <span aria-hidden="true" className={styles.spinner} />
      <span className={styles.label}>Đang tải trang...</span>
    </div>
  )
}
