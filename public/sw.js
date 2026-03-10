// Basic Service Worker for caching (v2: не кэшируем HTML и favicon — у дилеров разный контент по одному URL)
const CACHE_NAME = 'setki21-v2';
const urlsToCache = [
  '/robots.txt',
  '/sitemap.xml'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch: HTML и навигация — всегда из сети (фавикон/tenant по текущему домену)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(fetch(event.request));
    return;
  }
  if (event.request.url.includes('/favicon') || event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Activate: удалить старые кэши (setki21-v1 и др.)
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
