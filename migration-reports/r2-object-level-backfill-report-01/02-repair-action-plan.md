## Planned Action Logic

- `object-present`: skip
- `object-missing` with resolvable local source: update existing Media doc in place
- `manual-review`: stop and report

## Initial Plan From Audit

- `skip-object-present`: `0`
- `update-in-place`: `21`
- `create-missing`: `0`
- `manual-review`: `0`

## Repair Scope Actually Used

All `21` missing objects were repaired in place.

- Existing Media document ID remained authoritative
- Existing filename remained the bucket-key basis
- Source resolution order stayed within the approved rule:
  1. `media/` exact filename
  2. `assets-map.json` + `legacy/public/` fallback only if needed

In the live run, every repair used `media/` as the source. No fallback to `legacy/public/` was required.

## Repaired Filenames

- `cam-on-nguoi-lon.jpg`
- `canh-dong-bat-tan.jpg`
- `chi-pheo.webp`
- `cho-toi-xin-mot-ve-di-tuoi-tho.jpg`
- `doi-thua.jpg`
- `kim-lan.jpg`
- `nam-cao.jpg`
- `ngay-xua-co-mot-chuyen-tinh.webp`
- `ngo-tat-to.jpg`
- `nguyen-du.jpg`
- `nguyen-ngoc-tu.jpg`
- `nguyen-nhat-anh.jpg`
- `nguyen-tuan.jpg`
- `so-do.webp`
- `tat-den.webp`
- `toi-la-beto.jpg`
- `toi-thay-hoa-vang-tren-co-xanh.jpg`
- `truyen-kieu.jpg`
- `vang-bong-mot-thoi.webp`
- `vo-nhat.webp`
- `vu-trong-phung.jpg`

## Explicit Non-Actions

- No broad rewrite
- No Media document recreation
- No relation rewrites
- No local-file cleanup
- No direct bulk object copy outside Payload-aware Media updates
