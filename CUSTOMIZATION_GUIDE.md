# 🎛️ HƯỚNG DẪN TÙY CHỈNH HỆ THỐNG GỢI Ý

## 📍 File cần sửa: `src/utils/suggestionEngine.js`

---

## 1️⃣ Thay đổi mức giảm giá

### Hiện tại:
- **3-4 ly:** Giảm 5.000đ
- **5+ ly:** Giảm 10.000đ

### Cách sửa:
```javascript
// Dòng 12-15 trong suggestionEngine.js
export const DISCOUNT_TIERS = [
  { quantity: 5, discount: 10000, name: 'Combo Đội Nhóm', icon: '🔥', color: 'orange' },
  { quantity: 3, discount: 5000, name: 'Combo Nhóm Nhỏ', icon: '✨', color: 'blue' },
];
```

### Ví dụ: Thêm tier mới (10 ly giảm 20K)
```javascript
export const DISCOUNT_TIERS = [
  { quantity: 10, discount: 20000, name: 'Combo Siêu Khủng', icon: '💥', color: 'purple' },
  { quantity: 5, discount: 10000, name: 'Combo Đội Nhóm', icon: '🔥', color: 'orange' },
  { quantity: 3, discount: 5000, name: 'Combo Nhóm Nhỏ', icon: '✨', color: 'blue' },
];
```

**Lưu ý:** Xếp từ lớn → nhỏ (quantity giảm dần)

---

## 2️⃣ Thay đổi món gợi ý

### Hiện tại:
Hệ thống gợi ý 4 món phổ biến:
1. Nước Dừa (15K)
2. Nước Mía (10K)
3. Coca Cola (10K)
4. Nước Chanh (15K)

### Cách sửa:
```javascript
// Dòng 18-23 trong suggestionEngine.js
const POPULAR_SUGGESTIONS = [
  { id: 6, name: 'Nước Dừa', price: 15000, category: 'Giải Khát', reason: 'Giải nhiệt cực tốt' },
  { id: 10, name: 'Nước Mía', price: 10000, category: 'Giải Khát', reason: 'Giá rẻ, bổ sung năng lượng' },
  { id: 11, name: 'Coca Cola', price: 10000, category: 'Nước Ngọt', reason: 'Sảng khoái, giá hợp lý' },
  { id: 8, name: 'Nước Chanh', price: 15000, category: 'Giải Khát', reason: 'Thanh mát, vitamin C' },
];
```

### Ví dụ: Thêm Pepsi vào danh sách
```javascript
const POPULAR_SUGGESTIONS = [
  { id: 6, name: 'Nước Dừa', price: 15000, category: 'Giải Khát', reason: 'Giải nhiệt cực tốt' },
  { id: 10, name: 'Nước Mía', price: 10000, category: 'Giải Khát', reason: 'Giá rẻ, bổ sung năng lượng' },
  { id: 11, name: 'Coca Cola', price: 10000, category: 'Nước Ngọt', reason: 'Sảng khoái, giá hợp lý' },
  { id: 12, name: 'Pepsi', price: 10000, category: 'Nước Ngọt', reason: 'Ngon không kém Coca' }, // ← MỚI
  { id: 8, name: 'Nước Chanh', price: 15000, category: 'Giải Khát', reason: 'Thanh mát, vitamin C' },
];
```

**Lấy ID từ đâu?**
→ Xem file `src/data/menu.js` để lấy `id` chính xác

---

## 3️⃣ Thay đổi số lượng món gợi ý

### Hiện tại:
Hệ thống gợi ý **tối đa số món cần thêm**

Ví dụ:
- Cần thêm 1 món → Hiển thị 1 món
- Cần thêm 2 món → Hiển thị 2 món

### Cách sửa để LUÔN hiển thị 3 món:
```javascript
// Dòng 50 trong suggestionEngine.js
// Thay đổi từ:
.slice(0, itemsNeeded)

// Thành:
.slice(0, 3) // Luôn hiển thị 3 món
```

---

## 4️⃣ Thay đổi màu sắc

### File: `src/components/CartModal.jsx`

#### Combo đang áp dụng (Orange):
```jsx
// Dòng ~200
className="mb-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 rounded-2xl"
```

**Đổi sang màu đỏ:**
```jsx
className="mb-4 p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 rounded-2xl"
```

#### Card gợi ý (Blue):
```jsx
// Dòng ~217
className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-2xl overflow-hidden"
```

**Đổi sang màu tím:**
```jsx
className="mb-4 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-400 rounded-2xl overflow-hidden"
```

---

## 5️⃣ Ẩn gợi ý nếu giỏ hàng > X món

### Ví dụ: Không gợi ý nếu đã có 3+ món

```javascript
// Trong CartModal.jsx, dòng ~13 (sau khi tính suggestionData)
// Thêm điều kiện:
const shouldShowSuggestion = suggestions.length > 0 && nextTier && cartItems.length < 3;

// Sau đó thay:
{suggestions.length > 0 && nextTier && (
  // UI gợi ý
)}

// Thành:
{shouldShowSuggestion && (
  // UI gợi ý
)}
```

---

## 6️⃣ Gợi ý thông minh hơn (Advanced)

### Hiện tại: Gợi ý cố định

### Upgrade: Gợi ý theo giỏ hàng

```javascript
// Trong suggestionEngine.js
const getSmartSuggestions = (cartItems, allMenuItems) => {
  const hasCafe = cartItems.some(item => item.category.includes('Cafe'));
  const hasWater = cartItems.some(item => item.category === 'Giải Khát');
  
  // Nếu có cafe → Gợi ý nước giải khát
  if (hasCafe && !hasWater) {
    return [
      { id: 6, name: 'Nước Dừa', reason: 'Uống cùng cafe cực hợp!' },
      { id: 8, name: 'Nước Chanh', reason: 'Cân bằng đắng của cafe' },
    ];
  }
  
  // Nếu chỉ có nước ngọt → Gợi ý cafe
  if (!hasCafe) {
    return [
      { id: 1, name: 'Cafe Sữa', reason: 'Thêm năng lượng cho ngày dài' },
    ];
  }
  
  // Mặc định
  return POPULAR_SUGGESTIONS;
};
```

---

## 7️⃣ Test thay đổi

### Sau khi sửa:
1. Save file (Ctrl+S)
2. Vite tự động reload
3. Mở giỏ hàng → Kiểm tra

### Debug:
```javascript
// Thêm vào CartModal.jsx
console.log('Suggestions:', suggestions);
console.log('Current Tier:', currentTier);
console.log('Next Tier:', nextTier);
```

---

## 🎯 Tips

### 1. Giữ giá gợi ý <= 15K
→ Khách sẽ dễ mua hơn

### 2. Lý do ngắn gọn
→ Tối đa 5-6 từ

### 3. Màu sắc tương phản
→ Nút [+ THÊM] phải nổi bật

### 4. Test mobile first
→ Vào http://localhost:5173 từ điện thoại

---

## 📞 Troubleshooting

### Lỗi: Món gợi ý không hiển thị
```
Nguyên nhân: ID món không tồn tại trong menu
Giải pháp: Check file menu.js, lấy đúng ID
```

### Lỗi: Giảm giá không đúng
```
Nguyên nhân: DISCOUNT_TIERS không xếp đúng thứ tự
Giải pháp: Xếp từ quantity lớn → nhỏ
```

### Lỗi: Gợi ý hiển thị món đã có trong giỏ
```
Nguyên nhân: Logic filter bị sai
Giải pháp: Check dòng 46-50 trong suggestionEngine.js
```

---

Chúc bạn tùy chỉnh thành công! 🚀
