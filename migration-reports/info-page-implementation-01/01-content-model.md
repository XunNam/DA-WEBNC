## Content Model

Added new global:
- `slug: 'infoPage'`
- `versions: { drafts: true }`
- `access.read: () => true`
- `access.update: usersCollectionOnly`

Fields:
- `pageTitle`: optional text
- `lead`: optional rich text
- `introBlocks`: array
  - `heading`: optional text
  - `body`: required rich text
- `toolSections`: array
  - `sectionTitle`: required text
  - `sectionDescription`: optional rich text
  - `tools`: array
    - `enableLink`: checkbox, default `false`
    - `externalUrl`: optional text
    - `logo`: optional upload to `media`
    - `toolName`: required text
    - `description`: optional rich text
- SEO fields from `createSEOFields()`

Link field behavior:
- `externalUrl` is shown only when `enableLink === true`
- validation accepts only absolute `http://` or `https://` URLs when linking is enabled
- validation is ignored when linking is disabled

Validation check result:
- hidden when disabled: `true`
- shown when enabled: `true`
- invalid URL rejected: `true`
- valid `https://` URL accepted: `true`
