export function initMobileNav() {
  // Elements common to both mobile drawer and desktop navbar
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav');
  const navbarNav = document.querySelector('.navbar-nav');
  const body = document.body;

  // Overlay element – create on-the-fly if it does not already exist
  let overlay = document.querySelector('.mobile-nav-overlay') || document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);
  }

  // Dedicated close button for side-drawer (optional)
  const mobileNavCloseBtn = document.querySelector('.mobile-nav-close-btn');

  /* ----------------- Helper functions ----------------- */
  const openNav = () => {
    // Drawer based nav (side panel)
    mobileDrawer?.classList.add('active');
    // Standard navbar list (collapse style)
    navbarNav?.classList.add('active');

    overlay.classList.add('active');
    body.classList.add('mobile-nav-open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    // Prevent background scrolling
    body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    mobileDrawer?.classList.remove('active');
    navbarNav?.classList.remove('active');

    overlay.classList.remove('active');
    body.classList.remove('mobile-nav-open');

    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    body.style.overflow = '';
  };

  /* ----------------- Event wiring ----------------- */
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (body.classList.contains('mobile-nav-open') || navbarNav?.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener('click', closeNav);
  }

  overlay.addEventListener('click', closeNav);

  // Close nav when a link inside either drawer or collapsed list is clicked
  const linkSelector = '.mobile-nav-links a, .navbar-nav a';
  document.querySelectorAll(linkSelector).forEach((link) => {
    link.addEventListener('click', () => {
      // Slight delay allows browser to initiate navigation first
      setTimeout(closeNav, 100);
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (body.classList.contains('mobile-nav-open') || navbarNav?.classList.contains('active'))) {
      closeNav();
    }
  });

  /* ------------- Mobile dropdown toggle ------------- */
  const dropdownToggles = document.querySelectorAll('.navbar-dropdown .dropdown-toggle');
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = toggle.closest('.navbar-dropdown');
        parent?.classList.toggle('active');
      }
    });
  });

  /* ------------- Highlight current page ------------- */
  highlightCurrentPageNav();

  /**
   * Highlights the current page in the navigation using data-page attributes
   */
  function highlightCurrentPageNav() {
    const navLinks = document.querySelectorAll('.navbar-nav a, .mobile-nav-links a');
    navLinks.forEach((link) => link.classList.remove('active'));

    const path = window.location.pathname;
    let currentPage = 'home';
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

    const activeLink = document.querySelector(`a[data-page="${currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
} 