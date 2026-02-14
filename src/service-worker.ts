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
      (async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        
        try {
          const networkResponse = await fetch(event.request);
          // Update cache with new response
          const responseClone = networkResponse.clone();
          const cache = await caches.open('takeaway-v1');
          cache.put(event.request, responseClone);
          return networkResponse;
        } catch {
          // Network failed, try cache again or return error
          const cached = await caches.match(event.request);
          return cached || new Response('Offline', { status: 503 });
        }
      })()
    );
  } 
  // Handle API requests (Supabase) with network-first strategy
  else if (event.request.url.includes('supabase')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const responseClone = networkResponse.clone();
          const cache = await caches.open('takeaway-v1');
          cache.put(event.request, responseClone);
          return networkResponse;
        } catch {
          // Try to return cached response if network fails
          const cached = await caches.match(event.request);
          return cached || new Response('API unavailable', { status: 503 });
        }
      })()
    );
  } 
  // Handle static assets with cache-first strategy
  else {
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return fetch(event.request);
      })()
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== 'takeaway-v1')
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});