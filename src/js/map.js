/**
 * @file Simplified Interactive World Map
 * @description This file handles all functionality for the interactive SVG world map
 * @author Zakhar Tesuhkov (simplified version)
 * @version 3.0.0
 *
 * DEBUGGING GUIDE:
 * 1. SVG Loading Issues: Check the SVG_URL constant and network requests
 * 2. Country Coloring Issues: Verify country IDs in COUNTRIES_DB match SVG path IDs
 * 3. Marker Positioning Issues: Adjust x/y coordinates in CHAPTER_LOCATIONS
 * 4. Pan/Zoom Issues: Check _applyTransform() and browser console for errors
 * 5. Click Events Not Working: Verify event listeners in _setupEventListeners()
 */

/**
 * WorldMap - Handles SVG map interactivity including pan/zoom, tooltips, and markers
 */
class WorldMap {
  /**
   * @param {string} containerId - DOM element ID for map container
   * @param {Object} options - Configuration options
   * @param {string} options.svgUrl - URL to SVG map file
   * @param {Array} options.countries - Country data for coloring and interactions
   * @param {Array} options.chapters - Chapter locations to mark on the map
   */
  constructor(containerId, options) {
    // DOM elements
    this.mapContainer = document.getElementById(containerId);
    if (!this.mapContainer) {
      console.error(`Map container #${containerId} not found!`);
      return;
    }
    this.buttonContainer = document.getElementById('map-button-container');
    this.svgRoot = null;
    this.panZoomGroup = null;

    // Configuration
    this.svgUrl = options.svgUrl;
    this.countriesData = options.countries;
    this.chapterLocations = options.chapters;
    this.countryByCode = this._createCountryLookup();

    // Zoom settings
    this.zoomConfig = {
      MIN_SCALE: 1,
      MAX_SCALE: 5,
      ZOOM_STEP: 0.2,
    };

    // Country status colors
    this.statusColors = {
      ratified: '#3498db', // Blue for active chapters
      unratified: '#f5b5b5', // Pink for upcoming chapters
      none: '#e9ecef', // Light gray for others
    };

    // State for pan & zoom functionality
    this.state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
      wasClick: false,
    };

