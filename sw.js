const CACHE_NAME = 'birdie-bounce-cache-v1';
const urlsToCache = [
  '/',
  'soundeffects/bump.wav',
  'soundeffects/fall.wav',
  'soundeffects/wingsFlap.wav',
  'sprite/bird.png',
  'sprite/birdfly.png',
  'sprite/clouds.png',
  'index.html',
  'index.js'

];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
