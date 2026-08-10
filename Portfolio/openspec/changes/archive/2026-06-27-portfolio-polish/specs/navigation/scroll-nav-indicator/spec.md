# Spec: Scroll Nav Indicator

## Purpose

Highlight the active navigation link based on the user's scroll position, providing visual feedback about which section is currently in view.

## Requirements

### NAV-1: Active Section Detection
The system SHALL detect which section is currently most visible in the viewport using IntersectionObserver or scroll position calculations.

### NAV-2: Visual Highlight
The navigation link corresponding to the active section MUST receive a distinct visual style (e.g., color change, underline, or background highlight).

### NAV-3: Smooth Transition
The active state transition between nav links MUST be smooth and not cause layout shifts.

## Scenarios

### Scenario: Nav highlights hero section on page load
**Given** the user loads the portfolio page
**When** the hero section is fully visible
**Then** the "Home" or hero nav link is visually highlighted
**And** no other nav links are highlighted

### Scenario: Nav updates when scrolling to a new section
**Given** the user scrolls down past the hero section
**When** the next section (e.g., projects) becomes the most visible
**Then** the corresponding nav link becomes highlighted
**And** the previous nav link highlight is removed

### Scenario: Nav updates when scrolling back up
**Given** the user is viewing a lower section
**When** the user scrolls back up to a previous section
**Then** the nav highlight moves back to the previous section's link

### Scenario: No flickering during rapid scroll
**Given** the user scrolls rapidly through multiple sections
**When** the scroll animation is in progress
**Then** the nav highlight updates smoothly without flickering or rapid toggling
