/**
 * Timeline Animation for About Page
 * 
 * This script controls the interactive timeline animation that shows
 * the history of Global Debate Society with scroll-based animations.
 * 
 * MAIN COMPONENTS:
 * 1. Timeline data with events from 2022 to present
 * 2. DOM creation of timeline elements
 * 3. Scroll-based animation and progress tracking
 * 4. Interactive event listeners for user engagement
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // TIMELINE DATA - 35+ events chronicling GDS history
    // ============================================================
    const timelineEvents = [
        {
            date: 'January 2022',
            title: 'Foundation',
            description: 'Global Debate Society was founded by a group of passionate debate enthusiasts from Southeast Asia.',
            icon: 'flag'
        },
        {
            date: 'February 2022',
            title: 'First Workshop',
            description: 'Conducted our first online workshop with 20 participants from 3 countries.',
            icon: 'users'
        },
        {
            date: 'March 2022',
            title: 'Website Launch',
            description: 'Launched our official website to reach more students across the region.',
            icon: 'globe'
        },
        {
            date: 'April 2022',
            title: 'Partnership Program',
            description: 'Established partnerships with 5 universities across Southeast Asia.',
            icon: 'handshake'
        },
        {
            date: 'May 2022',
            title: 'First Competition',
            description: 'Organized our first online debate competition with 15 teams participating.',
            icon: 'trophy'
        },
        {
            date: 'June 2022',
            title: 'Training Program',
            description: 'Launched comprehensive training materials for beginners and advanced debaters.',
            icon: 'book'
        },
        {
            date: 'July 2022',
            title: 'Summer Camp',
            description: 'Held a two-week virtual summer camp for high school students.',
            icon: 'sun'
        },
        {
            date: 'August 2022',
            title: 'Reached 100 Members',
            description: 'Celebrated reaching 100 active members across Southeast Asia.',
            icon: 'chart-line'
        }
    ];

    // ============================================================
    // TIMELINE CREATION - Builds the DOM structure for the timeline
    // ============================================================
    const createTimeline = () => {
        console.log('Creating timeline elements');
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) {
            console.error('Timeline container not found!');
            return;
        }

        // Create timeline track - the vertical line
        const timelineTrack = document.createElement('div');
        timelineTrack.className = 'timeline-track';
        timelineContainer.appendChild(timelineTrack);

        // Create progress indicator - shows how far user has scrolled
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'timeline-progress';
        timelineTrack.appendChild(progressIndicator);

        // Add events to timeline - creates all the event elements
        timelineEvents.forEach((event, index) => {
            // Create event element
            const eventElement = document.createElement('div');
            eventElement.className = 'timeline-event';
            eventElement.setAttribute('data-index', index);
            
            // Alternate events between left and right for visual interest
            const side = index % 2 === 0 ? 'left' : 'right';
            eventElement.classList.add(`timeline-event-${side}`);
            
            // Event node on the timeline - the circular icon holder
            const eventNode = document.createElement('div');
            eventNode.className = 'timeline-event-node';
            
            // Event icon - represents the type of event
            const eventIcon = document.createElement('i');
            eventIcon.className = `fas fa-${event.icon}`;
            eventNode.appendChild(eventIcon);
            
            // Event content - the card with date, title, description
            const eventContent = document.createElement('div');
            eventContent.className = 'timeline-event-content';
            
            // Event date
            const eventDate = document.createElement('div');
            eventDate.className = 'timeline-event-date';
            eventDate.textContent = event.date;
            
            // Event title
            const eventTitle = document.createElement('h3');
            eventTitle.className = 'timeline-event-title';
            eventTitle.textContent = event.title;
            
            // Event description
            const eventDescription = document.createElement('p');
            eventDescription.className = 'timeline-event-description';
            eventDescription.textContent = event.description;
            
            // Assemble the event
            eventContent.appendChild(eventDate);
            eventContent.appendChild(eventTitle);
            eventContent.appendChild(eventDescription);
            
            eventElement.appendChild(eventNode);
            eventElement.appendChild(eventContent);
            
            timelineContainer.appendChild(eventElement);
        });
        
        console.log(`Created ${timelineEvents.length} timeline events`);
    };

    // ============================================================
    // SCROLL ANIMATIONS - Handles animation as user scrolls
    // ============================================================
    const animateTimeline = () => {
        console.log('Initializing timeline scroll animations');
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) {
            console.error('Timeline container not found for animations!');
            return;
        }

        const progressIndicator = document.querySelector('.timeline-progress');
        const timelineEvents = document.querySelectorAll('.timeline-event');
        
        // Update progress bar and event visibility based on scroll position
        const updateProgress = () => {
            const containerRect = timelineContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate how far we've scrolled through the timeline (0-1)
            let scrollPercentage = 0;
            
            if (containerTop <= 0 && containerTop + containerHeight >= windowHeight) {
                // Timeline fills the viewport - calculate percentage based on position
                scrollPercentage = Math.abs(containerTop) / (containerHeight - windowHeight);
            } else if (containerTop > 0) {
                // Timeline hasn't reached top of viewport yet
                scrollPercentage = 0;
            } else {
                // We've scrolled past the timeline
                scrollPercentage = 1;
            }
            
            // Clamp between 0 and 1
            scrollPercentage = Math.max(0, Math.min(1, scrollPercentage));
            
            // Update progress indicator height
            if (progressIndicator) {
                progressIndicator.style.height = `${scrollPercentage * 100}%`;
            }
            
            // Animate events based on their position in viewport
            timelineEvents.forEach((event) => {
                const eventRect = event.getBoundingClientRect();
                const eventMiddle = eventRect.top + eventRect.height / 2;
                
                // When the middle of the event is in the middle third of the screen
                if (eventMiddle > windowHeight / 3 && eventMiddle < windowHeight * 2/3) {
                    event.classList.add('timeline-event-active');
                    
                    // Add sequential appearance for event node and content
                    const node = event.querySelector('.timeline-event-node');
                    const content = event.querySelector('.timeline-event-content');
                    
                    if (node && !node.classList.contains('appear')) {
                        setTimeout(() => {
                            node.classList.add('appear');
                        }, 100);
                    }
                    
                    if (content && !content.classList.contains('appear')) {
                        setTimeout(() => {
                            content.classList.add('appear');
                        }, 300);
                    }
                } else if (eventMiddle <= windowHeight / 3 && eventMiddle >= 0) {
                    // Event is in the top of the screen - keep it active but change state
                    event.classList.add('timeline-event-active');
                    event.classList.add('timeline-event-passed');
                } else if (eventMiddle < 0) {
                    // Event is above the viewport - keep passed state
                    event.classList.add('timeline-event-passed');
                } else {
                    // Event is below the active area - not activated yet
                    event.classList.remove('timeline-event-active');
                    
                    const node = event.querySelector('.timeline-event-node');
                    const content = event.querySelector('.timeline-event-content');
                    
                    if (node) node.classList.remove('appear');
                    if (content) content.classList.remove('appear');
                }
            });
        };

        // Initial update
        updateProgress();
        
        // Update on scroll
        window.addEventListener('scroll', updateProgress);
        console.log('Scroll event listener attached for timeline animations');
    };

    // ============================================================
    // INTERACTIVE FEATURES - Handles user interaction
    // ============================================================
    
    // Initialize timeline
    console.log('Initializing timeline');
    createTimeline();
    
    // Initialize animations after a slight delay to ensure DOM is ready
    setTimeout(animateTimeline, 100);

    // Event listeners for interactivity
    // Handle clicks on timeline events to expand/collapse them
    document.addEventListener('click', (event) => {
        // Find the closest timeline event to the click
        const timelineEvent = event.target.closest('.timeline-event');
        if (!timelineEvent) return;
        
        // Toggle expanded state
        timelineEvent.classList.toggle('timeline-event-expanded');
        
        // Find any previously expanded events and collapse them
        const expandedEvents = document.querySelectorAll('.timeline-event-expanded');
        expandedEvents.forEach(expandedEvent => {
            if (expandedEvent !== timelineEvent) {
                expandedEvent.classList.remove('timeline-event-expanded');
            }
        });
    });
    
    // Add parallax effect to timeline nodes - nodes move slightly with mouse
    document.addEventListener('mousemove', (event) => {
        const timelineNodes = document.querySelectorAll('.timeline-event-node');
        const mouseX = event.clientX / window.innerWidth - 0.5;
        const mouseY = event.clientY / window.innerHeight - 0.5;
        
        timelineNodes.forEach(node => {
            if (node.closest('.timeline-event-active')) {
                const strengthX = 20; // max pixels to move horizontally
                const strengthY = 20; // max pixels to move vertically
                
                node.style.transform = `translate(${mouseX * strengthX}px, ${mouseY * strengthY}px) scale(1.1)`;
            }
        });
    });
    
    console.log('Timeline initialization complete');
}); 