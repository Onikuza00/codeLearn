# Stack Specification

## Purpose

Defines the stack/skills section: technology icons with FontAwesome and animated progress bars showing proficiency levels.

## Requirements

### Requirement: Stack Items Display

The system MUST display a list of technologies with their associated icons and proficiency percentages.

#### Scenario: Stack items render

- GIVEN the stack section is visible
- WHEN the section renders
- THEN each technology displays a FontAwesome icon, name, and progress bar

### Requirement: Progress Bars

The system MUST render progress bars that visually represent proficiency levels using `data-percent` attributes.

#### Scenario: Progress bar fills to correct percentage

- GIVEN a stack item has `data-percent="85"`
- WHEN the progress bar renders
- THEN the filled portion represents 85% of the bar's total width

#### Scenario: Progress bar animates on scroll

- GIVEN the stack section enters the viewport
- WHEN the scroll-triggered animation fires
- THEN the progress bar animates from 0% to its `data-percent` value

#### Scenario: Progress bar respects reduced motion

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the stack section enters the viewport
- THEN the progress bar displays at its full `data-percent` width immediately without animation

### Requirement: FontAwesome Icons

The system SHALL use FontAwesome CDN icons to represent each technology in the stack.

#### Scenario: Icons load from CDN

- GIVEN the page loads with FontAwesome CDN reference
- WHEN the stack section renders
- THEN each technology's corresponding FontAwesome icon is displayed

#### Scenario: Icon fails to load

- GIVEN the FontAwesome CDN is unavailable
- WHEN the stack section renders
- THEN a text fallback or empty space is shown without breaking the layout

### Requirement: Stack Grid Layout

The system SHALL arrange stack items in a responsive layout that adapts to viewport width.

#### Scenario: Mobile single column

- GIVEN the viewport width is below 768px
- WHEN the stack section renders
- THEN items stack vertically in a single column

#### Scenario: Tablet and desktop multi-column

- GIVEN the viewport width is 768px or above
- WHEN the stack section renders
- THEN items display in a 2 or 3-column grid
