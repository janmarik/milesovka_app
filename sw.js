const CACHE_NAME = 'milesovka-v1';
const ASSETS = [
  './',
  './index.html',
  './icon.png'
];

// Instalace a uložení souborů do paměti telefonu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivace a promazání starých verzí
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Obsluha požadavků - offline vrací uloženou aplikaci, počasí pouští na internet
self.addEventListener('fetch', event => {
  if (event.request.url.includes('open-meteo.com')) {
    return; // Počasí se stahuje vždy živě z internetu
  }
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
