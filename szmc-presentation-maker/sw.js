/**
 * SZMC Presentation Maker - Service Worker
 * Full offline support for PWA
 */

const CACHE_NAME = 'szmc-presentation-v2';

// All files to cache for complete offline use
const CACHE_FILES = [
    './',
    './index.html',
    './manifest.json',
    './offline.html',

    // CSS
    './css/main.css',
    './css/presentation.css',
    './css/visuals.css',
    './css/resources.css',
    './css/generator.css',
    './css/rtl.css',
    './css/mobile.css',

    // JavaScript
    './js/i18n.js',
    './js/templates.js',
    './js/templates-extended.js',
    './js/templates-extra.js',
    './js/citations.js',
    './js/resources.js',
    './js/generator.js',
    './js/editor.js',
    './js/presentation.js',
    './js/export.js',
    './js/advanced-export.js',
    './js/ai-assistant.js',
    './js/main.js',
    './js/mobile.js'
];

const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&family=Heebo:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache all files
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v2...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app files...');
                // Cache local files
                const localPromise = Promise.allSettled(
                    CACHE_FILES.map(url =>
                        cache.add(url).catch(err => {
                            console.warn(`[SW] Failed to cache: ${url}`);
                        })
                    )
                );

                // Cache external files
                const externalPromise = Promise.allSettled(
                    EXTERNAL_ASSETS.map(url =>
                        fetch(url, { mode: 'cors' })
                            .then(res => res.ok ? cache.put(url, res) : null)
                            .catch(() => console.warn(`[SW] Failed to cache external: ${url}`))
                    )
                );

                return Promise.all([localPromise, externalPromise]);
            })
            .then(() => {
                console.log('[SW] Install complete');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
            ))
            .then(() => {
                console.log('[SW] Now active');
                return self.clients.claim();
            })
    );
});

// Fetch event - cache first, network fallback
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) {
                    // Update cache in background
                    fetch(event.request)
                        .then(res => {
                            if (res.ok) {
                                caches.open(CACHE_NAME).then(c => c.put(event.request, res));
                            }
                        })
                        .catch(() => {});
                    return cached;
                }

                return fetch(event.request)
                    .then((res) => {
                        if (res.ok) {
                            const clone = res.clone();
                            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                        }
                        return res;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('./offline.html') || caches.match('./index.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Message handler
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline saves
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-saves') {
        event.waitUntil(syncOfflineSaves());
    }
});

async function syncOfflineSaves() {
    console.log('[SW] Syncing offline saves...');
}