    // UI elements created dynamically
    this.tooltip = null;
    this.zoomIndicator = null;
  }

  /**
   * Creates a lookup object to quickly find country data by code
   * @private
   * @returns {Object} Lookup object where keys are country codes
   */
  _createCountryLookup() {
    return this.countriesData.reduce((map, country) => {
      map[country.code] = country;
      return map;
    }, {});
  }

  /**
   * Initializes the map - main entry point after creation
   * @public
   */
  async init() {
    try {
      await this._loadSvg();
      if (!this.svgRoot) {
        throw new Error('SVG failed to load properly');
      }

      this._setupUI();
      this._colorizeCountries();
      this._addChapterMarkers();
      this._setupEventListeners();

      console.log('✅ Map initialized successfully');
    } catch (error) {
      console.error('❌ Map initialization failed:', error);
      this.mapContainer.innerHTML = '<p>Error loading map. Please try again later.</p>';
    }
  }

  /**
   * Loads the SVG file and injects it into the container
   * @private
   */
  async _loadSvg() {
    console.log(`Loading SVG from: ${this.svgUrl}`);
    try {
      const response = await fetch(this.svgUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const svgText = await response.text();
      this.mapContainer.innerHTML = svgText;

      this.svgRoot = this.mapContainer.querySelector('svg');
      this.panZoomGroup = this.svgRoot?.querySelector('g');

      if (!this.panZoomGroup) {
        console.warn('⚠️ No <g> element found in SVG - pan/zoom may not work correctly');
      }

      return true;
    } catch (error) {
      console.error('SVG loading failed:', error);
      return false;
    }
  }

  /**
   * Sets up UI elements for the map
   * @private
   */
  _setupUI() {
    // Create tooltip for hover information
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'map-tooltip';
    this.mapContainer.appendChild(this.tooltip);

    // Create zoom controls (+, -, reset)
    this._createZoomControls();

    // Create zoom level indicator
    this.zoomIndicator = document.createElement('div');
    this.zoomIndicator.className = 'zoom-indicator';
    this.mapContainer.appendChild(this.zoomIndicator);
  }

  /**
   * Creates zoom control buttons
   * @private
   */
  _createZoomControls() {
    const controls = document.createElement('div');
    controls.className = 'map-zoom-controls';

    // Zoom in button
    const zoomIn = document.createElement('button');
    zoomIn.className = 'zoom-btn';
    zoomIn.textContent = '+';
    zoomIn.addEventListener('click', () => this._zoom(this.zoomConfig.ZOOM_STEP));

    // Zoom out button
    const zoomOut = document.createElement('button');
    zoomOut.className = 'zoom-btn';
    zoomOut.textContent = '−';
    zoomOut.addEventListener('click', () => this._zoom(-this.zoomConfig.ZOOM_STEP));

    // Reset zoom button
    const reset = document.createElement('button');
    reset.className = 'zoom-btn';
    reset.textContent = '⟲';
    reset.addEventListener('click', () => this._resetZoom());

    controls.append(zoomIn, zoomOut, reset);
    this.mapContainer.appendChild(controls);
  }

  /**
   * Applies colors to countries based on their status
   * @private
   */
  _colorizeCountries() {
    // Find all path elements in the SVG
    const paths = this.svgRoot.querySelectorAll('path');
    console.log(`Found ${paths.length} paths in SVG`);

    paths.forEach((path) => {
      // Add country class for styling
      path.classList.add('country');

      // Get country data if available
      const countryId = path.id;
      const countryData = this.countryByCode[countryId];

      // Set fill color based on country status
      let fillColor = this.statusColors.none;
      if (countryData) {
        fillColor = this.statusColors[countryData.status] || this.statusColors.none;
        path.setAttribute('data-status', countryData.status);
        path.setAttribute('data-name', countryData.name);

        // Make clickable if it has a link
        if (countryData.href) {
          path.style.cursor = 'pointer';
        }
      } else {
        path.setAttribute('data-status', 'none');
      }

      path.setAttribute('fill', fillColor);
    });
  }

  /**
   * Adds chapter location markers to the map
   * @private
   */
  _addChapterMarkers() {
    // Create a group to hold all markers
    const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    markerGroup.setAttribute('class', 'chapter-markers');

    // Add each chapter marker
    this.chapterLocations.forEach((chapter) => {
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('class', 'chapter-marker');
      marker.setAttribute('cx', `${chapter.coordinates.x}%`);
      marker.setAttribute('cy', `${chapter.coordinates.y}%`);
      marker.setAttribute('r', '0.5%');
      marker.setAttribute('data-name', chapter.name);

      // Make clickable if it has a link
      if (chapter.href) {
        marker.style.cursor = 'pointer';
        marker.addEventListener('click', () => (window.location.href = chapter.href));
      }

      // Add tooltip behavior
      marker.addEventListener('mouseover', (e) =>
        this._showTooltip(e, `${chapter.name}<br>${chapter.city}, ${chapter.country}`)
      );
      marker.addEventListener('mouseout', () => this._hideTooltip());

      markerGroup.appendChild(marker);
    });

    this.panZoomGroup.appendChild(markerGroup);
  }

  /**
   * Sets up event listeners for map interactivity
   * @private
   */
  _setupEventListeners() {
    // Pan (drag) events
    this.svgRoot.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this.svgRoot.addEventListener('mousemove', this._handleMouseMove.bind(this));
    this.svgRoot.addEventListener('mouseup', this._handleMouseUp.bind(this));
    this.svgRoot.addEventListener('mouseleave', this._handleMouseUp.bind(this));

    // Zoom events
    this.svgRoot.addEventListener('wheel', this._handleWheel.bind(this));

    // Country hover events
    this.svgRoot.querySelectorAll('.country').forEach((path) => {
      path.addEventListener('mouseover', this._handleCountryHover.bind(this));
      path.addEventListener('mouseout', this._handleCountryLeave.bind(this));
    });
  }

  /**
   * Handles mousedown event to start panning
   * @private
   * @param {MouseEvent} e - The mousedown event
   */
  _handleMouseDown(e) {
    // Only respond to left mouse button
    if (e.button !== 0) return;
    e.preventDefault();

    this.state.isPanning = true;
    this.state.startX = e.clientX - this.state.translateX;
    this.state.startY = e.clientY - this.state.translateY;
    this.state.wasClick = true; // Assume it's a click until movement occurs
  }

  /**
   * Handles mousemove event for panning
   * @private
   * @param {MouseEvent} e - The mousemove event
   */
  _handleMouseMove(e) {
    if (!this.state.isPanning) return;
    e.preventDefault();

    // If moving, it's not a simple click
    this.state.wasClick = false;

    // Update translation based on mouse movement
    this.state.translateX = e.clientX - this.state.startX;
    this.state.translateY = e.clientY - this.state.startY;

    // Apply the transformation
    this._applyTransform();
  }

  /**
   * Handles mouseup event to end panning and potentially handle clicks
   * @private
   * @param {MouseEvent} e - The mouseup event
   */
  _handleMouseUp(e) {
    if (!this.state.isPanning) return;

    this.state.isPanning = false;

    // If no movement occurred, treat it as a click
    if (this.state.wasClick) {
      this._handleClick(e);
    }
  }

  /**
   * Handles wheel event for zooming
   * @private
   * @param {WheelEvent} e - The wheel event
   */
  _handleWheel(e) {
    e.preventDefault();

    // Determine zoom direction from wheel delta
    const delta = -Math.sign(e.deltaY);
    const zoomAmount = delta * this.zoomConfig.ZOOM_STEP;

    // Apply zoom centered on cursor position
    this._zoom(zoomAmount, e.clientX, e.clientY);
  }

  /**
   * Handles country hovering
   * @private
   * @param {MouseEvent} e - The mouseover event
   */
  _handleCountryHover(e) {
    const path = e.target;

    // Show tooltip with country name
    const countryName = path.getAttribute('data-name');
    if (countryName) {
      this._showTooltip(e, countryName);
    }

    // Update context button if container exists
    if (this.buttonContainer) {
      const countryData = this.countryByCode[path.id];
      if (countryData) {
        this._updateContextButton(countryData);
      }
    }
  }

  /**
   * Handles country mouse leave
   * @private
   */
  _handleCountryLeave() {
    this._hideTooltip();
    if (this.buttonContainer) {
      this._clearContextButton();
    }
  }

  /**
   * Handles clicks on the map
   * @private
   * @param {MouseEvent} e - The click event
   */
  _handleClick(e) {
    const path = e.target.closest('.country');
    if (!path) return;

    // Check if country has associated URL
    const countryData = this.countryByCode[path.id];
    if (countryData?.href) {
      window.location.href = countryData.href;
    }
  }

  /**
   * Applies zoom transformation to the map
   * @private
   * @param {number} amount - Amount to zoom by
   * @param {number} [centerX] - X coordinate to zoom around
   * @param {number} [centerY] - Y coordinate to zoom around
   */
  _zoom(amount, centerX, centerY) {
    // Calculate new scale within bounds
    const newScale = Math.max(
      this.zoomConfig.MIN_SCALE,
      Math.min(this.zoomConfig.MAX_SCALE, this.state.scale + amount)
    );

    // If no change in scale, exit early
    if (newScale === this.state.scale) return;

    // If center coordinates provided, zoom around that point
    if (centerX !== undefined && centerY !== undefined) {
      const rect = this.mapContainer.getBoundingClientRect();
      const svgX = (centerX - rect.left) / this.state.scale;
      const svgY = (centerY - rect.top) / this.state.scale;

      const scaleChange = newScale - this.state.scale;
      this.state.translateX -= svgX * scaleChange;
      this.state.translateY -= svgY * scaleChange;
    }

    // Update scale and apply transformation
    this.state.scale = newScale;
    this._applyTransform();
    this._updateZoomIndicator();
  }

  /**
   * Resets zoom and position to initial state
   * @private
   */
  _resetZoom() {
    this.state.scale = 1;
    this.state.translateX = 0;
    this.state.translateY = 0;
    this._applyTransform();
    this._updateZoomIndicator();
  }

  /**
   * Applies current transformation to the map SVG
   * @private
   */
  _applyTransform() {
    if (!this.panZoomGroup) return;

    const transform = `translate(${this.state.translateX}px, ${this.state.translateY}px) scale(${this.state.scale})`;
    this.panZoomGroup.style.transform = transform;
  }

  /**
   * Shows tooltip with specified text
   * @private
   * @param {MouseEvent} e - The triggering event
   * @param {string} text - Text content for tooltip
   */
  _showTooltip(e, text) {
    if (!this.tooltip) return;

    this.tooltip.innerHTML = text;
    this.tooltip.style.opacity = '1';

    const rect = this.mapContainer.getBoundingClientRect();
    this.tooltip.style.left = `${e.clientX - rect.left}px`;
    this.tooltip.style.top = `${e.clientY - rect.top}px`;
  }

  /**
   * Hides the tooltip
   * @private
   */
  _hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
    }
  }

  /**
   * Updates zoom level indicator
   * @private
   */
  _updateZoomIndicator() {
    if (!this.zoomIndicator) return;

    // Show current zoom percentage
    const percentage = Math.round(this.state.scale * 100);
    this.zoomIndicator.textContent = `${percentage}%`;
    this.zoomIndicator.classList.add('active');

    // Hide indicator after a delay
    clearTimeout(this.zoomIndicator.timeoutId);
    this.zoomIndicator.timeoutId = setTimeout(() => {
      this.zoomIndicator.classList.remove('active');
    }, 1500);
  }

  /**
   * Updates context button based on country data
   * @private
   * @param {Object} countryData - Data for the country
   */
  _updateContextButton(countryData) {
    if (!this.buttonContainer || !countryData) return;

    this.buttonContainer.innerHTML = '';
    const button = document.createElement('button');
    button.className = 'map-context-button';
    button.setAttribute('data-status', countryData.status);

    // Set button text based on status
    let text = `Explore: ${countryData.name}`;
    if (countryData.status === 'unratified') text = `Coming Soon: ${countryData.name}`;
    if (countryData.status === 'ratified') text = `Visit Chapter: ${countryData.name}`;

    button.textContent = text;

    // Add click handler if URL exists
    if (countryData.href) {
      button.addEventListener('click', () => (window.location.href = countryData.href));
    }

    this.buttonContainer.appendChild(button);
  }

  /**
   * Clears the context button
   * @private
   */
  _clearContextButton() {
    if (this.buttonContainer) {
      this.buttonContainer.innerHTML = '';
    }
  }
}

