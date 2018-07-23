addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('restaurant-app').then(function (cache) {
      return cache
    })
  )
}

addEventListener('activate', function (event) {
  event.waitUntil(
    catch.delete('restaurant-app')
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
