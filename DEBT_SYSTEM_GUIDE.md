# 📊 HƯỚNG DẪN HỆ THỐNG GHI NỢ - PEAK COFFEE

> **Phiên bản:** v1.0  
> **Ngày tạo:** 2024  
> **Mục đích:** Quản lý công nợ khách hàng thanh toán cuối tháng

---

## 🎯 MỤC ĐÍCH

Hệ thống cho phép **90% khách quen** ghi nợ và thanh toán sau (thường vào cuối tháng). Hỗ trợ:
- ✅ Thanh toán từng phần (trả thiếu)
- ✅ Theo dõi lịch sử thanh toán
- ✅ Thống kê công nợ realtime
- ✅ Quản lý chi tiết từng khách hàng

---

## 📱 HƯỚNG DẪN SỬ DỤNG CHO KHÁCH HÀNG

### Bước 1: Thêm món vào giỏ
- Chọn món như bình thường
- Tùy chỉnh (Size, Đá, Đường) nếu cần

### Bước 2: Thanh toán
1. Nhấn **"Thanh toán"** từ giỏ hàng
2. Chọn phương thức **"Ghi nợ"** (icon đồng hồ ⏰)
3. Nhập thông tin:
   - **Họ tên:** VD: Nguyễn Văn A
   - **Số điện thoại:** VD: 0901234567
4. Nhấn **"XÁC NHẬN ĐẶT HÀNG"**

### Kết quả:
- ✅ Đơn hàng được ghi nợ thành công
- 📱 Hiển thị thông báo: "Đã ghi nợ cho [Tên khách]!"
- 💾 Lưu vào hệ thống công nợ

---

## 👨‍💼 HƯỚNG DẪN QUẢN LÝ CHO ADMIN

### Truy cập trang Công nợ

1. Đăng nhập admin
2. Mở **Admin Dashboard**
3. Chọn tab **"Công nợ"** (icon 💲)

### Các tính năng chính:

#### 📊 **Thống kê tổng quan**
Hiển thị 4 thẻ thống kê:
- **Tổng nợ** (màu đỏ): Tổng tiền khách đang nợ
- **Khách nợ** (màu xanh dương): Số lượng khách đang có nợ
- **Đơn chưa TT** (màu vàng): Số đơn hàng chưa thanh toán đủ
- **Đã thu** (màu xanh lá): Tổng số tiền đã thu được

#### 🔍 **Tìm kiếm khách hàng**
- Gõ tên hoặc số điện thoại vào ô tìm kiếm
- Kết quả lọc realtime

#### 📋 **Danh sách khách hàng**
Hiển thị:
- Tên + Số điện thoại
- Tổng nợ còn lại
- Số đơn hàng
- Tổng đã trả
- Badge "Nợ cao" nếu > 50,000đ

**Nhấn vào khách** để xem chi tiết & thanh toán.

---

## 💰 THANH TOÁN NỢ

### Cách 1: Thanh toán nhanh (Toàn bộ hoặc 1/2)
1. Mở chi tiết khách hàng
2. Phần **"Thanh toán nhanh"**:
   - Nhập số tiền
   - Hoặc nhấn **"Trả hết"** / **"Trả 1/2"**
3. Nhấn **"Thanh toán"**

### Cách 2: Thanh toán từng đơn
1. Tìm đơn cần thanh toán (màu đỏ = chưa TT)
2. Nhấn **"Thanh toán đơn này"**
3. Nhập số tiền (có thể trả thiếu)
4. Nhấn **"OK"**

### Kết quả:
- ✅ Nếu trả đủ: Đơn chuyển sang màu xanh lá, hiển thị "✓ Đã thanh toán"
- ⚠️ Nếu trả thiếu: Hiển thị số tiền còn nợ, lưu lịch sử thanh toán

---

## 📈 LỊCH SỬ THANH TOÁN

Mỗi đơn hàng hiển thị:
- Ngày thanh toán
- Số tiền đã trả
- Số tiền còn nợ

**Ví dụ:**
```
Lịch sử thanh toán:
12/01/2024    +50,000đ
15/01/2024    +30,000đ
[Còn nợ: 20,000đ]
```

---

## 🔄 TRẠNG THÁI ĐƠN HÀNG

| Trạng thái | Màu sắc | Ý nghĩa |
|-----------|---------|---------|
| **DEBT** | 🔴 Đỏ | Còn nợ (chưa thanh toán đủ) |
| **PAID** | 🟢 Xanh lá | Đã thanh toán đủ |

---

## 💡 TÍNH NĂNG NỔI BẬT

### 1. Thanh toán từng phần
- Khách có thể trả từng phần thay vì trả hết
- Hệ thống tự động tính số tiền còn lại
- VD: Nợ 100,000đ → Trả 60,000đ → Còn 40,000đ

### 2. Lưu lịch sử
- Mỗi lần thanh toán đều được ghi lại
- Có timestamp chính xác
- Xem được toàn bộ quá trình thanh toán

