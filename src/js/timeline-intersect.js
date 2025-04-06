/**
 * Timeline Intersection Observer
 * 
 * This script uses the Intersection Observer API to detect when
 * the timeline section enters the viewport, and triggers animations accordingly.
 * 
 * KEY FEATURES:
 * - Handles the loading state of the timeline
 * - Activates animations when timeline is visible in viewport
 * - Sets up individual element observers for staggered animations
 * - Ensures timeline is visible even if observer fails
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the timeline section
    const timelineSection = document.querySelector('.timeline-section');
    if (!timelineSection) return;

    // SAFETY MEASURE: Ensure timeline is initially visible
    // Add a fallback to make timeline visible after timeout
    const safetyTimeout = setTimeout(() => {
        if (timelineSection.classList.contains('loading')) {
            console.log('Timeline safety timeout triggered - ensuring visibility');
            timelineSection.classList.remove('loading');
            timelineSection.classList.add('animate-in');
            
            // Also trigger animation start event
            const animationStartEvent = new CustomEvent('timeline:animation:start');
            timelineSection.dispatchEvent(animationStartEvent);
        }
    }, 2000); // Fallback after 2 seconds

    // Initially add loading state
    timelineSection.classList.add('loading');

    // Create observer for the timeline section
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When timeline enters viewport
                console.log('Timeline section is now visible in viewport');
                
                // Clear the safety timeout since observer triggered properly
                clearTimeout(safetyTimeout);
                
                // Remove loading state and add animation class
                timelineSection.classList.remove('loading');
                timelineSection.classList.add('animate-in');
                
                // Animate title and subtitle
                const timelineTitle = timelineSection.querySelector('.timeline-title');
                const timelineSubtitle = timelineSection.querySelector('.timeline-subtitle');
                
                if (timelineTitle) timelineTitle.classList.add('animate');
                if (timelineSubtitle) timelineSubtitle.classList.add('animate');
                
                // Trigger a custom event that other scripts can listen for
                const animationStartEvent = new CustomEvent('timeline:animation:start');
                timelineSection.dispatchEvent(animationStartEvent);
                
                // Disconnect after activation
                timelineObserver.disconnect();
            }
        });
    }, { 
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '100px 0px' // Extend detection area to trigger earlier
    });

    // Start observing
    timelineObserver.observe(timelineSection);

    /**
     * Setup individual timeline event observers
     * This creates a staggered animation effect as user scrolls through timeline
     */
    const setupItemObservers = () => {
        // Get all timeline events
        const timelineEvents = document.querySelectorAll('.timeline-event');
        if (!timelineEvents.length) {
            // If timeline events aren't ready yet, wait and try again
            setTimeout(setupItemObservers, 500);
            return;
        }

        console.log(`Found ${timelineEvents.length} timeline events to observe`);

        // Create observer for timeline events
        const eventObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add special animation class when event comes into view
                if (entry.isIntersecting) {
                    entry.target.classList.add('observed');
                    
                    // Create a staggered effect by adding a delay based on index
                    const index = parseInt(entry.target.getAttribute('data-index') || 0);
                    const delay = index * 150; // 150ms delay per item
                    
                    setTimeout(() => {
                        entry.target.classList.add('timeline-event-animate');
                    }, delay);
                    
                    // Optional: stop observing this element after animation
                    // eventObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.3, // Trigger when 30% of the item is visible
            rootMargin: '-50px 0px' // Trigger when item is 50px into the viewport
        });

        // Start observing each event
        timelineEvents.forEach(event => {
            eventObserver.observe(event);
        });
    };

    // Listen for the custom event from the timeline animation script
    timelineSection.addEventListener('timeline:animation:start', () => {
        console.log('Timeline animation start event received');
        setupItemObservers();
    });

    // Also attempt to set up observers after a reasonable delay
    // in case the timeline:animation:start event doesn't fire
    setTimeout(setupItemObservers, 1000);
}); 