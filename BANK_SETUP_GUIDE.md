# 🏦 HƯỚNG DẪN CẤU HÌNH THÔNG TIN NGÂN HÀNG

## 📍 Vị trí file cần chỉnh sửa
**File**: `src/components/PaymentModal.jsx`  
**Dòng**: 13-18

---

## 🔧 BƯỚC 1: MỞ FILE VÀ TÌM ĐOẠN CODE

Mở file `PaymentModal.jsx` và tìm đoạn code sau (khoảng dòng 13):

```javascript
// Thông tin ngân hàng - BẠN CẦN THAY ĐỔI THÔNG TIN NÀY
const BANK_INFO = {
  bankName: 'MB Bank',           // Thay tên ngân hàng của bạn
  bankCode: '970422',            // Mã BIN của ngân hàng (MB Bank: 970422)
  accountNumber: '0123456789',   // THAY SỐ TÀI KHOẢN CỦA BẠN
  accountName: 'NGUYEN VAN A',   // THAY TÊN TÀI KHOẢN CỦA BẠN
};
```

---

## 📝 BƯỚC 2: THAY ĐỔI THÔNG TIN

### 1. **bankName** - Tên ngân hàng
Ví dụ:
```javascript
bankName: 'VietcomBank'      // hoặc
bankName: 'Techcombank'      // hoặc
bankName: 'BIDV'             // hoặc
bankName: 'ACB'
```

### 2. **bankCode** - Mã BIN ngân hàng (Quan trọng cho VietQR)
**Bảng tra cứu mã BIN:**

| Ngân hàng        | Mã BIN  |
|------------------|---------|
| VietcomBank      | 970436  |
| Techcombank      | 970407  |
| BIDV             | 970418  |
| VietinBank       | 970415  |
| MBBank           | 970422  |
| ACB              | 970416  |
| Sacombank        | 970403  |
| VPBank           | 970432  |
| TPBank           | 970423  |
| HDBank           | 970437  |
| Agribank         | 970405  |
| OCB              | 970448  |
| MSB              | 970426  |
| SCB              | 970429  |
| VIB              | 970441  |
| SHB              | 970443  |
| Eximbank         | 970431  |
| SeABank          | 970440  |
| LienVietPostBank | 970449  |
| PVcomBank        | 970412  |
| BaoVietBank      | 970438  |
| DongA Bank       | 970406  |

> **Lưu ý**: Nếu ngân hàng của bạn không có trong danh sách, search Google: "Mã BIN [tên ngân hàng]"

### 3. **accountNumber** - Số tài khoản
```javascript
accountNumber: '1234567890'   // Thay bằng số TK của bạn
```

### 4. **accountName** - Tên chủ tài khoản (VIẾT HOA KHÔNG DẤU)
```javascript
accountName: 'NGUYEN VAN A'   // Ví dụ
accountName: 'LE THI B'       // Ví dụ
```

> **⚠️ Quan trọng**: Phải viết HOA và KHÔNG DẤU theo đúng tên trên tài khoản ngân hàng!

---

## ✅ VÍ DỤ CẤU HÌNH ĐẦY ĐỦ

### Ví dụ 1: VietcomBank
```javascript
const BANK_INFO = {
  bankName: 'VietcomBank',
  bankCode: '970436',
  accountNumber: '1234567890',
  accountName: 'TRAN VAN THANH',
};
```

### Ví dụ 2: Techcombank
```javascript
const BANK_INFO = {
  bankName: 'Techcombank',
  bankCode: '970407',
  accountNumber: '19036699999',
  accountName: 'PHAM THI HUONG',
};
```

### Ví dụ 3: MBBank
```javascript
const BANK_INFO = {
  bankName: 'MB Bank',
  bankCode: '970422',
  accountNumber: '0123456789012',
  accountName: 'HOANG MINH DUC',
};
```

---

## 🧪 BƯỚC 3: KIỂM TRA

