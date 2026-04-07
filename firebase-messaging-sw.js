// IMPORTANT: This file is auto-used by Firebase Messaging. Keep it at the root of your site.

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

let messaging = null;
let initialized = false;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG' && !initialized) {
    const firebaseConfig = event.data.config;
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
    initialized = true;

    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title || 'Trip Meal Planner';
      const body = payload.notification?.body || '';

      const notificationOptions = {
        body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        data: payload.data,
        vibrate: [200, 100, 200],
      };

      self.registration.showNotification(title, notificationOptions);
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
