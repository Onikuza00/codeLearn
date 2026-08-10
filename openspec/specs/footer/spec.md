# Footer Specification

## Purpose

Defines the footer card: copyright, credits, and closing information at the bottom of the page.

## Requirements

### Requirement: Footer Structure

The system MUST display a footer card at the bottom of the page with copyright information.

#### Scenario: Footer renders at page bottom

- GIVEN the page is fully scrolled to the bottom
- WHEN the footer section is visible
- THEN a `.card` component displays with copyright text

### Requirement: Copyright Text

The system SHALL display the current year and the author's name in the copyright notice.

#### Scenario: Copyright shows current year

- GIVEN the page renders
- WHEN the footer is visible
- THEN the copyright text includes the current year (e.g., "© 2026 Pau Crosas Batista")

#### Scenario: Copyright is translatable

- GIVEN the footer copyright is displayed
- WHEN the user switches language
- THEN any translatable portion of the footer updates via `data-i18n`

### Requirement: Footer Layout

The system SHOULD center-align footer content on all viewports.

#### Scenario: Content is centered

- GIVEN the footer renders at any viewport width
- WHEN the footer is visible
- THEN all content is horizontally centered within the card
