const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = [
    "sw.js",
    "index.js",
    "index.html",
    "thumbnail.jpg",
    "clouds.png",
    "bird.png",
    "birdfly.png"
];

self.addEventListener("install", function (event) {
    // Perform installation steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                // Return the cached response
                return response;
            }
            // Not found in cache - fetch from network
            return fetch(event.request)
                .then(function (response) {
                    // Check if response is valid
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic"
                    ) {
                        return response;
                    }
                    // Clone the response to cache
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(function (err) {
                    // Network request failed, return a fallback response
                    return caches.match("/offline.html");
                });
        })
    );
});
