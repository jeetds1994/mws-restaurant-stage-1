let restaurant;
var newMap;

document.addEventListener('DOMContentLoaded', (event) => {
  registerServiceWorker()
  initMap()
})


var registerServiceWorker = () => {
  if (!navigator.serviceWorker) {
    console.log('navigator service worker not found');
    return
  } else {
    console.log('found service worker in naviagtion');
  }

  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('registered service worker')
  }).catch(function() {
    console.error('failed to register service worker')
  })
}

/**
 * Initialize map as soon as the page is loaded.
 */

/**
 * Initialize leaflet map
 */

var initMap = () => {
  DBHelper.createDb('reviews')
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
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
}

/**
 * Get current restaurant from page URL.
 */
var fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      } else {
        DBHelper.fetchRestaurantReviewsById(restaurant.id).then(reviews => {
          restaurant.reviews = reviews
          fillRestaurantHTML();
          isRestaurantFavoritedById(id)
          listenToFavoriteCheckbox()
        })
      }
      callback(null, restaurant)
    });
  }
}



/**
 * Create restaurant HTML and add it to the webpage
 */
var fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.alt = restaurant.name + " Restaurant"
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
  addReviewEvent()
}

var addReviewEvent = (restaurant = self.restaurant) => {
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault()
    const name = document.querySelector(".add-review-form #name").value
    const rating = document.querySelector(".add-review-form #rating").value
    const comments = document.querySelector(".add-review-form #comments").value
    let params = `?restaurant_id=${restaurant.id}&name=${name}&rating=${rating}&comments=${comments}`
    fetch('http://localhost:1337/reviews/' + params, {
      method: 'POST',
    }).then(resp => {
      let retrier = setInterval(function(){
        DBHelper.fetchRestaurantReviewsById(restaurant.id).then(reviews => {
          if (restaurant.reviews.length < reviews.length) {
            let newReviews = reviews.filter(review => {
              return !restaurant.reviews.find(rr => review.id == rr.id)
            })
            newReviews.forEach (review => {
              fillRestaurantReview(review)
            })
            clearInterval(retrier)
          }
        })
     }, 1000);
    })
  })
}

var isRestaurantFavoritedById = (id) => {
  fetch('http://localhost:1337/restaurants/?is_favorite=true').then(resp => resp.json()).then(data => {
    let restaurant = data.find(restaurant => restaurant.id == id)
    let checked = restaurant.is_favorite ? restaurant.is_favorite : false
    document.querySelector("#restaurant-favorite-checkbox").checked = checked
  })
}

var listenToFavoriteCheckbox = (restaurant = self.restaurant) => {
  document.querySelector("#restaurant-favorite-checkbox").addEventListener('change', function(e) {
    DBHelper.updateRestaurantFavoriteStatus(restaurant, e.target.checked)
  })
}

var fillRestaurantReview = (review) => {
  const ul = document.getElementById('reviews-list');
  ul.appendChild(createReviewHTML(review));
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
var fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
var fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  if (!document.querySelector("#reviews-title")) {
    title.innerHTML = 'Reviews';
    title.id = "reviews-title";
    container.appendChild(title);
  }
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
var createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
var fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
var getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
