import React, { useState } from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, Gift, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '../contexts/LoyaltyContext';

const CartModal = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const { vouchers } = useLoyalty();
  const [useVoucher, setUseVoucher] = useState(false);

  // ============ DYNAMIC COMBO LOGIC ============
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Tính subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  
  // Logic giảm giá động theo số lượng (giảm giá cố định để tránh lỗ)
  let comboDiscount = 0;
  let comboType = null;
  
  if (totalQuantity >= 5) {
    // 5+ ly → giảm 10k
    comboDiscount = 10000;
    comboType = { name: 'Combo Đội Nhóm', amount: '10K', icon: '☕☕☕☕☕' };
  } else if (totalQuantity >= 3) {
    // 3-4 ly → giảm 5k
    comboDiscount = 5000;
    comboType = { name: 'Combo Nhóm Nhỏ', amount: '5K', icon: '☕☕☕' };
  }

  // Voucher discount (món đắt nhất miễn phí)
  const mostExpensiveItem = cartItems.length > 0 
    ? Math.max(...cartItems.map(item => item.finalPrice))
    : 0;
  const voucherDiscount = useVoucher && vouchers > 0 ? mostExpensiveItem : 0;
  
  // Tổng discount
  const totalDiscount = comboDiscount + voucherDiscount;
  const total = subtotal - totalDiscount;

  // Gợi ý thêm món để đạt combo tiếp theo
  const getComboSuggestion = () => {
    if (totalQuantity === 0) return null;
    if (totalQuantity === 1 || totalQuantity === 2) {
      const needed = 3 - totalQuantity;
      return { 
        text: `Thêm ${needed} ly nữa để được giảm 5K!`, 
        nextDiscount: 5000,
        icon: '💡'
      };
    }
    if (totalQuantity === 3 || totalQuantity === 4) {
      const needed = 5 - totalQuantity;
      return { 
        text: `Thêm ${needed} ly nữa để được giảm 10K!`, 
        nextDiscount: 10000,
        icon: '🔥'
      };
    }
    return null;
  };

  const comboSuggestion = getComboSuggestion();

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      ></motion.div>

      {/* Modal Content */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-stone-50 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col pointer-events-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-white rounded-t-[2rem]">
          <h2 className="font-black text-xl text-stone-800 flex items-center gap-2">
            <ShoppingBag className="text-orange-600" />
            Giỏ hàng <span className="text-stone-400 text-sm font-medium">({cartItems.length} món)</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={24} className="text-stone-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingBag size={40} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">Chưa có món nào trong giỏ</p>
              <button 
                onClick={onClose}
                className="mt-4 text-orange-600 font-bold text-sm hover:underline"
              >
                Quay lại menu
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartId} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-stone-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-xl object-cover bg-stone-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-stone-800 text-sm line-clamp-1">{item.displayName || item.name}</h4>
                      {/* Hien thi options da chon */}
                      {item.options && Object.keys(item.options).some(k => item.options[k] !== null) && (
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {item.options.temperature === 'hot' ? 'Nóng' : item.options.temperature === 'cold' ? 'Đá' : ''}
                          {item.options.sugar === false ? ' • K.Đường' : ''}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-orange-600">
                      {item.finalPrice.toLocaleString()}đ
                    </span>
                    
                    <div className="flex items-center gap-3 bg-stone-100 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} className={item.quantity <= 1 ? "text-stone-300" : "text-stone-700"} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                      >
                        <Plus size={14} className="text-stone-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-200 rounded-b-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            
            {/* Combo Đang Được Áp Dụng */}
            {comboType && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{comboType.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="text-orange-600 fill-orange-600" size={18} />
                      <span className="font-black text-orange-800 text-sm">{comboType.name}</span>
                    </div>amount}
                    <p className="text-xs text-orange-700 font-bold mt-1">
                      🎉 Giảm {comboType.percent}% • Tiết kiệm {comboDiscount.toLocaleString()}đ
                    </p>
                  </div>
                  <Sparkles className="text-orange-600 fill-orange-600" size={24} />
                </div>
              </motion.div>
            )}

            {/* Gợi Ý Thêm Món */}
            {comboSuggestion && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{comboSuggestion.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-800">
                      {comboSuggestion.text}
                    </p>
                    <p className="text-[10px] text-blue-600 mt-0.5">
                      Tiết kiệm thêm ~{comboSuggestion.nextDiscount.toLocaleString()}đ
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    Thêm món
                  </button>
                </div>
              </motion.div>
            )}

            {/* Voucher Checkbox */}
            {vouchers > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useVoucher}
                    onChange={(e) => setUseVoucher(e.target.checked)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Gift className="text-green-700 fill-green-700" size={18} />
                      <span className="font-black text-green-900 text-sm">Dùng voucher miễn phí</span>
                    </div>
                    <p className="text-xs text-green-700 font-bold mt-0.5">
                      Giảm {mostExpensiveItem.toLocaleString()}đ • Còn {vouchers} voucher
                    </p>
                  </div>
                  {useVoucher && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Sparkles className="text-green-700 fill-green-700" size={24} />
                    </motion.div>
                  )}
                </label>
              </motion.div>
            )}

            {/* Total Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 font-medium">Tạm tính</span>
                <span className="font-bold text-stone-700">{subtotal.toLocaleString()}đ</span>
              </div>
              
              {/* Combo Discount */}
              {comboDiscount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-orange-600 font-bold flex items-center gap-1">
                    <Zap size={14} fill="currentColor" />
                    Giảm giá combo {comboType?.amount}
                  </span>
                  <span className="font-bold text-orange-600">-{comboDiscount.toLocaleString()}đ</span>
                </motion.div>
              )}

              {/* Voucher Discount */}
              {useVoucher && voucherDiscount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    <Gift size={14} />
                    Voucher miễn phí
                  </span>
                  <span className="font-bold text-green-700">-{voucherDiscount.toLocaleString()}đ</span>
                </motion.div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-stone-800 font-black">Tổng cộng</span>
                <div className="text-right">
                  {totalDiscount > 0 && (
                    <div className="text-xs text-stone-400 line-through">
                      {subtotal.toLocaleString()}đ
                    </div>
                  )}
                  <span className="text-2xl font-black text-stone-800">
                    {total.toLocaleString()} <span className="text-sm text-stone-500 font-bold">đ</span>
                  </span>
                  {totalDiscount > 0 && (
                    <div className="text-xs text-green-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                      <TrendingUp size={12} />
                      Tiết kiệm {totalDiscount.toLocaleString()}đ
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onCheckout(useVoucher)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-300/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="fill-white" size={20} />
              ĐẶT MÓN NGAY
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CartModal;
