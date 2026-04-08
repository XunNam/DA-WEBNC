# SiteSettings Derivation Safety

## Purpose

This document tightens how `siteName`, `defaultMetaTitle`, and `defaultMetaDescription` should be derived for v1 so they remain reviewable normalized outputs rather than silently authoritative values.

`siteSettings` remains in v1. This revision only makes the derivation and validation rules safer.

## Direct evidence vs inferred evidence

### Direct evidence

The strongest site-wide metadata evidence currently found in legacy code is:

- `legacy/src/app/layout.tsx`
  - `description: "Bookstore Website"`

This directly supports an initial normalized candidate for:

- `defaultMetaDescription`

### Inferred or repeated evidence

The following repeated legacy metadata patterns support inference, but not certainty:

- `legacy/src/app/layout.tsx`
  - `title: "Bookstore | Trang chủ"`
- `legacy/src/app/booksPage/page.tsx`
  - `title: "Bookstore | Sách"`
- `legacy/src/app/authorsPage/page.tsx`
  - `title: "Bookstore | Tác giả"`

This supports inferred normalized candidates for:

- `siteName = "Bookstore"`
- `defaultMetaTitle = "Bookstore"`

### Weaker or inconsistent evidence

Author detail pages use titles like:

- `Tác giả | Nguyễn Nhật Ánh`
- `Tác giả | Kim Lân`

This does not invalidate the broader `Bookstore` inference, but it means the site-wide naming evidence is not perfectly uniform.

## Safe derivation policy

### What can be normalized

The normalization step may still produce v1 candidates for:

- `siteName`
- `defaultMetaTitle`
- `defaultMetaDescription`

### What must not happen

The normalization step must not treat inferred values as unquestioned truth.

That means:

- no silent upgrade from repeated prefix to authoritative brand decision
- no loss of provenance
- no validation pass that hides weak evidence

## Recommended normalized output shape

`migration-data/site-settings.normalized.json` should carry both normalized data and review metadata.

Recommended structure:

```json
{
  "data": {
    "siteName": "Bookstore",
    "defaultMetaTitle": "Bookstore",
    "defaultMetaDescription": "Bookstore Website",
    "footerLegalText": "Lập trình ứng dụng web | 0502",
    "footerLinks": [],
    "socialLinks": []
  },
  "review": {
    "siteName": {
      "evidenceType": "inferred",
      "reviewRequired": true,
      "confidence": "medium",
      "provenance": [
        "legacy/src/app/layout.tsx",
        "legacy/src/app/booksPage/page.tsx",
        "legacy/src/app/authorsPage/page.tsx"
      ]
    },
    "defaultMetaTitle": {
      "evidenceType": "inferred",
      "reviewRequired": true,
      "confidence": "medium",
      "provenance": [
        "legacy/src/app/layout.tsx",
        "legacy/src/app/booksPage/page.tsx",
        "legacy/src/app/authorsPage/page.tsx"
      ]
    },
    "defaultMetaDescription": {
      "evidenceType": "direct",
      "reviewRequired": false,
      "confidence": "high",
      "provenance": [
        "legacy/src/app/layout.tsx"
      ]
    }
  }
}
```

The exact field names can vary in implementation, but the normalized output must preserve:

- the normalized data values
- field-level provenance
- evidence strength
- whether manual review is required

## Validation expectations

Validation should treat site-wide metadata in two categories:

### Hard failure

Fail only if a required normalized site-settings value is missing entirely, for example:

- no candidate `siteName`
- no candidate `defaultMetaTitle`
- no candidate `defaultMetaDescription`

### Warning, not failure

Warn when metadata is present but weakly evidenced or inconsistent, for example:

- value derived only by inference
- inconsistent title prefixes across legacy pages
- multiple candidate descriptions discovered later

These warnings should appear in `migration-data/qa-report.json`.

## Why this is safer

This keeps `siteSettings` usable in v1 while making sure that:

- editors can review inferred site-wide metadata before trusting it
- import logic later can consume normalized data intentionally
- reviewers can distinguish direct extraction from normalization judgment

## Final recommendation

Keep `siteSettings` in v1, but require that site-wide metadata candidates remain explicitly reviewable. `defaultMetaDescription` can be treated as direct legacy evidence; `siteName` and `defaultMetaTitle` should be treated as inferred candidates with provenance and validation warnings where appropriate.
