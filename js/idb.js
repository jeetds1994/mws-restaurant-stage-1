import idb from 'idb';

function doesSupportIDB(){
  if (window.indexedDB) {
    return true
  }
  return false
}

function run(){
  if (doesSupportIDB()) {
    console.log('Browser does support IndexedDB')
    var request = idb.open("MyTestDatabase", 1);
    request.then(something => console.log("promise"))
  } else {
    console.log('Browser does not support IndexedDB')
  }
}


run()
