# About Specification

## Purpose

Defines the about card: 2-column grid layout, 3D avatar flip on hover, bio text, and portfolio links.

## Requirements

### Requirement: About Card Layout

The system MUST display the about section as a card with a 2-column grid layout on viewports 768px and above.

#### Scenario: Two-column layout on tablet+

- GIVEN the viewport width is 768px or above
- WHEN the about card renders
- THEN the avatar column and bio column display side by side

#### Scenario: Single column on mobile

- GIVEN the viewport width is below 768px
- WHEN the about card renders
- THEN the avatar stacks above the bio in a single column

### Requirement: Avatar 3D Flip

The system MUST implement a 3D CSS flip animation on the avatar element on hover.

#### Scenario: Avatar flips on hover

- GIVEN the avatar is visible on a pointer-capable device
- WHEN the user hovers over the avatar
- THEN the card rotates 180 degrees on the Y-axis revealing the back face

#### Scenario: Avatar front shows photo

- GIVEN the avatar is in its default state
- WHEN the about card renders
- THEN the front face displays a photo placeholder (`img/` asset)

#### Scenario: Avatar back shows bio

- GIVEN the avatar is flipped (hovered)
- WHEN the back face is visible
- THEN a short bio text or tagline is displayed

#### Scenario: Flip respects reduced motion

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the user hovers over the avatar
- THEN the flip animation is disabled or replaced with an instant swap

### Requirement: Bio Content

The system SHALL display biographical information sourced from the original portfolio.

#### Scenario: Bio text renders

- GIVEN the about card is visible
- WHEN the about section renders
- THEN the bio text is displayed in the bio column

#### Scenario: Bio is translatable

- GIVEN the bio text is displayed
- WHEN the user switches language
- THEN the bio text updates via `data-i18n`

### Requirement: Portfolio Links

The system MUST display links to the user's external portfolios and profiles.

#### Scenario: Links render and are clickable

- GIVEN the about card is visible
- WHEN the links section renders
- THEN each link (e.g., vorastudio.cat, raymel.cat, GitHub) is displayed as a clickable anchor element
