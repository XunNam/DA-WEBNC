# Media Search / Preview Plan

## Goal

Support the user workflow with the smallest change set:

- preview images
- find images by uploaded filename
- open/view an image
- delete an image

## What Payload already provides

For upload-enabled collections, Payload already provides:

- upload-aware list view
- upload-aware edit view
- thumbnail/list behavior in admin
- delete support at the collection level

That means preview and delete are already fundamentally available through the built-in Media admin.

## Smallest useful admin improvements

### 1. Make filename the admin-facing title

Recommended change:

- in `src/collections/Media.ts`
  - set `admin.useAsTitle = 'filename'`

Why:

- the user’s real lookup key is the uploaded filename
- this improves document labels throughout the admin UI

### 2. Make list search explicitly filename-centric

Recommended change:

- set `admin.listSearchableFields = ['filename', 'alt']`

Why:

- default search behavior should not be left ambiguous when filename-based lookup is a core requirement
- `alt` remains useful as a secondary search surface

### 3. Set filename-first default columns

Recommended change:

- set `admin.defaultColumns` to a small practical set such as:
  - `filename`
  - `alt`
  - `updatedAt`
  - optionally `mimeType` or `filesize`

Why:

- this makes the built-in list view immediately usable as a media library
- it avoids custom components unless they are truly necessary

### 4. Open/view image

Safest first-pass approach:

- rely on the built-in edit view preview for uploads
- optionally add a small `admin.preview` URL on the Media collection edit view if the user wants an explicit “open original file” action

This is safer than building a custom admin page.

## What is not required immediately

- no custom list view page
- no custom media dashboard
- no custom thumbnail component unless the built-in list view proves insufficient
- no bulk asset browser redesign

## Resulting recommended workflow

1. go to Media collection admin
2. search by filename
3. use the list view thumbnail + metadata to identify the asset
4. open the document if needed
5. preview/open the file from the edit view
6. delete the Media document when the asset should be removed from R2
