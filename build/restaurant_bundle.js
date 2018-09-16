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
  }, {
    key: 'getCachedMessagesByName',
    value: function getCachedMessagesByName(name) {
      return DBHelper.openDB(name).then(function (db) {
        if (db) {
          var transaction = db.transaction(name, 'readwrite');
          if (transaction) {
            var store = transaction.objectStore(name);
            return store.getAll();
          }
        }
      });
    }

    /**
     * Fetch all restaurants.
     */

  }, {
    key: 'fetchRestaurants',
    value: function fetchRestaurants(callback) {
      DBHelper.getCachedMessagesByName('restaurants').then(function (cachedData) {
        if (cachedData.length > 0) {
          return callback(null, cachedData);
        }
      });
      var xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);
      xhr.onload = function () {
        if (xhr.status === 200) {
          // Got a success response from server!
          var restaurantJSON = JSON.parse(xhr.responseText);
          callback(null, restaurantJSON);
        } else {
          // Oops!. Got an error from server.
          var error = 'Request failed. Returned status of ' + xhr.status;
          callback(error, null);
        }
      };
      xhr.send();
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
      DBHelper.getCachedMessagesByName('reviews').then(function (cachedData) {
        if (cachedData.length > 0) {
          return callback(null, cachedData);
        }
      });
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
      return '/img/' + restaurant.photograph + '.jpg';
    }

    /**
     * Map marker for a restaurant.
     */

  }, {
    key: 'mapMarkerForRestaurant',
    value: function mapMarkerForRestaurant(restaurant, map) {
      var marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP });
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

var restaurant = void 0;
var newMap;

document.addEventListener('DOMContentLoaded', function (event) {
  registerServiceWorker();
});

var registerServiceWorker = function registerServiceWorker() {
  if (!navigator.serviceWorker) {
    console.log('navigator service worker not found');
    return;
  } else {
    console.log('found service worker in naviagtion');
  }

  navigator.serviceWorker.register('/sw.js').then(function () {
    console.log('registered service worker');
  }).catch(function () {
    console.error('failed to register service worker');
  });
};

/**
 * Initialize map as soon as the page is loaded.
 */

/**
 * Initialize leaflet map
 */

window.initMap = function () {
  DBHelper.createDb('reviews');
  fetchRestaurantFromURL(function (error, restaurant) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
var fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  var id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, function (error, restaurant) {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      } else {
        DBHelper.fetchRestaurantReviewsById(restaurant.id).then(function (reviews) {
          restaurant.reviews = reviews;
          fillRestaurantHTML();
          isRestaurantFavoritedById(id);
          listenToFavoriteCheckbox();
        });
      }
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
var fillRestaurantHTML = function fillRestaurantHTML() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  var address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  var image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + " Restaurant";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  var cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
  addReviewEvent();
};

var addReviewEvent = function addReviewEvent() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.querySelector(".add-review-form #name").value;
    var rating = document.querySelector(".add-review-form #rating").value;
    var comments = document.querySelector(".add-review-form #comments").value;
    var params = '?restaurant_id=' + restaurant.id + '&name=' + name + '&rating=' + rating + '&comments=' + comments;
    fetch('http://localhost:1337/reviews/' + params, {
      method: 'POST'
    }).then(function (resp) {
      DBHelper.fetchRestaurantReviewsById(restaurant.id).then(function (reviews) {
        var lastReview = reviews[reviews.length - 1];
        fillRestaurantReview(lastReview);
      });
    });
  });
};

var isRestaurantFavoritedById = function isRestaurantFavoritedById(id) {
  fetch('http://localhost:1337/restaurants/?is_favorite=true').then(function (resp) {
    return resp.json();
  }).then(function (data) {
    var restuarant = data.find(function (restaurant) {
      return restaurant.id == id;
    });
    document.querySelector("#restaurant-favorite-checkbox").checked = restuarant.is_favorite;
  });
};

var listenToFavoriteCheckbox = function listenToFavoriteCheckbox() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  document.querySelector("#restaurant-favorite-checkbox").addEventListener('change', function (e) {
    DBHelper.updateRestaurantFavoriteStatus(restaurant, e.target.checked);
  });
};

var fillRestaurantReview = function fillRestaurantReview(review) {
  var ul = document.getElementById('reviews-list');
  ul.appendChild(createReviewHTML(review));
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
var fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
  var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

  var hours = document.getElementById('restaurant-hours');
  for (var key in operatingHours) {
    var row = document.createElement('tr');

    var day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    var time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
var fillReviewsHTML = function fillReviewsHTML() {
  var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

  var container = document.getElementById('reviews-container');
  var title = document.createElement('h2');
  if (!document.querySelector("#reviews-title")) {
    title.innerHTML = 'Reviews';
    title.id = "reviews-title";
    container.appendChild(title);
  }
  if (!reviews) {
    var noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  var ul = document.getElementById('reviews-list');
  reviews.forEach(function (review) {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
var createReviewHTML = function createReviewHTML(review) {
  var li = document.createElement('li');
  var name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  var date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  var rating = document.createElement('p');
  rating.innerHTML = 'Rating: ' + review.rating;
  li.appendChild(rating);

  var comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
var fillBreadcrumb = function fillBreadcrumb() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var breadcrumb = document.getElementById('breadcrumb');
  var li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
var getParameterByName = function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

},{}],3:[function(require,module,exports){
'use strict';

var cacheName = "restaurant-cache";

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(cacheName).then(function (cache) {
    return cache.addAll(['/', '/index.html', '/restaurant.html', '/build/index_bundle.js', '/build/restaurant_bundle.js', '/js/dbhelper.js']);
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.delete(cacheName));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open(cacheName).then(function (cache) {
    return cache.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      }
    });
  }));
});

},{}]},{},[2,1,3]);
