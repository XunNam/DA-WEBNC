export type RuntimeRedirectEntry = {
  source: string
  destination: string
  permanent: true
}

export type ManualReviewRedirectEntry = {
  source: string
  reason: string
  suggestedAction: 'manual-review'
}

export const AUTO_LISTING_REDIRECTS: RuntimeRedirectEntry[] = [
  {
    source: '/authorsPage',
    destination: '/authors',
    permanent: true,
  },
  {
    source: '/booksPage',
    destination: '/books',
    permanent: true,
  },
]

export const MANUAL_REVIEW_ROUTE_CANDIDATES: ManualReviewRedirectEntry[] = [
  {
    source: '/buyBookPage',
    reason: 'No approved canonical v1 destination.',
    suggestedAction: 'manual-review',
  },
]

export const AUTHOR_DETAIL_REDIRECT_SOURCE_PREFIX = '/authorsPage/'
export const AUTHOR_DETAIL_REDIRECT_DESTINATION_PREFIX = '/authors/'
