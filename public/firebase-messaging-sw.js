// Firebase Cloud Messaging Service Worker
// File này phải đặt ở public/ để browser có thể access
// Docs: https://firebase.google.com/docs/cloud-messaging/js/client

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase config (phải giống với config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDP-KltcVfbZzfCfSNmtmbf9L4wKRAdR80",
  authDomain: "peak-coffee-3b1e0.firebaseapp.com",
  projectId: "peak-coffee-3b1e0",
  storageBucket: "peak-coffee-3b1e0.firebasestorage.app",
  messagingSenderId: "166401454852",
  appId: "1:166401454852:web:55964a878b94701cf1d651"
};

// Initialize Firebase trong Service Worker
firebase.initializeApp(firebaseConfig);

// Lấy messaging instance
const messaging = firebase.messaging();

// Handle background messages (khi app không mở)
messaging.onBackgroundMessage((payload) => {
  console.log('📩 [firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Đơn hàng mới!';
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có đơn hàng mới cần xử lý',
    icon: '/icon-192x192.png', // Logo quán (cần tạo file này)
    badge: '/badge-72x72.png',
    tag: 'new-order', // Group notifications
    requireInteraction: true, // Notification không tự tắt
    vibrate: [200, 100, 200], // Vibration pattern
    data: payload.data, // Custom data
    actions: [
      {
        action: 'view',
        title: '👀 Xem đơn',
        icon: '/view-icon.png'
      },
      {
        action: 'close',
        title: '✕ Đóng',
        icon: '/close-icon.png'
      }
    ]
  };

  // Hiển thị notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view') {
    // Mở app và focus vào admin dashboard
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Tìm tab đã mở app
        for (const client of clientList) {
          if (client.url.includes('localhost') || client.url.includes('peak-coffee')) {
            return client.focus();
          }
        }
        // Nếu chưa mở, mở tab mới
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
