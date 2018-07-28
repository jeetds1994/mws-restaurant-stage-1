var cacheName = "restaurant-cache"


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/js/main.js',
        '/js/restaurant_info.js'
      ])
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.delete(cacheName)
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    return caches.open(cacheName).then(function (cache) {
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
