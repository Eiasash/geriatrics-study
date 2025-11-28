// SZMC Geriatrics Presentation Maker - Service Worker for Offline Support

const CACHE_NAME = 'szmc-presentation-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './css/presentation.css',
    './css/visuals.css',
    './css/resources.css',
    './css/generator.css',
    './js/templates.js',
    './js/templates-extended.js',
    './js/templates-extra.js',
    './js/citations.js',
    './js/resources.js',
    './js/generator.js',
    './js/editor.js',
    './js/presentation.js',
    './js/export.js',
    './js/ai-assistant.js',
    './js/main.js'
];

const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                // Cache local assets
                return cache.addAll(STATIC_ASSETS.map(url => {
                    // Handle relative paths
                    return url.startsWith('/') ? url : '/' + url;
                }));
            })
            .then(() => {
                // Try to cache external assets (non-blocking)
                return caches.open(CACHE_NAME).then(cache => {
                    return Promise.allSettled(
                        EXTERNAL_ASSETS.map(url =>
                            fetch(url, { mode: 'cors' })
                                .then(response => {
                                    if (response.ok) {
                                        return cache.put(url, response);
                                    }
                                })
                                .catch(() => {
                                    console.log('Could not cache external asset:', url);
                                })
                        )
                    );
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached response if available
                if (cachedResponse) {
                    // Fetch in background to update cache
                    fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse.ok) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(request, networkResponse.clone());
                                });
                            }
                        })
                        .catch(() => {});

                    return cachedResponse;
                }

                // Fetch from network
                return fetch(request)
                    .then((networkResponse) => {
                        // Cache successful responses
                        if (networkResponse.ok) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline fallback for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
