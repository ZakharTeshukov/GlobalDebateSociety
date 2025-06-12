# Website SEO and Performance Optimization

This document tracks the tasks completed and planned for improving the website's SEO and performance based on Google's leaked SEO document.

## Completed Tasks

- [x] **Homepage SEO (`index.html`):**
  - [x] Optimized title and meta description.
  - [x] Added `Organization` and `WebSite` structured data (JSON-LD).
  - [x] Corrected broken navigation links.
- [x] **CSS Performance:**
  - [x] Added `clean-css-cli` to bundle and minify all CSS files.
  - [x] Updated `package.json` with a `build:css` script.
  - [x] Replaced individual CSS links with a single bundled file in all optimized pages.
  - [x] Removed redundant CSS files and imports.
- [x] **About Page SEO (`/pages/about/index.html`):**
  - [x] Optimized the `<h1>` tag.
  - [x] Added `Person` structured data for the team.
  - [x] Corrected broken links.
- [x] **Events Page SEO (`/pages/events/index.html`):**
  - [x] Added generic `Event` structured data.
  - [x] Corrected broken links in the footer.
- [x] **Resources Page SEO (`/pages/resources/index.html`):**
  - [x] Added `WebPage` and `ItemList` structured data for resource categories.
  - [x] Corrected broken links.
- [x] **Join Page SEO (`/pages/join/index.html`):**
  - [x] Added `WebPage` and `ItemList` structured data for membership options.
  - [x] Corrected broken links.
- [x] **Contact Page SEO (`/pages/contact/index.html`):**
  - [x] Optimized the `<title>` tag.
  - [x] Added `ContactPage` structured data.
  - [x] Corrected broken social media and footer links.
- [x] **Image Optimization:**
  - [x] Converted all PNG and JPG images to WebP format.
  - [x] Updated HTML to use WebP images with PNG/SVG fallbacks.

## In Progress Tasks

- [ ] **JavaScript Optimization:**
  - [ ] Minify and bundle JavaScript files.
  - [ ] Defer loading of non-critical scripts.

## Future Tasks

- [ ] **Content Freshness:**
  - [ ] Implement a system to display "last updated" dates on key pages.
  - [ ] Develop a content strategy to regularly update the blog and resources.
- [ ] **Backlink Strategy:**
  - [ ] Identify opportunities for acquiring high-quality backlinks.
- [ ] **Author Authority:**
  - [ ] Create author bios and link them to content.
- [ ] **Advanced Schema:**
  - [ ] Implement more specific schema types where applicable (e.g., `Article` for blog posts).

## Implementation Plan

The next immediate steps will focus on optimizing the remaining assets (JavaScript) to further improve page load times. After that, the focus will shift to content-related SEO factors like freshness and authority.

### Relevant Files

- `index.html`
- `src/pages/about/index.html`
- `src/pages/events/index.html`
- `src/pages/resources/index.html`
- `src/pages/join/index.html`
- `src/pages/contact/index.html`
- `package.json`
- `dist/style.bundle.css`
- `src/styles/index.css`
- `src/js/convert-images.js`
- `src/assets/images/webp/` 