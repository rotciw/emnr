/* eslint-disable */
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  console.log('[SW] Service worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated.');
  sendMessageToClient('Worker activated');
});

self.addEventListener('push', (event) => {
  console.log('[SW] Service worker push event.', event);
  // if (event) {
  //     console.log("Event: ", event);
  //     if (event.data) {
  //         console.log("EventData: ", event.data);
  //         const data = event.data.json();
  //         console.log("JSON Data: ", data)
  //     }
  // }
});

self.addEventListener('message', (event) => {
  console.log('[SW] Service worker message event.');
  console.log('Event: ', event);
  console.log('Data: ', event.data);
});

const sendMessageToClient = (msg) => {
  console.log('sendMessageToClient, msg: ', msg);
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      console.log('[SW] sending message to client: ', client);
      // client.postMessage(msg);
    });
  });
};
