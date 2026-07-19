# i18n Specification

## Purpose

Defines the internationalization system: translation dictionaries, `data-i18n` attribute binding, and language switcher behavior.

## Requirements

### Requirement: Translation Dictionary

The system MUST provide a `translations.js` module containing translation dictionaries for Catalan (ca), Spanish (es), and English (en).

#### Scenario: All languages have matching keys

- GIVEN the `translations.js` file is loaded
- WHEN inspecting the translation object
- THEN every key present in `ca` also exists in `es` and `en`

#### Scenario: Missing translation key

- GIVEN a `data-i18n` element references a key that does not exist in the current language
- WHEN the language is set to that language
- THEN the element displays the key name or falls back to the default language

### Requirement: data-i18n Binding

The system MUST bind `data-i18n` attributes on HTML elements to their corresponding translation values.

#### Scenario: Elements update on language change

- GIVEN elements have `data-i18n="some.key"` attributes
- WHEN the user switches the active language
- THEN all matching elements update their text content to the translated value

#### Scenario: Initial language renders correctly

- GIVEN the page loads with a default language (ca)
- WHEN the DOM is ready
- THEN all `data-i18n` elements display the Catalan translation

### Requirement: Language Switcher

The system MUST provide a UI control in the navigation that allows switching between ca, es, and en.

#### Scenario: Switcher changes active language

- GIVEN the language switcher is visible in the nav
- WHEN the user selects a different language
- THEN the active language changes and all `data-i18n` elements update

#### Scenario: Selected language persists

- GIVEN the user selects a language
- WHEN the page is reloaded
- THEN the previously selected language is restored (via `localStorage` or URL parameter)

### Requirement: Terminal Text Translation

The system MUST ensure the typewriter text in the terminal card is translatable.

#### Scenario: Typewriter uses translated text

- GIVEN the terminal typewriter is about to animate
- WHEN the language is set to a specific locale
- THEN the typewriter types the text from that language's translation dictionary
