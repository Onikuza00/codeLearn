# Hero Specification

## Purpose

Defines the hero card: display name, tagline, online status, CTA actions, and curtain reveal overlay.

## Requirements

### Requirement: Hero Card Structure

The system MUST display a hero card with a display name, tagline, status indicator, and action buttons.

#### Scenario: Hero renders with all elements

- GIVEN the page loads
- WHEN the hero section is visible
- THEN the display name, tagline, status badge, and action buttons are rendered inside a `.card` component

### Requirement: Status Indicator

The system SHALL display an online/available status indicator next to or near the display name.

#### Scenario: Status shows as available

- GIVEN the portfolio is active
- WHEN the hero renders
- THEN a green status dot or equivalent indicator is visible

### Requirement: Action Buttons

The system MUST provide at least two CTA buttons (e.g., "View Projects", "Contact") that navigate to their respective sections.

#### Scenario: CTA buttons scroll to sections

- GIVEN the hero card is visible
- WHEN the user clicks a CTA button
- THEN the page smooth-scrolls to the target section

### Requirement: Curtain Reveal Overlay

The system MUST display a full-screen curtain overlay on page load that reveals the hero content via GSAP animation.

#### Scenario: Curtain plays on load

- GIVEN the page finishes loading
- WHEN the GSAP curtain timeline executes
- THEN the overlay slides away to reveal the hero content beneath

#### Scenario: Curtain respects reduced motion

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the page loads
- THEN the curtain is either absent or reveals instantly without animation
