// Define the cache name
var cacheName = 'my-page-cache-v1';

// Define the files to be cached
var filesToCache = [
  '/',
  'soundeffects/bump.wav',
  'soundeffects/fall.wav',
  'soundeffects/wingsFlap.wav',
  'sprite/bird.png',
  'sprite/birdfly.png',
  'index.html',
  'index.js',
];

// Install the service worker and cache the files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Activate the service worker and remove old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== cacheName;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});

// Intercept network requests and return cached files when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});

// Refresh the cache when the user presses the refresh button
self.addEventListener('message', function(event) {
  if (event.data.action === 'refresh') {
    caches.open(cacheName).then(function(cache) {
      cache.addAll(filesToCache);
    });
  }
});
