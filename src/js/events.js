document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Hero scroll button for Events page
  const scrollButton = document.getElementById('scrollToEventsContent');
  const targetSection = document.getElementById('main-events-content');

  if (scrollButton && targetSection) {
    scrollButton.addEventListener('click', () => {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  // Calendar Initialization
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth',
      googleCalendarApiKey: 'AIzaSyB0KhMJx1WNE4HhReQoxdc3rl-pXSLTGNk',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listMonth',
      },
      events: {
        googleCalendarId:
          'c6291aceb5ef7e85faa2d3709b757c3f54ef683b7da7ca1d77a3046b40391568@group.calendar.google.com',
      },
      height: 'auto',
      windowResize: function () {
        if (window.innerWidth < 768) {
          calendar.changeView('listMonth');
          calendar.setOption('headerToolbar', {
            left: 'prev,next',
            center: 'title',
            right: 'today',
          });
        } else {
          calendar.changeView('dayGridMonth');
          calendar.setOption('headerToolbar', {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listMonth',
          });
        }
      },
      eventClassNames: function (arg) {
        const categories = arg.event.extendedProps.categories;
        if (categories) {
          return categories.map((cat) => `event-${cat.toLowerCase()}`);
        }
        return [];
      },
      eventClick: function (info) {
        showEventDetails(info.event);
      },
    });
    calendar.render();
  }

  // Event Details Modal
  function showEventDetails(event) {
    const modal = document.createElement('div');
    modal.className = 'event-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <h3>${event.title}</h3>
            <p><i class="fas fa-calendar"></i> ${formatDate(event.start)}</p>
            ${event.end ? `<p><i class="fas fa-clock"></i> ${formatDate(event.start)} - ${formatDate(event.end)}</p>` : ''}
            <p class="event-type"><i class="fas fa-tag"></i> ${event.extendedProps.type}</p>
            <div class="modal-actions">
                <button class="btn-register">Register Now</button>
            </div>
        `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal);
      }
    };
  }

  // Date formatting helper
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Registration button functionality
  const registerButtons = document.querySelectorAll('.btn-register');
  registerButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const eventTitle = e.target.closest('.event-card')
        ? e.target.closest('.event-card').querySelector('h3').textContent
        : 'this event';

      alert(`Thank you for your interest in ${eventTitle}. Registration will open soon!`);
    });
  });

  // Smooth scroll for navigation
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

  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 50px 0px',
  };

  function preloadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      preloadImage(entry.target);
      observer.unobserve(entry.target);
    });
  }, imageOptions);

  images.forEach((image) => imageObserver.observe(image));

  // Animation on scroll
  const animatedElements = document.querySelectorAll('.event-card, .timeline-event');
  const animationOptions = {
    threshold: 0.2,
    rootMargin: '0px',
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    });
  }, animationOptions);

  animatedElements.forEach((element) => animationObserver.observe(element));

  // Event filtering functionality
  let currentFilter = 'all';
  const filterButtons = document.querySelectorAll('[data-filter]');
  const eventCards = document.querySelectorAll('.event-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      currentFilter = filter;

      // Update active button state
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter events
      eventCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          setTimeout(() => card.classList.add('show'), 10);
        } else {
          card.classList.remove('show');
          setTimeout(() => (card.style.display = 'none'), 300);
        }
      });
    });
  });

  // Dynamic countdown for upcoming events
  function updateEventCountdowns() {
    const eventDates = document.querySelectorAll('.event-date');

    eventDates.forEach((dateElement) => {
      const dateStr = dateElement.getAttribute('data-date');
      if (!dateStr) return;

      const eventDate = new Date(dateStr);
      const now = new Date();
      const diff = eventDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const countdownElement = dateElement.querySelector('.countdown');
        if (countdownElement) {
          countdownElement.textContent = `${days}d ${hours}h`;
        }
      }
    });
  }

  // Update countdowns every hour
  updateEventCountdowns();
  setInterval(updateEventCountdowns, 3600000);
});
