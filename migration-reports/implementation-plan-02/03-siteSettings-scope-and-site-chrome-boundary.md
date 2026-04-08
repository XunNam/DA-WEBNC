# SiteSettings Scope And Site-Chrome Boundary

## Purpose

This document defines the exact v1 boundary for `siteSettings` and separates editor-managed site chrome from code-managed chrome.

The goal is to add a useful minimal global without pushing unstable or placeholder navigation decisions into the CMS too early.

## V1 `siteSettings` scope

`siteSettings` should be added in v1 as a minimal global with only the settings that are both useful and supported by legacy evidence.

### Include in `siteSettings`

- `siteName`
- `defaultMetaTitle`
- `defaultMetaDescription`
- `footerLegalText`
- `footerLinks`
- `socialLinks`

These fields are justified because they represent site-wide settings or repeatable link groups that can reasonably be managed by non-developers without changing app structure.

## Why these fields belong in `siteSettings`

### `siteName`

Reason:

- stable site-wide identity value
- useful for layout metadata and future shared UI
- low risk for editor control

### `defaultMetaTitle`

Reason:

- useful fallback SEO value across the site
- clearly site-wide
- does not require a full SEO plugin or complex metadata model

### `defaultMetaDescription`

Reason:

- same rationale as `defaultMetaTitle`
- supports minimal v1 SEO without over-engineering

### `footerLegalText`

Legacy evidence:

- `legacy/src/app/components/Footer.tsx`

Observed content:

- `Lập trình ứng dụng web | 0502`

Reason:

- clearly global
- small and stable
- appropriate for editor control

### `footerLinks`

Legacy evidence:

- `legacy/src/app/components/Footer.tsx`

Reason:

- footer links are site-wide UI content
- link labels may reasonably need editorial updates
- the data shape is small and manageable

Important boundary:

- only the stable subset of footer links should be normalized into v1
- placeholder or unresolved footer items should not be imported blindly

### `socialLinks`

Legacy evidence:

- `legacy/src/app/components/Footer.tsx` contains social icons but no actual URLs

Reason:

- social URLs are a classic global setting
- editors may later populate them without changing code
- the legacy evidence supports the presence of social platforms, but not actual destination URLs

Initial v1 behavior:

- `socialLinks` should exist as a field in `siteSettings`
- normalized initial data should be an empty list unless real URLs are approved during review

## What stays out of `siteSettings` in v1

### `navLinks` stay code-managed

This is a locked v1 decision unless the repo structure later proves it impossible.

Legacy evidence:

- `legacy/src/app/components/NavbarLink.tsx`

Observed issues:

- mixed stable and unstable destinations
- placeholder content such as `Về chúng tôi?`
- an external localhost-only link for `Tư vấn` pointing to `http://127.0.0.1:8501`

Why `navLinks` should remain code-managed in v1:

- the navigation is not yet a clean content set
- route rollout is staged and still depends on what frontend surfaces are implemented
- editor-managing unstable or placeholder nav entries increases migration risk
- the first frontend refactor should not depend on a new editable nav model

## Footer links boundary

`footerLinks` are editor-managed in v1, but only for the stable subset supported by real destinations.

### Stable subset to include initially

Based on `legacy/src/app/components/Footer.tsx`, the safe initial normalized links are:

- `/` for home
- `/books` as the canonical replacement for legacy `/booksPage`
- `/authors` as the canonical replacement for legacy `/authorsPage`

### Links to exclude from initial normalized data

Do not include these in the initial imported `footerLinks` set:

- `Về chúng tôi?`
- `Liên hệ`

Reason:

- they do not map to approved v1 routes
- in the legacy footer they do not represent stable implemented destinations
- importing them into `siteSettings` would give a false sense of completion

These can be revisited later if real pages are added.

## Social links boundary

`socialLinks` should be editor-managed, but the initial state should be empty.

Reason:

- legacy footer icons imply intended platforms
- legacy code does not provide real URLs
- inventing URLs or placeholder links would create bad public data

Recommended v1 behavior:

- code owns the icon selection per platform
- data owns only populated platform/link rows
- frontend renders only rows that have real approved URLs

## Static assets that stay code-managed

### Logo SVGs

Keep the following static in v1:

- `legacy/public/site-logo.svg`
- `legacy/public/site-logo-white.svg`

Reason:

- these are design assets, not editorial content
- the current repo does not require editor-managed logos for the v1 rollout
- moving them into Payload media would broaden scope without business value

### Award icons

Keep the award SVGs static in v1.

Reason:

- awards are represented as structured homepage content plus static icon keys
- icon files are UI assets, not content records
- static usage is simpler and safer for the first rollout

## Minimal site-chrome ownership model for v1

### Editor-managed in `siteSettings`

- site name
- default meta title
- default meta description
- footer legal text
- stable footer links
- social links with real URLs only

### Code-managed in v1

- nav links
- logo SVG references
- award icon references
- icon component mapping for social platforms
- any placeholder or not-yet-implemented chrome destinations

## Why this boundary is the safest v1 choice

This boundary gives editors control where the value is real and low-risk, while keeping unstable routing and design assets out of the CMS until the site structure is more mature.

That reduces risk in four ways:

- it avoids encoding placeholder navigation as trusted content
- it keeps design assets out of the first migration
- it limits `siteSettings` to values with clear site-wide meaning
- it keeps the first frontend refactor from depending on unresolved nav decisions
