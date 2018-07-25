
addEventListener('install', function(event) {
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

addEventListener('activate', function (event) {
  event.waitUntil(
    caches.delete('static')
  )
})

addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        if (response) {
          return response
        } else {
          return fetch(event.request)
        }
      }
    )
  )
})
