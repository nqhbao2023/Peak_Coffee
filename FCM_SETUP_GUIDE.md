# 🔔 HƯỚNG DẪN SETUP FIREBASE CLOUD MESSAGING (FCM)

## Mục tiêu
Admin nhận **push notification trên iPhone** khi có đơn hàng mới.

---

## 📋 BƯỚC 1: LẤY VAPID KEY TỪ FIREBASE CONSOLE

### 1.1. Vào Firebase Console
- Truy cập: https://console.firebase.google.com/
- Chọn project: **peak-coffee-3b1e0**

### 1.2. Vào Cloud Messaging Settings
- Sidebar → **Build** → **Cloud Messaging**
- Scroll xuống phần **Web configuration**
- Tìm **Web Push certificates**

### 1.3. Generate Web Push Certificate (nếu chưa có)
- Click **Generate key pair**
- Copy **Key pair** (format: `BNxxxxxxx...`)

### 1.4. Thay VAPID_KEY trong code
Mở file: `src/firebase/messaging.js`
```javascript
// Dòng 9: Thay YOUR_VAPID_KEY_HERE
const VAPID_KEY = 'BNxxxxxxx...'; // 👈 Paste key vừa copy
```

---

## 📋 BƯỚC 2: BẬT CLOUD MESSAGING API

### 2.1. Enable Cloud Messaging API
- Firebase Console → **Project Settings** (⚙️ icon)
- Tab **Cloud Messaging**
- Click **Manage API in Google Cloud Console**
- Click **Enable** (nếu chưa enable)

### 2.2. Kiểm tra Server key
- Quay lại Firebase Console → **Cloud Messaging**
- Kiểm tra có **Server key** (dạng `AAAAxxxxx...`)
- Lưu key này (dùng để gửi notification từ backend sau này)

---

## 📋 BƯỚC 3: SETUP CLOUD FUNCTION (Optional - Nâng cao)

### 3.1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 3.2. Initialize Cloud Functions
```bash
cd "c:\Users\BAOA PC\Documents\GitHub\Peak_Coffee"
firebase init functions
# Chọn TypeScript hoặc JavaScript
# Chọn Install dependencies? → Yes
```

### 3.3. Tạo function gửi notification khi có đơn mới
File: `functions/index.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Trigger khi có document mới trong collection 'orders'
exports.sendNewOrderNotification = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Chỉ gửi notification cho đơn pending
    if (order.status !== 'pending') {
      return null;
    }

    // Lấy FCM tokens của tất cả admin
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('isAdmin', '==', true)
      .where('fcmToken', '!=', null)
      .get();

    if (usersSnapshot.empty) {
      console.log('No admin with FCM token found');
      return null;
    }

    // Tạo notification payload
    const payload = {
      notification: {
        title: '🔔 Đơn hàng mới!',
        body: `Mã đơn: #${order.orderCode} - ${order.total.toLocaleString()}đ`,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'new-order',
        requireInteraction: true,
      },
      data: {
        orderId: context.params.orderId,
        orderCode: order.orderCode,
        total: order.total.toString(),
        click_action: '/',
      },
    };

    // Gửi notification đến tất cả admin tokens
    const tokens = [];
    usersSnapshot.forEach(doc => {
      const token = doc.data().fcmToken;
      if (token) tokens.push(token);
    });

    if (tokens.length === 0) {
      return null;
    }

    // Send multicast
    const response = await admin.messaging().sendMulticast({
      tokens: tokens,
      ...payload,
    });

    console.log(`✅ Sent ${response.successCount} notifications`);
    return response;
  });
```

### 3.4. Deploy Cloud Function
```bash
firebase deploy --only functions
```

---

## 📋 BƯỚC 4: TEST TRÊN IPHONE

### 4.1. Cài đặt yêu cầu
- **iOS 16.4+** (Push notification trên Safari iOS)
- Hoặc dùng **PWA (Progressive Web App)** - Add to Home Screen

### 4.2. Deploy lên Firebase Hosting (HTTPS bắt buộc)
```bash
# Build production
npm run build

# Init hosting
firebase init hosting
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No

# Deploy
firebase deploy --only hosting
```

### 4.3. Truy cập trên iPhone
- Mở Safari → https://peak-coffee-3b1e0.web.app (URL của bạn)
- Đăng nhập admin (SĐT: 1111111111)
- Safari sẽ hỏi **"Allow Notifications?"** → Click **Allow**
- FCM token sẽ tự động lưu vào Firestore

### 4.4. Test notification
- Mở iPhone khác hoặc máy tính
- Đặt hàng thử
- Admin iPhone sẽ nhận notification ngay lập tức! 🎉

---

## 📋 BƯỚC 5: ADD TO HOME SCREEN (PWA)

### 5.1. Tạo manifest.json
File: `public/manifest.json`

```json
{
  "name": "Peak Coffee",
  "short_name": "Peak Coffee",
  "description": "Đặt món nhanh - Nhận ngay tại quán",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 5.2. Link manifest trong index.html
File: `index.html`

```html
<head>
  ...
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#f97316">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="/icon-192x192.png">
</head>
```

### 5.3. Tạo icon (sử dụng logo quán)
- Tạo 2 files: `icon-192x192.png` và `icon-512x512.png`
- Đặt vào folder `public/`
- Tool: https://realfavicongenerator.net/

### 5.4. Add to Home Screen trên iPhone
- Safari → Share button (biểu tượng chia sẻ)
- Scroll xuống → **Add to Home Screen**
- Icon Peak Coffee sẽ xuất hiện trên màn hình chính
- Mở như app native → Nhận notification tốt hơn!

---

## 🚨 TROUBLESHOOTING

### Lỗi: "Messaging is not supported in this browser"
- **Nguyên nhân:** Safari iOS < 16.4 không hỗ trợ Web Push
- **Giải pháp:** Update iOS hoặc dùng PWA (Add to Home Screen)

### Lỗi: "Registration failed - no Service Worker"
- **Nguyên nhân:** File `firebase-messaging-sw.js` không đúng vị trí
- **Giải pháp:** Đảm bảo file ở `public/` (không phải `src/`)

### Lỗi: "Notification permission denied"
- **Nguyên nhân:** User đã chặn notification
- **Giải pháp:** Settings → Safari → Websites → Notifications → Allow

### Không nhận notification trên iPhone
- Kiểm tra: Settings → Notifications → Safari → Allow Notifications
- Kiểm tra: Có mạng (WiFi/4G)
- Kiểm tra: App đang chạy HTTPS (không phải localhost)
- Kiểm tra: FCM token đã lưu trong Firestore chưa

---

## 🎯 CHECKLIST

- [ ] Đã lấy VAPID Key từ Firebase Console
- [ ] Đã thay `YOUR_VAPID_KEY_HERE` trong `messaging.js`
- [ ] Đã enable Cloud Messaging API
- [ ] Đã deploy Cloud Function (nếu dùng)
- [ ] Đã build và deploy lên Firebase Hosting
- [ ] Đã test trên iPhone với HTTPS
- [ ] Đã allow notification permission
- [ ] Đã kiểm tra FCM token lưu trong Firestore
- [ ] Đã test đặt hàng → nhận notification thành công

---

## 📖 DOCS THAM KHẢO

- Firebase Cloud Messaging: https://firebase.google.com/docs/cloud-messaging/js/client
- Web Push on iOS: https://webkit.org/blog/12824/
- PWA on iOS: https://developer.apple.com/videos/play/wwdc2021/10106/

---

**Lưu ý:** Bước quan trọng nhất là **deploy lên HTTPS** vì Safari iOS không cho test notification trên localhost!
