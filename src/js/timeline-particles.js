/**
 * Timeline Particles Animation
 * 
 * This script adds floating particle effects to the timeline section
 * to enhance the visual appeal of the timeline component.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if timeline section exists
    const timelineSection = document.querySelector('.timeline-section');
    if (!timelineSection) return;

    // Configuration
    const particlesConfig = {
        count: 0,          // Changed from 30 to 0 to remove particles
        colors: [           // Particle colors
            'rgba(var(--primary-color-rgb), 0.2)',
            'rgba(var(--secondary-color-rgb), 0.15)',
            'rgba(var(--accent-color-rgb), 0.1)'
        ],
        sizeRange: {        // Size range in pixels
            min: 3,
            max: 12
        },
        speedRange: {       // Speed range in pixels per second
            min: 0.3,
            max: 1.2
        },
        opacityRange: {     // Opacity range
            min: 0.1,
            max: 0.5
        },
        maxLifetime: 20,    // Maximum lifetime in seconds
    };

    // Particle class
    class Particle {
        constructor(container) {
            this.container = container;
            this.element = document.createElement('div');
            this.element.className = 'timeline-particle';
            this.reset(true);
            container.appendChild(this.element);
        }

        reset(isInitial = false) {
            // Set random size
            const size = Math.random() * (particlesConfig.sizeRange.max - particlesConfig.sizeRange.min) + particlesConfig.sizeRange.min;
            this.element.style.width = `${size}px`;
            this.element.style.height = `${size}px`;

            // Set random position
            const containerRect = this.container.getBoundingClientRect();
            this.x = Math.random() * containerRect.width;
            
            // If initial setup, distribute particles vertically
            if (isInitial) {
                this.y = Math.random() * containerRect.height;
            } else {
                // Otherwise start from the bottom
                this.y = containerRect.height + size;
            }

            // Set random speed
            this.speed = Math.random() * (particlesConfig.speedRange.max - particlesConfig.speedRange.min) + particlesConfig.speedRange.min;
            
            // Add some horizontal drift
            this.horizontalDrift = (Math.random() - 0.5) * 0.5;
            
            // Set random opacity
            this.opacity = Math.random() * (particlesConfig.opacityRange.max - particlesConfig.opacityRange.min) + particlesConfig.opacityRange.min;
            
            // Set random color
            const colorIndex = Math.floor(Math.random() * particlesConfig.colors.length);
            this.element.style.backgroundColor = particlesConfig.colors[colorIndex];
            
            // Apply styles
            this.element.style.opacity = this.opacity;
            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            
            // Add subtle scaling animation
            const animationDuration = 3 + Math.random() * 4;
            this.element.style.animation = `particle-pulse ${animationDuration}s infinite alternate ease-in-out`;
            
            // Reset lifetime
            this.lifetime = Math.random() * particlesConfig.maxLifetime;
        }

        update(deltaTime) {
            // Move up
            this.y -= this.speed * deltaTime * 60;
            
            // Apply horizontal drift using a sine wave for natural movement
            this.x += Math.sin(this.y * 0.01) * this.horizontalDrift * deltaTime * 60;
            
            // Update position
            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            
            // Update lifetime
            this.lifetime -= deltaTime;
            
            // If lifetime expired or out of bounds, reset
            const size = parseFloat(this.element.style.width);
            if (this.lifetime <= 0 || this.y < -size * 2) {
                this.reset();
                return true;
            }
            
            return false;
        }
    }

    // Set up particles
    const particles = [];
    const setupParticles = () => {
        if (particles.length > 0) {
            // Clear existing particles
            particles.forEach(particle => {
                particle.element.remove();
            });
            particles.length = 0;
        }

        // Create new particles
        for (let i = 0; i < particlesConfig.count; i++) {
            particles.push(new Particle(timelineSection));
        }
    };

    // Animation loop
    let lastTime = 0;
    const animate = (timestamp) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
        lastTime = timestamp;

        // Update particles
        particles.forEach(particle => {
            particle.update(deltaTime);
        });

        // Continue animation
        requestAnimationFrame(animate);
    };

    // Add CSS animation for particles
    const addParticleKeyframes = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particle-pulse {
                0% {
                    transform: translate(var(--x), var(--y)) scale(1);
                }
                100% {
                    transform: translate(var(--x), var(--y)) scale(1.5);
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize parallax effect for background elements
    const initParallax = () => {
        const timelineContainer = document.querySelector('.timeline-container');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            
            // Apply parallax to section background
            timelineSection.style.backgroundPosition = `0 ${scrolled * 0.05}px`;
            
            // Only do parallax if in viewport
            const rect = timelineSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                timelineContainer.style.transform = `translateY(${scrolled * 0.02}px)`;
            }
        });
    };

    // Initialize interactive nodes
    const initInteractiveNodes = () => {
        // Mouseover effect on timeline nodes
        document.addEventListener('mouseover', (event) => {
            const node = event.target.closest('.timeline-event-node');
            if (!node) return;
            
            // Create a ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'timeline-node-ripple';
            node.appendChild(ripple);
            
            // Remove after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    };

    // Initialize timeline section animations
    const initTimeline = () => {
        addParticleKeyframes();
        setupParticles();
        initParallax();
        initInteractiveNodes();
        
        // Start animation loop
        requestAnimationFrame(animate);
        
        // Initialize title animation
        const timelineTitle = document.querySelector('.timeline-title');
        const timelineSubtitle = document.querySelector('.timeline-subtitle');
        
        // Animate title when it enters viewport
        const observeTitle = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineTitle.classList.add('animate');
                    timelineSubtitle.classList.add('animate');
                    observeTitle.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        if (timelineTitle) {
            observeTitle.observe(timelineTitle);
        }
    };

    // Remove floating year labels functionality
    const initFloatingLabels = () => {
        // Function intentionally emptied
    };

    // Start all animations
    initTimeline();
    // Not initializing floating labels
    
    // Handle window resize
    window.addEventListener('resize', setupParticles);
}); 