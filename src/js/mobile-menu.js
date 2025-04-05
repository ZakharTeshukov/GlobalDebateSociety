/**
 * Mobile Menu functionality for Global Debate Society
 * Handles the mobile menu toggle, overlay, and accessibility
 * 
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarNav = document.querySelector('.navbar-nav');
    const body = document.body;
    
    // Create overlay element for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    body.appendChild(overlay);
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle active class on button and nav
            this.classList.toggle('active');
            navbarNav.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Set aria-expanded for accessibility
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            if (isExpanded) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // Close menu when clicking on overlay
    overlay.addEventListener('click', function() {
        if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navbarNav.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', false);
            body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a nav link (for mobile)
    const navLinks = document.querySelectorAll('.navbar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navbarNav.classList.remove('active');
                overlay.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', false);
                body.style.overflow = '';
            }
        });
    });
    
    // Handle window resize to reset menu state
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navbarNav.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', false);
            body.style.overflow = '';
        }
    });
}); 