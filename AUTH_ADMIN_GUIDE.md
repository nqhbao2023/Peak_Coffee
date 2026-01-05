# 🔐 HƯỚNG DẪN ĐĂNG NHẬP & ADMIN

## ✅ ĐÃ TRIỂN KHAI

### 1. **HỆ THỐNG ĐĂNG NHẬP**
- ✅ Form đăng nhập đơn giản: SĐT + Tên
- ✅ Không cần mật khẩu
- ✅ Lưu LocalStorage
- ✅ Bắt buộc đăng nhập trước khi đặt món

### 2. **ADMIN DASHBOARD**
- ✅ Giao diện quản lý đơn hàng realtime
- ✅ Thống kê tổng quan (Chờ duyệt/Đang pha/Sẵn sàng/Hoàn thành)
- ✅ Cập nhật trạng thái đơn
- ✅ Xóa đơn đã hoàn thành
- ✅ Tìm kiếm đơn hàng

### 3. **UI/UX CẢI THIỆN**
- ✅ Bỏ Hero banner "Đặt món siêu tốc"
- ✅ Chỉ giữ lại LoyaltyCard
- ✅ Header có nút Admin (cho admin)
- ✅ Header có nút Login/Logout

---

## 🎯 CÁCH SỬ DỤNG

### **A. ĐĂNG NHẬP (USER)**

1. Click icon **👤 User** trên Header
2. Nhập số điện thoại (10-11 số)
3. Nhập tên của bạn
4. Click "ĐĂNG NHẬP"
5. ✅ Đã đăng nhập! Giờ có thể đặt món

**Lưu ý:**
- Không cần mật khẩu
- Thông tin lưu trên browser
- Đổi browser = phải đăng nhập lại

---

### **B. ĐĂNG NHẬP ADMIN**

**Số điện thoại Admin:** `0000000000`

**Các bước:**
1. Click icon **👤 User** trên Header
2. Nhập SĐT: `0000000000`
3. Nhập tên: `Admin` (hoặc bất kỳ)
4. Click "ĐĂNG NHẬP"
5. ✅ Icon **🛡️ Shield** xuất hiện (Admin mode)

---

### **C. DUYỆT ĐƠN HÀNG (ADMIN)**

1. Đăng nhập với SĐT Admin
2. Click icon **🛡️ Shield** trên Header
3. Thấy Admin Dashboard với:
   - **Thống kê:** Số đơn theo trạng thái
   - **Tìm kiếm:** Tìm mã đơn
   - **Danh sách đơn:** Grid layout đẹp

#### **Cập nhật trạng thái đơn:**

**Flow đơn hàng:**
```
Chờ duyệt → Đang pha chế → Sẵn sàng → Hoàn thành
```

**Actions:**
- **Chờ duyệt:** Click "Bắt đầu pha" → Đang pha chế
- **Đang pha:** Click "Đã xong" → Sẵn sàng
- **Sẵn sàng:** Click "Đã giao" → Hoàn thành
- **Hoàn thành:** Click icon 🗑️ để xóa

**Colors:**
- 🟡 Chờ duyệt (Amber)
- 🔵 Đang pha (Blue)
- 🟢 Sẵn sàng (Green)
- ⚪ Hoàn thành (Gray)

---

### **D. ĐĂNG XUẤT**

1. Click icon **🚪 LogOut** trên Header
2. ✅ Đã đăng xuất
3. Icon đổi lại thành **👤 User**

---

## 🔧 CẤU HÌNH

### **Thay đổi số Admin:**

Mở file: `src/contexts/AuthContext.jsx`

```javascript
// Admin phone number (có thể thay đổi)
const ADMIN_PHONE = '0000000000';  // ← THAY SỐ NÀY
```

**Ví dụ:**
```javascript
const ADMIN_PHONE = '0987654321';  // Số điện thoại của bạn
```

---

## 🎬 DEMO FLOW HOÀN CHỈNH

