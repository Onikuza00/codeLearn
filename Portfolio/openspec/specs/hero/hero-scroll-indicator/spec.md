# Spec: Hero Scroll Indicator

## Purpose

Add a visual scroll prompt in the hero section to signal to users that there is more content below and encourage scrolling.

## Requirements

### HERO-1: Visual Indicator Element
The hero section SHALL include a scroll indicator element (e.g., animated arrow, chevron, or "scroll down" text) positioned at the bottom of the hero viewport.

### HERO-2: Subtle Animation
The indicator MUST have a subtle, non-distracting animation (e.g., bounce, pulse, or fade) to draw attention without causing motion discomfort.

### HERO-3: Hide on Scroll
The indicator SHALL fade out or disappear once the user begins scrolling past the hero section.

## Scenarios

### Scenario: Scroll indicator visible on page load
**Given** the user loads the portfolio page
**When** the hero section is in view
**Then** a scroll indicator is visible at the bottom of the hero
**And** the indicator has a subtle repeating animation

### Scenario: Indicator hides on scroll
**Given** the user starts scrolling down from the hero
**When** the hero section is no longer fully visible
**Then** the scroll indicator fades out or disappears
**And** it does not reappear when scrolling back up past the hero

### Scenario: Indicator respects reduced motion
**Given** the user has `prefers-reduced-motion` enabled
**When** the hero section loads
**Then** the scroll indicator is visible but does NOT animate
**And** the indicator still conveys the scroll affordance statically
