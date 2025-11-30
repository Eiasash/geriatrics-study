/**
 * Geriatrics Study Platform - Service Worker
 * Enables offline access for the learning platform
 */

const CACHE_NAME = 'geriatrics-study-v1';

const CACHE_FILES = [
    './',
    './index.html',
    // Clinical tools
    './clinical-tools/ai-assistant.html',
    './clinical-tools/anticoag.html',
    './clinical-tools/assessments.html',
    './clinical-tools/dashboard.html',
    './clinical-tools/decisions.html',
    './clinical-tools/evidence.html',
    './clinical-tools/exam.html',
    './clinical-tools/medications.html',
    './clinical-tools/oncall.html',
    './clinical-tools/study.html',
];

// External resources to cache
const EXTERNAL_CACHE = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.tailwindcss.com'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app files');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.log('Cache install failed:', err))
    );
});

// Activate event - clean old caches
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
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests except whitelisted
    const url = new URL(event.request.url);
    const isLocal = url.origin === self.location.origin;
    const isWhitelisted = EXTERNAL_CACHE.some(ext => event.request.url.startsWith(ext.split('?')[0]));

    if (!isLocal && !isWhitelisted) return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cache successful responses
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => cache.put(event.request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});
