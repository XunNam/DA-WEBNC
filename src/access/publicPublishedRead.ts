import type { Access } from 'payload'

const publishedOnlyConstraint = {
  _status: {
    equals: 'published',
  },
} as const

/**
 * Repo-specific read access for draft-enabled public collections.
 *
 * Assumptions locked by the migration planning baseline:
 * - the current repo has a single trusted auth collection: `users`
 * - that collection is used for admin/operator access today
 *
 * This helper must be revisited if a second auth collection or a non-admin
 * user model is introduced later.
 */
export const publicPublishedRead: Access = ({ req }) => {
  if (!req.user) {
    return publishedOnlyConstraint
  }

  if (req.user.collection === 'users') {
    return true
  }

  return publishedOnlyConstraint
}
