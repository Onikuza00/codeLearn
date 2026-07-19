# Animations Specification

## Purpose

Defines GSAP 3.15 animation timelines: curtain reveal, scroll-triggered section reveals, cascade title animations, and typewriter effect.

## Requirements

### Requirement: Curtain Reveal Timeline

The system MUST play a full-screen curtain reveal animation on page load that exposes the hero content.

#### Scenario: Curtain plays on load

- GIVEN the page has finished loading all critical assets
- WHEN the curtain timeline starts
- THEN a full-screen overlay slides or fades away revealing the page content

#### Scenario: Curtain does not block interaction

- GIVEN the curtain animation is playing
- WHEN the animation completes
- THEN the overlay is removed from the DOM or set to `display: none` so it does not intercept pointer events

### Requirement: Scroll-Triggered Reveals

The system MUST animate sections (projects, stack, about) as they enter the viewport using GSAP ScrollTrigger.

#### Scenario: Section animates on enter

- GIVEN a target section is below the viewport
- WHEN the user scrolls and the section enters the viewport
- THEN the section fades in and/or slides up into view

#### Scenario: Section does not re-animate on scroll up

- GIVEN a section has already been revealed
- WHEN the user scrolls away and back
- THEN the section does not re-trigger the animation (once-only trigger)

#### Scenario: ScrollTrigger respects reduced motion

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the page loads
- THEN all scroll-triggered animations are disabled and sections are visible by default

### Requirement: Cascade Title Animations

The system SHOULD animate section titles with a staggered cascade effect as they enter the viewport.

#### Scenario: Title words cascade in

- GIVEN a section title is split into words or characters
- WHEN the section enters the viewport
- THEN each word/character animates in with a staggered delay

### Requirement: Typewriter Timeline

The system MUST animate terminal text character-by-character using GSAP TextPlugin.

#### Scenario: Typewriter types in terminal

- GIVEN the terminal section is in view
- WHEN the typewriter timeline executes
- THEN each character of the target text appears sequentially

#### Scenario: Typewriter source is translatable

- GIVEN the typewriter text is defined
- WHEN the language changes
- THEN the typewriter types the translated text string

### Requirement: GSAP Library Loading

The system MUST load GSAP 3.15, ScrollTrigger, and TextPlugin from jsdelivr CDN.

#### Scenario: GSAP loads successfully

- GIVEN the page includes GSAP CDN script tags
- WHEN the page loads
- THEN `gsap`, `ScrollTrigger`, and `TextPlugin` are available in the global scope

#### Scenario: GSAP CDN unavailable

- GIVEN the jsdelivr CDN is unreachable
- WHEN the page loads
- THEN the page remains functional without animations (graceful degradation)
