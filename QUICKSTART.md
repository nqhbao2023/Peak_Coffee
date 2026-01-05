# 🎯 QUICK START GUIDE - PEAK COFFEE v2.0

## 🚀 CÀI ĐẶT & CHẠY PROJECT

```bash
# 1. Clone hoặc mở project
cd Peak_Coffee

# 2. Cài đặt dependencies (nếu chưa có)
npm install

# 3. Chạy development server
npm run dev

# 4. Mở trình duyệt
# → http://localhost:5173
```

---

## ⚙️ CẤU HÌNH NGAY (QUAN TRỌNG!)

### ⚠️ THAY THÔNG TIN NGÂN HÀNG CỦA BẠN

**File**: `src/components/PaymentModal.jsx` (dòng 13-18)

```javascript
const BANK_INFO = {
  bankName: 'VietcomBank',       // ← THAY TÊN NGÂN HÀNG
  bankCode: '970436',            // ← THAY MÃ BIN (xem bảng dưới)
  accountNumber: '1234567890',   // ← THAY SỐ TÀI KHOẢN
  accountName: 'NGUYEN VAN A',   // ← THAY TÊN (VIẾT HOA KHÔNG DẤU)
};
```

**📋 Bảng mã BIN ngân hàng:**
- VietcomBank: `970436`
- Techcombank: `970407`
- MBBank: `970422`
- BIDV: `970418`
- ACB: `970416`
- VietinBank: `970415`

👉 **Xem đầy đủ**: [BANK_SETUP_GUIDE.md](./BANK_SETUP_GUIDE.md)

---

## ✨ TÍNH NĂNG MỚI

### 🎁 1. Hệ thống tích điểm
- Mua 10 ly → Nhận 1 voucher miễn phí
- Card hiển thị progress đẹp mắt
- Tự động cộng điểm sau mỗi đơn

### 💳 2. Thanh toán QR Code
- QR Code động (VietQR API)
- Tự động điền số tiền + nội dung
- Hỗ trợ cả tiền mặt

### 📦 3. Quản lý đơn hàng
- Xem lịch sử đơn hàng
- Theo dõi trạng thái
- Xem chi tiết từng đơn

### 🔔 4. Thông báo Toast
- Thông báo khi thêm món
- Thông báo đặt hàng thành công
- Hiển thị voucher mới nhận

---

## 📱 HƯỚNG DẪN SỬ DỤNG

### Khách hàng:
1. **Tích điểm**: Xem progress ở đầu trang
2. **Chọn món**: Click vào món → Chọn options → Thêm giỏ
3. **Dùng voucher**: Tick checkbox khi thanh toán
4. **Thanh toán**: Quét QR hoặc chọn tiền mặt
5. **Theo dõi**: Click icon 📦 để xem đơn hàng

### Admin (Coming soon):
- Dashboard quản lý đơn hàng
- Thống kê doanh thu
- Cập nhật trạng thái đơn

---

## 📂 CẤU TRÚC PROJECT

```
src/
├── contexts/              # State Management
│   ├── LoyaltyContext     # Tích điểm
│   └── OrderContext       # Đơn hàng
├── components/
│   ├── LoyaltyCard        # Card tích điểm
│   ├── PaymentModal       # Modal thanh toán
│   ├── OrderHistory       # Lịch sử đơn
│   ├── CartModal          # Giỏ hàng
│   ├── Header             # Header + icons
│   ├── Hero               # Banner
│   └── ...
├── data/
│   └── menu.js            # Data món ăn
└── App.jsx                # Main app
```

---

## 🛠️ TECH STACK

- **React** 19.2 + Vite 7
- **Tailwind CSS** 3.4
- **Framer Motion** 12 (Animations)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)
- **UUID** (Order codes)
- **VietQR API** (QR Codes)

---

## 📖 TÀI LIỆU CHI TIẾT

- [COMPLETED_FEATURES.md](./COMPLETED_FEATURES.md) - Tính năng đã hoàn thành
- [BANK_SETUP_GUIDE.md](./BANK_SETUP_GUIDE.md) - Hướng dẫn setup ngân hàng
- [FULL_STACK_PLAN.md](./FULL_STACK_PLAN.md) - Kế hoạch Firebase

---

## 🎯 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Đã thay thông tin ngân hàng
- [ ] Đã test QR Code (quét thử)
- [ ] Đã test tích điểm + voucher
- [ ] Đã test đặt hàng end-to-end
- [ ] UI responsive trên mobile

---

## 🐛 TROUBLESHOOTING

### QR Code không hiển thị?
→ Kiểm tra internet + mã BIN ngân hàng

### Voucher không hoạt động?
→ Clear LocalStorage: `localStorage.clear()` trong Console

### Lỗi khác?
→ Mở Console (F12) xem lỗi chi tiết

---

## 🚀 NEXT STEPS

### Phase 2: Backend
- [ ] Setup Firebase
- [ ] Migrate data sang Firestore
- [ ] Admin Dashboard
- [ ] Authentication

### Phase 3: Advanced
- [ ] PWA (cài app)
- [ ] Push Notifications
- [ ] Casso API (auto check payment)
- [ ] Rating system

---

## 💡 TIPS

1. **Test trên mobile thật**: UI được optimize cho mobile
2. **Clear cache**: Nếu có lỗi lạ, Ctrl+Shift+R
3. **LocalStorage**: Data lưu trong browser (chưa có backend)
4. **QR dynamic**: Mỗi đơn có QR + nội dung riêng

---

## 📞 SUPPORT

Có vấn đề? Check:
1. Console log (F12)
2. Network tab (kiểm tra API calls)
3. LocalStorage (Application tab)

---

**Version**: 2.0.0  
**Status**: ✅ Production Ready (Frontend)  
**Updated**: 03/01/2026

**LET'S GO PEAK! 🚀**
