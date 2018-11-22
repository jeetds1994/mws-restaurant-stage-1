var cacheName = "restaurant-cache"

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/build/index_bundle.js',
        '/js/idb.js',
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
        '/build/restaurant_bundle.js',
        '/js/dbhelper.js'
      ])
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.delete(cacheName)
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(function(response){
    return response || caches.open(cacheName).then((cache) => {
      return fetch(event.request).then((response) => {
        if (response.status === 404) {
          console.log("Page not found.");
          return new Response("Page not found.")
        }
        if(event.request.url.includes('restaurant.html')){
          cache.put(event.request, response.clone());
        }
        return response;
      });
    });
  }).catch(function() {
      console.log("Offline")
  })
  );
});


self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (response) {
          return response
        } else {
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response
          })
        }
      })
    })
  )
})
