/// Service Worker — nid.local PWA
const CACHE_NAME = "nidlocal-v5";
const OFFLINE_URL = "/offline.html";

// Pages calculatrices — client-side, fonctionnent hors-ligne
const CALCULATOR_URLS = [
  "/calculatrice-hypothecaire",
  "/capacite-emprunt",
  "/calculateur-plex",
  "/acheter-ou-louer",
  "/estimation",
  "/ressources",
];

// Ressources statiques a mettre en cache lors de l'installation
const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  ...CALCULATOR_URLS,
];

// Installation : pre-cache des ressources essentielles
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch : strategie selon le type de requete
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requetes non-GET
  if (request.method !== "GET") return;

  // Routes API et auth : network-first
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Ressources statiques (images, fonts, JS, CSS) : cache-first
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?)$/)
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

  // Calculatrices : stale-while-revalidate (cache-first + mise a jour en arriere-plan)
  // Ces pages sont des composants client-side — elles fonctionnent hors-ligne
  if (
    request.headers.get("accept")?.includes("text/html") &&
    CALCULATOR_URLS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        // Toujours lancer le fetch reseau pour mettre a jour le cache
        const networkFetch = fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => null);

        // Si en cache, servir immediatement (le fetch met a jour en arriere-plan)
        if (cached) {
          // Declencher la mise a jour sans attendre
          networkFetch;
          return cached;
        }
        // Pas en cache : attendre le reseau, fallback offline
        return networkFetch.then((resp) => resp || caches.match(OFFLINE_URL));
      })
    );
    return;
  }

  // Pages HTML : network-first avec fallback offline
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Tout le reste : network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
