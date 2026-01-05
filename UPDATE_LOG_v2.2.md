# 🎉 CẬP NHẬT v2.2 - Sửa Logic Tích Điểm & Thêm Góp Ý

## 📋 TỔNG QUAN
Phiên bản này giải quyết 2 vấn đề quan trọng:
1. **Fix Logic Tích Điểm**: Chỉ tích điểm khi đơn hàng được admin duyệt (completed)
2. **Chức Năng Góp Ý**: Cho phép khách hàng gửi góp ý/đề xuất đơn giản

---

## 🔧 1. FIX LOGIC TÍCH ĐIỂM

### ❌ VẤN ĐỀ TRƯỚC ĐÂY
- Điểm được cộng **NGAY** khi khách đặt hàng
- Nếu đơn hàng bị hủy → khách vẫn nhận điểm (không hợp lý)

### ✅ GIẢI PHÁP MỚI
- Điểm chỉ được cộng khi admin **HOÀN THÀNH** đơn hàng (status = 'completed')
- Logic tích điểm tự động thông qua callback mechanism

### 📂 FILES THAY ĐỔI

#### 1. `src/contexts/OrderContext.jsx`
```javascript
// ✅ Thêm callback mechanism
let loyaltyAddPointsCallback = null;
export const setLoyaltyCallback = (callback) => {
  loyaltyAddPointsCallback = callback;
};

// ✅ Tự động tích điểm khi đơn completed
const updateOrderStatus = (orderId, newStatus) => {
  // ... update status ...
  
  // Tích điểm khi completed
  if (newStatus === 'completed' && targetOrder && loyaltyAddPointsCallback) {
    const totalItems = targetOrder.items.reduce((sum, item) => sum + item.quantity, 0);
    const earnedVouchers = loyaltyAddPointsCallback(totalItems);
    
    // Toast notification cho khách
    toast.success(/* ... */);
  }
};
```

#### 2. `src/contexts/LoyaltyContext.jsx`
```javascript
// ✅ Đăng ký callback với OrderContext
useEffect(() => {
  setLoyaltyCallback(addPoints);
}, [points, vouchers]);
```

#### 3. `src/App.jsx`
```javascript
// ❌ XÓA logic tích điểm ngay
const handlePaymentConfirm = (paymentMethod) => {
  // ...
  // ❌ const earnedVouchers = addPoints(totalItems); // XÓA
  
  // ✅ Thông báo điểm sẽ được cộng sau
  toast.success("Điểm thưởng sẽ được cộng sau khi đơn hoàn thành");
};
```

### 🎯 WORKFLOW MỚI
1. Khách đặt hàng → **KHÔNG tích điểm**
2. Admin duyệt đơn (preparing → ready → **completed**)
3. Khi admin chuyển status = **completed** → **Tự động tích điểm**
4. Khách nhận notification: "🎉 Đơn hàng hoàn thành! (+X điểm / +Y voucher)"

---

## 💬 2. CHỨC NĂNG GÓP Ý

### 🎨 THIẾT KẾ ĐƠN GIẢN
- Nút "GÓP Ý" màu xanh dương ở BottomNav (cạnh nút "GỌI NGAY")
- Modal form đơn giản: Tên (optional) + Nội dung
- Gợi ý nhanh: "Muốn thêm món mới", "Phục vụ chậm", v.v.
- Lưu vào localStorage (sau này Firebase)

### 📂 FILES MỚI

#### 1. `src/components/FeedbackModal.jsx`
**Component cho khách hàng gửi góp ý**
- Form: Tên (không bắt buộc), Nội dung (bắt buộc)
- Gợi ý nhanh để điền nhanh
- Lưu vào localStorage key: `peak_feedbacks`
- Toast notification khi gửi thành công

```javascript
// Data structure
{
  id: "timestamp",
  name: "Tên khách (hoặc 'Khách hàng')",
  message: "Nội dung góp ý",
  timestamp: "ISO string",
  status: "pending" // pending, read, replied
}
```

#### 2. `src/components/FeedbackList.jsx`
**Component cho admin xem góp ý**
- Hiển thị trong AdminDashboard → Tab "Cài đặt"
- Tự động refresh mỗi 5 giây
- Đánh dấu "Mới" cho feedback chưa đọc
- Nút "Đánh dấu đã đọc"
- Hiển thị thời gian (vừa xong, X phút trước, ...)

### 📂 FILES SỬA ĐỔI

