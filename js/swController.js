
 var registerServiceWorker = () => {
   if (!navigator.serviceWorker) {
     console.error('navigator service worker not found');
     return
   } else {
     console.log('Registering service worker in naviagtion');
   }

   navigator.serviceWorker.register('./sw.js').then(function(event) {
     console.log('registered service worker')

    if (event.waiting) {
      event.waiting.postMessage('updateSW');
      return;
    }
    if (event.installing) {
     console.log("installing sw")
     return;
   }
   event.addEventListener('updatefound', () => {
      const newWorker = event.installing;
      newWorker.waiting.postMessage('updateSW')
    });
   }).catch(function() {
     console.error('failed to register service worker')
   })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
 }

 if ('serviceWorker' in navigator) {
   window.addEventListener('load', function() {
     registerServiceWorker();
   });
 }
