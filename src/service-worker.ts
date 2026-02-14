/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('takeaway-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico',
        '/android-chrome-192x192.png',
        '/android-chrome-512x512.png',
        '/assets/index-*.css',
        '/assets/index-*.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Handle navigation requests with network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          // Update cache with new response
          const responseClone = networkResponse.clone();
          caches.open('takeaway-v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        });
      })
    );
  } 
  // Handle API requests (Supabase) with network-first strategy
  else if (event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Try to return cached response if network fails
        return caches.match(event.request);
      })
    );
  } 
  // Handle static assets with cache-first strategy
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'takeaway-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});