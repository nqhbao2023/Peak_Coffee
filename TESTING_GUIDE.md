# 🧪 DEMO & TEST SCENARIOS

## 📋 CHECKLIST KIỂM TRA TOÀN BỘ

### ✅ 1. LoyaltyCard Component
- [ ] Card hiển thị đúng với gradient đẹp
- [ ] Progress bar animation mượt
- [ ] Stamps (10 ô tròn) hiển thị đúng
- [ ] Số điểm hiện tại chính xác
- [ ] Số voucher hiển thị (khi có)

**Test:**
```javascript
// Mở Console (F12) và chạy:
localStorage.setItem('peak_loyalty_points', '7')
localStorage.setItem('peak_loyalty_vouchers', '2')
// Reload page → Thấy 7/10 điểm + 2 voucher
```

---

### ✅ 2. Menu & Add to Cart
- [ ] Menu hiển thị đầy đủ món
- [ ] Filter category hoạt động
- [ ] Click món → ProductModal mở
- [ ] Chọn options (nóng/lạnh, đường)
- [ ] Add to cart → Toast notification
- [ ] Cart badge cập nhật số lượng

**Test Flow:**
```
1. Click "Cafe Sữa"
2. Chọn "Đá"
3. Quantity = 2
4. "THÊM VÀO GIỎ"
5. ✅ Toast: "Đã thêm vào giỏ hàng!"
6. ✅ Badge header: 2
```

---

### ✅ 3. CartModal với Voucher
- [ ] Giỏ hàng hiển thị món đã chọn
- [ ] Update quantity +/-
- [ ] Remove item hoạt động
- [ ] Voucher checkbox xuất hiện (khi có voucher)
- [ ] Tính toán giảm giá đúng (món đắt nhất)
- [ ] Tổng tiền chính xác

**Test Voucher:**
```javascript
// Setup: Thêm voucher
localStorage.setItem('peak_loyalty_vouchers', '1')

// Test:
1. Thêm "Cafe Sữa" (18k) + "Trà Sữa" (25k)
2. Mở giỏ hàng
3. ✅ Thấy checkbox "Dùng voucher"
4. Tick checkbox
5. ✅ Giảm 25k (món Trà Sữa - đắt nhất)
6. ✅ Tổng = 18k
```

---

### ✅ 4. PaymentModal với QR Code
- [ ] Modal mở khi click "ĐẶT MÓN NGAY"
- [ ] 2 phương thức: QR vs Cash
- [ ] QR Code hiển thị (từ VietQR API)
- [ ] Thông tin ngân hàng đúng
- [ ] Copy button hoạt động
- [ ] Nội dung CK có format: PEAK + mã

**Test QR:**
```
1. Mở giỏ hàng → "ĐẶT MÓN NGAY"
2. Chọn "Chuyển khoản QR"
3. ✅ QR Code hiển thị
4. ✅ Số tài khoản: [số của bạn]
5. Click icon Copy → ✅ Copied!
6. Quét QR bằng app ngân hàng → ✅ Mở đúng
```

**Test Cash:**
```
1. Chọn "Tiền mặt"
2. ✅ Hiển thị thông báo "Chuẩn bị tiền mặt"
3. ✅ Icon Banknote hiển thị
```

---

### ✅ 5. Xác nhận đặt hàng
- [ ] Click "XÁC NHẬN ĐẶT HÀNG"
- [ ] Toast hiển thị mã đơn
- [ ] Voucher bị trừ (nếu dùng)
- [ ] Điểm tăng lên
- [ ] Nhận voucher mới (nếu đủ 10)
- [ ] Giỏ hàng reset về 0
- [ ] Modal đóng

**Test Complete Flow:**
```
Setup: 
- Points = 9
- Vouchers = 0

Flow:
1. Thêm 1 món vào giỏ
2. Đặt hàng → Xác nhận
3. ✅ Toast: "Đặt hàng thành công!"
4. ✅ Toast: "+1 voucher miễn phí!"
5. ✅ LoyaltyCard: 0/10 điểm, 1 voucher
6. ✅ Giỏ hàng: 0 món
```

---

### ✅ 6. OrderHistory Component
- [ ] Click icon 📦 trên Header
- [ ] Hiển thị danh sách đơn hàng
- [ ] Click đơn → Expand chi tiết
- [ ] Trạng thái đơn đúng
- [ ] Thời gian hiển thị
- [ ] Xóa đơn hoàn thành

**Test:**
```
1. Đặt 3 đơn hàng
2. Click icon 📦
3. ✅ Thấy 3 đơn
4. Click đơn 1 → ✅ Expand chi tiết
5. ✅ Thấy món + số lượng + giá
6. ✅ Phương thức thanh toán
```

---

### ✅ 7. Responsive Mobile
- [ ] UI đẹp trên điện thoại (375px)
- [ ] Touch targets đủ lớn (min 44px)
- [ ] Scroll smooth
- [ ] Modal full screen mobile
- [ ] Text không bị cắt

**Test:**
```
1. F12 → Toggle device toolbar
2. Chọn iPhone SE (375px)
3. ✅ Tất cả element vừa màn hình
4. ✅ Buttons dễ bấm
5. ✅ Text đọc được
```

---

