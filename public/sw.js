// Deliberately minimal — no Workbox/vite-plugin-pwa dependency, so it works
// immediately with `npm install` and no extra config (hackathon time
// pressure). Two responsibilities only:
//   1. Cache the app shell so the PWA still opens with no connection
//      (spec section 15/16 — light, offline-tolerant).
//   2. Never touch API responses — GET /api/citizen/* always hits the
//      network. Freshness of zone/weather/alert data is handled in
//      src/offline/lastKnown.js (localStorage), not here, so the app can
//      show "last known data as of <time>" instead of a stale cached JSON
//      silently pretending to be current (spec section 15).

const CACHE_NAME = 'neuron-sentinel-citizen-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never cache API calls — always network, let the app's own
  // "last known data" logic handle offline instead of a stale SW cache.
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, res.clone()));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
