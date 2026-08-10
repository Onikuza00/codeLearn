# Spec: SEO Meta

## Purpose

Add meta description, Open Graph tags, and favicon to enable proper social sharing and browser tab identification.

## Requirements

### SEO-1: Meta Description
The page SHALL include a `<meta name="description">` tag with a concise, keyword-rich description of the portfolio (max 160 characters).

### SEO-2: Open Graph Tags
The page SHALL include the following OG tags: `og:title`, `og:description`, `og:image`, `og:url`, and `og:type`.

### SEO-3: Favicon
The page SHALL include a favicon that displays correctly in browser tabs and bookmarks. Both `.ico` and `.png` formats SHOULD be provided.

## Scenarios

### Scenario: Meta description present in head
**Given** the user views the page source
**When** inspecting the `<head>` section
**Then** a `<meta name="description" content="...">` tag exists
**And** the content is between 120-160 characters

### Scenario: OG tags render for social sharing
**Given** a social platform scrapes the page URL
**When** the scraper reads the `<head>` section
**Then** all required OG meta tags are present with valid values
**And** `og:image` points to a reachable image URL

### Scenario: Favicon displays in browser
**Given** the user opens the portfolio in a browser
**When** the page loads
**Then** the browser tab displays the custom favicon
**And** the favicon persists in bookmarks when saved
