/**
 * Global Debate Society - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  // Set current active link in navigation
  setActiveNavLink();

  // Initialize tooltips if any
  initializeTooltips();

  // Back to top button functionality
  handleBackToTop();

  // Update copyright year
  updateCopyright();

  // Handle navbar scroll behavior
  handleNavbarScroll();

  // Animate elements on scroll if they have the class
  animateOnScroll();

  // Initialize smooth scrolling for anchor links
  initSmoothScrolling();

  // Update join buttons
  updateJoinButtons();

  // Immediately animate hero section on page load
  setTimeout(() => {
    document.querySelector('.hero-content')?.classList.add('animate');
  }, 100);

  // Initialize scroll animations
  initScrollAnimations();
});

/**
 * Sets the active navigation link based on current page
 */
function setActiveNavLink() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');

    // Check for exact match or homepage
    if (currentPage.endsWith(href) || (currentPage.endsWith('/') && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initializes tooltips on elements with data-tooltip attribute
 */
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  tooltipElements.forEach((element) => {
    element.addEventListener('mouseenter', function () {
      const tooltipText = this.getAttribute('data-tooltip');

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;

      document.body.appendChild(tooltip);

      const elementRect = this.getBoundingClientRect();
      tooltip.style.top = `${elementRect.top - tooltip.offsetHeight - 10}px`;
      tooltip.style.left = `${elementRect.left + elementRect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.opacity = '1';

      this.addEventListener(
        'mouseleave',
        function () {
          document.body.removeChild(tooltip);
        },
        { once: true }
      );
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
        behavior: 'smooth',
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Initialize animations that trigger on scroll
 * Only trigger animations on first scroll through the page
 */
function initScrollAnimations() {
  // Store if the user has already scrolled
  let hasScrolled = false;

  // Store if we've already animated sections
  let animatedSections = {
    features: false,
    events: false,
    testimonials: false,
    blog: false,
    cta: false,
  };

  // Only animate each section once until page reload
  window.addEventListener('scroll', function () {
    // Set that user has scrolled
    hasScrolled = true;

    // Get scroll position
    const scrollPosition = window.scrollY + window.innerHeight * 0.8;

    // Animate features section
    if (!animatedSections.features) {
      const featuresSection = document.querySelector('.features');
      if (featuresSection && featuresSection.offsetTop < scrollPosition) {
        document.querySelector('.features .section-title')?.classList.add('animate');

        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, 200 * index); // Stagger animation
        });

        animatedSections.features = true;
      }
    }

    // Animate events section
    if (!animatedSections.events) {
      const eventsSection = document.querySelector('.upcoming-events');
      if (eventsSection && eventsSection.offsetTop < scrollPosition) {
        document.querySelector('.upcoming-events .section-title')?.classList.add('animate');

        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, 200 * index); // Stagger animation
        });

        animatedSections.events = true;
      }
    }

    // Animate testimonials section
    if (!animatedSections.testimonials) {
      const testimonialsSection = document.querySelector('.testimonials');
      if (testimonialsSection && testimonialsSection.offsetTop < scrollPosition) {
        document.querySelector('.testimonials .section-title')?.classList.add('animate');

        const testimonialItems = document.querySelectorAll('.testimonial-item');
        testimonialItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate');
          }, 200 * index); // Stagger animation
        });

        animatedSections.testimonials = true;
      }
    }

    // Animate blog section
    if (!animatedSections.blog) {
      const blogSection = document.querySelector('.latest-blog');
      if (blogSection && blogSection.offsetTop < scrollPosition) {
        document.querySelector('.latest-blog .section-title')?.classList.add('animate');

        const blogCards = document.querySelectorAll('.blog-card-small');
        blogCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, 200 * index); // Stagger animation
        });

        animatedSections.blog = true;
      }
    }

    // Animate CTA section
    if (!animatedSections.cta) {
      const ctaSection = document.querySelector('.cta-section');
      if (ctaSection && ctaSection.offsetTop < scrollPosition) {
        document.querySelector('.cta-content')?.classList.add('animate');
        animatedSections.cta = true;
      }
    }

    // Check if all sections have been animated
    const allAnimated = Object.values(animatedSections).every((value) => value === true);
    if (allAnimated) {
      // Remove scroll listener if all sections are animated
      window.removeEventListener('scroll', arguments.callee);
    }
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
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Form Validation
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach((field) => {
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  };

  animateOnScroll();

  // Add active class to current navigation item
  const setActiveNavItem = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach((link) => {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
  document.querySelectorAll('form').forEach((form) => {
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

  input.addEventListener(
    'input',
    () => {
      error.remove();
      input.classList.remove('error');
    },
    { once: true }
  );
}

function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Update all "Join Us" links to "Join" with orange button styling
function updateJoinButtons() {
  // Find all links that point to join.html
  const joinLinks = document.querySelectorAll('a[href*="join.html"]');

  joinLinks.forEach((link) => {
    // Update text content if it contains "Join Us"
    if (link.textContent.includes('Join Us')) {
      link.textContent = 'Join';
    }

    // Add the btn-join class if it doesn't already have it
    if (!link.classList.contains('btn-join')) {
      link.classList.add('btn-join');
    }
  });
}

// Add this new function for navbar scroll behavior
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down & past threshold
      navbar.classList.add('hide');
    } else {
      // Scrolling up or at top
      navbar.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Performance optimizations
 *
 * These optimizations are designed to improve page loading speed and responsiveness.
 */

// Import lazy loading functions if using ES modules
// If not using ES modules, functions will be available globally from lazy-loading.js
try {
  // Try to import the modules
  import('./lazy-loading.js')
    .then((module) => {
      // Store the functions for later use
      window.lazyLoadImages = module.lazyLoadImages;
      window.convertExistingImagesToLazyLoad = module.convertExistingImagesToLazyLoad;
    })
    .catch((err) => {
      console.log('Module import not supported or module not found');
    });
} catch (e) {
  // If import() is not supported, the functions should be globally available
  console.log('Using global lazy loading functions');
}

/**
 * Apply performance optimizations
 */
function applyPerformanceOptimizations() {
  // Add rel=preconnect for external domains
  addPreconnect('https://fonts.googleapis.com');
  addPreconnect('https://fonts.gstatic.com', true);
  addPreconnect('https://cdnjs.cloudflare.com');

  // Apply lazy loading for images that load after initial page load
  document.addEventListener('DOMContentLoaded', () => {
    // Use the global function if available
    if (typeof convertExistingImagesToLazyLoad === 'function') {
      // Wait for critical content to load first
      setTimeout(convertExistingImagesToLazyLoad, 1000);
    }
  });

  // Re-trigger lazy loading when content changes dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if new nodes contain images
        const hasNewImages = Array.from(mutation.addedNodes).some(
          (node) => node.nodeName === 'IMG' || (node.nodeType === 1 && node.querySelector('img'))
        );

        if (hasNewImages && typeof lazyLoadImages === 'function') {
          lazyLoadImages();
        }
      }
    });
  });

  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Add preconnect links to the document head
 */
function addPreconnect(url, crossorigin = false) {
  if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    if (crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }
}

// Apply performance optimizations
applyPerformanceOptimizations();
