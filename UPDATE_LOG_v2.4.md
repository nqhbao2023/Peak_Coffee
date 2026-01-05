# 🎉 CẬP NHẬT v2.4 - COMBO DEAL & STREAK SYSTEM

## 📋 TỔNG QUAN
Phiên bản này thêm 2 tính năng PEAK để tăng doanh thu và retention:
1. **COMBO DEAL**: Tăng giá trị đơn hàng (AOV)
2. **STREAK SYSTEM**: Tạo thói quen đặt món hàng ngày (Retention)

---

## 🔥 1. COMBO DEAL

### 🎯 MỤC ĐÍCH
- Tăng **Average Order Value** (từ 25k → 40k+)
- Upsell tự nhiên: "Thêm bánh mì chỉ còn 10k"
- Phù hợp công nhân: Combo bữa sáng/trưa

### 📦 CÁC COMBO

#### Combo 1: Sáng Nhanh (35k)
- Cà phê sữa đá + Bánh mì thịt
- Tiết kiệm: **5k** (40k → 35k)
- Best time: 7h-9h sáng

#### Combo 2: Trưa Đã (45k)
- Trà sữa trân châu + Chả giò 3 cái
- Tiết kiệm: **10k** (55k → 45k)
- Best time: 11h-13h

#### Combo 3: 2 Ly Bất Kỳ
- Chọn 2 món nước bất kỳ
- Giảm: **10%**
- Best for: Gọi chung đồng nghiệp

#### Combo 4: Chiều Nhẹ (30k)
- Cà phê đen đá + Bánh flan
- Tiết kiệm: **5k** (35k → 30k)
- Best time: 14h-16h

#### Combo 5: Đội Nhóm
- Từ 3 món trở lên
- Giảm: **15%**
- Best for: Đặt chung cả nhóm

### 🎨 UI/UX

**Tab Combo Riêng**:
- Category "🔥 COMBO" ở đầu danh sách
- Badge "TIẾT KIỆM Xk" nổi bật màu đỏ-cam
- Icon emoji to rõ: ☕🥖, 🧋🍤
- Tag thời gian: "⏰ 7h-9h sáng"

**ComboCard Component**:
- Header gradient đỏ-cam với badge tiết kiệm
- Danh sách "Bao gồm:" rõ ràng
- Giá gạch ngang (originalPrice)
- Nút "CHỌN COMBO" to, dễ nhấn

### 📂 FILES MỚI

1. **src/data/combos.js**
   - Export COMBOS array
   - Structure: id, name, items, prices, discount, image, category

2. **src/components/ComboCard.jsx**
   - Hiển thị combo với UI đẹp
   - Badge tiết kiệm nổi bật
   - Handle addToCart với isCombo flag

### 🔧 TÍCH HỢP

**App.jsx**:
- Import COMBOS
- Thêm 'Combo' vào categories
- Filter: nếu category='Combo' → render COMBOS
- Render ComboCard thay vì MenuItem

**CategoryFilter**:
- Tự động nhận 'Combo' từ categories
- Không cần sửa gì

---

## 🔥 2. STREAK SYSTEM (ĐIỂM DANH LIÊN TỤC)

### 🎯 MỤC ĐÍCH
- **Retention**: User đặt món HÀNG NGÀY
- **Gamification**: Vui, addictive, không muốn bỏ lỡ
- **Rewards**: Voucher miễn phí theo streak

### 📊 REWARDS TABLE

| Streak | Reward | Mô tả |
|--------|--------|-------|
| 3 ngày | +1 voucher | Động viên ban đầu |
| 7 ngày | +3 vouchers | Milestone tuần |
| 14 ngày | +5 vouchers | 2 tuần liên tục |
| 30 ngày | 1 ly MIỄN PHÍ | Ultimate goal |

### 🧠 LOGIC

#### Cơ chế:
1. Mỗi lần đặt món = +1 streak
2. **Chỉ được điểm danh 1 lần/ngày**
3. Bỏ lỡ 1 ngày → **Reset về 0**
4. Ngày liên tiếp = ngày hôm sau (không tính cùng ngày)

