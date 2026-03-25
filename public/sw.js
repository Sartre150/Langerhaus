const CACHE_NAME = "langerhaus-v2";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/auth",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and chrome-extension requests
  if (request.method !== "GET" || request.url.startsWith("chrome-extension")) return;

  // Network-first for navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")).then((r) => r || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })))
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, fonts, images)
  if (
    request.url.match(/\.(js|css|woff2?|png|jpg|svg|ico)$/) ||
    request.url.includes("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // Network-first for everything else (API, Supabase)
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })))
  );
});
