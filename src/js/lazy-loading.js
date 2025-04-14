/**
 * Lazy Loading Implementation for Global Debate Society
 * 
 * This script implements lazy loading for images across the website to improve 
 * performance and reduce initial load times.
 */

document.addEventListener('DOMContentLoaded', () => {
    const lazyLoadImages = () => {
        // Use Intersection Observer API to detect when images enter viewport
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    // Only load images that are intersecting (visible)
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Replace data-src with src
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Replace data-srcset with srcset if available
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        
                        // Add loaded class for potential animations
                        img.classList.add('loaded');
                        
                        // Stop observing the image once it's loaded
                        observer.unobserve(img);
                    }
                });
            }, {
                // Root margin provides a buffer, so images start loading just before they become visible
                rootMargin: '0px 0px 200px 0px',
                threshold: 0.01
            });
            
            // Get all images that have a data-src attribute
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                // Add placeholder class
                img.classList.add('lazy-placeholder');
                // Start observing the image
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            const lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                const lazyImages = document.querySelectorAll('img[data-src]');
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop + 500) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        img.removeAttribute('data-src');
                        img.removeAttribute('data-srcset');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoadCallback);
                    window.removeEventListener('resize', lazyLoadCallback);
                    window.removeEventListener('orientationChange', lazyLoadCallback);
                }
            }, 20);
        }
    };
    
    // Run lazy loading on page load
    lazyLoadImages();
    
    /**
     * Function to convert existing images to lazy loaded images
     * This allows for retrofitting existing img tags without manually updating the HTML
     */
    const convertExistingImagesToLazyLoad = () => {
        // Skip svg images and already processed images
        const images = document.querySelectorAll('img:not([data-src]):not([src*=".svg"])');
        
        images.forEach(img => {
            // Save the original src
            const src = img.getAttribute('src');
            if (src && !img.classList.contains('loaded') && !img.complete) {
                // Set a low-quality placeholder or transparent pixel
                img.setAttribute('data-src', src);
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                img.classList.add('lazy-placeholder');
            }
        });
        
        // Re-run the lazy loading to catch newly converted images
        lazyLoadImages();
    };
    
    // Convert existing images after a short delay to allow critical images to load
    setTimeout(convertExistingImagesToLazyLoad, 500);
    
    // Add CSS for lazy loading animations
    const style = document.createElement('style');
    style.textContent = `
        .lazy-placeholder {
            opacity: 0;
            transition: opacity 0.3s;
        }
        img.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Export functions for use in other modules
export { lazyLoadImages, convertExistingImagesToLazyLoad }; 