# Proposal: portfolioPC-build

## Intent

Build a new personal portfolio (`codeLearn/portfolioPC/`) from scratch — mobile-first, dark-themed, with GSAP animations and i18n — to present at a meeting with Esolvo on Monday 29/06. The portfolio showcases 8 client projects and demonstrates modern CSS practices (`@layer`, `:has()`, container queries, mobile-first breakpoints).

## Scope

### In Scope
- Full HTML structure with semantic landmarks and `data-i18n` attributes
- CSS from scratch with `@layer` (tokens, base, components, utilities, animations) and mobile-first `min-width` breakpoints
- Design tokens (`:root`) with confirmed palette: `#000000` bg, `#08080c`/`#0e0e14`/`16161e` surfaces, `#38bdf8` accent, `#ffffff` text, `#a3a3a3` muted
- 8 project cards with beam hover effect (rotating light border)
- Terminal card with typewriter effect
- Hero card with curtain reveal overlay
- Stack section with progress bars (`data-percent`) + FontAwesome icons
- About card with 2-column grid, 3D avatar flip, bio + links from original portfolio
- Nav header with logo (`img/logo.jpg`) + hamburger mobile toggle
- Footer card
- GSAP 3.15 animations (curtain, scroll reveals, cascade titles, typewriter) via jsdelivr
- i18n system (`translations.js`) with 3 languages: Catalan, Spanish, English
- `prefers-reduced-motion` support
- Image assets copied from `portfolio/img/`

### Out of Scope
- Online deployment (local only for now)
- AI avatar section (scope creep from redesign)
- Backend or CMS integration
- Form submissions or contact functionality
- Performance optimization beyond reasonable defaults

## Capabilities

### New Capabilities
- `portfolio-pc`: Complete portfolio site — HTML structure, CSS tokens + styles, JS animations + i18n, all sections (nav, hero, terminal, projects, stack, about, footer)

### Modified Capabilities
- None

## Approach

**Approach 2 from exploration**: Rebuild from scratch with mobile-first CSS. Pau writes every line; the agent guides.

1. **Setup**: Create `portfolioPC/` structure, copy image assets from `portfolio/img/`, reference logo from `portfolio/img/logo.jpg`
2. **CSS layers**: `@layer tokens, base, components, utilities, animations;` — tokens define all custom properties, base sets reset/typography, components style each card/section, utilities provide helper classes, animations hold keyframes
3. **Mobile-first breakpoints**: Base styles = mobile (320px+), `min-width: 768px` for tablet, `min-width: 1024px` for desktop, `min-width: 1440px` for large screens
4. **Card system**: BEM-ish naming (`.card`, `.card__header`, `.card__body`, `.card__footer`) reused across all sections
5. **Beam effect**: `::before`/`::after` pseudo-elements with conic gradient + rotation on hover (from `portfolio/redesign/css/style.css` lines 174-224)
6. **GSAP**: Load 3.15 + ScrollTrigger + TextPlugin from jsdelivr. Timelines: curtain on load, scroll-triggered reveals for projects/stack, cascade titles, typewriter in terminal
7. **i18n**: `translations.js` object with `ca`, `es`, `en` keys, `data-i18n` attributes on elements, language switcher in nav
8. **Avatar flip**: CSS 3D transform on hover (front = photo placeholder, back = bio text)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `portfolioPC/index.html` | New | Main HTML with all sections, semantic landmarks, `data-i18n` attributes |
| `portfolioPC/css/tokens.css` | New | Design tokens: colors, spacing, typography, shapes, transitions |
| `portfolioPC/css/style.css` | New | All styles: reset, base, components, utilities, animations, responsive |
| `portfolioPC/js/main.js` | New | GSAP timelines, beam effect JS, i18n switcher, nav toggle |
| `portfolioPC/js/translations.js` | New | Translation dictionaries (ca/es/en) |
| `portfolioPC/img/` | New (copy) | Project images + logo copied from `portfolio/img/` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mobile-first media query mistakes (wrong breakpoint direction) | Medium | Agent reviews each breakpoint; Pau writes with `min-width` explicitly |
| GSAP TextPlugin CDN availability at 3.15 | Low | Verify CDN URL before use; fallback to manual typewriter if needed |
| Missing images in `portfolioPC/img/` | Medium | Copy all referenced images from `portfolio/img/` during setup block |
| Scope creep (adding unplanned sections) | Medium | Strict adherence to 8 sections defined in scope; defer extras to future changes |
| `prefers-reduced-motion` not implemented | Low | Include at CSS level (`@media (prefers-reduced-motion: reduce)`) and JS level (skip GSAP timelines) |
| i18n missing translations for new content | Low | Build translation keys alongside HTML; verify all `data-i18n` values exist in all 3 languages |

## Rollback Plan

Since this is a greenfield build in an isolated directory (`portfolioPC/`):
- **Full rollback**: Delete the `portfolioPC/` directory — zero impact on existing codebase
- **Partial rollback**: Revert to last committed state of `portfolioPC/` via git
- No migrations, no database changes, no shared state to clean up

## Dependencies

- GSAP 3.15 + ScrollTrigger + TextPlugin (jsdelivr CDN)
- FontAwesome icons (CDN) — for stack section
- Image assets from `portfolio/img/` (local copy)
- Logo from `portfolio/img/logo.jpg` (local copy)
- `portfolio/redesign/css/style.css` — beam effect reference (read-only)
- `codeLearn/Portfolio/css/tokens.css` — palette reference (read-only)

## Success Criteria

- [ ] All 8 sections render correctly on mobile (320px), tablet (768px), desktop (1024px), and large screens (1440px)
- [ ] CSS uses `@layer` with correct cascade order (tokens → base → components → utilities → animations)
- [ ] All media queries use `min-width` (mobile-first) — zero `max-width` breakpoints
- [ ] Beam hover effect works on project cards with rotating light border
- [ ] GSAP curtain reveal plays on page load
- [ ] Scroll-triggered animations fire correctly for projects and stack sections
- [ ] Typewriter effect displays text in terminal card
- [ ] Language switcher changes all `data-i18n` elements across ca/es/en
- [ ] `prefers-reduced-motion` disables GSAP animations and CSS transitions
- [ ] Nav hamburger toggle works on mobile, desktop nav shows full links
- [ ] About card avatar flip works on hover (3D CSS transform)
- [ ] Zero console errors on page load
- [ ] All images load without 404s
