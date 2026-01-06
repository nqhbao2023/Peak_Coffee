import React, { useState } from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, Gift, Sparkles, TrendingUp, Zap, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '../contexts/LoyaltyContext';
import { useMenu } from '../contexts/MenuContext';
import { getSuggestions, calculateTotal } from '../utils/suggestionEngine';

const CartModal = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout, onAddItem }) => {
  const { vouchers } = useLoyalty();
  const { menuItems } = useMenu();
  const [useVoucher, setUseVoucher] = useState(false);
  const [isSuggestionExpanded, setIsSuggestionExpanded] = useState(false); // State cho expand/collapse

  // ============ HỆ THỐNG GỢI Ý THÔNG MINH ============
  const suggestionData = getSuggestions(cartItems, menuItems);
  const { currentTier, nextTier, itemsNeeded, suggestions } = suggestionData;

  // Tính toán giá trị - Guard cho empty cart
  const mostExpensiveItem = cartItems && cartItems.length > 0 
    ? Math.max(...cartItems.map(item => item?.finalPrice || 0).filter(price => price > 0))
    : 0;
  
  const { subtotal, tierDiscount, voucherDiscount, totalDiscount, total } = calculateTotal(
    cartItems,
    useVoucher && vouchers > 0,
    mostExpensiveItem
  );

  // Handler: Thêm món gợi ý vào giỏ
  const handleAddSuggestion = (item) => {
    if (!item || !item.id || !item.price || !onAddItem) return; // Guard
    
    const cartItem = {
      ...item,
      cartId: `${item.id}_${Date.now()}`,
      finalPrice: item.price,
      displayName: item.name,
      quantity: 1,
      options: {} // Thêm options mặc định
    };
    onAddItem(cartItem);
  };

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
            
            {/* Combo Đang Được Áp Dụng - COMPACT */}
            {currentTier && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3 p-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">{currentTier.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <Zap className="text-white fill-white" size={14} />
                      <span className="font-black text-white text-xs">{currentTier.name}</span>
                    </div>
                    <p className="text-[10px] text-orange-50 font-bold mt-0.5">
                      Tiết kiệm {currentTier.discount.toLocaleString()}đ
                    </p>
                  </div>
                  <Sparkles className="text-white fill-white" size={18} />
                </div>
              </motion.div>
            )}

            {/* GỢI Ý THÔNG MINH - COLLAPSIBLE (MỚI) */}
            {suggestions.length > 0 && nextTier && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3"
              >
                {/* COMPACT HEADER - Luôn hiển thị */}
                <motion.button
                  onClick={() => setIsSuggestionExpanded(!isSuggestionExpanded)}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-3"
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon + Badge */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-xl">{nextTier.icon}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white text-[10px] font-black">{itemsNeeded}</span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <p className="text-white font-black text-sm leading-tight">
                      Thêm {itemsNeeded} món giảm {nextTier.discount.toLocaleString()}đ
                    </p>
                    <p className="text-blue-100 text-[10px] font-semibold mt-0.5">
                      {isSuggestionExpanded ? 'Thu gọn' : `${suggestions.length} món gợi ý cho bạn`}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    animate={{ rotate: isSuggestionExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white"
                  >
                    <ChevronDown size={20} strokeWidth={3} />
                  </motion.div>
                </motion.button>

                {/* EXPANDED CONTENT - Chỉ hiển thị khi expand */}
                <AnimatePresence>
                  {isSuggestionExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 bg-blue-50 rounded-xl border-2 border-blue-200 p-3 space-y-2">
                        {/* Danh sách món gợi ý */}
                        {suggestions.map((item, index) => (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              handleAddSuggestion(item);
                              setIsSuggestionExpanded(false); // Auto collapse sau khi thêm
                            }}
                            className="w-full flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
                          >
                            {/* Hình ảnh nhỏ gọn hơn */}
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                            />
                            
                            {/* Thông tin */}
                            <div className="flex-1 text-left min-w-0">
                              <h4 className="font-bold text-stone-800 text-xs line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-[9px] text-blue-600 font-semibold mt-0.5 line-clamp-1">
                                {item.reason}
                              </p>
                              <span className="text-xs font-black text-orange-600">
                                {item.price.toLocaleString()}đ
                              </span>
                            </div>

                            {/* Icon thêm nhỏ hơn */}
                            <div className="flex-shrink-0 w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Plus className="text-white" size={16} />
                            </div>
                          </motion.button>
                        ))}

                        {/* Footer - Chọn món khác */}
                        <button
                          onClick={() => {
                            setIsSuggestionExpanded(false);
                            onClose();
                          }}
                          className="w-full py-2 bg-blue-100 hover:bg-blue-200 transition-colors rounded-lg flex items-center justify-center gap-1 text-[10px] font-bold text-blue-700 mt-2"
                        >
                          <span>Hoặc chọn món khác trong menu</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              
              {/* Tier Discount */}
              {tierDiscount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-orange-600 font-bold flex items-center gap-1">
                    <Zap size={14} fill="currentColor" />
                    Giảm giá {currentTier?.name}
                  </span>
                  <span className="font-bold text-orange-600">-{tierDiscount.toLocaleString()}đ</span>
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
