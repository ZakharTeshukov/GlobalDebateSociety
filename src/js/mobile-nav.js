/* src/js/mobile-nav.js */

/**
 * New Mobile Navigation System for Global Debate Society
 *
 * Handles the functionality for the revamped mobile navigation system.
 * This includes opening/closing the nav, handling the overlay, and body scroll lock.
 */

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavCloseBtn = document.querySelector('.mobile-nav-close-btn');
  const body = document.body;

  const openMobileNav = () => {
    body.classList.add('mobile-nav-open');
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMobileNav = () => {
    body.classList.remove('mobile-nav-open');
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (body.classList.contains('mobile-nav-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  // Close nav on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('mobile-nav-open')) {
      closeMobileNav();
    }
  });

  // Close nav when a link is clicked
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (body.classList.contains('mobile-nav-open')) {
        // Add a small delay to allow navigation to start
        setTimeout(closeMobileNav, 100);
      }
    });
  });
});
