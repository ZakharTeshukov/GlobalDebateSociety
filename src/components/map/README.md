# Interactive World Map Component

This document explains how the interactive SVG world map component works and how to maintain it.

## Overview

The map component displays an interactive world map showing the locations of Global Debate Society chapters. It allows for:

- Pan and zoom navigation
- Country highlighting based on chapter status
- Chapter location markers with tooltips
- Context-sensitive buttons based on country selection

## Files Structure

The map implementation has been simplified into just two files:

1. **`src/js/map.js`** - All JavaScript functionality
2. **`src/styles/components/map.css`** - All styling rules

## How to Use

To add the map to a page:

```html
<!-- Add this HTML structure -->
<section id="map-section">
  <div class="container">
    <h2>Our Global Chapters</h2>
    <p class="section-subtitle">Explore Global Debate Society chapters around the world</p>
    <div id="world-map-container"></div>
    <div id="map-button-container"></div>
  </div>
</section>

<!-- Include these scripts -->
<script src="src/js/map.js"></script>
```

## Configuration

All configuration is in `map.js`, making it easy to update without changing the code:

1. **SVG Source**: Change `SVG_URL` constant to use a different map
2. **Countries Data**: Update `COUNTRIES_DB` array to change which countries are highlighted
   - Status options: 'ratified' (blue), 'unratified' (pink), 'none' (gray)
3. **Chapter Locations**: Update `CHAPTER_LOCATIONS` array to add or remove chapter markers
   - Coordinates are in percentages relative to SVG viewBox

## Troubleshooting Guide

### Map Not Loading

1. Check browser console for errors
2. Verify SVG path is correct (`SVG_URL` constant in map.js)
3. Ensure map container elements exist in HTML (`#world-map-container`)

### Country Colors Not Showing Correctly

1. Check that country IDs in `COUNTRIES_DB` match the IDs in the SVG file
2. Inspect SVG elements to verify the path IDs
3. Check status values ('ratified', 'unratified', 'none')

### Chapter Markers Not Positioned Correctly

1. Adjust x/y coordinates in `CHAPTER_LOCATIONS` array
2. Use browser developer tools to inspect marker positions
3. Coordinates are percentages (0-100) of the SVG viewBox

### Pan/Zoom Not Working

1. Check that the SVG has a first-level `<g>` element for transformation
2. Verify map container is properly sized with `position: relative`
3. Look for JavaScript errors in console

## Adding New Chapters

To add a new chapter to the map:

1. Add country to `COUNTRIES_DB` with appropriate status
2. Add chapter marker to `CHAPTER_LOCATIONS` with correct coordinates
3. Set URLs for both country and chapter marker as needed

Example:
```javascript
// Add to COUNTRIES_DB
{ code: 'Philippines', name: 'Philippines', status: 'unratified', href: 'https://globaldebatesociety.com' }

// Add to CHAPTER_LOCATIONS
{ 
    name: "Manila Chapter", 
    country: "Philippines", 
    city: "Manila", 
    coordinates: { x: 79.5, y: 49.8 }, 
    href: "https://globaldebatesociety.com/chapters/manila" 
}
```

## Modifying the SVG Map

If you need to modify the SVG map:

1. Edit the SVG file directly (use Inkscape or similar)
2. Ensure each country path has an `id` attribute matching its code in `COUNTRIES_DB`
3. Keep the first-level `<g>` element intact for zoom/pan functionality

## Customizing Appearance

To customize the map's appearance:

1. Edit color variables in `map.js` (for country fill colors)
2. Modify CSS styles in `src/styles/components/map.css` for tooltips, markers, etc.
3. Adjust responsive breakpoints in the media queries as needed 