const CACHE_NAME = 'viconik-tools-v1';
const ASSETS = [
  "/",
  "/budget-quick-calculator.html",
  "/call-sheet-generator.html",
  "/continuity-report.html",
  "/delivery-checklist.html",
  "/depth-of-field-calculator.html",
  "/edit-log.html",
  "/exposure-calculator.html",
  "/image-rights-release.html",
  "/index.html",
  "/lighting-diagram.html",
  "/multicam-sync.html",
  "/parte-de-camara.html",
  "/render-time-calculator.html",
  "/room-acoustics-estimator.html",
  "/safe-zone-generator.html",
  "/sensor-crop-converter.html",
  "/shooting-permits-checklist.html",
  "/shooting-schedule-planner.html",
  "/sound-report.html",
  "/storyboard-rapido.html",
  "/storyboard-template-generator.html",
  "/subtitle-cps-checker.html",
  "/tarifario-audiovisual.html",
  "/timecode-calculator.html",
  "/viconik_calculators.html",
  "/waveform-vectorscope.html",
  "/editor/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
