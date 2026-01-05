import React, { useState } from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, Gift, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLoyalty } from '../contexts/LoyaltyContext';

const CartModal = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  // if (!isOpen) return null; // Handled by AnimatePresence in App.jsx
  const { vouchers } = useLoyalty();
  const [useVoucher, setUseVoucher] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  
  // Tìm món đắt nhất để miễn phí khi dùng voucher
  const mostExpensiveItem = cartItems.length > 0 
    ? Math.max(...cartItems.map(item => item.finalPrice))
    : 0;
  
  const discount = useVoucher && vouchers > 0 ? mostExpensiveItem : 0;
  const total = subtotal - discount;

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
            {/* Voucher Checkbox */}
            {vouchers > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useVoucher}
                    onChange={(e) => setUseVoucher(e.target.checked)}
                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Gift className="text-orange-600 fill-orange-600" size={18} />
                      <span className="font-black text-stone-800 text-sm">Dùng voucher miễn phí</span>
                    </div>
                    <p className="text-xs text-orange-600 font-bold mt-0.5">
                      Giảm {mostExpensiveItem.toLocaleString()}đ • Còn {vouchers} voucher
                    </p>
                  </div>
                  {useVoucher && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Sparkles className="text-orange-600 fill-orange-600" size={24} />
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
              
              {useVoucher && discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-orange-600 font-bold flex items-center gap-1">
                    <Gift size={14} />
                    Voucher giảm giá
                  </span>
                  <span className="font-bold text-orange-600">-{discount.toLocaleString()}đ</span>
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-stone-800 font-black">Tổng cộng</span>
                <span className="text-2xl font-black text-stone-800">
                  {total.toLocaleString()} <span className="text-sm text-stone-500 font-bold">đ</span>
                </span>
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
