# Performance Optimization Documentation

This document provides an overview of the performance optimizations implemented in the Global Debate Society website.

## Implemented Optimizations

### 1. Lazy Loading for Images

Lazy loading defers the loading of off-screen images until they are needed, reducing initial page load times and data usage.

**Implementation:**
- Created `src/js/lazy-loading.js` using the Intersection Observer API for modern browsers with a fallback mechanism
- Added automatic conversion of existing images to lazy-loaded images
- Implemented smooth transitions for lazy-loaded images to prevent layout shifts

**Usage:**
- Images will automatically lazy load when they come into the viewport
- For optimal results, add the `data-src` attribute to your image tags instead of `src`:
  ```html
  <img data-src="path/to/image.jpg" alt="Description">
  ```

### 2. Service Worker & Caching

Service workers provide offline capability and faster load times through strategic caching.

**Implementation:**
- Created `src/js/service-worker.js` with the following caching strategies:
  - Network-first for HTML pages
  - Cache-first for images
  - Stale-while-revalidate for CSS, JS, and other static assets
- Added service worker registration and update notification system

**Features:**
- Offline access to previously visited pages
- Faster subsequent page loads
- Reduced server load and bandwidth usage
- Update notification when new content is available

### 3. Browser Caching

Proper cache headers and preload directives help browsers optimize resource loading.

**Implementation:**
- Added Cache-Control headers
- Implemented resource preloading for critical assets
- Added rel=preconnect for external domains

### 4. Web App Manifest

Added a Web App Manifest (`manifest.json`) to enable Progressive Web App (PWA) capabilities.

**Features:**
- Installable on mobile and desktop devices
- Full-screen experience without browser UI
- Custom icons and theme colors

## File Changes

1. **New Files Created:**
   - `src/js/lazy-loading.js` - Implements lazy loading for images
   - `src/js/service-worker.js` - Implements service worker with caching strategies
   - `src/js/sw-register.js` - Helper to register and update the service worker
   - `manifest.json` - Web App Manifest for PWA support

2. **Updated Files:**
   - `index.html` - Added service worker registration, lazy loading, and manifest
   - `src/js/main.js` - Added performance optimization integrations
   - Page templates - Updated with service worker and lazy loading support

## Performance Tips

1. **Image Optimization:**
   - Use WebP format where possible
   - Resize images to the display size before uploading
   - Use SVG for icons and logos

2. **JavaScript Optimization:**
   - Use the `defer` attribute for non-critical scripts
   - Split code into modules to reduce initial payload

3. **CSS Optimization:**
   - Inline critical CSS in the head
   - Load non-critical CSS with defer or async attributes

## Monitoring Performance

Use the following tools to monitor website performance:
- Google PageSpeed Insights
- Chrome DevTools Performance tab
- Lighthouse audits

## Browser Support

- Lazy loading: All modern browsers (IE11 uses fallback)
- Service Worker: Chrome, Firefox, Safari, Edge (not IE)
- Manifest: Chrome, Edge, Firefox, Opera, Safari (partial) 