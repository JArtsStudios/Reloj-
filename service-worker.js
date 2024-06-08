// service-worker.js

const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/reloj.html',
  '/menu.html',
  '/css/styles.css',
  '/css/reloj.css',
  '/css/menu.css',
  '/js/script.js',
  '/js/reloj.js',
  '/js/menu.js',
  '/img/logo.png',
  '/img/icono.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
