/**
 * Global Debate Society - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current active link in navigation
    setActiveNavLink();
    
    // Add box shadow to navbar on scroll
    handleNavbarScroll();
    
    // Initialize tooltips if any
    initializeTooltips();
    
    // Back to top button functionality
    handleBackToTop();
    
    // Update copyright year
    updateCopyright();
    
    // Animate elements on scroll if they have the class
    animateOnScroll();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
});

/**
 * Sets the active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check for exact match or homepage
        if (currentPage.endsWith(href) || 
            (currentPage.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Adds shadow to navbar on scroll
 */
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

/**
 * Initializes tooltips on elements with data-tooltip attribute
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const elementRect = this.getBoundingClientRect();
            tooltip.style.top = `${elementRect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${elementRect.left + (elementRect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.opacity = '1';
            
            this.addEventListener('mouseleave', function() {
                document.body.removeChild(tooltip);
            }, { once: true });
        });
    });
}

/**
 * Back to top button functionality
 */
function handleBackToTop() {
    // Create back to top button if it doesn't exist
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide button based on scroll position
    const scrollThreshold = 300;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

/**
 * Updates copyright year in footer
 */
function updateCopyright() {
    const copyright = document.querySelector('.footer-bottom p');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.textContent = `© ${year} Global Debate Society. All rights reserved.`;
    }
}

/**
 * Animates elements when they scroll into view
 */
function animateOnScroll() {
    // Add .animate-fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileNavToggle = () => {
        const nav = document.querySelector('.nav-links');
        const navHeight = nav.scrollHeight;

        if (window.innerWidth <= 768) {
            if (nav.style.maxHeight) {
                nav.style.maxHeight = null;
            } else {
                nav.style.maxHeight = navHeight + 'px';
            }
        }
    };

    // Add mobile nav toggle button
    const header = document.querySelector('header');
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-nav-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.addEventListener('click', mobileNavToggle);

    if (window.innerWidth <= 768) {
        header.querySelector('.main-nav').appendChild(mobileToggle);
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Sticky Header
    const stickyHeader = () => {
        const header = document.querySelector('header');
        const scrollPosition = window.scrollY;

        if (scrollPosition > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', stickyHeader);

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Create or update error message
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                    errorMessage.textContent = `${field.getAttribute('placeholder') || 'This field'} is required`;
                } else {
                    field.classList.remove('error');
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // Intersection Observer for Animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    animateOnScroll();

    // Add active class to current navigation item
    const setActiveNavItem = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    setActiveNavItem();

    // Handle form submissions
    const handleFormSubmit = async (form) => {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Your message has been sent successfully!';
            form.insertBefore(successMessage, form.firstChild);

            // Reset form
            form.reset();

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);

        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-error';
            errorMessage.textContent = 'An error occurred. Please try again later.';
            form.insertBefore(errorMessage, form.firstChild);

        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    };

    // Add form submission handlers
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleFormSubmit(form);
        });
    });

    // Window resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset mobile navigation
            const nav = document.querySelector('.nav-links');
            if (window.innerWidth > 768) {
                nav.style.maxHeight = null;
                const mobileToggle = document.querySelector('.mobile-nav-toggle');
                if (mobileToggle) {
                    mobileToggle.remove();
                }
            } else {
                const mobileToggle = document.querySelector('.mobile-nav-toggle');
                if (!mobileToggle) {
                    header.querySelector('.main-nav').appendChild(mobileToggle);
                }
            }
        }, 250);
    });
});

// Form validation (if contact form exists)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const name = contactForm.querySelector('input[name="name"]');
        const email = contactForm.querySelector('input[name="email"]');
        const message = contactForm.querySelector('textarea[name="message"]');
        
        let isValid = true;
        
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        }
        
        if (isValid) {
            // Here you would typically send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        }
    });
}

// Helper functions
function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.classList.add('error');
    
    input.addEventListener('input', () => {
        error.remove();
        input.classList.remove('error');
    }, { once: true });
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
} 