(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Common database helper functions.
 */
var DBHelper = function () {
  function DBHelper() {
    _classCallCheck(this, DBHelper);
  }

  _createClass(DBHelper, null, [{
    key: 'port',
    value: function port() {
      return 1337;
    }

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */

  }, {
    key: 'createDb',
    value: function createDb(name) {
      return idb.open(name, 1, function (updated) {
        if (!updated.objectStoreNames.contains(name)) {
          updated.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
        }
      });
    }
  }, {
    key: 'openDB',
    value: function openDB(name) {
      return idb.open(name, 1);
    }

    // static getCachedMessagesByName(name){
    //   return DBHelper.openDB(name).then(function(db){
    //     if (db) {
    //       var transaction = db.transaction(name, 'readwrite');
    //       if (transaction) {
    //         var store = transaction.objectStore(name);
    //         return store.getAll()
    //       }
    //     }}
    //   );
    // }

    /**
     * Fetch all restaurants.
     */

  }, {
    key: 'fetchRestaurants',
    value: function fetchRestaurants(callback) {
      // DBHelper.getCachedMessagesByName('restaurants').then(function(cachedData) {
      //   if (cachedData.length > 0) {
      //     return callback(null, cachedData)
      //   }
      // })
      fetch(DBHelper.DATABASE_URL).then(function (resp) {
        return resp.json();
      }).then(function (restaurantJSON) {
        if (restaurantJSON) {
          callback(null, restaurantJSON);
        } else {
          var error = "Request failed";
          callback(error, null);
        }
      });
    }
    /**
     * Fetch a restaurant by its ID.
     */

  }, {
    key: 'fetchRestaurantById',
    value: function fetchRestaurantById(id, callback) {
      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var restaurant = restaurants.find(function (r) {
            return r.id == id;
          });
          if (restaurant) {
            // Got the restaurant
            callback(null, restaurant);
          } else {
            // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
          }
        }
      });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByCuisine',
    value: function fetchRestaurantByCuisine(cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          var results = restaurants.filter(function (r) {
            return r.cuisine_type == cuisine;
          });
          callback(null, results);
        }
      });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByNeighborhood',
    value: function fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          var results = restaurants.filter(function (r) {
            return r.neighborhood == neighborhood;
          });
          callback(null, results);
        }
      });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByCuisineAndNeighborhood',
    value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var results = restaurants;
          if (cuisine != 'all') {
            // filter by cuisine
            results = results.filter(function (r) {
              return r.cuisine_type == cuisine;
            });
          }
          if (neighborhood != 'all') {
            // filter by neighborhood
            results = results.filter(function (r) {
              return r.neighborhood == neighborhood;
            });
          }
          callback(null, results);
        }
      });
    }
  }, {
    key: 'fetchRestaurantReviewsById',
    value: function fetchRestaurantReviewsById(id) {
      return fetch('http://localhost:' + DBHelper.port() + '/reviews/?restaurant_id=' + id).then(function (resp) {
        return resp.json();
      });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */

  }, {
    key: 'fetchNeighborhoods',
    value: function fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          var neighborhoods = restaurants.map(function (v, i) {
            return restaurants[i].neighborhood;
          });
          // Remove duplicates from neighborhoods
          var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
            return neighborhoods.indexOf(v) == i;
          });
          callback(null, uniqueNeighborhoods);
        }
      });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */

  }, {
    key: 'fetchCuisines',
    value: function fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          var cuisines = restaurants.map(function (v, i) {
            return restaurants[i].cuisine_type;
          });
          // Remove duplicates from cuisines
          var uniqueCuisines = cuisines.filter(function (v, i) {
            return cuisines.indexOf(v) == i;
          });
          callback(null, uniqueCuisines);
        }
      });
    }

    /**
     * Restaurant page URL.
     */

  }, {
    key: 'urlForRestaurant',
    value: function urlForRestaurant(restaurant) {
      return './restaurant.html?id=' + restaurant.id;
    }

    /**
     * Restaurant image URL.
     */

  }, {
    key: 'imageUrlForRestaurant',
    value: function imageUrlForRestaurant(restaurant) {
      if (restaurant.photograph) {
        return './img/' + restaurant.photograph + '.jpg';
      } else {
        return '';
      }
    }

    /**
     * Map marker for a restaurant.
     */

  }, {
    key: 'mapMarkerForRestaurant',
    value: function mapMarkerForRestaurant(restaurant, map) {
      var marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], { title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      });
      marker.addTo(newMap);
      return marker;
    }
  }, {
    key: 'updateRestaurantFavoriteStatus',
    value: function updateRestaurantFavoriteStatus(restaurant, favoriteStatus) {
      fetch('http://localhost:1337/restaurants/' + restaurant.id + '/?is_favorite=' + favoriteStatus, {
        method: 'PUT'
      });
    }
  }, {
    key: 'DATABASE_URL',
    get: function get() {
      return 'http://localhost:' + DBHelper.port() + '/restaurants';
    }
  }]);

  return DBHelper;
}();

},{}],2:[function(require,module,exports){
'use strict';

var restaurants = void 0,
    neighborhoods = void 0,
    cuisines = void 0;
var newMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function (event) {
  registerServiceWorker();
  initMap();
  fetchNeighborhoods();
  fetchCuisines();
});

var registerServiceWorker = function registerServiceWorker() {
  if (!navigator.serviceWorker) {
    console.log('navigator service worker not found');
    return;
  } else {
    console.log('Registering service worker in naviagtion');
  }

  navigator.serviceWorker.register('/sw.js').then(function () {
    console.log('registered service worker');
  }).catch(function () {
    console.error('failed to register service worker');
  });
};

/**
 * Fetch all neighborhoods and set their HTML.
 */
var fetchNeighborhoods = function fetchNeighborhoods() {
  DBHelper.createDb('restaurants');
  DBHelper.fetchNeighborhoods(function (error, neighborhoods) {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {
  var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

  var select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(function (neighborhood) {
    var option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.role = "option";
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
var fetchCuisines = function fetchCuisines() {
  DBHelper.fetchCuisines(function (error, cuisines) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = function fillCuisinesHTML() {
  var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

  var select = document.getElementById('cuisines-select');

  cuisines.forEach(function (cuisine) {
    var option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    option.role = "option";
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
// window.initMap = () => {
//   let loc = {
//     lat: 40.722216,
//     lng: -73.987501
//   };
//   self.map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 12,
//     center: loc,
//     scrollwheel: false
//   });
//   updateRestaurants();
// }

var initMap = function initMap() {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiamVldGRzMTk5NCIsImEiOiJjampld3UzNmwwNHVjM3dvNzQ3MjRtNmR1In0.5Me6ypx2v_XfodhOesUy5A',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
var updateRestaurants = function updateRestaurants() {
  var cSelect = document.getElementById('cuisines-select');
  var nSelect = document.getElementById('neighborhoods-select');
  var cIndex = cSelect.selectedIndex;
  var nIndex = nSelect.selectedIndex;

  var cuisine = cSelect[cIndex].value;
  var neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
    if (error) {
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
var resetRestaurants = function resetRestaurants(restaurants) {
  // Remove all restaurants
  self.restaurants = [];
  var ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  ul.role = 'listitem';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(function (marker) {
      return marker.setMap(null);
    });
  }
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
var fillRestaurantsHTML = function fillRestaurantsHTML() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  var ul = document.getElementById('restaurants-list');
  restaurants.forEach(function (restaurant) {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
var createRestaurantHTML = function createRestaurantHTML(restaurant) {
  var li = document.createElement('li');

  var image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name + " Restaurant";
  li.append(image);

  var name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  var neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  var address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  var more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
var addMarkersToMap = function addMarkersToMap() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  restaurants.forEach(function (restaurant) {
    // Add marker to the map
    var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    marker.on('click', function () {
      window.location.href = marker.url;
    });
    marker.alt = restaurant.name;
    marker.role = "prestation";
    self.markers.push(marker);
  });
};

},{}],3:[function(require,module,exports){
'use strict';

var cacheName = "restaurant-cache-v1";

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(cacheName).then(function (cache) {
    return cache.addAll(['/', '/index.html', '/restaurant.html', '/build/index_bundle.js', '/js/idb.js', 'img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg', 'img/9.jpg', 'img/10.jpg', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css', 'data/restaurants.json', 'css/styles.css', '/build/restaurant_bundle.js', '/js/dbhelper.js']);
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cache) {
      return cacheName.startsWith('restaurant-cache') && cache != cacheName;
    }).map(function (cache) {
      return caches.delete(cache);
    }));
  }));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    return response || caches.open(cacheName).then(function (cache) {
      return fetch(event.request).then(function (response) {
        if (response.status === 404) {
          console.log("Page not found.");
          return new Response("Page not found.");
        }
        if (event.request.url.includes('restaurant.html')) {
          cache.put(event.request, response.clone());
        }
        return response;
      });
    });
  }).catch(function (err) {
    console.log("Offline SW", err);
  }));
});

},{}]},{},[2,1,3]);