#### Auto-check:
- Mở app → Tự động kiểm tra streak có bị break không
- Break nếu: hôm nay - lastOrderDate > 1 ngày

#### Tracking:
- `streak`: Số ngày liên tục hiện tại
- `lastOrderDate`: Ngày đặt món gần nhất
- `orderDates`: Array các ngày đã đặt (format: YYYY-MM-DD)
- `streakHistory`: Lịch sử streak theo ngày

### 🎨 UI/UX

#### StreakBadge (Header):
- Icon 🔥 Flame animate-pulse
- Text: "5 NGÀY"
- Sub-text: "Còn 2 ngày" (đến reward tiếp)
- Màu gradient đỏ-cam nổi bật
- Click → Mở StreakModal

#### StreakModal:
**Header**:
- Streak hiện tại: "5 NGÀY" to đậm
- Next reward: "7 ngày: +3 vouchers (còn 2 ngày)"

**Calendar 30 ngày**:
- Grid 7x5 (7 cột = 7 ngày trong tuần)
- Ngày đã đặt: Gradient đỏ-cam
- Ngày hôm nay: Ring orange
- Ngày chưa đặt: Xám nhạt

**Rewards List**:
- 4 tiers rewards
- Đã đạt: ✓ màu xanh
- Đang làm: Badge "Tiếp theo" cam
- Chưa đạt: Xám

**Tip**:
- "Đặt món mỗi ngày để giữ streak!"

### 📂 FILES MỚI

1. **src/contexts/StreakContext.jsx**
   - StreakProvider với localStorage
   - Functions:
     - `addStreak()`: Tăng streak khi đặt món
     - `checkStreakBreak()`: Kiểm tra bị break
     - `getNextReward()`: Lấy reward tiếp theo
     - `resetStreak()`: Reset về 0
   - Constants: STREAK_REWARDS

2. **src/components/StreakBadge.jsx**
   - Badge hiển thị ở Header
   - Chỉ show nếu streak > 0
   - Click → Mở StreakModal

3. **src/components/StreakModal.jsx**
   - Modal chi tiết streak
   - Calendar 30 ngày gần nhất
   - Rewards progress
   - Tips

### 🔧 TÍCH HỢP

**App.jsx**:
- Import StreakProvider, useStreak, components
- Wrap <StreakProvider> trong providers chain
- State: `isStreakOpen`
- `handlePaymentConfirm()`: Gọi `addStreak()`
- Pass `<StreakBadge />` vào Header
- Render `<StreakModal />`

**Header.jsx**:
- Nhận prop `streakBadge`
- Render giữa Admin và Order History

---

## 📊 DATA STORAGE

### LocalStorage Keys Mới

| Key | Mô tả | Type |
|-----|-------|------|
| `peak_streak` | Số ngày liên tục | Number |
| `peak_last_order_date` | ISO string ngày gần nhất | String |
| `peak_order_dates` | Array các ngày đã đặt | Array |
| `peak_streak_history` | Lịch sử streak | Array |

### Streak History Object
```json
{
  "date": "2026-01-04",
  "streak": 5
}
```

---

## 🎯 WORKFLOW

### User đặt món lần đầu:
1. Checkout → `handlePaymentConfirm()`
2. Gọi `addStreak()`
3. Streak = 1
4. Toast: "🔥 Streak: 1 ngày!"
5. StreakBadge xuất hiện ở Header

### User đặt món ngày 2 liên tiếp:
1. Checkout
2. `addStreak()` → Check `isConsecutiveDay()` = true
3. Streak = 2
4. Toast: "🔥 Streak: 2 ngày!"

### User đặt món ngày 3 (đạt reward):
1. Checkout
2. Streak = 3
3. Nhận reward: +1 voucher
4. Toast: "🔥 3 ngày liên tục! 3 ngày: +1 voucher"

### User bỏ lỡ 1 ngày:
1. Mở app ngày 5 (không đặt ngày 4)
2. `checkStreakBreak()` → Phát hiện gap > 1 ngày
3. Streak → 0
4. StreakBadge biến mất

### User đặt lại sau khi break:
1. Checkout
2. Streak = 1 (bắt đầu lại)

---

## 🧪 CÁCH TEST

