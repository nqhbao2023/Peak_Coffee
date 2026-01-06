// ============================================
// PEAK COFFEE - HỆ THỐNG GỢI Ý THÔNG MINH
// Logic: Phân tích giỏ hàng → Đề xuất món cụ thể để tối ưu giảm giá
// ============================================

/**
 * Các rule gợi ý dựa trên:
 * 1. Món đang có trong giỏ (cafe thì gợi ý thêm nước giải khát)
 * 2. Đạt ngưỡng giảm giá (3 ly -5K, 5 ly -10K)
 * 3. Combo phổ biến cho công nhân (rẻ + đủ năng lượng)
 */

// Định nghĩa các deal giảm giá theo số lượng
export const DISCOUNT_TIERS = [
  { quantity: 5, discount: 10000, name: 'Combo Đội Nhóm', icon: '🔥', color: 'orange' },
  { quantity: 3, discount: 5000, name: 'Combo Nhóm Nhỏ', icon: '✨', color: 'blue' },
];

// Các món được gợi ý ưu tiên (phổ biến + giá hợp lý)
const POPULAR_SUGGESTIONS = [
  { id: 6, name: 'Nước Dừa', price: 15000, category: 'Giải Khát', reason: 'Giải nhiệt cực tốt' },
  { id: 10, name: 'Nước Mía', price: 10000, category: 'Giải Khát', reason: 'Giá rẻ, bổ sung năng lượng' },
  { id: 11, name: 'Coca Cola', price: 10000, category: 'Nước Ngọt', reason: 'Sảng khoái, giá hợp lý' },
  { id: 8, name: 'Nước Chanh', price: 15000, category: 'Giải Khát', reason: 'Thanh mát, vitamin C' },
];

/**
 * Hàm chính: Tính toán gợi ý dựa trên giỏ hàng
 * @param {Array} cartItems - Danh sách món trong giỏ
 * @param {Array} allMenuItems - Toàn bộ menu để lấy thông tin món
 * @returns {Object} - { currentDiscount, nextTier, suggestions }
 */
export const getSuggestions = (cartItems = [], allMenuItems = []) => {
  // Guard: Kiểm tra input hợp lệ
  if (!Array.isArray(cartItems) || !Array.isArray(allMenuItems)) {
    return {
      currentTier: null,
      currentDiscount: 0,
      nextTier: null,
      itemsNeeded: 0,
      suggestions: [],
      totalQuantity: 0
    };
  }

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  
  // 1. Tính discount hiện tại
  const currentTier = DISCOUNT_TIERS.find(tier => totalQuantity >= tier.quantity);
  const currentDiscount = currentTier ? currentTier.discount : 0;
  
  // 2. Tìm tier tiếp theo (để gợi ý)
  const nextTier = DISCOUNT_TIERS.find(tier => totalQuantity < tier.quantity);
  
  // 3. Số ly cần thêm để đạt tier tiếp theo
  const itemsNeeded = nextTier ? nextTier.quantity - totalQuantity : 0;
  
  // 4. Lấy danh sách ID món đã có trong giỏ
  const cartItemIds = cartItems.map(item => item?.id).filter(id => id !== undefined);
  
  // 5. Gợi ý món cụ thể (không trùng với món đã có)
  let suggestions = [];
  
  if (itemsNeeded > 0 && itemsNeeded <= 3) {
    // Chỉ gợi ý khi cần thêm 1-3 món (không quá nhiều)
    suggestions = POPULAR_SUGGESTIONS
      .filter(item => {
        // Kiểm tra món có tồn tại trong menu và available
        const menuItem = allMenuItems.find(m => m.id === item.id);
        return menuItem && menuItem.isAvailable && !cartItemIds.includes(item.id);
      })
      .slice(0, itemsNeeded) // Chỉ lấy đủ số món cần
      .map(item => {
        const menuItem = allMenuItems.find(m => m.id === item.id);
        if (!menuItem) return null; // Guard
        
        return {
          ...menuItem,
          reason: item.reason,
          benefit: `Thêm món này để giảm ${nextTier.discount.toLocaleString()}đ`
        };
      })
      .filter(item => item !== null); // Loại bỏ null
  }
  
  return {
    currentTier,
    currentDiscount,
    nextTier,
    itemsNeeded,
    suggestions,
    totalQuantity
  };
};

/**
 * Tính tổng tiền sau khi áp dụng discount
 */
export const calculateTotal = (cartItems = [], useVoucher = false, mostExpensivePrice = 0) => {
  // Guard: Kiểm tra input
  if (!Array.isArray(cartItems)) {
    return {
      subtotal: 0,
      tierDiscount: 0,
      voucherDiscount: 0,
      totalDiscount: 0,
      total: 0,
      currentTier: null
    };
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const finalPrice = item?.finalPrice || 0;
    const quantity = item?.quantity || 0;
    return sum + (finalPrice * quantity);
  }, 0);
  
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  
  // Discount theo tier
  const currentTier = DISCOUNT_TIERS.find(tier => totalQuantity >= tier.quantity);
  const tierDiscount = currentTier ? currentTier.discount : 0;
  
  // Voucher discount - đảm bảo không âm
  const voucherDiscount = useVoucher && mostExpensivePrice > 0 ? mostExpensivePrice : 0;
  
  const totalDiscount = tierDiscount + voucherDiscount;
  // Đảm bảo total không bao giờ âm
  const total = Math.max(0, subtotal - totalDiscount);
  
  return {
    subtotal,
    tierDiscount,
    voucherDiscount,
    totalDiscount,
    total,
    currentTier
  };
};
