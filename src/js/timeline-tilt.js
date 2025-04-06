/**
 * Timeline 3D Tilt Effect
 * 
 * This script adds a subtle 3D tilt effect to timeline cards
 * when users hover over them, enhancing the interactive experience.
 * 
 * FEATURES:
 * - 3D rotation based on mouse position
 * - Shine/reflection effect that follows the mouse
 * - Click animations for timeline nodes and cards
 * - Accessibility support via prefers-reduced-motion
 * - Mobile responsive behavior
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if timeline section exists
    const timelineSection = document.querySelector('.timeline-section');
    if (!timelineSection) {
        console.error('Timeline section not found for tilt effect');
        return;
    }

    console.log('Initializing timeline tilt effects');

    // Configuration
    const tiltConfig = {
        maxRotation: 5, // Maximum rotation in degrees
        perspective: 1000, // CSS perspective value
        transitionSpeed: 400, // Transition speed in ms
        scale: 1.03, // Scale factor on hover
        disableOnMobile: true, // Disable on mobile devices
        mobileWidth: 768 // Max width to be considered mobile
    };

    // Check if we should disable tilt on this device
    const shouldDisableTilt = () => {
        // Check if it's a mobile device
        if (tiltConfig.disableOnMobile && window.innerWidth <= tiltConfig.mobileWidth) {
            console.log('Tilt effect disabled on mobile device');
            return true;
        }
        
        // Check if device has limited motion capabilities
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Tilt effect disabled due to reduced motion preference');
            return true;
        }
        
        return false;
    };

    // Initialize tilt effect
    const initTiltEffect = () => {
        // If tilt should be disabled, exit early
        if (shouldDisableTilt()) return;
        
        console.log('Setting up tilt effect for timeline cards');
        
        // Function to handle mouse movement over timeline events
        const handleMouseMove = (event) => {
            // Find the closest timeline event content
            const contentCard = event.target.closest('.timeline-event-content');
            if (!contentCard) return;
            
            // Get the active state of the parent event
            const isActive = contentCard.closest('.timeline-event-active');
            if (!isActive) return;
            
            // Get dimensions
            const rect = contentCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate distance from center (normalized from -1 to 1)
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            
            const normalizedX = (mouseX - centerX) / (rect.width / 2);
            const normalizedY = (mouseY - centerY) / (rect.height / 2);
            
            // Calculate rotation (invert Y for natural feel)
            const rotateY = normalizedX * tiltConfig.maxRotation;
            const rotateX = -normalizedY * tiltConfig.maxRotation;
            
            // Apply the rotation using CSS variables
            contentCard.style.setProperty('--rotateX', `${rotateX}deg`);
            contentCard.style.setProperty('--rotateY', `${rotateY}deg`);
            contentCard.classList.add('tilted');
            
            // Add subtle scale effect
            contentCard.style.transform = `perspective(${tiltConfig.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${tiltConfig.scale})`;
            
            // Add light reflection effect
            const shine = contentCard.querySelector('.shine-effect') || createShineEffect(contentCard);
            
            // Position the shine based on mouse position
            const shineX = (normalizedX + 1) / 2 * 100;
            const shineY = (normalizedY + 1) / 2 * 100;
            shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 80%)`;
        };
        
        // Function to handle mouse exit from timeline events
        const handleMouseLeave = (event) => {
            const contentCard = event.target.closest('.timeline-event-content');
            if (!contentCard) return;
            
            // Reset rotation
            contentCard.style.setProperty('--rotateX', '0deg');
            contentCard.style.setProperty('--rotateY', '0deg');
            contentCard.classList.remove('tilted');
            
            // Reset scale with transition
            contentCard.style.transform = '';
            
            // Hide shine effect
            const shine = contentCard.querySelector('.shine-effect');
            if (shine) shine.style.opacity = '0';
        };
        
        // Create shine effect element for a card
        const createShineEffect = (card) => {
            // If already has shine effect, return it
            const existingShine = card.querySelector('.shine-effect');
            if (existingShine) return existingShine;
            
            // Create new shine effect
            const shine = document.createElement('div');
            shine.className = 'shine-effect';
            shine.style.position = 'absolute';
            shine.style.top = '0';
            shine.style.left = '0';
            shine.style.right = '0';
            shine.style.bottom = '0';
            shine.style.borderRadius = 'inherit';
            shine.style.pointerEvents = 'none';
            shine.style.opacity = '0';
            shine.style.transition = 'opacity 0.3s ease';
            shine.style.zIndex = '2'; // Ensure it's above the content but below any clickable elements
            card.appendChild(shine);
            
            // Show shine with slight delay
            setTimeout(() => {
                shine.style.opacity = '1';
            }, 50);
            
            return shine;
        };
        
        // Add click effect
        const handleCardClick = (event) => {
            const contentCard = event.target.closest('.timeline-event-content');
            if (!contentCard) return;
            
            // Add a quick pulse animation
            contentCard.classList.add('card-clicked');
            
            // Remove the class after animation
            setTimeout(() => {
                contentCard.classList.remove('card-clicked');
            }, 300);
        };
        
        // Add node click effect
        const handleNodeClick = (event) => {
            const node = event.target.closest('.timeline-event-node');
            if (!node) return;
            
            // Add clicked class for animation
            node.classList.add('clicked');
            
            // Remove after animation completes
            setTimeout(() => {
                node.classList.remove('clicked');
            }, 600);
        };
        
        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave, true); // Capture phase
        document.addEventListener('click', handleCardClick);
        document.addEventListener('click', handleNodeClick);
        
        console.log('Timeline tilt effect event listeners attached');
        
        // Add CSS for card click effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes card-click-pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb), 0.7);
                    transform: scale(1);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(var(--primary-color-rgb), 0);
                    transform: scale(0.98);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb), 0);
                    transform: scale(1);
                }
            }
            
            .card-clicked {
                animation: card-click-pulse 0.3s forwards;
            }
            
            .shine-effect {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                border-radius: inherit;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
        console.log('Timeline tilt effect CSS styles added');
    };

    // Initialize tilt effect when timeline is ready
    timelineSection.addEventListener('timeline:animation:start', () => {
        console.log('Timeline animation start event received in tilt.js');
        initTiltEffect();
    });
    
    // Also initialize after a delay in case the event doesn't fire
    setTimeout(() => {
        console.log('Fallback timer for tilt effect initialization');
        initTiltEffect();
    }, 2000);
    
    // Reinitialize on resize to handle orientation changes
    window.addEventListener('resize', () => {
        // Only re-initialize if we're crossing the mobile breakpoint
        const wasMobile = window.innerWidth <= tiltConfig.mobileWidth;
        setTimeout(() => {
            const isMobile = window.innerWidth <= tiltConfig.mobileWidth;
            if (wasMobile !== isMobile) {
                console.log('Screen size changed, reinitializing tilt effect');
                initTiltEffect();
            }
        }, 100);
    });
}); 