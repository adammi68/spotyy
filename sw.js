const CACHE_NAME = 'spotyy-v1';
const OFFLINE_FILES = [
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(OFFLINE_FILES)));
});
self.addEventListener('activate', event=>{
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event=>{
  event.respondWith(caches.match(event.request).then(resp=>resp || fetch(event.request)));
});