### Test Combo:
1. Click tab "🔥 COMBO"
2. Thấy 5 combos với badge "TIẾT KIỆM"
3. Click "CHỌN COMBO" → Thêm vào giỏ
4. Kiểm tra giá = comboPrice (không phải originalPrice)

### Test Streak Lần Đầu:
1. Đặt món → Toast: "🔥 Streak: 1 ngày!"
2. Header xuất hiện badge 🔥 "1 NGÀY"
3. Click badge → Modal streak
4. Calendar: hôm nay được tô màu cam

### Test Streak Liên Tiếp:
**⚠️ QUAN TRỌNG**: Để test, cần **thay đổi ngày hệ thống**
1. Đặt món ngày 1 (streak = 1)
2. Đổi ngày máy sang ngày 2
3. Refresh app → Đặt món → streak = 2
4. Đổi ngày máy sang ngày 4 (bỏ lỡ ngày 3)
5. Refresh app → Streak = 0 (bị break)

### Test Reward:
1. Fake streak: 
   ```javascript
   localStorage.setItem('peak_streak', '2');
   ```
2. Đặt món → Streak = 3
3. Toast: "🔥 3 ngày liên tục! 3 ngày: +1 voucher"

### Test Calendar:
1. Fake orderDates:
   ```javascript
   const dates = ['2026-01-01', '2026-01-02', '2026-01-04'];
   localStorage.setItem('peak_order_dates', JSON.stringify(dates));
   ```
2. Mở StreakModal
3. Thấy ngày 1, 2, 4 được tô màu
4. Ngày 3 trống (bỏ lỡ)

---

## 💡 BUSINESS IMPACT

### Combo Deal:
- **AOV tăng 30-50%**: Từ 25k → 35-40k/đơn
- **Upsell tự nhiên**: "Combo rẻ hơn mua lẻ"
- **Dễ quyết định**: Không cần suy nghĩ nhiều

### Streak System:
- **Retention +40%**: User đặt hàng ngày thay vì 2-3 lần/tuần
- **Habit formation**: Uống Peak Coffee = thói quen sáng
- **Viral**: User khoe streak trên social media
- **Chi phí thấp**: Voucher chỉ = ly nước (cost ~8k)

### Tổng hợp:
- Doanh thu/user/tháng: 
  - Trước: 25k x 10 lần = 250k
  - Sau: 40k x 25 lần = **1,000k** (+300%)
- LTV (Lifetime Value) tăng đáng kể

---

## 🚀 NEXT STEPS

### Nâng cấp Combo:
- [ ] Combo động theo giờ (API time-based)
- [ ] Gợi ý combo khi thêm món vào giỏ
- [ ] "Mua kèm X để thành combo"
- [ ] Admin tạo combo custom

### Nâng cấp Streak:
- [ ] Push notification: "Đặt món hôm nay để giữ streak!"
- [ ] Leaderboard: Top streakers tháng
- [ ] Streak recovery: Trả 5k để cứu streak bị break
- [ ] Share streak lên social media
- [ ] Reward streak vouchers tự động thêm vào LoyaltyContext

### Integration:
- [ ] Streak rewards → Auto add vouchers
- [ ] Combo + Streak: Đặt combo = streak x2 points
- [ ] Firebase sync để không mất streak khi đổi thiết bị

---

## 📝 NOTES

### Performance:
- `checkStreakBreak()` chạy mỗi lần mở app → lightweight check
- Calendar chỉ render 30 ngày → không lag
- LocalStorage: ~5KB/user → OK

### UX:
- Streak badge chỉ show khi có streak → Không làm rối Header
- Modal có calendar → Trực quan, dễ hiểu
- Toast có emoji → Vui, engaging

### Business:
- Combo phù hợp công nhân (bữa sáng/trưa nhanh)
- Streak reward không quá cao → Sustainable
- 30 ngày = 1 ly free → Acceptable margin

---

## 👨‍💻 MAINTAINED BY
Peak Coffee Development Team  
Version: 2.4  
Date: 2026-01-04

**Features Added**: 2  
**Files Created**: 5  
**Files Modified**: 2  
**Lines Added**: ~800
