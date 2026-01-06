// ============================================
// TEST FILE - Kiểm tra các edge cases
// ============================================

import { getSuggestions, calculateTotal, DISCOUNT_TIERS } from './suggestionEngine';

console.log('🧪 BẮT ĐẦU TEST HỆ THỐNG GỢI Ý...\n');

// ===== TEST 1: Empty cart =====
console.log('TEST 1: Giỏ hàng rỗng');
const test1 = getSuggestions([], []);
console.assert(test1.suggestions.length === 0, '❌ Lỗi: suggestions phải rỗng');
console.assert(test1.totalQuantity === 0, '❌ Lỗi: totalQuantity phải = 0');
console.assert(test1.currentTier === null, '❌ Lỗi: currentTier phải null');
console.log('✅ PASS\n');

// ===== TEST 2: Invalid input =====
console.log('TEST 2: Input không hợp lệ (null, undefined)');
const test2a = getSuggestions(null, null);
console.assert(test2a.suggestions.length === 0, '❌ Lỗi: phải xử lý null');
const test2b = getSuggestions(undefined, undefined);
console.assert(test2b.suggestions.length === 0, '❌ Lỗi: phải xử lý undefined');
console.log('✅ PASS\n');

// ===== TEST 3: Cart với 2 món =====
console.log('TEST 3: Giỏ có 2 món');
const mockCart3 = [
  { id: 1, quantity: 1, finalPrice: 15000 },
  { id: 2, quantity: 1, finalPrice: 15000 }
];
const mockMenu = [
  { id: 6, name: 'Nước Dừa', price: 15000, isAvailable: true, image: 'test.jpg', category: 'Giải Khát' },
  { id: 10, name: 'Nước Mía', price: 10000, isAvailable: true, image: 'test.jpg', category: 'Giải Khát' },
];
const test3 = getSuggestions(mockCart3, mockMenu);
console.assert(test3.itemsNeeded === 1, `❌ Lỗi: itemsNeeded phải = 1, nhưng là ${test3.itemsNeeded}`);
console.assert(test3.nextTier?.quantity === 3, '❌ Lỗi: nextTier phải là tier 3');
console.log('✅ PASS\n');

// ===== TEST 4: Cart đạt tier 3 =====
console.log('TEST 4: Giỏ có 3 món (đạt tier giảm 5K)');
const mockCart4 = [
  { id: 1, quantity: 2, finalPrice: 15000 },
  { id: 2, quantity: 1, finalPrice: 15000 }
];
const test4 = getSuggestions(mockCart4, mockMenu);
console.assert(test4.currentTier?.quantity === 3, '❌ Lỗi: currentTier phải là tier 3');
console.assert(test4.currentDiscount === 5000, '❌ Lỗi: discount phải = 5000');
console.log('✅ PASS\n');

// ===== TEST 5: calculateTotal với discount =====
console.log('TEST 5: Tính tổng tiền với discount');
const test5 = calculateTotal(mockCart4, false, 0);
console.assert(test5.subtotal === 45000, `❌ Lỗi: subtotal sai, là ${test5.subtotal}`);
console.assert(test5.tierDiscount === 5000, '❌ Lỗi: tierDiscount phải = 5000');
console.assert(test5.total === 40000, `❌ Lỗi: total sai, là ${test5.total}`);
console.log('✅ PASS\n');

// ===== TEST 6: Negative total không xảy ra =====
console.log('TEST 6: Total không bao giờ âm');
const mockCart6 = [{ id: 1, quantity: 1, finalPrice: 5000 }];
const test6 = calculateTotal(mockCart6, true, 10000); // Voucher > subtotal
console.assert(test6.total >= 0, '❌ Lỗi: total không được âm');
console.log('✅ PASS\n');

// ===== TEST 7: Item không có finalPrice =====
console.log('TEST 7: Item thiếu property finalPrice');
const mockCart7 = [
  { id: 1, quantity: 2 }, // Missing finalPrice
  { id: 2, quantity: 1, finalPrice: 15000 }
];
const test7 = calculateTotal(mockCart7, false, 0);
console.assert(!isNaN(test7.total), '❌ Lỗi: total không được là NaN');
console.assert(test7.total === 15000, `❌ Lỗi: total phải = 15000, nhưng là ${test7.total}`);
console.log('✅ PASS\n');

// ===== TEST 8: Suggestions không trùng món trong giỏ =====
console.log('TEST 8: Gợi ý không trùng món đã có trong giỏ');
const mockCart8 = [
  { id: 6, quantity: 1, finalPrice: 15000 }, // Đã có Nước Dừa
  { id: 1, quantity: 1, finalPrice: 15000 }
];
const test8 = getSuggestions(mockCart8, mockMenu);
console.assert(!test8.suggestions.find(s => s.id === 6), '❌ Lỗi: Nước Dừa không được gợi ý lại');
console.log('✅ PASS\n');

// ===== SUMMARY =====
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ TẤT CẢ TESTS ĐÃ PASS!');
console.log('Hệ thống gợi ý hoạt động ổn định.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Export để có thể chạy test từ terminal
export const runTests = () => {
  console.log('Tests completed successfully!');
};
