# Terminal Specification

## Purpose

Defines the terminal card: macOS-style window chrome (red/yellow/green dots) and typewriter text effect.

## Requirements

### Requirement: Terminal Chrome

The system MUST render a terminal card with macOS-style window controls (three colored dots: red, yellow, green) in the header.

#### Scenario: Chrome dots render

- GIVEN the terminal card is visible
- WHEN the card renders
- THEN three circular dots (red `#ff5f57`, yellow `#febc2e`, green `#28c840`) appear in the `.card__header`

### Requirement: Typewriter Effect

The system MUST display text appearing character-by-character inside the terminal body, simulating a typewriter.

#### Scenario: Typewriter types text on load

- GIVEN the page loads and the terminal section is in view
- WHEN the GSAP typewriter timeline executes
- THEN text appears one character at a time inside the terminal body

#### Scenario: Typewriter completes full text

- GIVEN the typewriter animation starts
- WHEN the animation finishes
- THEN the full text string is visible in the terminal body

#### Scenario: Typewriter respects reduced motion

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the terminal section is in view
- THEN the full text is displayed immediately without character-by-character animation

### Requirement: Terminal Content

The system SHALL display a command-line-style message (e.g., a welcome message or portfolio intro) inside the terminal body.

#### Scenario: Content is translatable

- GIVEN the terminal text is displayed
- WHEN the user switches language
- THEN the terminal text updates to the translated version via `data-i18n`