1. **Lưu file** (Ctrl + S)
2. **Mở app** (đang chạy `npm run dev`)
3. **Thêm món vào giỏ** → "ĐẶT MÓN NGAY"
4. **Chọn "Chuyển khoản QR"**
5. **Kiểm tra QR Code**:
   - ✅ QR Code hiển thị đúng
   - ✅ Thông tin ngân hàng đúng
   - ✅ Số tiền tự động điền
   - ✅ Nội dung CK có format: `PEAK + mã đơn`

---

## 🎯 CÁCH HOẠT ĐỘNG CỦA VIETQR API

QR Code được tạo từ URL động:
```
https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.jpg
  ?amount={số_tiền}
  &addInfo=PEAK{mã_đơn}
  &accountName={tên_tài_khoản}
```

**Ví dụ URL thực tế:**
```
https://img.vietqr.io/image/970436-1234567890-compact2.jpg
  ?amount=50000
  &addInfo=PEAK12345678
  &accountName=NGUYEN%20VAN%20A
```

Khi khách quét QR:
- ✅ App ngân hàng tự động mở
- ✅ Số tiền đã được điền sẵn
- ✅ Nội dung chuyển khoản đã có
- ✅ Khách chỉ cần xác nhận

---

## 🔍 KIỂM TRA MÃ BIN CỦA BẠN

### Cách 1: Tra Google
Search: `Mã BIN [tên ngân hàng của bạn]`

### Cách 2: Kiểm tra trực tiếp VietQR
Truy cập: https://api.vietqr.io/  
Tìm tên ngân hàng trong danh sách API

### Cách 3: Test thử
1. Tạo QR với mã BIN khác nhau
2. Quét bằng app ngân hàng
3. Mã nào app mở đúng → Đó là mã BIN đúng!

---

## ❓ TROUBLESHOOTING

### 🐛 Lỗi 1: QR Code không hiển thị
**Nguyên nhân**: Mã BIN sai hoặc không kết nối mạng  
**Giải pháp**: 
- Kiểm tra lại `bankCode`
- Kiểm tra internet
- Reload lại trang

### 🐛 Lỗi 2: Quét QR không mở app ngân hàng
**Nguyên nhân**: Mã BIN sai  
**Giải pháp**: Tra lại mã BIN chính xác của ngân hàng

### 🐛 Lỗi 3: Thông tin hiển thị sai
**Nguyên nhân**: Nhập sai số TK hoặc tên  
**Giải pháp**: 
- Kiểm tra lại `accountNumber`
- Kiểm tra `accountName` phải VIẾT HOA KHÔNG DẤU

---

## 🎁 BONUS: TỐI ƯU HÓA

### Thêm logo ngân hàng (tuỳ chọn)
Nếu muốn hiển thị logo ngân hàng, thêm field này:

```javascript
const BANK_INFO = {
  bankName: 'VietcomBank',
  bankCode: '970436',
  accountNumber: '1234567890',
  accountName: 'NGUYEN VAN A',
  logoUrl: 'https://link-to-vietcombank-logo.png',  // ← Thêm dòng này
};
```

Sau đó cập nhật UI trong PaymentModal để hiển thị logo.

---

## 📚 TÀI LIỆU THAM KHẢO

- **VietQR API Docs**: https://vietqr.io/
- **Danh sách mã BIN**: https://napas.com.vn/
- **QR Code Generator**: https://www.qrcode.com/en/

---

## ✨ KẾT LUẬN

Sau khi cấu hình xong:
- ✅ Khách quét QR là thanh toán ngay
- ✅ Không cần nhập thủ công số TK, số tiền, nội dung
- ✅ Giảm thiểu lỗi chuyển khoản sai
- ✅ Tăng tốc độ thanh toán 10x

**Hãy kiểm tra kỹ thông tin trước khi đưa vào production!**

---

**Cập nhật lần cuối**: 03/01/2026  
**Version**: 1.0