### ✅ 8. Animation & UX
- [ ] Modal slide up smooth
- [ ] Toast fade in/out
- [ ] Loyalty card stamps animate
- [ ] Button scale khi click
- [ ] Progress bar transition
- [ ] Vibration feedback (mobile)

**Test:**
```
1. Thêm món → ✅ Vibrate + Toast
2. Mở modal → ✅ Slide animation
3. LoyaltyCard → ✅ Stamps pop in
4. Button → ✅ Scale effect
```

---

## 🎬 DEMO SCENARIOS

### Scenario 1: Khách hàng mới
```
1. Lần đầu vào app
2. LoyaltyCard: 0/10
3. Chọn 2 món
4. Thanh toán QR
5. ✅ Nhận 2 điểm
6. Tiếp tục mua...
```

### Scenario 2: Nhận voucher
```
1. Đã có 9 điểm
2. Mua thêm 1 ly
3. ✅ Đạt 10 điểm → Tự động đổi voucher
4. ✅ Toast: "+1 voucher!"
5. LoyaltyCard: 0/10, 1 voucher
```

### Scenario 3: Dùng voucher
```
1. Có 1 voucher
2. Thêm "Trà Sữa" (25k) + "Cafe" (18k)
3. Giỏ hàng: 43k
4. ✅ Tick "Dùng voucher"
5. ✅ Giảm 25k (món đắt nhất)
6. ✅ Tổng: 18k
7. Thanh toán → ✅ Voucher bị trừ
```

### Scenario 4: Xem lịch sử
```
1. Đã đặt 5 đơn
2. Click icon 📦
3. ✅ Thấy danh sách
4. Click đơn → ✅ Xem chi tiết
5. Đơn cũ → ✅ Xóa được
```

---

## 🐛 BUG TESTING

### Test Case 1: Voucher không đủ
```
Vouchers = 0
→ Tick checkbox voucher
→ ✅ Không áp dụng giảm giá
→ ✅ Checkbox disabled hoặc ẩn
```

### Test Case 2: Giỏ hàng rỗng
```
Giỏ = 0 món
→ Mở CartModal
→ ✅ Hiển thị "Chưa có món"
→ ✅ Button "ĐẶT MÓN" ẩn
```

### Test Case 3: QR Code lỗi
```
Mất internet
→ Thanh toán QR
→ ✅ Fallback: Hiển thị text "QR Code"
→ ✅ Vẫn có thông tin STK để copy
```

### Test Case 4: LocalStorage đầy
```
(Hiếm gặp, nhưng cần handle)
→ Lưu quá nhiều đơn
→ ✅ Có giới hạn hoặc clear cũ
```

---

## 📊 PERFORMANCE CHECK

### Lighthouse Score Target:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

### Test:
```
1. F12 → Lighthouse tab
2. Generate report
3. ✅ Kiểm tra scores
```

---

## 🎯 USER ACCEPTANCE TESTING

### Câu hỏi cho người dùng thật:
1. "Bạn hiểu cách tích điểm không?" → ✅ Yes
2. "Quét QR có dễ không?" → ✅ Yes
3. "UI có đẹp/dễ dùng không?" → ✅ Yes
4. "Có gì khó hiểu không?" → ❌ No
5. "Bạn có dùng lại không?" → ✅ Yes

---

## 🔢 TEST DATA SUGGESTIONS

### Điểm test tích điểm:
```javascript
// 0 điểm, chưa có voucher
localStorage.setItem('peak_loyalty_points', '0')
localStorage.setItem('peak_loyalty_vouchers', '0')

// 5 điểm, chưa đủ voucher
localStorage.setItem('peak_loyalty_points', '5')
localStorage.setItem('peak_loyalty_vouchers', '0')

// 9 điểm, sắp đủ
localStorage.setItem('peak_loyalty_points', '9')
localStorage.setItem('peak_loyalty_vouchers', '0')

// 3 điểm, đã có 2 voucher
localStorage.setItem('peak_loyalty_points', '3')
localStorage.setItem('peak_loyalty_vouchers', '2')
```

### Đơn hàng test:
```javascript
// Tạo đơn test
const testOrder = {
  id: 'test-001',
  orderCode: 'ABC12345',
  items: [
    {name: 'Cafe Sữa', quantity: 2, finalPrice: 18000}
  ],
  total: 36000,
  paymentMethod: 'qr',
  status: 'pending',
  createdAt: new Date().toISOString()
}

// Lưu
let orders = JSON.parse(localStorage.getItem('peak_orders') || '[]')
orders.push(testOrder)
localStorage.setItem('peak_orders', JSON.stringify(orders))
```

---

## ✅ FINAL CHECKLIST

Trước khi deploy:

**Functionality:**
- [ ] Tất cả features hoạt động
- [ ] Không có lỗi Console
- [ ] Mobile responsive
- [ ] Toast notifications work
- [ ] LocalStorage persist

**UI/UX:**
- [ ] Animation mượt
- [ ] Colors consistent
- [ ] Typography clear
- [ ] Icons align
- [ ] Loading states

**Data:**
- [ ] Thông tin ngân hàng đã thay
- [ ] QR Code test thành công
- [ ] Menu data đầy đủ
- [ ] Images load nhanh

**Performance:**
- [ ] Page load < 3s
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Lazy loading images

---

**Happy Testing! 🧪**

Phát hiện bug? Đừng lo, đó là cơ hội để cải thiện! 💪