### 3. Tự động sắp xếp
- Khách nợ nhiều nhất hiển thị trên đầu
- Dễ dàng theo dõi khách cần ưu tiên

### 4. Badge cảnh báo
- "Nợ cao" nếu tổng nợ > 50,000đ
- Màu đỏ nổi bật để dễ nhận biết

---

## 📦 CẤU TRÚC DỮ LIỆU

### Customer (Khách hàng)
```javascript
{
  phone: "0901234567",
  name: "Nguyễn Văn A",
  totalDebt: 100000,      // Tổng nợ còn lại
  totalPaid: 50000,       // Tổng đã trả
  orderCount: 5,          // Số đơn hàng
  orders: [...],          // Danh sách ID đơn hàng
  createdAt: "2024-01-01T10:00:00",
  lastOrderDate: "2024-01-15T14:30:00",
  lastPaymentDate: "2024-01-10T09:00:00"
}
```

### DebtOrder (Đơn nợ)
```javascript
{
  id: "debt_xxx",
  orderCode: "PC1234",
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  items: [...],           // Danh sách món
  total: 100000,          // Tổng tiền đơn
  paid: 60000,            // Đã thanh toán
  remaining: 40000,       // Còn nợ
  status: "DEBT",         // DEBT hoặc PAID
  paymentHistory: [       // Lịch sử thanh toán
    {
      id: "pay_xxx",
      amount: 30000,
      paidAt: "2024-01-10T09:00:00"
    },
    {
      id: "pay_yyy",
      amount: 30000,
      paidAt: "2024-01-12T15:00:00"
    }
  ],
  createdAt: "2024-01-01T10:00:00"
}
```

---

## 🛠️ API CONTEXT

### `useDebt()` Hook

#### Lấy dữ liệu:
```javascript
const { 
  customers,           // Danh sách khách hàng
  debtOrders,          // Danh sách đơn nợ
  getDebtStats,        // Lấy thống kê
  getCustomerDebtOrders // Lấy đơn theo khách
} = useDebt();
```

#### Thao tác:
```javascript
// Tạo đơn nợ mới
createDebtOrder({
  orderCode: "PC1234",
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  items: cartItems,
  total: 100000
});

// Thanh toán (từng phần hoặc đủ)
payDebt(orderId, amount);

// Thanh toán toàn bộ nợ của 1 khách
payAllDebtByCustomer(customerPhone, amount);
```

---

## 🎨 THIẾT KẾ UI/UX

### Màu sắc:
- 🔴 **Đỏ:** Nợ, cảnh báo
- 🟢 **Xanh lá:** Đã thanh toán
- 🔵 **Xanh dương:** Ghi nợ, thông tin
- 🟡 **Vàng:** Chờ xử lý

### Icons:
- ⏰ **Clock:** Ghi nợ
- 💲 **DollarSign:** Công nợ
- 👤 **User:** Khách hàng
- 📞 **Phone:** Số điện thoại
- ✅ **Check:** Đã thanh toán
- ⚠️ **AlertCircle:** Chưa thanh toán

---

## 📝 LƯU Ý QUAN TRỌNG

### ✅ Nên làm:
- Kiểm tra thông tin khách trước khi ghi nợ
- Cập nhật thanh toán ngay khi nhận tiền
- Theo dõi thống kê định kỳ
- Nhắc nhở khách nợ quá hạn

### ❌ Không nên:
- Để khách nợ quá nhiều (>500,000đ nên cảnh báo)
- Quên cập nhật thanh toán
- Xóa lịch sử thanh toán
- Để trùng số điện thoại (hệ thống tự nhận diện)

---

## 🚀 TÍNH NĂNG TƯƠNG LAI (Dự kiến)

- [ ] SMS/Zalo nhắc nợ tự động
- [ ] Xuất báo cáo Excel
- [ ] Biểu đồ thống kê theo thời gian
- [ ] Đặt hạn thanh toán
- [ ] Tính lãi nếu quá hạn
- [ ] QR Code thanh toán nhanh

---

## 🐛 XỬ LÝ LỖI

### Lỗi thường gặp:

**1. "Vui lòng nhập đầy đủ thông tin"**
- **Nguyên nhân:** Chưa nhập tên hoặc số điện thoại
- **Giải pháp:** Điền đầy đủ 2 trường

**2. "Số điện thoại không hợp lệ"**
- **Nguyên nhân:** SĐT < 10 số
- **Giải pháp:** Nhập đúng format (VD: 0901234567)

**3. "Số tiền vượt quá nợ còn lại"**
- **Nguyên nhân:** Nhập số tiền lớn hơn số nợ
- **Giải pháp:** Kiểm tra lại số nợ và nhập đúng

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề khi sử dụng hệ thống:
1. Kiểm tra console log (F12)
2. Xem localStorage: `debt_customers`, `debt_orders`
3. Liên hệ developer để được hỗ trợ

---

## 📄 BẢN QUYỀN

© 2024 Peak Coffee - Hệ thống quản lý công nợ v1.0

---

**🎉 CHÚC BẠN SỬ DỤNG HIỆU QUẢ!**
