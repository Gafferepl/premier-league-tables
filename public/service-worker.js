// Self-destructing Service Worker v2 - Forces fresh load
// This replaces the old caching SW to ensure users get fresh code

self.addEventListener('install', (event) => {
  console.log('SW: Installing clean service worker - will clear all caches');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activating - clearing ALL caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('SW: Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('SW: All caches cleared, claiming clients');
      return self.clients.claim();
    })
  );
});

// Pass all requests straight to network - no caching
self.addEventListener('fetch', (event) => {
  // Do nothing - let the browser handle all requests normally
  return;
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
