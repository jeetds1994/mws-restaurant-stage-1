/**
 * Common database helper functions.
 */
class DBHelper {

  static port() {
    return 1337
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return `http://localhost:${DBHelper.port()}/restaurants`;
  }

  static createDb(name){
    return idb.open(name, 1, function (updated) {
      if (!updated.objectStoreNames.contains(name)) {
        updated.createObjectStore(name, {keyPath: 'id', autoIncrement: true})
      }
    })
  }

  static openDB(name) {
    return idb.open(name, 1)
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
  static fetchRestaurants(callback) {
    // DBHelper.getCachedMessagesByName('restaurants').then(function(cachedData) {
    //   if (cachedData.length > 0) {
    //     return callback(null, cachedData)
    //   }
    // })
    fetch(DBHelper.DATABASE_URL).then(resp => resp.json()).then(restaurantJSON => {
      if (restaurantJSON) { 
        callback(null, restaurantJSON);
      } else {
        const error = ("Request failed");
        callback(error, null);
      }
    })
  }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  static fetchRestaurantReviewsById(id) {
    return fetch(`http://localhost:${DBHelper.port()}/reviews/?restaurant_id=${id}`).then(resp => {
      return resp.json()
    })
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) {
      return (`./img/${restaurant.photograph}.jpg`);
    } else {
      return ''
    }
  }

  /**
   * Map marker for a restaurant.
   */
 static mapMarkerForRestaurant(restaurant, map) {
   const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
     {title: restaurant.name,
     alt: restaurant.name,
     url: DBHelper.urlForRestaurant(restaurant)
     })
     marker.addTo(newMap);
    return marker;
  }

  static updateRestaurantFavoriteStatus(restaurant, favoriteStatus) {
    fetch(`http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=${favoriteStatus}`, {
      method: 'PUT',
    })
  }
}
