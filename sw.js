
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('static').then(function (cache) {
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
    caches.open('static')
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('static').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (response) {
          return response
        } else {
          fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response
          })
        }
      })
    })
  )
})
