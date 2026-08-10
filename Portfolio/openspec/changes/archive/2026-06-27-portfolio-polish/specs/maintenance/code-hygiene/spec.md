# Spec: Code Hygiene

## Purpose

Fix HTML/CSS bugs, refactor duplicated logic, improve performance with lazy loading, and enforce consistent code conventions across the portfolio codebase.

## Requirements

### HYG-1: HTML Structure Fixes
The system SHALL remove the extra `</div>` closing tag and the stray `</span>` in translation strings. All HTML MUST validate with zero mismatched or orphan tags.

### HYG-2: CSS Variable Resolution
All CSS custom property references MUST use the `var()` function. No raw variable names (e.g., `--fs-small`) SHALL appear as property values.

### HYG-3: Duplicate CSS Rules
The duplicate `.btn-secondary:hover` rule MUST be consolidated into a single rule with all hover styles combined.

### HYG-4: Shared Word-Splitting Helper
Duplicated word-splitting logic across JS files MUST be extracted into a single shared helper function. All callers SHALL use this helper.

### HYG-5: Targeted GSAP clearProps
`clearProps: "all"` MUST be replaced with targeted property clearing (only the specific properties that need resetting). No other animation sequences SHALL break.

### HYG-6: Inline Styles to CSS
All inline styles on `.mobile-nav-toggle` MUST be moved to `css/main.css`. The element SHALL have no `style=""` attribute.

### HYG-7: Semantic Class Rename
The `.personalizado` class MUST be renamed to an English semantic equivalent (e.g., `.custom-highlight` or `.featured`).

### HYG-8: Remove !important
The `!important` flag on `.section-desc` font-size MUST be removed. Specificity SHALL be resolved through proper cascade ordering.

### HYG-9: Image Loading Optimization
All project, avatar, and about images MUST have `loading="lazy"`. Intro overlay images MUST have `fetchpriority="high"`.

## Scenarios

### Scenario: HTML validates without errors
**Given** the page HTML is run through a validator
**When** checking for structural errors
**Then** zero mismatched tags, orphan closures, or stray elements are found

### Scenario: CSS variables resolve in computed styles
**Given** the page is inspected in browser dev tools
**When** viewing computed styles for elements using custom properties
**Then** all values resolve to actual CSS values (no `--variable-name` literals)

### Scenario: Word-splitting uses shared helper
**Given** any JS file that performs word splitting
**When** reviewing the source code
**Then** it calls the shared helper function instead of duplicating logic

### Scenario: Images have correct loading attributes
**Given** the page source is inspected
**When** checking `<img>` tags
**Then** project/avatar/about images have `loading="lazy"`
**And** intro overlay images have `fetchpriority="high"`
