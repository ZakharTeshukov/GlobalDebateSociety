/**
 * Mobile Menu functionality for Global Debate Society
 * Handles the mobile menu toggle, scroll locking, and accessibility
 * 
 * @version 1.1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarNav = document.querySelector('.navbar-nav');
    const body = document.body;
    
    // Calculate scrollbar width once
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    // Add index to menu items for staggered animation
    const menuItems = document.querySelectorAll('.navbar-nav li');
    menuItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Toggle active class on button and nav
            this.classList.toggle('active');
            navbarNav.classList.toggle('active');
            
            // Set aria-expanded for accessibility
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Lock/unlock scroll
            if (isExpanded) {
                lockScroll();
            } else {
                unlockScroll();
            }
        });
    }
    
    // Function to lock scroll
    function lockScroll() {
        // Store current scroll position
        const scrollY = window.scrollY;
        body.style.top = `-${scrollY}px`;
        body.classList.add('menu-open');
    }
    
    // Function to unlock scroll
    function unlockScroll() {
        body.classList.remove('menu-open');
        const scrollY = body.style.top;
        body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    // Close menu when clicking outside of it
    document.addEventListener('click', function(e) {
        if (mobileMenuBtn && 
            mobileMenuBtn.classList.contains('active') && 
            !navbarNav.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
            
            mobileMenuBtn.classList.remove('active');
            navbarNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', false);
            unlockScroll();
        }
    });
    
    // Close menu when clicking on a nav link (for mobile)
    const navLinks = document.querySelectorAll('.navbar-nav a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            if (window.innerWidth <= 768 && mobileMenuBtn.classList.contains('active')) {
                // Allow navigation to happen before closing menu
                setTimeout(() => {
                    mobileMenuBtn.classList.remove('active');
                    navbarNav.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', false);
                    unlockScroll();
                }, 10);
            }
        });
    });
    
    // Toggle dropdown menus on mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                
                // Close other open dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== this && otherToggle.parentElement.classList.contains('active')) {
                        otherToggle.parentElement.classList.remove('active');
                    }
                });
                
                this.parentElement.classList.toggle('active');
            }
        });
    });
    
    // Prevent clicks on dropdown menu items from closing the main menu
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navbarNav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', false);
                unlockScroll();
            }
            
            // Update scrollbar width
            const newScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.setProperty('--scrollbar-width', `${newScrollbarWidth}px`);
        }, 250);
    });
}); 