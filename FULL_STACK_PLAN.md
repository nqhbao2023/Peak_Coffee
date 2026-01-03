# Kế hoạch Full Stack cho Peak Coffee (Firebase)

Dưới đây là lộ trình chuyển đổi Peak Coffee từ Frontend-only sang Full Stack App sử dụng Firebase.

## 1. Thiết lập Firebase Project
- **Tạo Project**: Truy cập Firebase Console và tạo project mới "Peak Coffee".
- **Kích hoạt dịch vụ**:
  - **Authentication**: Bật "Anonymous" (để khách đặt không cần login) và "Google/Phone" (cho Admin/Shipper).
  - **Firestore Database**: Chọn location gần nhất (Singapore - asia-southeast1).
  - **Storage**: Để lưu ảnh món ăn.
  - **Hosting**: Để deploy web app.

## 2. Cấu trúc Database (Firestore)
Chúng ta sẽ sử dụng NoSQL Firestore với cấu trúc sau:

### Collection: `products` (Menu)
Lưu trữ danh sách món ăn thay vì file `menu.js`.
```json
{
  "id": "cafe-sua",
  "name": "Cafe Sữa",
  "price": 18000,
  "category": "Cafe Máy",
  "image": "url_tu_storage",
  "description": "...",
  "hasTemp": true,
  "hasSugar": true,
  "isAvailable": true
}
```

### Collection: `orders` (Đơn hàng)
Lưu trữ đơn hàng từ khách.
```json
{
  "id": "order_123",
  "userId": "anonymous_user_id",
  "items": [
    { "productId": "cafe-sua", "quantity": 2, "options": {...}, "price": 36000 }
  ],
  "total": 36000,
  "status": "pending", // pending -> preparing -> ready -> completed
  "createdAt": timestamp,
  "paymentMethod": "cash" // hoặc momo/banking sau này
}
```

## 3. Các bước triển khai (Coding)

### Giai đoạn 1: Kết nối Firebase & Menu động
1.  Cài đặt Firebase SDK: `npm install firebase`.
2.  Tạo file `src/firebase/config.js` để khởi tạo app.
3.  Viết hook `useMenu` để fetch data từ Firestore `products`.
4.  Thay thế `MENU_DATA` tĩnh bằng data từ hook.

### Giai đoạn 2: Đặt hàng (Order Placement)
1.  Khi bấm "ĐẶT MÓN NGAY":
    - Tạo document mới trong collection `orders`.
    - Hiển thị thông báo thành công và mã đơn hàng.
    - Reset giỏ hàng.

### Giai đoạn 3: Admin Dashboard (Cho nhân viên)
1.  Tạo route `/admin` (bảo vệ bằng password hoặc login Google).
2.  Giao diện hiển thị danh sách `orders` realtime (dùng `onSnapshot`).
3.  Chức năng đổi trạng thái đơn (Nhận đơn -> Đã làm xong).
4.  Chức năng bật/tắt món (Hết hàng).

## 4. UI/UX Nâng cao
- **Realtime Status**: Khách hàng có thể thấy trạng thái đơn hàng của mình thay đổi ngay lập tức (Đang pha chế...).
- **Lịch sử đơn hàng**: Lưu lại các món đã đặt (dựa trên device ID/Anonymous Auth).

## 5. Deploy
- Chạy `npm run build`.
- Cài Firebase CLI: `npm install -g firebase-tools`.
- Chạy `firebase deploy`.

---
**Lưu ý**: Hiện tại tôi đã fix các lỗi UI/UX và data như bạn yêu cầu. Bạn có thể review trước khi chúng ta bắt đầu Giai đoạn 1.
