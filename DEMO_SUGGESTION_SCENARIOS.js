// ============================================
// DEMO: Cách hệ thống gợi ý hoạt động
// ============================================

/**
 * SCENARIO 1: Khách đang có 2 món trong giỏ
 * =============================================
 * Cart:
 * - Cafe Sữa x1 (15.000đ)
 * - Phin Đen x1 (15.000đ)
 * Total: 30.000đ
 * 
 * → Hệ thống hiển thị:
 * 
 * ┌─────────────────────────────────────────┐
 * │ ✨ Thêm 1 món để giảm 5.000đ!          │
 * │ Chọn nhanh bên dưới 👇                  │
 * ├─────────────────────────────────────────┤
 * │ [IMG]  Nước Dừa                         │
 * │        Giải nhiệt cực tốt               │
 * │        15.000đ • Giải Khát     [+ THÊM] │
 * ├─────────────────────────────────────────┤
 * │ → Hoặc chọn món khác                    │
 * └─────────────────────────────────────────┘
 * 
 * Nếu khách bấm [+ THÊM]:
 * → Total: 45.000đ - 5.000đ = 40.000đ
 * → Tiết kiệm: 5.000đ
 */

/**
 * SCENARIO 2: Khách đang có 4 món trong giỏ
 * =============================================
 * Cart:
 * - Cafe Sữa x2 (30.000đ)
 * - Nước Dừa x1 (15.000đ)
 * - Coca Cola x1 (10.000đ)
 * Total: 55.000đ
 * Discount hiện tại: -5.000đ (Combo 3-4 ly)
 * 
 * → Hệ thống hiển thị:
 * 
 * ┌─────────────────────────────────────────┐
 * │ 🔥 Combo Nhóm Nhỏ                       │
 * │ Tiết kiệm 5.000đ                        │
 * └─────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────┐
 * │ 🔥 Thêm 1 món để giảm 10.000đ!          │
 * │ Chọn nhanh bên dưới 👇                  │
 * ├─────────────────────────────────────────┤
 * │ [IMG]  Nước Mía                         │
 * │        Giá rẻ, bổ sung năng lượng       │
 * │        10.000đ • Giải Khát     [+ THÊM] │
 * ├─────────────────────────────────────────┤
 * │ [IMG]  Nước Chanh                       │
 * │        Thanh mát, vitamin C             │
 * │        15.000đ • Giải Khát     [+ THÊM] │
 * ├─────────────────────────────────────────┤
 * │ → Hoặc chọn món khác                    │
 * └─────────────────────────────────────────┘
 * 
 * Nếu khách bấm [+ THÊM] Nước Mía:
 * → Total: 65.000đ - 10.000đ = 55.000đ
 * → Tiết kiệm: 10.000đ (tăng 5K so với trước!)
 */

/**
 * SCENARIO 3: Khách đã có 5+ món
 * =============================================
 * Cart:
 * - Cafe Sữa x3 (45.000đ)
 * - Nước Dừa x1 (15.000đ)
 * - Coca Cola x1 (10.000đ)
 * Total: 70.000đ
 * Discount hiện tại: -10.000đ (Combo Đội Nhóm)
 * 
 * → Hệ thống hiển thị:
 * 
 * ┌─────────────────────────────────────────┐
 * │ 🔥 Combo Đội Nhóm                       │
 * │ Tiết kiệm 10.000đ                       │
 * └─────────────────────────────────────────┘
 * 
 * (KHÔNG hiển thị gợi ý thêm - đã đạt max tier)
 * 
 * Final: 70.000đ - 10.000đ = 60.000đ
 */

/**
 * TẠI SAO KHÁCH SẼ THÍCH?
 * =============================================
 * 
 * 1. MINH BẠCH:
 *    - Thấy rõ món nào, giá bao nhiêu
 *    - Biết chính xác tiết kiệm được bao nhiêu
 * 
 * 2. TIỆN LỢI:
 *    - 1 click thêm món (không cần chọn size, options)
 *    - Không phải tìm trong menu
 * 
 * 3. TÂM LÝ:
 *    - "Chỉ cần thêm 10K là giảm 10K → Thực ra không tốn tiền!"
 *    - FOMO: "Không thêm là mất 10K!"
 * 
 * 4. PHÙ HỢP CÔNG NHÂN:
 *    - Gợi ý món rẻ (10K-15K)
 *    - Món phổ biến, quen thuộc
 *    - Không phức tạp
 */

/**
 * SO SÁNH VỚI HỆ THỐNG CŨ
 * =============================================
 * 
 * CŨ (Tab Combo):
 * ❌ Tab Combo trống (không bán thức ăn)
 * ❌ Khách không biết nên mua gì
 * ❌ Chỉ thấy: "Thêm 2 ly nữa để giảm 5K"
 * ❌ Phải tự tìm món trong menu
 * 
 * MỚI (Gợi ý thông minh):
 * ✅ Gợi ý món CỤ THỂ
 * ✅ Có hình ảnh + giá + lý do
 * ✅ 1-click thêm món
 * ✅ Tự động tính giảm giá
 * ✅ Mobile-first, animation đẹp
 */

console.log('📊 Hệ thống gợi ý đã sẵn sàng!');
console.log('🚀 Test ngay trên localhost:5173');
