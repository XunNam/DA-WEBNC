## Admin And Publish Behavior

Admin capabilities added:
- edit the single `infoPage` global
- create multiple introduction blocks
- create multiple tool sections
- add multiple tools per section
- optionally enable or disable an external link per tool
- optionally attach a logo image from the `media` collection
- publish the page independently from drafts

Published-only behavior:
- the public `/info` route never reads draft content
- unpublished or empty content resolves to a safe fallback state instead of a crash
- public-read safety remained aligned with the repo's existing Payload local API pattern

Admin verification:
- `/admin` returned `200`
- `/admin/globals/infoPage` returned `200`

Conditional link-field verification:
- `externalUrl` condition returned `false` when `enableLink` was disabled
- `externalUrl` condition returned `true` when `enableLink` was enabled
- invalid external URL returned a validation error message
- valid `https://example.com/tool` returned `true`