// CONFIGURATION DATA
// =================

// Single source of truth for the SVG map path
const SVG_URL = 'src/assets/maps/not-calibrated/world_with_states.svg';

// Country database defining colors and interactions
const COUNTRIES_DB = [
  // Active chapter countries
  { code: 'Vietnam', name: 'Vietnam', status: 'ratified', href: 'https://globaldebatesociety.com' },
  {
    code: 'Thailand',
    name: 'Thailand',
    status: 'ratified',
    href: 'https://globaldebatesociety.com',
  },

  // Upcoming chapters
  {
    code: 'Indonesia',
    name: 'Indonesia',
    status: 'unratified',
    href: 'https://globaldebatesociety.com',
  },
  {
    code: 'Malaysia',
    name: 'Malaysia',
    status: 'unratified',
    href: 'https://globaldebatesociety.com',
  },
  {
    code: 'Singapore',
    name: 'Singapore',
    status: 'unratified',
    href: 'https://globaldebatesociety.com',
  },

  // Other countries
  {
    code: 'United States',
    name: 'United States',
    status: 'none',
    href: 'https://globaldebatesociety.com',
  },
  { code: 'Mexico', name: 'Mexico', status: 'none', href: 'https://globaldebatesociety.com' },
];

// Chapter location markers
const CHAPTER_LOCATIONS = [
  {
    name: 'SSIS Chapter',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    coordinates: { x: 78.2, y: 49.5 },
    href: 'https://globaldebatesociety.com/chapters/ssis',
  },
  {
    name: 'ABCIS Chapter',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    coordinates: { x: 78.2, y: 50.1 },
    href: 'https://globaldebatesociety.com/chapters/abcis',
  },
  {
    name: 'LSTS Chapter',
    country: 'Thailand',
    city: 'Bangkok',
    coordinates: { x: 76.3, y: 48.2 },
    href: 'https://globaldebatesociety.com/chapters/lsts',
  },
];

// Initialize the map when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('world-map-container');
  if (mapContainer) {
    const worldMap = new WorldMap('world-map-container', {
      svgUrl: SVG_URL,
      countries: COUNTRIES_DB,
      chapters: CHAPTER_LOCATIONS,
    });

    worldMap.init();
  } else {
    console.error("Map container element '#world-map-container' not found in the document");
  }
});
