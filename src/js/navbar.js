/**
 * Global Debate Society - Navbar functionality
 * Handles mobile menu toggle and active page highlighting
 */

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarNav = document.querySelector('.navbar-nav');
  const menuOverlay = document.querySelector('.menu-overlay');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar-nav a');

  // Set active navigation link
  highlightCurrentPageNav();

  // Toggle mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      navbarNav.classList.toggle('active');

      // Create overlay if it doesn't exist
      if (!menuOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);

        // Add click event to close menu when overlay is clicked
        overlay.addEventListener('click', function () {
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
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
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

  // Dropdown toggle for mobile
  const dropdownToggles = document.querySelectorAll('.navbar-dropdown .dropdown-toggle');
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.closest('.navbar-dropdown');
        parent.classList.toggle('active');
      }
    });
  });
});

/**
 * Highlights the current page in the navigation using data-page attributes
 * This is a simpler and more reliable approach than URL matching
 */
function highlightCurrentPageNav() {
  // First, remove all active classes
  const navLinks = document.querySelectorAll('.navbar-nav a');
  navLinks.forEach((link) => link.classList.remove('active'));

  // Get the current page path for simple matching
  const path = window.location.pathname;

  // Determine which page we're on
  let currentPage = 'home'; // Default to home

  if (path.includes('/about/')) {
    currentPage = 'about';
  } else if (path.includes('/events/')) {
    currentPage = 'events';
  } else if (path.includes('/resources/')) {
    currentPage = 'resources';
  } else if (path.includes('/join/')) {
    currentPage = 'join';
  } else if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
    currentPage = 'home';
  }

  // Find the link with matching data-page attribute
  const activeLink = document.querySelector(`.navbar-nav a[data-page="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}
