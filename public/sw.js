const CACHE_NAME = 'admitflow-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Simple network-first strategy for API calls, cache-first for static assets
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful GET responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  
  if (event.data.type === 'SLA_BREACH') {
    self.registration.showNotification('SLA Breach Alert', {
      body: `Lead ${event.data.leadId} has breached SLA.`,
      icon: '/icon-192.svg'
    });
  } else if (event.data.type === 'TASK_REMINDER') {
    self.registration.showNotification('Task Reminder', {
      body: event.data.message || 'You have pending tasks.',
      icon: '/icon-192.svg'
    });
  }
});
