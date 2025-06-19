document.addEventListener('DOMContentLoaded', () => {

    /*
        ========================================
        CONSTANTS & DATA STRUCTURES (Requirement 7)
        ========================================
    */

    // 9. SVG Loading & Initialization: URL to the SVG map file.
    const SVG_URL = 'src/assets/maps/not-calibrated/world_with_states.svg';

    /**
        * CENTRALIZED COUNTRY DATABASE
        * This is the single source of truth for country data containing:
        * - code: Country ID that matches SVG path IDs in the world_with_states.svg file
        * - name: Full country name for display purposes
        * - status: "ratified", "unratified", or "none" (default)
        * - color: Fill color based on status
        * - href: Link target when clicked (defaults to globaldebatesociety.com)
        */
    const COUNTRIES_DB = [
        // GDS Chapter Countries (Blue)
        { code: 'Vietnam', name: 'Vietnam', status: 'ratified', color: '#3498db', href: 'https://globaldebatesociety.com' },
        { code: 'Thailand', name: 'Thailand', status: 'ratified', color: '#3498db', href: 'https://globaldebatesociety.com' },
        
        // Upcoming Chapter Countries (Pink)
        { code: 'Indonesia', name: 'Indonesia', status: 'unratified', color: '#f5b5b5', href: 'https://globaldebatesociety.com' },
        { code: 'Malaysia', name: 'Malaysia', status: 'unratified', color: '#f5b5b5', href: 'https://globaldebatesociety.com' },
        { code: 'Singapore', name: 'Singapore', status: 'unratified', color: '#f5b5b5', href: 'https://globaldebatesociety.com' },
        
        // Commonly referenced countries (Default - Gray)
        { code: 'United States', name: 'United States', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Mexico', name: 'Mexico', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Brazil', name: 'Brazil', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Australia', name: 'Australia', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'United Kingdom', name: 'United Kingdom', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'France', name: 'France', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Germany', name: 'Germany', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'India', name: 'India', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Russia', name: 'Russia', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Japan', name: 'Japan', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'South Africa', name: 'South Africa', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Nigeria', name: 'Nigeria', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' },
        { code: 'Egypt', name: 'Egypt', status: 'none', color: '#e9ecef', href: 'https://globaldebatesociety.com' }
    ];

    /**
     * CHAPTER LOCATIONS
     * Specific chapter locations with coordinates for placing markers
     */
    const CHAPTER_LOCATIONS = [
        {
            name: "SSIS Chapter",
            country: "Vietnam",
            city: "Ho Chi Minh City",
            coordinates: { x: 78.2, y: 49.5 }, // Coordinates in % of SVG viewBox
            href: "https://globaldebatesociety.com/chapters/ssis"
        },
        {
            name: "ABCIS Chapter",
            country: "Vietnam",
            city: "Ho Chi Minh City",
            coordinates: { x: 78.2, y: 50.1 }, // Slightly offset from SSIS
            href: "https://globaldebatesociety.com/chapters/abcis"
        },
        {
            name: "LSTS Chapter",
            country: "Thailand",
            city: "Bangkok",
            coordinates: { x: 76.3, y: 48.2 },
            href: "https://globaldebatesociety.com/chapters/lsts"
        }
    ];

    // Create lookup maps for faster access
    const countryByCode = COUNTRIES_DB.reduce((map, country) => {
        map[country.code] = country;
        return map;
    }, {});

    // Zoom configuration
    const ZOOM_CONFIG = {
        MIN_SCALE: 1,
        MAX_SCALE: 8,
        ZOOM_STEP: 0.2,
        ZOOM_SPEED: 0.001 // Controls sensitivity of trackpad/wheel zoom
    };

    /*
        ========================================
        STATE VARIABLES
        ========================================
    */

    // 10. Zoom/Pan Logic: State object to hold the current transform values
    let panZoomState = {
        scale: 1,
        translateX: 0,
        translateY: 0,
        isPanning: false,
        startX: 0,
        startY: 0,
        mouseDownX: 0,
        mouseDownY: 0,
        mouseDownTime: 0,
        wasClick: false,
        lastWheelEventTime: 0
    };

    // DOM element references
    const mapContainer = document.getElementById('world-map-container');
    const buttonContainer = document.getElementById('map-button-container');
    let svgRoot = null;
    let panZoomGroup = null;
    let tooltip = null;
    let zoomIndicator = null;
    let zoomControls = null;

    /*
        ========================================
        INITIALIZATION
        ========================================
    */

    /**
        * Main function to kick off the map loading and setup process.
        * 9. SVG Loading & Initialization
        * This function fetches the SVG file and injects it into the DOM.
        */
    async function initializeMap() {
        if (!mapContainer) {
            return;
        }
        try {
            // 9a. Fetch SVG content from the specified URL.
            const response = await fetch(SVG_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const svgText = await response.text();
            
            // 9b. Inject the SVG content directly into the map container.
            mapContainer.innerHTML = svgText;
            
            // 9c. After injection, select the SVG and its main group for manipulation.
            svgRoot = mapContainer.querySelector('svg');
            panZoomGroup = svgRoot.querySelector('g'); // Assumes 'g' is the pan/zoom target

            // 9d. If the SVG is properly loaded, set up its interactive features.
            if (svgRoot && panZoomGroup) {
                setupMapInteraction();
                setupTooltip();
                setupZoomControls();
                colorizeCountries();
                addChapterMarkers();
            } else {
                console.error("SVG root or pan/zoom group not found.");
            }
        } catch (error) {
            console.error("Failed to load or initialize map:", error);
            mapContainer.innerHTML = '<p>Error loading map. Please try again later.</p>';
        }
    }

    /**
     * Colorizes countries based on the COUNTRIES_DB data
     */
    function colorizeCountries() {
        if (!svgRoot) return;
        
        // Find all country paths in the SVG
        const countryPaths = svgRoot.querySelectorAll('path');
        
        countryPaths.forEach(path => {
            // Add the country class to all paths
            path.classList.add('country');
            
            // Check if this country is in our database
            const countryId = path.id;
            const countryData = countryByCode[countryId];
            
            if (countryData) {
                // Set the fill color and data attributes
                path.setAttribute('fill', countryData.color);
                path.setAttribute('data-status', countryData.status);
                path.setAttribute('data-name', countryData.name);
                
                // Add click event for navigation
                if (countryData.href) {
                    path.style.cursor = 'pointer';
                }
            } else {
                // Default styling for countries not in our database
                path.setAttribute('fill', '#e9ecef');
                path.setAttribute('data-status', 'none');
            }
        });
    }

    /**
     * Adds chapter markers to the map
     */
    function addChapterMarkers() {
        if (!svgRoot || !panZoomGroup) return;
        
        // Create a new group for markers
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        markerGroup.setAttribute('class', 'chapter-markers');
        
        // Add each chapter marker
        CHAPTER_LOCATIONS.forEach(chapter => {
            // Create marker circle
            const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            marker.setAttribute('class', 'chapter-marker');
            marker.setAttribute('cx', `${chapter.coordinates.x}%`);
            marker.setAttribute('cy', `${chapter.coordinates.y}%`);
            marker.setAttribute('r', '0.5%');
            marker.setAttribute('data-name', chapter.name);
            marker.setAttribute('data-city', chapter.city);
            marker.setAttribute('data-country', chapter.country);
            
            // Add event listeners
            marker.addEventListener('mouseover', (e) => {
                showTooltip(e, `${chapter.name}<br>${chapter.city}, ${chapter.country}`);
            });
            
            marker.addEventListener('mouseout', hideTooltip);
            
            if (chapter.href) {
                marker.style.cursor = 'pointer';
                marker.addEventListener('click', () => {
                    window.location.href = chapter.href;
                });
            }
            
            markerGroup.appendChild(marker);
        });
        
        // Add the marker group to the SVG
        panZoomGroup.appendChild(markerGroup);
    }

    /**
     * Sets up zoom controls UI elements
     */
    function setupZoomControls() {
        // Create zoom controls container
        zoomControls = document.createElement('div');
        zoomControls.className = 'map-zoom-controls';
        
        // Create zoom in button
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'zoom-btn zoom-in';
        zoomInBtn.innerHTML = '+';
        zoomInBtn.setAttribute('aria-label', 'Zoom in');
        zoomInBtn.addEventListener('click', () => {
            zoomBy(ZOOM_CONFIG.ZOOM_STEP * 5);
        });
        
        // Create zoom out button
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'zoom-btn zoom-out';
        zoomOutBtn.innerHTML = '−'; // Using an en dash
        zoomOutBtn.setAttribute('aria-label', 'Zoom out');
        zoomOutBtn.addEventListener('click', () => {
            zoomBy(-ZOOM_CONFIG.ZOOM_STEP * 5);
        });
        
        // Create reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'zoom-btn reset';
        resetBtn.innerHTML = '↺';
        resetBtn.setAttribute('aria-label', 'Reset zoom');
        resetBtn.addEventListener('click', resetZoom);
        
        // Add buttons to controls
        zoomControls.appendChild(zoomInBtn);
        zoomControls.appendChild(zoomOutBtn);
        zoomControls.appendChild(resetBtn);
        
        // Create zoom indicator
        zoomIndicator = document.createElement('div');
        zoomIndicator.className = 'zoom-indicator';
        zoomIndicator.textContent = '100%';
        
        // Add controls to map container
        mapContainer.appendChild(zoomControls);
        mapContainer.appendChild(zoomIndicator);
    }

    /*
        ========================================
        EVENT HANDLERS & INTERACTIVITY (Requirement 3, 4, 5, 6, 8, 10)
        ========================================
    */

    /**
        * Sets up all event listeners for the map.
        */
    function setupMapInteraction() {
        // 3a. Attach a single 'mouseover' listener to the SVG container.
        // This uses event delegation to handle hovers over any country path.
        svgRoot.addEventListener('mouseover', handleCountryMouseOver);

        // 3b. Attach a 'mouseout' listener to reset country styles when the mouse leaves.
        svgRoot.addEventListener('mouseout', handleCountryMouseOut);
        
        // 10a. Mouse down for panning
        svgRoot.addEventListener('mousedown', startPan);
        
        // 10b. Mouse move for panning
        svgRoot.addEventListener('mousemove', pan);

        // 10c. Mouse up for panning
        svgRoot.addEventListener('mouseup', endPan);
        
        // 10d. Mouse leave to cancel panning if the cursor exits the container
        svgRoot.addEventListener('mouseleave', endPan);
        
        // 10e. Wheel event for zooming (works for both mouse wheel and trackpad)
        svgRoot.addEventListener('wheel', handleZoom, { passive: false });
        
        // 6a. Add a click listener to the SVG root for handling country clicks.
        // This will check if the interaction was a click or a pan.
        svgRoot.addEventListener('click', handleCountryClick, true); // Use capture phase
    }

    /**
        * Handles the 'mouseover' event on a country path.
        * @param {MouseEvent} event - The mouseover event object.
        */
    function handleCountryMouseOver(event) {
        const countryPath = event.target.closest('.country');
        
        if (countryPath) {
            const countryId = countryPath.id;
            const countryData = countryByCode[countryId];
            
            updateContextButton(countryData);
            
            if (countryData && countryData.status === 'ratified') {
                showTooltip(event, `${countryData.name}<br>Active GDS Chapter`);
            } else if (countryData && countryData.status === 'unratified') {
                showTooltip(event, `${countryData.name}<br>Coming Soon`);
            } else {
                showTooltip(event, countryPath.getAttribute('data-name') || countryId);
            }
        }
        
        // Check for chapter markers
        if (event.target.classList.contains('chapter-marker')) {
            const marker = event.target;
            const chapterName = marker.getAttribute('data-name');
            const city = marker.getAttribute('data-city');
            const country = marker.getAttribute('data-country');
            
            showTooltip(event, `${chapterName}<br>${city}, ${country}`);
        }
    }

    /**
        * Handles the 'mouseout' event to clear dynamic states.
        */
    function handleCountryMouseOut(event) {
        clearContextButton();
        hideTooltip();
    }
    
    /**
        * Handles a click on a country.
        * This function is called in the capture phase to determine if it was a genuine click.
        * @param {MouseEvent} event - The click event object.
        */
    function handleCountryClick(event) {
        if (panZoomState.wasClick) {
            // Check for country click
            const countryPath = event.target.closest('.country');
            if (countryPath) {
                const countryId = countryPath.id;
                const countryData = countryByCode[countryId];

                if (countryData && countryData.href) {
                    event.stopPropagation();
                    event.preventDefault();
                    window.location.href = countryData.href;
                }
            }
            
            // Check for chapter marker click
            if (event.target.classList.contains('chapter-marker')) {
                const href = CHAPTER_LOCATIONS.find(
                    chapter => chapter.name === event.target.getAttribute('data-name')
                )?.href;
                
                if (href) {
                    event.stopPropagation();
                    event.preventDefault();
                    window.location.href = href;
                }
            }
        }
    }

    /**
        * Initiates the panning action.
        * @param {MouseEvent} event - The mousedown event.
        */
    function startPan(event) {
        if (event.buttons !== 1) return;

        panZoomState.isPanning = true;
        panZoomState.startX = event.clientX - panZoomState.translateX;
        panZoomState.startY = event.clientY - panZoomState.translateY;
        panZoomState.mouseDownX = event.clientX;
        panZoomState.mouseDownY = event.clientY;
        panZoomState.mouseDownTime = Date.now();
        panZoomState.wasClick = true; // Assume it's a click until moved
        svgRoot.style.cursor = 'grabbing';
    }

    /**
        * Handles the panning movement.
        * @param {MouseEvent} event - The mousemove event.
        */
    function pan(event) {
        if (!panZoomState.isPanning) return;
        
        const dx = event.clientX - panZoomState.mouseDownX;
        const dy = event.clientY - panZoomState.mouseDownY;

        // If the mouse has moved more than a few pixels, it's a pan, not a click.
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            panZoomState.wasClick = false;
        }

        panZoomState.translateX = event.clientX - panZoomState.startX;
        panZoomState.translateY = event.clientY - panZoomState.startY;

        applyTransform();
    }

    /**
        * Ends the panning action.
        */
    function endPan() {
        if (!panZoomState.isPanning) return;
        
        panZoomState.isPanning = false;
        svgRoot.style.cursor = 'grab';
        
        // If the mouse was down for less than 200ms and didn't move much,
        // it's probably a click rather than a pan.
        const timeElapsed = Date.now() - panZoomState.mouseDownTime;
        if (timeElapsed < 200 && panZoomState.wasClick) {
            panZoomState.wasClick = true;
        }
    }

    /**
        * Handles the wheel event for zooming.
        * @param {WheelEvent} event - The wheel event.
        */
    function handleZoom(event) {
        // Prevent default browser behavior (page scrolling)
        event.preventDefault();
        
        // Throttle wheel events to prevent too many updates
        const now = Date.now();
        if (now - panZoomState.lastWheelEventTime < 16) { // ~60fps
            return;
        }
        panZoomState.lastWheelEventTime = now;
        
        // Calculate zoom factor based on wheel delta
        // deltaY is positive when scrolling down/away (zoom out)
        // and negative when scrolling up/toward (zoom in)
        const delta = event.deltaY || event.deltaX;
        const zoomFactor = -delta * ZOOM_CONFIG.ZOOM_SPEED;
        
        // Get cursor position relative to the SVG for zoom centering
        const rect = svgRoot.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        
        zoomAt(zoomFactor, offsetX, offsetY);
        
        // Show zoom indicator
        updateZoomIndicator();
    }
    
    /**
     * Zooms the map by a specific amount at a specific point
     * @param {number} zoomFactor - Amount to zoom (positive = zoom in, negative = zoom out)
     * @param {number} centerX - X coordinate to zoom at
     * @param {number} centerY - Y coordinate to zoom at
     */
    function zoomAt(zoomFactor, centerX, centerY) {
        const oldScale = panZoomState.scale;
        
        // Calculate new scale with limits
        const newScale = Math.min(
            Math.max(oldScale * (1 + zoomFactor), ZOOM_CONFIG.MIN_SCALE),
            ZOOM_CONFIG.MAX_SCALE
        );
        
        // If scale didn't change, don't proceed
        if (newScale === oldScale) return;
        
        // Calculate how much the coordinates will change
        const scaleRatio = newScale / oldScale;
        
        // Adjust the translation to zoom at the cursor position
        panZoomState.translateX = centerX - (centerX - panZoomState.translateX) * scaleRatio;
        panZoomState.translateY = centerY - (centerY - panZoomState.translateY) * scaleRatio;
        panZoomState.scale = newScale;
        
        applyTransform();
    }
    
    /**
     * Zooms by a specific amount centered on the map
     * @param {number} amount - Amount to zoom (positive = zoom in, negative = zoom out)
     */
    function zoomBy(amount) {
        // Get center of SVG
        const rect = svgRoot.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        zoomAt(amount, centerX, centerY);
        updateZoomIndicator();
    }
    
    /**
     * Resets zoom and pan to initial state
     */
    function resetZoom() {
        panZoomState.scale = 1;
        panZoomState.translateX = 0;
        panZoomState.translateY = 0;
        
        applyTransform();
        updateZoomIndicator();
    }
    
    /**
     * Updates the zoom indicator display
     */
    function updateZoomIndicator() {
        if (!zoomIndicator) return;
        
        // Format zoom level as percentage
        const zoomPercent = Math.round(panZoomState.scale * 100);
        zoomIndicator.textContent = `${zoomPercent}%`;
        
        // Show indicator and set timeout to hide it
        zoomIndicator.classList.add('active');
        
        // Clear any existing timeout
        if (zoomIndicator.hideTimeout) {
            clearTimeout(zoomIndicator.hideTimeout);
        }
        
        // Set new timeout to hide indicator after 1.5 seconds
        zoomIndicator.hideTimeout = setTimeout(() => {
            zoomIndicator.classList.remove('active');
        }, 1500);
    }

    /**
        * Applies the current transform values to the SVG group.
        */
    function applyTransform() {
        if (!panZoomGroup) return;
        
        const transform = `translate(${panZoomState.translateX}px, ${panZoomState.translateY}px) scale(${panZoomState.scale})`;
        
        // Apply transform with transform-origin at center
        panZoomGroup.style.transformOrigin = 'center';
        panZoomGroup.style.transform = transform;
    }

    /**
        * Updates the context button based on the hovered country.
        * @param {Object} countryData - The data for the hovered country.
        */
    function updateContextButton(countryData) {
        if (!buttonContainer) return;
        
        // Clear any existing buttons
        buttonContainer.innerHTML = '';
        
        if (!countryData) return;
        
        // Create a button with appropriate text based on country status
        const button = document.createElement('button');
        button.className = 'map-context-button';
        button.setAttribute('data-status', countryData.status);
        
        switch (countryData.status) {
            case 'ratified':
                button.textContent = `Visit ${countryData.name} Chapter`;
                break;
            case 'unratified':
                button.textContent = `${countryData.name} Chapter Coming Soon`;
                break;
            default:
                button.textContent = `Learn About ${countryData.name}`;
        }
        
        // Add click handler to navigate to the country's href
        button.addEventListener('click', () => {
            if (countryData.href) {
                window.location.href = countryData.href;
            }
        });
        
        buttonContainer.appendChild(button);
    }

    /**
        * Clears the context button.
        */
    function clearContextButton() {
        if (!buttonContainer) return;
        buttonContainer.innerHTML = '';
    }

    /**
        * Sets up the tooltip element.
        */
    function setupTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        mapContainer.appendChild(tooltip);
    }

    /**
        * Shows the tooltip with the specified text at the event coordinates.
        * @param {MouseEvent} event - The mouse event that triggered the tooltip.
        * @param {string} text - The text to display in the tooltip.
        */
    function showTooltip(event, text) {
        if (!tooltip) return;
        
        tooltip.innerHTML = text;
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY - 10}px`;
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translate(-50%, -100%)';
    }

    /**
        * Hides the tooltip.
        */
    function hideTooltip() {
        if (!tooltip) return;
        
        tooltip.style.opacity = '0';
    }

    // Initialize the map when the DOM is loaded
    initializeMap();
}); 