### **Khách hàng đặt món:**
```
1. Vào app (chưa login)
2. Chọn món → Thêm giỏ
3. Click "ĐẶT MÓN NGAY"
4. ❌ Toast: "Vui lòng đăng nhập!"
5. LoginModal tự động mở
6. Nhập SĐT + Tên → Đăng nhập
7. ✅ Toast: "Chào [Tên]!"
8. Thêm món lại → Giỏ hàng
9. "ĐẶT MÓN NGAY" → PaymentModal
10. Chọn QR/Cash → "XÁC NHẬN"
11. ✅ Đơn hàng tạo (Status: Chờ duyệt)
```

### **Admin duyệt đơn:**
```
1. Đăng nhập Admin (SĐT: 0000000000)
2. Click icon 🛡️ Shield
3. Thấy đơn "Chờ duyệt"
4. Click "Bắt đầu pha" → Đang pha chế
5. Pha chế xong → Click "Đã xong" → Sẵn sàng
6. Khách lấy món → Click "Đã giao" → Hoàn thành
7. (Optional) Xóa đơn cũ
```

### **Khách xem trạng thái:**
```
1. Click icon 📦 Package
2. Thấy đơn vừa đặt
3. Trạng thái cập nhật realtime (khi admin thay đổi)
4. Expand → Xem chi tiết món
```

---

## 🎨 UI COMPONENTS

### **Header Icons:**
```
[Logo] PEAK COFFEE
                    [🛡️ Admin] [📦 Orders] [👤 User/🚪 Logout] [🛒 Cart]
```

**Khi chưa login:**
- 👤 User (màu cam) → Click để login

**Khi đã login (user):**
- 🚪 LogOut → Hover thấy tên
- 📦 Package → Xem đơn hàng

**Khi đã login (admin):**
- 🛡️ Shield (gradient cam-đỏ) → Admin Dashboard
- 🚪 LogOut → Hover thấy tên
- 📦 Package → Xem đơn hàng

---

## 📱 RESPONSIVE

- **Mobile:** Single column admin grid
- **Tablet:** 2 columns
- **Desktop:** 3 columns

Admin Dashboard có scroll riêng, không ảnh hưởng page.

---

## 🔒 BẢO MẬT

**Hiện tại:**
- ❌ Không có authentication thật
- ❌ Bất kỳ ai biết SĐT Admin đều vào được
- ❌ LocalStorage có thể edit trực tiếp

**Lưu ý:**
- Đây là MVP, chỉ phù hợp demo/test
- Production cần Firebase Auth

**Cải thiện sau (Phase 2):**
- [ ] Firebase Authentication
- [ ] Admin role trong Firestore
- [ ] Password/OTP verification
- [ ] Session management

---

## 🐛 TROUBLESHOOTING

### Lỗi: Không vào được Admin
→ Kiểm tra SĐT phải chính xác `0000000000`

### Lỗi: Đăng nhập rồi nhưng vẫn bắt login
→ Clear LocalStorage: Console → `localStorage.clear()`

### Lỗi: Admin Dashboard không hiển thị đơn
→ Reload page hoặc kiểm tra LocalStorage `peak_orders`

---

## ✨ FEATURES NỔI BẬT

1. **Zero Password** - Chỉ cần SĐT + Tên
2. **Instant Admin** - SĐT đặc biệt = Admin
3. **Visual Status** - Color-coded theo trạng thái
4. **One-Click Actions** - Cập nhật nhanh
5. **Search Orders** - Tìm mã đơn dễ dàng
6. **Stats Overview** - Thống kê tổng quan

---

## 🎯 SỬ DỤNG THỰC TẾ

### **Tại quán:**
1. Khách vào app → Đăng nhập (lần đầu)
2. Đặt món → Thanh toán
3. Nhân viên (Admin) xem đơn trên Dashboard
4. Cập nhật trạng thái khi pha chế
5. Gọi khách lấy món khi "Sẵn sàng"

### **Tip:**
- In mã QR đặt món dán trước quán
- Nhân viên mở Admin Dashboard trên tablet
- Khách tự đặt, tự thanh toán
- Nhân viên chỉ cần pha chế

---

**Version:** 2.1.0  
**Updated:** 03/01/2026  
**Status:** ✅ Ready for Testing

---

**🚀 Giờ đã có hệ thống hoàn chỉnh: Khách đặt → Admin duyệt → Hoàn thành!**
