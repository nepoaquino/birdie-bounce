// Set the name of the cache
const CACHE_NAME = "birdie-bounce-cache-v1";

// Set the URLs to cache
const urlsToCache = [
  "/",
  "soundeffects/bump.wav",
  "soundeffects/fall.wav",
  "soundeffects/wingsFlap.wav",
  "sprite/bird.png",
  "sprite/birdfly.png",
  "sprite/clouds.png",
  "index.html",
  "index.js",
];

// When the service worker is installed, open a cache and add the URLs to cache
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      try {
        return cache.addAll(urlsToCache);
      } catch (error) {
        console.error("Failed to add URLs to cache:", error);
      }
    })
  );
});

// When a fetch event occurs, respond with the cached version of the resource if it exists
// If it doesn't exist, fetch the resource from the network
// If the network request fails, serve the offline.html fallback page
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).catch(function () {
          return caches.match("offline.html");
        });
      }
    })
  );
});

// When the service worker is activated, delete any old caches that have a different name than the current cache
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
