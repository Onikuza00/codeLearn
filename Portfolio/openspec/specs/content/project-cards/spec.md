# Spec: Project Cards

## Purpose

Add raymel.cat and comercialros.cat project entries to the portfolio grid, adjusting the grid layout to support 4-column display without breaking existing cards at any breakpoint.

## Requirements

### PROJ-1: New Project Entries
The system SHALL display two new project cards: raymel.cat and comercialros.cat. Each card MUST include a project image, title, description, and clickable link.

### PROJ-2: Grid Layout
The project grid MUST support 4 columns on large viewports. The grid SHALL use CSS Grid with `auto-fill` and `minmax()` for responsive reflow.

### PROJ-3: Breakpoint Integrity
The grid MUST display correctly at 768px, 900px, and 991px breakpoints without layout shifts or overlapping content.

## Scenarios

### Scenario: New cards render in the grid
**Given** the user loads the portfolio page
**When** the project section is visible
**Then** raymel.cat and comercialros.cat cards appear alongside existing project cards
**And** each card is clickable and links to the correct external URL

### Scenario: Grid reflows to 4 columns on large screens
**Given** the viewport width is >= 1200px
**When** the project section renders
**Then** the grid displays 4 cards per row
**And** all cards have equal height and consistent spacing

### Scenario: Grid reflows gracefully at medium breakpoints
**Given** the viewport width is between 768px and 1199px
**When** the project section renders
**Then** the grid displays 2-3 cards per row depending on the exact breakpoint
**And** no content overflows or overlaps

### Scenario: Grid stacks on mobile
**Given** the viewport width is < 768px
**When** the project section renders
**Then** the grid displays 1 card per row (stacked vertically)
**And** each card maintains full width with proper padding
