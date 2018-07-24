
addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('static').then(function (cache) {
      cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/scripts/main.js',
        '/scripts/restaurant_info.js',
        '/scripts/utils.js'
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
          return cache.put(fetch(event.request))
        }
      }
    )
  )
})
