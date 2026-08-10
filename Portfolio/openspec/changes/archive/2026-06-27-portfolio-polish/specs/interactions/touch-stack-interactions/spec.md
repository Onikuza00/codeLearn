# Spec: Touch Stack Interactions

## Purpose

Add touch event support for stack hover interactions so mobile users can trigger the same card stack effects that desktop users get on hover.

## Requirements

### TOUCH-1: Touch Event Binding
The system SHALL bind `touchstart` and `touchend` events to stack interaction elements in addition to existing `mouseenter`/`mouseleave` handlers.

### TOUCH-2: Equivalent Visual Feedback
Touch interactions MUST produce the same visual stack effect (card reveal, transform, or animation) as hover interactions on desktop.

### TOUCH-3: No Conflict with Hover
Touch events SHALL NOT interfere with or duplicate hover events on devices that support both input methods.

## Scenarios

### Scenario: Touch reveals stacked card on mobile
**Given** the user is on a touch device
**When** the user taps a project stack card
**Then** the stack interaction triggers (card reveals/transforms)
**And** the visual effect matches the desktop hover behavior

### Scenario: Touch release restores original state
**Given** the user has tapped a stack card
**When** the user lifts their finger (touchend)
**Then** the card returns to its original stacked state after a brief delay or on next tap

### Scenario: No double-trigger on hybrid devices
**Given** the user is on a device with both touch and mouse input
**When** the user interacts with a stack card
**Then** the interaction triggers only once per gesture
**And** hover and touch do not fire simultaneously
