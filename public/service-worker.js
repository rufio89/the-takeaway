const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `${CACHE_VERSION}-static`,
  dynamic: `${CACHE_VERSION}-dynamic`,
  images: `${CACHE_VERSION}-images`
};

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch((error) => {
      console.error('[Service Worker] Install error:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return !Object.values(CACHE_NAMES).includes(cacheName);
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Fetch event - implement stale-while-revalidate with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Route-specific strategies
  if (request.destination === 'image') {
    event.respondWith(cacheImages(request));
  } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(cachePage(request));
  } else if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheStatic(request));
  } else {
    event.respondWith(cacheAPI(request));
  }
});

// Cache images with fallback
async function cacheImages(request) {
  const cache = await caches.open(CACHE_NAMES.images);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Image fetch failed:', error);
    // Return a placeholder or default image if available
    return cache.match('/icon-192.png') || new Response('', { status: 404 });
  }
}

// Cache static assets (stale-while-revalidate)
async function cacheStatic(request) {
  const cache = await caches.open(CACHE_NAMES.static);
  const cached = await cache.match(request);

  if (cached) {
    // Revalidate in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Network error, use cache
    });
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Static fetch failed:', error);
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache pages (network-first with fallback)
async function cachePage(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAMES.dynamic);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Page fetch failed:', error);
    const cache = await caches.open(CACHE_NAMES.dynamic);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }

    // Return offline page if available
    const offlinePage = await cache.match('/index.html');
    if (offlinePage) {
      return offlinePage;
    }

    return new Response('Offline - Page not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache API responses (network-first with timeout)
async function cacheAPI(request) {
  const cache = await caches.open(CACHE_NAMES.dynamic);

  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      )
    ]);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] API fetch failed:', error);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }

    // Return 503 for failed API calls
    return new Response('Offline - API unavailable', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle background sync for future offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-digests') {
    event.waitUntil(syncDigests());
  }
});

async function syncDigests() {
  try {
    // Sync logic here when user goes back online
    console.log('[Service Worker] Syncing digests');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New digest available',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'digest-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('The Takeaway', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
