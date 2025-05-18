/* public/service-worker.js */
const CACHE_NAME = 'dicoding-story-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
  '/scripts/index.js',
  '/styles/styles.css',
  '/styles/animations.css',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip cross-origin requests
  if (requestUrl.origin !== location.origin && !requestUrl.pathname.includes('dicoding.dev')) {
    return;
  }

  // API Cache Strategy - Network First
  if (requestUrl.pathname.includes('dicoding.dev')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Static Assets Strategy - Cache First
  if (
    requestUrl.pathname.match(/\.(css|js|png|jpg|jpeg|svg|gif|ico|woff2)$/) ||
    requestUrl.pathname === '/' ||
    requestUrl.pathname.includes('index.html')
  ) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  // Default Strategy - Network First
  event.respondWith(networkFirstStrategy(event.request));
});

// Cache First Strategy - Good for static assets that don't change often
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Network First Strategy - Good for API requests that need fresh data
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Handle Push Notification
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'New notification',
    options: {
      body: 'This is a push notification!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
    },
  };

  if (event.data) {
    try {
      notificationData = JSON.parse(event.data.text());
    } catch (error) {
      console.error('Failed to parse notification data', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Navigate to home or other specific page
  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((windowClients) => {
      // Check if there is already a window client
      for (const client of windowClients) {
        if (client.url === urlToOpen) {
          return client.focus();
        }
      }
      // If no window client, open a new window
      return clients.openWindow(urlToOpen);
    })
  );
});