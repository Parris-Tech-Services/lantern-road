const CACHE_NAME = "lantern-road-shell";
const CACHE_PREFIX = "lantern-road-";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./content.js",
  "./save-system.js",
  "./game.js",
  "./assets/art/source/garrick.webp",
  "./assets/art/source/mira.webp",
  "./assets/art/source/oren.webp",
  "./assets/art/source/brindle.webp",
  "./assets/ui/icons.svg",
  "./assets/ui/materials/lantern-wash.svg",
  "./assets/ui/materials/parchment-dark.svg",
  "./assets/ui/effects/rain-lines.svg",
  "./assets/ui/effects/fog-wash.svg",
  "./assets/ui/effects/sacred-halo.svg",
  "./manifest.webmanifest",
  "./LICENSE",
  "./README.md"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      const fallback = await cache.match("./index.html") || await cache.match("./");
      if (fallback) return fallback;
    }

    throw error;
  }
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(networkFirst(event.request));
});
