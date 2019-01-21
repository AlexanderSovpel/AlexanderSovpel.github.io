const cacheName = 'swPWA';
const dataCacheName = 'swData';
const filesToCache = [
  '/',
  '/index.html',
  '/js/main.js',
  '/css/main.css',
  '/img/clear.png',
  '/img/cloudy-scattered-showers.png',
  '/img/cloudy-sunny.png',
  '/img/cloudy.png',
  '/img/fog.png',
  '/img/partly-cloudy.png',
  '/img/rain.png',
  '/img/scattered-showers.png',
  '/img/sleet.png',
  '/img/snow.png',
  '/img/thunderstorm.png',
  '/img/wind.png'
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(install());
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(activate());
});

self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetch', event.request.url);

  const dataUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Minsk,by&appid=eefae3388620d9e23738898664eb2bd9&units=metric';

  if (event.request.url.indexOf(dataUrl) === 0) {
    event.respondWith(fetchData());
  } else {
    event.respondWith(fetchFiles());
  }
});

const install = async () => {
  const cache = await caches.open(cacheName);
  return cache.addAll(filesToCache);
};

const activate = async () => {
  const keyList = await caches.keys();
  const oldCache = keyList.filter(key => key !== cacheName);
  return Promise.all(oldCache.map(key => caches.delete(key)));
};

const fetchData = async () => {
  const response = await fetch(event.request);
  const dataCache = await caches.open(dataCacheName);
  return cache.put(event.request.url, response.clone());
};

const fetchFiles = async () => {
  const response = await caches.match(event.request);
  return response || fetch(event.request)
};