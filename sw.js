var cacheName = "restaurant-cache-v1"

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        './',
        'js/main.js',
        'js/restaurant_info.js',
        'js/swController.js',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
        'data/restaurants.json',
        'css/styles.css',
        '/js/dbhelper.js'
      ])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.filter((cache) => {
      return cache.startsWith('restaurant') && cache != cacheName;;
    }).map((cache) => {
      return caches.delete(cache);
    }));
  }));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => {
    return response || caches.open(cacheName).then((cache) => {
      return fetch(event.request).then((response) => {
        if (response.status === 404) {
          return new Response("Response returned 404")
        }
        if(event.request.url.includes('restaurant.html') || event.request.url.includes('leaflet')){
          cache.put(event.request, response.clone());
        }
        return response;
      });
    });
  }).catch(function() {
      return new Response("Offline")
  })
  );
});
