/**
 * Service Worker for Global Debate Society
 *
 * This service worker implements caching strategies for better performance
 * and offline capabilities.
 */

// Cache name versioning - increment when assets change
const CACHE_NAME = 'gds-cache-v1';

// Assets to cache on install
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/pages/navbar-pages/about.html',
  '/pages/navbar-pages/events.html',
  '/pages/navbar-pages/resources.html',
  '/pages/navbar-pages/join.html',
  '/pages/footer-pages/blog.html',
  '/pages/footer-pages/contact.html',
  '/pages/footer-pages/faq.html',
  '/src/src/styles/index.css',
  '/src/js/main.js',
  '/src/js/lazy-loading.js',
  '/src/js/navbar.js',
  '/src/js/mobile-menu.js',
  '/src/js/faq.js',
  '/src/js/contact.js',
  '/src/js/events.js',
  '/src/js/join.js',
  '/src/js/blog.js',
  '/src/js/resources.js',
  '/src/assets/images/debate-hero-bg.svg',
  '/src/assets/images/pattern-dots.svg',
  '/src/assets/images/blog-placeholder.svg',
  '/src/assets/images/profile-placeholder.svg',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  // Skip waiting forces the waiting service worker to become the active service worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching core assets');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Delete any old caches that aren't the current one
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For HTML pages - use Network First Strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone();

          // Open the cache
          caches.open(CACHE_NAME).then((cache) => {
            // Add the response to the cache
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For images - use Cache First, falling back to network
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request).then((response) => {
          // Clone the response
          const responseClone = response.clone();

          // Open the cache
          caches.open(CACHE_NAME).then((cache) => {
            // Add the response to the cache
            cache.put(event.request, responseClone);
          });

          return response;
        });
      })
    );
    return;
  }

  // For CSS, JS, and other static assets - use Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Get from network even if it's in cache
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Save the updated file in cache for next time
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => {
          // Network error, just return cache if available
          return cachedResponse;
        });

      // Return cached response immediately, but update cache in background
      return cachedResponse || fetchPromise;
    })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  // Skip waiting if the client asks to
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
