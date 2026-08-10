# Tasks: portfolioPC-build

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1200-1600 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Foundation + Nav \| PR 2: Content Sections \| PR 3: Interactivity + QA |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation + Nav (blocks 1-2) | PR 1 | HTML skeleton, tokens, base CSS, nav + card system, utilities, animations CSS |
| 2 | Content Sections (blocks 3-7) | PR 2 | Hero, terminal, projects, stack, about, footer — all card variants and responsive |
| 3 | Interactivity + Polish (blocks 8-10) | PR 3 | GSAP timelines, translations.js, i18n logic, nav toggle JS, a11y, QA |

## Phase 1: Foundation + Nav (Blocks 1-2)

- [ ] 1.1 Copy images from `C:\xampp\htdocs\portfolio\img\` to `portfolioPC/img/` (logo.jpg, verdures.webp, raymel.webp, comercialros.webp, aurex.webp, 7vision.webp, chrome.webp, spica.webp, yo.webp)
- [ ] 1.2 Create `css/tokens.css` — `@layer tokens`, `:root` with colors (`#000000` bg, `#38bdf8` accent, surface tiers), fluid spacing, typography (Outfit + JetBrains Mono), shapes, transitions
- [ ] 1.3 Create `css/base.css` — `@layer base`, CSS reset, html/body defaults, `.container`, `.text-mono`, `.text-gradient`, `.signal-dot`
- [ ] 1.4 Create `index.html` skeleton — `<head>` with meta tags, font preconnect, layer CSS links, `<body>` with semantic landmarks and curtain overlay panels
- [ ] 1.5 Build nav HTML — logo (`img/logo.jpg`), hamburger button with `aria-label`, desktop links (Projects, Stack, About), lang switcher (ca/es/en)
- [ ] 1.6 Add nav + header styles to `components.css` — `@layer components`, `.nav` BEM, hamburger animation, mobile menu overlay, desktop breakpoint (768px)
- [ ] 1.7 Add card system to `components.css` — `.card`, `.card__header`, `.card__body`, `.card__footer` with `.card__label`, `.card__meta`
- [ ] 1.8 Create `css/utilities.css` — `@layer utilities`, `.highlight`, `.sr-only`, `.stack-*` layout helpers
- [ ] 1.9 Create `css/animations.css` — `@layer animations`, `@keyframes` (border-beam, blink, signal-pulse), `prefers-reduced-motion` CSS override
- [ ] 1.10 Add nav toggle logic in `main.js` — hamburger click toggles `nav--open`, manages `aria-expanded`

## Phase 2: Content Sections (Blocks 3-7)

- [ ] 2.1 Build hero card HTML — display name, tagline, status dot, two CTA buttons, within `.card` wrapper
- [ ] 2.2 Style hero card in `components.css` — hero layout, responsive typography, `.btn` primary/ghost variants, status indicator
- [ ] 2.3 Build terminal card HTML — `.card__header` with 3 macOS dots (`#ff5f57`/`#febc2e`/`#28c840`), `.card__body` with typewriter container
- [ ] 2.4 Style terminal card in `components.css` — dot chrome, terminal window chrome, monospace typewriter area
- [ ] 2.5 Build projects section HTML — grid of 8 project cards with image, category, title, description, tags, and external link
- [ ] 2.6 Style projects grid in `components.css` — responsive grid (1/2/3/4 cols at breakpoints), beam hover effect via `::before` conic-gradient + `::after` mask
- [ ] 2.7 Build stack section HTML — 16 technology items with FontAwesome icon, skill name, progress bar (`data-percent`)
- [ ] 2.8 Style stack items in `components.css` — grid layout, progress bar fill from `data-width`, icon sizing, responsive columns
- [ ] 2.9 Build about card HTML — 2-column grid, avatar flip (front = photo, back = bio text), bio column with portfolio links
- [ ] 2.10 Style about card in `components.css` — 3D flip (`perspective`, `rotateY`), grid collapse on mobile, `prefers-reduced-motion` override
- [ ] 2.11 Build footer card HTML — copyright with `data-i18n`, centered content
- [ ] 2.12 Style footer card in `components.css` — centered layout, muted text, spacing

## Phase 3: Interactivity + Polish (Blocks 8-10)

- [ ] 3.1 Create `js/translations.js` — `window.i18nData` with ca/es/en dictionaries for all `data-i18n` keys across all sections
- [ ] 3.2 Add GSAP CDN in `index.html` — gsap 3.15, ScrollTrigger, TextPlugin from jsdelivr, loaded before `main.js`
- [ ] 3.3 Program curtain reveal timeline in `main.js` — two overlay panels slide apart on DOMContentLoaded
- [ ] 3.4 Program ScrollTrigger batch for section cards — fade-up + stagger (once: true) for projects, stack, about
- [ ] 3.5 Program cascade titles — split `.txt-cascade` text into words with staggered entrance
- [ ] 3.6 Program typewriter — ScrollTrigger on terminal section using GSAP TextPlugin
- [ ] 3.7 Program stack bar animation — ScrollTrigger reads `data-width`, animates fill from 0 to target
- [ ] 3.8 Add i18n `updateContent(lang)` in `main.js` — queries `[data-i18n]`, sets innerHTML, persists to `localStorage`
- [ ] 3.9 Wire language switcher — lang buttons call `updateContent()`, toggle `.lang-btn.active` class
- [ ] 3.10 Add `prefers-reduced-motion` JS guard — skip GSAP timelines if `matchMedia('(prefers-reduced-motion: reduce)').matches`
- [ ] 3.11 QA pass — test all 4 viewports (320/768/1024/1440px), verify beam hover, avatar flip, typewriter, i18n switch, nav toggle, no console errors
- [ ] 3.12 Final a11y check — all images have `alt`, hamburger has `aria-label`, lang buttons have `aria-label`, curtain overlay removed after animation
