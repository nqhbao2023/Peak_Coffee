// ============================================
// PEAK COFFEE - HỆ THỐNG GỢI Ý THÔNG MINH
// Logic: Phân tích giỏ hàng → Đề xuất món cụ thể để tối ưu giảm giá
// + Gợi ý dựa trên lịch sử đặt hàng (upsell)
// ============================================

/**
 * Các rule gợi ý dựa trên:
 * 1. Món đang có trong giỏ (cafe thì gợi ý thêm nước giải khát)
 * 2. Đạt ngưỡng giảm giá (3 ly -5K, 5 ly -10K)
 * 3. Combo phổ biến cho công nhân (rẻ + đủ năng lượng)
 * 4. Cross-sell: Gợi ý category khác so với giỏ hiện tại
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

// Cross-sell rules: Nếu giỏ có category X → gợi ý category Y
const CROSS_SELL_RULES = [
  { ifCategory: 'Cà Phê', suggestCategory: 'Giải Khát', reason: 'Kèm ly giải khát mát lành' },
  { ifCategory: 'Cà Phê', suggestCategory: 'Nước Ngọt', reason: 'Combo cà phê + nước ngọt' },
  { ifCategory: 'Giải Khát', suggestCategory: 'Cà Phê', reason: 'Thêm ly cà phê tỉnh táo' },
  { ifCategory: 'Nước Ngọt', suggestCategory: 'Cà Phê', reason: 'Mix thêm cà phê cho đa vị' },
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
    // Lấy categories đang có trong giỏ
    const cartCategories = [...new Set(cartItems.map(item => item?.category).filter(Boolean))];
    
    // Ưu tiên cross-sell: gợi ý category khác để đa dạng
    const crossSellItems = [];
    cartCategories.forEach(cat => {
      const rules = CROSS_SELL_RULES.filter(r => r.ifCategory === cat);
      rules.forEach(rule => {
        const items = allMenuItems.filter(m => 
          m.category === rule.suggestCategory && 
          m.isAvailable && 
          !cartItemIds.includes(m.id)
        );
        items.forEach(item => {
          if (!crossSellItems.find(cs => cs.id === item.id)) {
            crossSellItems.push({ ...item, reason: rule.reason });
          }
        });
      });
    });

    // Merge cross-sell + popular, ưu tiên cross-sell
    const popularFiltered = POPULAR_SUGGESTIONS
      .filter(item => {
        const menuItem = allMenuItems.find(m => m.id === item.id);
        return menuItem && menuItem.isAvailable && !cartItemIds.includes(item.id);
      })
      .map(item => {
        const menuItem = allMenuItems.find(m => m.id === item.id);
        return menuItem ? { ...menuItem, reason: item.reason } : null;
      })
      .filter(Boolean);

    // Combine: cross-sell trước, popular sau, lấy đủ số lượng cần
    const combined = [...crossSellItems, ...popularFiltered];
    const uniqueCombined = combined.filter((item, index) => 
      combined.findIndex(i => i.id === item.id) === index
    );

    suggestions = uniqueCombined
      .slice(0, itemsNeeded)
      .map(item => ({
        ...item,
        benefit: `Thêm món này để giảm ${nextTier.discount.toLocaleString()}đ`,
      }));
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

/**
 * Gợi ý món cho trang menu dựa trên lịch sử đặt hàng
 * Dùng để hiển thị "Gợi ý cho bạn" hoặc "Combo tiết kiệm"
 * @param {Array} orderHistory - Lịch sử đơn hàng
 * @param {Array} allMenuItems - Toàn bộ menu
 * @param {number} maxSuggestions - Số lượng gợi ý tối đa
 * @returns {Array} - Danh sách món gợi ý kèm lý do
 */
export const getMenuSuggestions = (orderHistory = [], allMenuItems = [], maxSuggestions = 3) => {
  if (!Array.isArray(allMenuItems) || allMenuItems.length === 0) return [];

  const availableItems = allMenuItems.filter(item => item.isAvailable);

  // Nếu không có lịch sử → gợi ý Popular
  if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
    return POPULAR_SUGGESTIONS
      .map(ps => {
        const menuItem = availableItems.find(m => m.id === ps.id);
        return menuItem ? { ...menuItem, reason: ps.reason, badge: 'Phổ biến' } : null;
      })
      .filter(Boolean)
      .slice(0, maxSuggestions);
  }

  // Tính tần suất mua từ lịch sử
  const frequencyMap = {};
  orderHistory.forEach(order => {
    if (!order.items) return;
    order.items.forEach(item => {
      if (!frequencyMap[item.id]) {
        frequencyMap[item.id] = { count: 0, lastOrdered: order.createdAt };
      }
      frequencyMap[item.id].count += item.quantity;
      if (order.createdAt > frequencyMap[item.id].lastOrdered) {
        frequencyMap[item.id].lastOrdered = order.createdAt;
      }
    });
  });

  // Gợi ý dựa trên tần suất cao nhất (món hay mua)
  const frequentItems = Object.entries(frequencyMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, maxSuggestions)
    .map(([id, data]) => {
      const menuItem = availableItems.find(m => String(m.id) === String(id));
      if (!menuItem) return null;
      return {
        ...menuItem,
        reason: `Bạn đã đặt ${data.count} lần`,
        badge: 'Hay đặt',
      };
    })
    .filter(Boolean);

  return frequentItems.length > 0 ? frequentItems : [];
};
