# Proposal: Portfolio Polish

## Intent

The portfolio site has accumulated bugs (broken markup, unresolved CSS variables, duplicate rules), lacks basic performance and SEO hygiene, and needs two new project cards (raymel.cat, comercialros.cat) to reflect current work. This change fixes correctness first, then applies a light visual refresh — not a redesign.

## Scope

### In Scope
- Fix 4 bugs: extra `</div>`, stray `</span>`, missing `var()` in CSS, duplicate `.btn-secondary:hover`
- Refactor duplicated word-splitting logic into shared helper
- Replace `clearProps: "all"` with targeted GSAP prop clearing
- Move inline styles from `.mobile-nav-toggle` to CSS
- Rename `.personalizado` to English semantic class
- Remove `!important` from `.section-desc` font-size
- Add `loading="lazy"` to project/avatar/about images; `fetchpriority="high"` to intro overlay images
- Add meta description, OG tags, and favicon
- Add touch support for stack interactions
- Add scroll indicator to hero section
- Add active nav section highlight on scroll
- Add raymel.cat and comercialros.cat project cards (adjust grid to 4-column)

### Out of Scope
- Redesign layout, color system, or typography scale
- Migrate to a build tool or framework
- Rewrite GSAP animation architecture
- New pages or sections beyond project cards

## Capabilities

### New Capabilities
- `project-cards`: New project entries (raymel.cat, comercialros.cat) with grid layout support for 4-column display
- `seo-meta`: Meta description, OG tags, and favicon for social sharing
- `scroll-nav-indicator`: Active section highlight in navigation during scroll
- `touch-stack-interactions`: Touch event support for stack hover interactions on mobile
- `hero-scroll-indicator`: Visual scroll prompt in hero section

### Modified Capabilities
- None — existing capabilities (i18n, GSAP animations, responsive layout) remain unchanged at the spec level

## Approach

Phase 1: Bug fixes (HTML structure, CSS variable resolution, duplicate rules, i18n string sync). Phase 2: Refactor (shared word-splitting helper, targeted GSAP clearProps, inline styles → CSS, class rename, `!important` removal). Phase 3: Enhancements (lazy loading, meta/OG tags, favicon, touch support, scroll indicator, nav highlight). Phase 4: Content (two new project cards, grid reflow to 4-column).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `index.html` | Modified | Fix markup bugs, add lazy/fetchpriority, new project cards, scroll indicator, meta tags |
| `css/main.css` | Modified | Fix `var()`, remove duplicate rule, move inline styles, rename class, remove `!important`, grid updates |
| `js/main.js` | Modified | Extract shared word-splitting helper, fix `clearProps`, add touch events, nav scroll highlight |
| `js/translations.js` | Modified | Sync stray `</span>` fix across ca/es/en translation strings |
| `img/` | New | Favicon files, raymel.cat and comercialros.cat project images |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Grid reflow to 4-column breaks existing cards at breakpoints | Medium | Test at 768px, 900px, 991px; use CSS Grid `auto-fill` with `minmax` |
| `clearProps` change breaks existing animation sequences | Low | Audit all timelines that follow stack reveal; test each animation |
| New project images increase page weight | Low | Use webp format + `loading="lazy"` |
| i18n translation strings desync after `</span>` fix | Low | Verify all 3 languages render identically |

## Rollback Plan

1. Revert the git branch to pre-change commit — all changes are in tracked files (HTML, CSS, JS, images)
2. If intro overlay or GSAP animations break after `clearProps` change, restore original `clearProps: "all"` line as immediate hotfix
3. If grid reflow causes layout issues, revert grid CSS to previous 2-column state while keeping new cards stacked

## Dependencies

- None — zero external dependencies. All assets (images) provided by project owner.

## Success Criteria

- [ ] Zero HTML validation errors (no mismatched tags, no stray closures)
- [ ] All CSS custom properties resolve correctly (no `font-size: --fs-small` in computed styles)
- [ ] All project images have `loading="lazy"`; intro overlay images have `fetchpriority="high"`
- [ ] Meta description and OG tags present in `<head>`; favicon loads in browser tab
- [ ] Stack interactions respond to touch on mobile devices
- [ ] Nav highlights active section during scroll
- [ ] raymel.cat and comercialros.cat cards visible and clickable in project grid
- [ ] Grid displays correctly at 768px, 900px, 991px breakpoints
- [ ] All 3 languages (ca/es/en) render without stray markup
- [ ] No duplicate CSS rules in `css/main.css`
