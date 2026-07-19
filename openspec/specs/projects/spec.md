# Projects Specification

## Purpose

Defines the projects section: a responsive grid of 8 project cards with beam hover effect.

## Requirements

### Requirement: Project Cards Grid

The system MUST display 8 project cards in a responsive grid layout.

#### Scenario: Grid renders all projects

- GIVEN the projects section is visible
- WHEN the section renders
- THEN 8 cards are displayed: Vorastudio, Raymel, VictoriaTaylor, PalmitoHouse, ComercialRos, Guardavan, AurexInmobles, AulaGastronomica

#### Scenario: Mobile single column

- GIVEN the viewport width is below 768px
- WHEN the grid renders
- THEN cards stack in a single column

#### Scenario: Tablet two columns

- GIVEN the viewport width is 768px or above but below 1024px
- WHEN the grid renders
- THEN cards display in a 2-column grid

#### Scenario: Desktop multi-column

- GIVEN the viewport width is 1024px or above
- WHEN the grid renders
- THEN cards display in a 3 or 4-column grid based on available space

### Requirement: Beam Hover Effect

The system MUST apply a rotating beam (conic-gradient light border) effect on project card hover.

#### Scenario: Beam activates on hover

- GIVEN a project card is visible on a pointer-capable device
- WHEN the user hovers over the card
- THEN a rotating light border appears around the card edge

#### Scenario: Beam deactivates on mouse leave

- GIVEN the beam effect is active on a hovered card
- WHEN the cursor leaves the card
- THEN the beam effect fades or stops rotating

#### Scenario: No beam on touch without hover support

- GIVEN the device does not support hover (touch-only)
- WHEN the user views the projects section
- THEN the beam effect is not triggered by touch

### Requirement: Card Content

The system SHALL display each project's name, description, and optionally a thumbnail image inside the card.

#### Scenario: Card shows project info

- GIVEN a project card renders
- WHEN the card is visible
- THEN the project name, a short description, and associated image are displayed

### Requirement: Card Click Navigation

The system MUST allow clicking a project card to navigate to the project's detail page or external URL.

#### Scenario: Click opens project link

- GIVEN a project card is visible
- WHEN the user clicks the card
- THEN the browser navigates to the project's associated URL
