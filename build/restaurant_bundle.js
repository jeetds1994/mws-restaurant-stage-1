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

var restaurant = void 0;
var newMap;

document.addEventListener('DOMContentLoaded', function (event) {
  registerServiceWorker();
  initMap();
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

var initMap = function initMap() {
  DBHelper.createDb('reviews');
  fetchRestaurantFromURL(function (error, restaurant) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 12,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiamVldGRzMTk5NCIsImEiOiJjampld3UzNmwwNHVjM3dvNzQ3MjRtNmR1In0.5Me6ypx2v_XfodhOesUy5A',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
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
    showAddReviewForm(false);
    showPosting(true);
    fetch('http://localhost:1337/reviews/' + params, {
      method: 'POST'
    }).then(function (resp) {
      var retrier = setInterval(function () {
        DBHelper.fetchRestaurantReviewsById(restaurant.id).then(function (reviews) {
          if (restaurant.reviews.length < reviews.length) {
            var newReviews = reviews.filter(function (review) {
              return !restaurant.reviews.find(function (rr) {
                return review.id == rr.id;
              });
            });
            newReviews.forEach(function (review) {
              restaurant.reviews.push(review);
              fillRestaurantReview(review);
            });
            showAddReviewForm(true);
            showPosting(false);
            clearInterval(retrier);
          }
        });
      }, 1000);
    });
  });
};

var showAddReviewForm = function showAddReviewForm(show) {
  var newReviewForm = document.querySelector(".add-review-form");
  if (show) {
    newReviewForm.style.visibility = 'visible';
  } else {
    newReviewForm.style.visibility = 'hidden';
  }
};

var showPosting = function showPosting(show) {
  var newReviewForm = document.querySelector(".posting");
  if (show) {
    newReviewForm.style.visibility = 'visible';
  } else {
    newReviewForm.style.visibility = 'hidden';
  }
};

var isRestaurantFavoritedById = function isRestaurantFavoritedById(id) {
  fetch('http://localhost:1337/restaurants/?is_favorite=true').then(function (resp) {
    return resp.json();
  }).then(function (data) {
    var restaurant = data.find(function (restaurant) {
      return restaurant.id == id;
    });
    if (restaurant) {
      document.querySelector("#restaurant-favorite-checkbox").checked = true;
    } else {
      document.querySelector("#restaurant-favorite-checkbox").checked = false;
    }
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
