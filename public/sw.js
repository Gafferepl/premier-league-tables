// Self-destructing Service Worker v3 - No caching, forces fresh loads
// Replaces old aggressive caching SW that caused stale data issues

self.addEventListener('install', (event) => {
  console.log('SW v3: Installing - no-cache service worker');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW v3: Activating - purging ALL caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('SW v3: Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('SW v3: All caches purged, claiming clients');
      return self.clients.claim();
    })
  );
});

// No-op fetch handler - all requests go straight to network
self.addEventListener('fetch', (event) => {
  return;
});
