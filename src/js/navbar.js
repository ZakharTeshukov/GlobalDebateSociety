/**
 * Global Debate Society - Navbar functionality
 * Handles mobile menu toggle and sticky navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarNav = document.querySelector('.navbar-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarNav.classList.toggle('active');
            
            // Create overlay if it doesn't exist
            if (!menuOverlay) {
                const overlay = document.createElement('div');
                overlay.className = 'menu-overlay';
                document.body.appendChild(overlay);
                
                // Add click event to close menu when overlay is clicked
                overlay.addEventListener('click', function() {
                    mobileMenuBtn.classList.remove('active');
                    navbarNav.classList.remove('active');
                    this.classList.remove('active');
                });
            } else {
                menuOverlay.classList.toggle('active');
            }
            
            // Prevent scrolling when menu is open
            if (this.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.classList.remove('active');
                navbarNav.classList.remove('active');
                
                if (menuOverlay) {
                    menuOverlay.classList.remove('active');
                }
                
                document.body.style.overflow = '';
            }
        });
    });
    
    // Sticky navbar on scroll
    let scrollPosition = window.scrollY;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        scrollPosition = window.scrollY;
        
        if (scrollPosition > scrollThreshold) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if the current page matches the link's href
        if (currentPage.endsWith(linkPath) || 
            (currentPage.endsWith('/') && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile menu state when window is resized to desktop
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
            if (navbarNav) {
                navbarNav.classList.remove('active');
            }
            if (menuOverlay) {
                menuOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
}); 