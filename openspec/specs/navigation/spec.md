# Navigation Specification

## Purpose

Defines the navigation/header bar: logo, mobile hamburger toggle, desktop links, and language selector.

## Requirements

### Requirement: Logo Display

The system MUST display the site logo in the navigation bar, linked to the top of the page.

#### Scenario: Logo renders on all viewports

- GIVEN the page is loaded at any viewport width
- WHEN the navigation renders
- THEN the logo image (`img/logo.jpg`) is visible in the nav's left side
- AND clicking the logo scrolls to the top of the page

#### Scenario: Logo missing image

- GIVEN the logo image file does not exist or fails to load
- WHEN the navigation renders
- THEN an `alt` text is displayed as fallback

### Requirement: Mobile Hamburger Toggle

The system MUST display a hamburger button on viewports below 768px that toggles the mobile navigation menu.

#### Scenario: Hamburger toggles menu open/close

- GIVEN the viewport width is below 768px
- WHEN the user taps the hamburger button
- THEN the mobile navigation menu becomes visible
- AND tapping again hides the menu

#### Scenario: Desktop hides hamburger

- GIVEN the viewport width is 768px or above
- WHEN the navigation renders
- THEN the hamburger button is not visible

### Requirement: Desktop Navigation Links

The system SHALL display all section links (Projects, Stack, About) horizontally on viewports 768px and above.

#### Scenario: Desktop shows full nav links

- GIVEN the viewport width is 768px or above
- WHEN the navigation renders
- THEN all section links are displayed horizontally in the nav bar
- AND clicking a link smooth-scrolls to the corresponding section

### Requirement: Language Selector

The system MUST display a language switcher allowing the user to toggle between Catalan (ca), Spanish (es), and English (en).

#### Scenario: Selector shows current language

- GIVEN the page loads with a default language
- WHEN the language selector renders
- THEN the current language is indicated as active

#### Scenario: Switching language

- GIVEN the user selects a different language from the selector
- WHEN the selection changes
- THEN all `data-i18n` elements update to the selected language
- AND the selector reflects the new active language
