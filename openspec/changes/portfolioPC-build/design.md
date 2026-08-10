# Design: portfolioPC-build

## Technical Approach

Greenfield build of `codeLearn/portfolioPC/` — an isolated directory with zero coupling to existing code. Pau writes every line; the agent guides step-by-step through 10 sequential blocks. The architecture follows the Factory.ai-inspired card system already prototyped in `portfolio/redesign/`, adapted to `#38bdf8` accent palette and mobile-first `@layer` CSS.

All 10 spec domains (navigation, hero, terminal, projects, stack, about, footer, animations, i18n, seo-accessibility) map directly to implementation blocks.

## Architecture Decisions

| # | Decision | Choice | Alternatives | Rationale |
|---|----------|--------|-------------|-----------|
| 1 | Card system | BEM: `.card`, `.card__header`, `.card__body`, `.card__footer` | Atomic CSS, utility-first | Matches `redesign/` pattern exactly. Pau already knows BEM from DAW. Single `.card` class reused across all 7 sections. |
| 2 | CSS architecture | `@layer tokens, base, components, utilities, animations` | Single file, ITCSS | Config rule: separation of concerns. Layers give explicit cascade control. Each layer = one CSS file loaded via `<link>`. |
| 3 | i18n approach | `translations.js` → `window.i18nData` + `data-i18n` attributes + `updateContent()` | JSON fetch, i18next library | Vanilla, no deps. Proven pattern in `portfolio/js/translations.js`. `localStorage` persists language choice. |
| 4 | Beam hover effect | `::before` conic-gradient (inset -300%) + `::after` surface mask (inset 2px) | box-shadow animation, JS border | Exact technique from `redesign/style.css:174-224`. Pure CSS, GPU-accelerated via `transform: rotate()`. Hover accelerates `animation-duration` from 7s → 2.5s. |
| 5 | GSAP loading | jsdelivr CDN `<script>` tags (gsap 3.15 + ScrollTrigger + TextPlugin) | npm/bundler, cdnjs | Spec mandates jsdelivr. No build tools. `<script>` before `main.js` in `<body>` end. Graceful degradation if CDN fails. |
| 6 | Font loading | `<link rel="preconnect">` + `<link>` stylesheet in `<head>` | `@import` in CSS, self-hosted | Preconnect avoids render-blocking. Outfit + JetBrains Mono from Google Fonts, matching `redesign/` pattern. |
| 7 | Breakpoints | Mobile-first: base = 320px+, `min-width: 768px`, `1024px`, `1440px` | max-width, mixed | Global best practice rule. Zero `max-width` queries. Base styles ARE mobile styles. |
| 8 | Accent palette | `#38bdf8` (sky-400 celeste neón) | `#2de2ff` (redesign cyan), purple | Confirmed during exploration. Surfaces tinted blue: `#08080c`, `#0e0e14`, `#16161e`. |

## Data Flow

### i18n Pipeline

```
translations.js (loaded in <head>)
    │
    ▼
window.i18nData = { ca: {...}, es: {...}, en: {...} }
    │
    ▼
main.js → updateContent(lang)
    │
    ├── querySelectorAll('[data-i18n]')
    │       └── el.innerHTML = i18nData[lang][key]
    │
    ├── localStorage.setItem('lang', lang)
    │
    └── Update .lang-btn.active class
```

### GSAP Animation Orchestration

```
DOMContentLoaded
    │
    ├── 1. Curtain Timeline (intro-overlay panels slide apart → display:none)
    │
    ├── 2. ScrollTrigger.batch('.card-section')
    │       └── fade-up + opacity (once: true, stagger: 0.15)
    │
    ├── 3. Cascade titles ('.txt-cascade' → split words → stagger in)
    │
    ├── 4. Typewriter (ScrollTrigger on #terminal-section)
    │       └── TextPlugin types i18nData[lang]['terminal-messages']
    │
    └── 5. Stack bars (ScrollTrigger → width from data-width attr)
```

### Beam Effect (CSS-only, no JS)