#### 3. `src/components/BottomNav.jsx`
```javascript
// ✅ Thêm nút Góp Ý
<button onClick={onFeedbackClick} className="...">
  <MessageSquare /> GÓP Ý
</button>
```

#### 4. `src/App.jsx`
```javascript
// ✅ State mới
const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

// ✅ Truyền callback
<BottomNav onFeedbackClick={() => setIsFeedbackOpen(true)} />

// ✅ Render modal
<FeedbackModal isOpen={isFeedbackOpen} onClose={...} />
```

#### 5. `src/components/AdminDashboard.jsx`
```javascript
// ✅ Import và hiển thị trong tab Settings
import FeedbackList from './FeedbackList';

{activeTab === 'settings' && (
  <div>
    <FeedbackList />
    {/* ... */}
  </div>
)}
```

---

## 🧪 CÁCH TEST

### Test 1: Tích Điểm Sau Khi Duyệt
1. Đặt hàng 3 món (3 điểm)
2. Kiểm tra: **ĐIỂM CHƯA ĐƯỢC CỘNG**
3. Login admin → Chuyển đơn sang "Hoàn thành"
4. Khách nhận notification: "🎉 Đơn hàng hoàn thành! (+3 điểm)"
5. Kiểm tra loyalty card: **Điểm đã được cộng**

### Test 2: Góp Ý
1. Click nút "GÓP Ý" màu xanh ở dưới
2. Nhập tên (hoặc bỏ trống), nhập nội dung
3. Hoặc click gợi ý nhanh: "Muốn thêm món mới"
4. Click "GỬI GÓP Ý"
5. Nhận toast: "Gửi góp ý thành công! 🎉"

### Test 3: Admin Xem Góp Ý
1. Login admin
2. Vào tab "⚙️ Cài đặt"
3. Thấy danh sách góp ý
4. Feedback mới có badge "Mới" màu đỏ
5. Click "Đánh dấu đã đọc" → Badge biến mất

---

## 📊 DATA STORAGE

### LocalStorage Keys
| Key | Mô tả | Structure |
|-----|-------|-----------|
| `peak_feedbacks` | Danh sách góp ý | Array of feedback objects |
| `peak_orders` | Đơn hàng | Array of order objects |
| `peak_loyalty_points` | Điểm tích lũy | Number |
| `peak_loyalty_vouchers` | Số voucher | Number |

### Feedback Object
```json
{
  "id": "1704419200000",
  "name": "Nguyễn Văn A",
  "message": "Shop có thể thêm trà sữa matcha không ạ?",
  "timestamp": "2026-01-04T10:00:00.000Z",
  "status": "pending"
}
```

---

## 🎯 UX IMPROVEMENTS

### Mobile-First Design
- Nút to, dễ chạm (min-height: 44px)
- Modal full screen mobile, rounded desktop
- Vibration feedback khi gửi thành công
- Toast notification rõ ràng

### Accessibility
- Placeholder gợi ý rõ ràng
- Gợi ý nhanh cho người không biết viết gì
- Tên không bắt buộc (tôn trọng privacy)
- Limit 500 ký tự (tránh spam)

### Admin Experience
- Auto-refresh feedback list (5s)
- Badge đếm số feedback mới
- Timestamp thân thiện ("5 phút trước")
- Quick action: Đánh dấu đã đọc

---

## 🚀 NEXT STEPS (Tương Lai)

### Tích Điểm
- [ ] Hoàn tiền điểm nếu admin hủy đơn
- [ ] Lịch sử tích/trừ điểm
- [ ] Điểm x2 vào ngày đặc biệt

### Góp Ý
- [ ] Admin reply feedback (2-way communication)
- [ ] Categories: Món mới, Phục vụ, Giá cả, Khác
- [ ] Upload ảnh kèm góp ý
- [ ] Firebase sync (realtime)
- [ ] Email notification cho admin khi có góp ý mới

---

## 📝 NOTES CHO DEVELOPER

### Performance
- Feedback list tự động refresh 5s → Cân nhắc WebSocket sau này
- localStorage có giới hạn ~5-10MB → Cần cleanup feedback cũ định kỳ

### Security
- Hiện tại không có validation input → Cần sanitize HTML sau này
- Không có rate limiting → Cần thêm throttle để tránh spam

### Scalability
- localStorage → Firebase khi scale up
- Cần pagination cho feedback list nếu > 100 items

---

## 👨‍💻 MAINTAINED BY
Peak Coffee Development Team  
Version: 2.2  
Date: 2026-01-04
