const CACHE_NAME = 'valentine-v1';
const ASSETS = [
    '/valentine/',
    '/valentine/index.html',
    '/valentine/css/style.css',
    '/valentine/js/data.js',
    '/valentine/js/app.js',
    '/valentine/manifest.json',
    '/valentine/icon-192.svg',
    '/valentine/icon-512.svg'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