```
.card (position: relative, overflow: hidden)
    ├── ::before (inset: -300%, conic-gradient, @keyframes rotate 7s)
    │       └── :hover → animation-duration: 2.5s, brighter gradient
    └── ::after  (inset: 2px, surface bg → masks beam to 2px border)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `portfolioPC/index.html` | Create | Semantic HTML5: `<header>`, `<main>`, 7 `<section>` cards, `<footer>`. All text nodes have `data-i18n`. |
| `portfolioPC/css/tokens.css` | Create | `@layer tokens` — `:root` custom properties: colors, spacing (8px base), typography (fluid clamp), shape, transitions. |
| `portfolioPC/css/base.css` | Create | `@layer base` — Reset, html/body defaults, img/a resets, `::selection`, `.container`, `.text-mono`, `.text-gradient`, `.signal-dot`. |
| `portfolioPC/css/components.css` | Create | `@layer components` — Nav, card system, hero, terminal, project-grid, project-card, stack-grid, stack-item, about-grid, avatar-flip, footer, buttons. |
| `portfolioPC/css/utilities.css` | Create | `@layer utilities` — `.highlight`, `.sr-only`, layout helpers. |
| `portfolioPC/css/animations.css` | Create | `@layer animations` — `@keyframes` (border-beam, blink, signal-pulse), `.reveal-word`, `.char`, GSAP support classes, `prefers-reduced-motion` override. |
| `portfolioPC/js/translations.js` | Create | `window.i18nData` with ca/es/en dictionaries. Includes `terminal-messages` array per language. |
| `portfolioPC/js/main.js` | Create | GSAP registration, curtain timeline, ScrollTrigger batch, cascade split, typewriter, i18n `updateContent()`, nav toggle, lang switcher, stack bar animation. |
| `portfolioPC/img/` | Create (copy) | All project images + logo from `portfolio/img/`. |

## Interfaces / Contracts

### i18n Translation Key Contract

Every `data-i18n` value in HTML MUST have a matching key in ALL three language objects. Keys use kebab-case: `section-element-property` (e.g., `hero-title`, `project1-desc`, `nav-home`).

### Card HTML Contract

```html
<div class="card [card-variant]">
  <div class="card__header">
    <span class="card__label"><span class="signal-dot"></span><span class="text-mono">LABEL</span></span>
    <span class="card__meta text-mono">meta/path</span>
  </div>
  <div class="card__body">...</div>
  <div class="card__footer">...</div>  <!-- optional -->
</div>
```

### Stack Bar Data Contract

```html
<span class="stack-bar-fill" data-width="70"></span>
```

JS reads `data-width` and animates `width` to that percentage via ScrollTrigger.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | All sections at 320/768/1024/1440px | Manual browser DevTools responsive mode |
| Functional | i18n switcher, nav toggle, beam hover, avatar flip | Manual interaction testing |
| Animation | Curtain, scroll reveals, typewriter, cascade | Manual scroll + page load |
| Accessibility | `prefers-reduced-motion`, alt texts, ARIA labels | DevTools + OS accessibility settings |
| Console | Zero errors on load | Browser DevTools console |

No automated tests — static site, no test infrastructure. Manual checklist from proposal success criteria.

## Implementation Order

| Block | Name | Files | Dependencies |
|-------|------|-------|-------------|
| 1 | Setup + Tokens + Base | `tokens.css`, `base.css`, `index.html` skeleton, `img/` copy | None |
| 2 | Nav + Card System | `components.css` (nav + card), `index.html` header | Block 1 |
| 3 | Hero Card | `components.css` (hero), `index.html` hero section | Block 2 |
| 4 | Terminal Card | `components.css` (terminal), `index.html` terminal section | Block 2 |
| 5 | Projects Section | `components.css` (project-grid/card), beam CSS, `index.html` projects | Block 2 |
| 6 | Stack Section | `components.css` (stack), `index.html` stack section | Block 2 |
| 7 | About + Footer | `components.css` (about/footer), `index.html` about + footer | Block 2 |
| 8 | GSAP Animations | `main.js`, `animations.css`, `translations.js` | Blocks 3-7 |
| 9 | i18n + Polish | `translations.js` finalize, `main.js` i18n logic, `utilities.css` | Block 8 |
| 10 | Preview + Ajustes | Cross-browser/responsive testing, `prefers-reduced-motion` | All |

## Migration / Rollout

No migration required. Greenfield build in isolated `portfolioPC/` directory. Full rollback = delete directory.

## Open Questions

None — all decisions confirmed during exploration phase.
