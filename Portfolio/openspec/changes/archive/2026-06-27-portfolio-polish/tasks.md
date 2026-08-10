# Tasks: Portfolio Polish

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200–260 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Bug Fixes

- [x] 1.1 `index.html` — Remove extra `</div>` in hero section
- [x] 1.2 `js/translations.js` — Remove stray `</span>` in ca/es/en translation strings
- [x] 1.3 `css/main.css` — Fix raw `--fs-small` → `var(--fs-small)`
- [x] 1.4 `css/main.css` — Consolidate duplicate `.btn-secondary:hover` into single rule

## Phase 2: Refactor

- [x] 2.1 `js/main.js` — Extract shared `splitWords()` helper; replace duplicated word-splitting callers
- [x] 2.2 `js/main.js` — Replace `clearProps: "all"` with targeted property arrays per timeline
- [x] 2.3 `index.html` + `css/main.css` — Move inline `style=""` from `.mobile-nav-toggle` to CSS rules
- [x] 2.4 `index.html` + `css/main.css` — Rename `.personalizado` to `.featured` (all references)
- [x] 2.5 `css/main.css` — Remove `!important` from `.section-desc` font-size; resolve via cascade

## Phase 3: Enhancements

- [x] 3.1 `index.html` — Add `loading="lazy"` to project/avatar/about images; `fetchpriority="high"` to intro overlay images
- [x] 3.2 `index.html` — Add `<meta name="description">` and OG tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- [x] 3.3 `img/` + `index.html` — Add favicon (`.ico` + `.png`); add `<link>` tags in `<head>`
- [x] 3.4 `js/main.js` — Bind `touchstart`/`touchend` for stack interaction elements
- [x] 3.5 `index.html` + `css/main.css` — Add scroll indicator at hero bottom with subtle bounce animation; hide on scroll past hero
- [x] 3.6 `js/main.js` + `css/main.css` — Use IntersectionObserver to highlight active nav section; add `.active-nav` style

## Phase 4: Content

- [x] 4.1 `index.html` — Add raymel.cat project card (image, title, description, link)
- [x] 4.2 `index.html` — Add comercialros.cat project card (image, title, description, link)
- [x] 4.3 `img/` — Place raymel.cat and comercialros.cat project images (webp format)
- [x] 4.4 `css/main.css` — Update grid to 4-column with `auto-fill`/`minmax()`; verify at 768px, 900px, 991px
