/**
 * Geriatrics Study Platform - Service Worker v5
 */
const CACHE_NAME = 'geriatrics-study-v7';

const CACHE_FILES = [
    './',
    './index.html',
    './manifest.json',
    './offline.html',
    './iv-protocols.html',
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
    './h5p/index.html',
    './hazzards/index.html',
    './szmc-presentation-maker/index.html',
    './gerifellow-assistant/index.html',
    './gerifellow-assistant/style.css',
    './gerifellow-assistant/script.js',
    './clinical-tools/mobile-fallback.css',
    './clinical-tools/shared/sanitize.js',
    './clinical-tools/shared/storage.js',
    './data/content.json',
];

const EXTERNAL_CACHE = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
            .catch((err) => { console.warn('SW Install cache error:', err); })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    const isLocal = url.origin === self.location.origin;
    const isWhitelisted = EXTERNAL_CACHE.some(ext => event.request.url.startsWith(ext.split('?')[0]));
    if (!isLocal && !isWhitelisted) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((res) => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return res;
            }).catch(() => {
                if (event.request.mode === 'navigate') return caches.match('./index.html');
                return new Response('Offline', { status: 503 });
            });
        })
    );
});
