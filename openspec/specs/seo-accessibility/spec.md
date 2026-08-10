# SEO & Accessibility Specification

## Purpose

Defines accessibility and SEO requirements: semantic HTML, `prefers-reduced-motion` support, alt texts, ARIA labels, and meta tags.

## Requirements

### Requirement: Semantic HTML Structure

The system MUST use semantic HTML5 landmarks for all major page sections.

#### Scenario: Page uses semantic landmarks

- GIVEN the page renders
- WHEN inspecting the DOM
- THEN `<header>`, `<main>`, `<section>`, `<article>`, and `<footer>` elements are used appropriately

### Requirement: prefers-reduced-motion

The system MUST respect the `prefers-reduced-motion: reduce` media query at both CSS and JS levels.

#### Scenario: CSS disables animations

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the page renders
- THEN CSS transitions and keyframe animations are disabled via `@media (prefers-reduced-motion: reduce)`

#### Scenario: JS skips GSAP timelines

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the page loads
- THEN GSAP animation timelines (curtain, scroll reveals, typewriter, cascade) are skipped

### Requirement: Alt Texts on Images

The system MUST provide descriptive `alt` attributes on all `<img>` elements.

#### Scenario: All images have alt text

- GIVEN the page renders with images
- WHEN inspecting each `<img>` element
- THEN a non-empty, descriptive `alt` attribute is present

#### Scenario: Decorative images have empty alt

- GIVEN an image is purely decorative (e.g., beam effect, background)
- WHEN the image renders
- THEN `alt=""` is set to indicate it is decorative

### Requirement: ARIA Labels

The system MUST provide `aria-label` attributes on interactive elements that lack visible text labels.

#### Scenario: Hamburger button has aria-label

- GIVEN the hamburger toggle button renders on mobile
- WHEN inspecting the button
- THEN an `aria-label` describing its function (e.g., "Toggle navigation") is present

#### Scenario: Language selector has aria-label

- GIVEN the language switcher renders
- WHEN inspecting the select or button element
- THEN an `aria-label` describing its function is present

### Requirement: Form Label Association

The system MUST associate `<label>` elements with their corresponding form controls via `for`/`id` or nesting.

#### Scenario: Labels are properly associated

- GIVEN any form control exists in the page
- WHEN inspecting the form control
- THEN a visible `<label>` is correctly associated with it

### Requirement: Meta Tags for SEO

The system SHALL include essential meta tags for search engine optimization.

#### Scenario: Page has SEO meta tags

- GIVEN the page `<head>` renders
- WHEN inspecting meta tags
- THEN `<title>`, `<meta name="description">`, and `<meta name="viewport">` are present
