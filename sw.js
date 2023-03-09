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
      return cache.addAll(urlsToCache);
    })
  );
});

// When a fetch event occurs, respond with the cached version of the resource if it exists
// If it doesn't exist, fetch the resource from the network and add it to the cache
// If the network request fails, serve the offline.html fallback page
self.addEventListener("fetch", function (event) {
  if (event.request.method === "GET" && event.request.mode === "navigate") {
    event.respondWith(
      caches.match("index.html").then(function (response) {
        return fetch(event.request).then(function (networkResponse) {
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(function () {
          return response || caches.match("offline.html");
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function (networkResponse) {
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(function () {
          return caches.match(event.request).then(function (response) {
            return response || caches.match("offline.html");
          });
        });
      })
    );
  }
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
