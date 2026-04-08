# Current Media Admin State

## Current collection/admin shape

The current `media` collection is intentionally minimal:

- `src/collections/Media.ts`
  - `slug: 'media'`
  - public `read`
  - one custom field: `alt`
  - `upload: true`
- there is no custom `admin` config on the collection right now
- there are no custom media lifecycle hooks in the app code

Because `upload: true` is enabled, Payload already gives this collection its built-in upload admin behavior. The generated types confirm that the collection already exposes the built-in upload fields that matter for management:

- `filename`
- `url`
- `thumbnailURL`
- `mimeType`
- `filesize`
- `width`
- `height`

Evidence:

- `src/payload-types.ts`
- official Payload upload docs state that upload-enabled collections automatically get:
  - upload-specific list UI
  - upload-specific edit UI
  - file delete support
  - thumbnail support in the list view

## Current R2 wiring

The current Payload config already wires the `media` collection through Cloudflare R2 using the official S3-compatible adapter:

- `src/payload.config.ts`
  - `@payloadcms/storage-s3`
  - target collection: `media`
  - endpoint derived from `R2_ACCOUNT_ID`
  - `region: 'auto'`
  - `forcePathStyle: true`
  - direct file URL generation from `R2_PUBLIC_URL`
  - storage enabled only when the R2 env gate is active and complete

The current runtime state shows that media documents are already resolving to the custom/public R2 URL, e.g. `https://.../filename.jpg`, so the storage adapter is active in the current local environment.

## Current admin workflow the repo already supports

Without adding any custom page, the current Media collection admin already gives the user:

- upload a media item
- view a paginated list of media documents
- open a media document edit view
- delete a media document
- see built-in upload metadata fields such as filename/url

## Real current gap

The main gap is not “missing media CRUD.”

The real gap is that the current Media admin is still generic and not optimized for the user’s image-management workflow:

- filename is not explicitly configured as the admin-facing title
- list columns are not tuned for filename-first discovery
- search behavior is not explicitly configured around uploaded filename
- there is no explicit “open original image” affordance configured
- the deletion expectation is currently misunderstood:
  - deleting a Book does not delete its related Media object
  - the Media collection is the actual deletion point for removing an object from R2

That means the repo does not currently need a new media-management system.
It needs:

1. a delete-lifecycle audit/verification centered on Media deletion
2. small admin usability improvements on the existing Media collection
