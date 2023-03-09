const CACHE_NAME = "my-site-cache-v2";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        'soundeffects/bump.wav',
        'soundeffects/fall.wav',
        'soundeffects/wingsFlap.wav',
        'sprite/bird.png',
        'sprite/birdfly.png',
        'index.html',
        'index.js',
        'sw.js'
      ]);
    })
  );
});

self.addEventListener("fetch", async function (event) {
  const cache = await caches.open(CACHE_NAME);
  const cacheValidity = 10 * 60 * 1000; // 30 minutes in milliseconds
  const cacheExpiration = Date.now() - cacheValidity;

  try {
    const networkResponse = await fetch(event.request);

    if (networkResponse.status === 200 && networkResponse.type === "basic") {
      const clonedResponse = networkResponse.clone();
      cache.put(event.request, clonedResponse);
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse && cachedResponse.timestamp > cacheExpiration) {
      return cachedResponse;
    }

    throw error;
  }
});
