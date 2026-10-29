const CACHE_NAME = "control-clientes-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/hometech.png", "./assets/teknovida.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
    return response;
  }).catch(() => caches.match("./index.html"))));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(list => {
    for (const client of list) if ("focus" in client) return client.focus();
    if (self.clients.openWindow) return self.clients.openWindow("./index.html");
  }));
});
