import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Snowflake, Plus, Minus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState('cold'); // 'hot' or 'cold'
  const [sugar, setSugar] = useState(true); // true = co duong, false = khong duong
  const [addon, setAddon] = useState(false); // cho nuoc mia + chanh muoi

  // Reset state khi mo modal moi
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setTemperature('cold');
      setSugar(true);
      setAddon(false);
    }
  }, [isOpen, product?.id]);

  // LOCK SCROLL
  useEffect(() => {
    if (isOpen && product) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen, product]);

  if (!product) return null;

  // Tinh tong tien
  const addonTotal = addon && product.hasAddon ? product.addonPrice : 0;
  const itemTotal = (product.price + addonTotal) * quantity;

  // Tao ten hien thi trong gio hang
  const getDisplayName = () => {
    let name = product.name;
    const options = [];
    
    if (product.hasTemp) {
      options.push(temperature === 'hot' ? 'Nóng' : 'Đá');
    }
    if (product.hasSugar) {
      options.push(sugar ? 'Có đường' : 'Không đường');
    }
    if (product.hasAddon && addon) {
      options.push(`+ ${product.addonName}`);
    }
    
    if (options.length > 0) {
      name += ` (${options.join(', ')})`;
    }
    return name;
  };

  const handleAddToCart = () => {
    // Chỉ truyền thông tin sản phẩm và số lượng 1 lần
    // App.jsx sẽ tự handle logic tách item hoặc gộp
    const cartItem = {
      ...product,
      cartId: `${product.id}-${temperature}-${sugar}-${addon}-${Date.now()}`,
      displayName: getDisplayName(),
      finalPrice: product.price + addonTotal,
      options: {
        temperature: product.hasTemp ? temperature : null,
        sugar: product.hasSugar ? sugar : null,
        addon: product.hasAddon ? addon : null,
      },
      addQuantity: quantity // Truyền số lượng cần thêm
    };
    
    // Gọi hàm addToCart với cả cục item có số lượng
    onAddToCart(cartItem);
    
    onClose();
  };

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0"
      style={{ touchAction: 'none' }}
    >
      {/* Backdrop FULL với gradient */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-coffee-950/60"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />

      {/* Modal với 3D effect */}
      <motion.div 
        initial={{ y: '100%', scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
        className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ transformOrigin: 'bottom center' }}
      >
        {/* Header with Image */}
        <div className="relative h-56 bg-coffee-100 shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/80 via-transparent to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-red transition-all duration-200"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-5 left-6 right-6">
            <span className="inline-block px-2 py-0.5 rounded bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider mb-2 shadow-sm">
              {product.category}
            </span>
            <h2 className="text-3xl font-black text-white leading-tight shadow-sm drop-shadow-md">{product.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-white flex-1">
          <p className="text-coffee-600 text-sm leading-relaxed font-medium">{product.description}</p>

          {/* Temperature Option */}
          {product.hasTemp && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-coffee-400 uppercase tracking-wider">Chọn nhiệt độ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTemperature('cold')}
                  className={`relative flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                    temperature === 'cold' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10' 
                      : 'border-coffee-100 bg-white text-coffee-400 hover:border-coffee-200'
                  }`}
                >
                  <Snowflake size={20} />
                  <span className="font-bold">Đá Lạnh</span>
                  {temperature === 'cold' && (
                    <div className="absolute top-2 right-2 p-0.5 bg-blue-500 rounded-full">
                        <Check size={10} className="text-white" strokeWidth={4} />
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setTemperature('hot')}
                  className={`relative flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                    temperature === 'hot' 
                      ? 'border-brand-red bg-red-50 text-brand-red shadow-md shadow-brand-red/10' 
                      : 'border-coffee-100 bg-white text-coffee-400 hover:border-coffee-200'
                  }`}
                >
                  <Flame size={20} />
                  <span className="font-bold">Nóng</span>
                  {temperature === 'hot' && (
                     <div className="absolute top-2 right-2 p-0.5 bg-brand-red rounded-full">
                        <Check size={10} className="text-white" strokeWidth={4} />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Sugar Option */}
          {product.hasSugar && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-coffee-400 uppercase tracking-wider">Độ ngọt</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSugar(true)}
                  className={`p-3.5 rounded-2xl border font-bold transition-all duration-200 active:scale-[0.98] ${
                    sugar 
                      ? 'border-coffee-600 bg-coffee-50 text-coffee-800 shadow-md' 
                      : 'border-coffee-100 text-coffee-400 hover:border-coffee-200'
                  }`}
                >
                  Có đường
                </button>
                <button
                  onClick={() => setSugar(false)}
                  className={`p-3.5 rounded-2xl border font-bold transition-all duration-200 active:scale-[0.98] ${
                    !sugar 
                      ? 'border-coffee-600 bg-coffee-50 text-coffee-800 shadow-md' 
                      : 'border-coffee-100 text-coffee-400 hover:border-coffee-200'
                  }`}
                >
                  Không đường
                </button>
              </div>
            </div>
          )}

          {/* Addon Option */}
          {product.hasAddon && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-coffee-400 uppercase tracking-wider">Thêm topping</label>
              <button
                onClick={() => setAddon(!addon)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                  addon 
                    ? 'border-brand-red bg-red-50 shadow-md shadow-brand-red/10' 
                    : 'border-coffee-100 hover:border-coffee-200'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${addon ? 'bg-brand-red border-brand-red' : 'border-coffee-300'}`}>
                        {addon && <Check size={14} className="text-white" strokeWidth={3} />}
                   </div>
                   <span className={`font-bold ${addon ? 'text-brand-red' : 'text-coffee-700'}`}>
                    + {product.addonName}
                   </span>
                </div>
                <span className={`font-bold ${addon ? 'text-brand-red' : 'text-coffee-400'}`}>
                  +{product.addonPrice?.toLocaleString()}đ
                </span>
              </button>
            </div>
          )}

          {/* Quantity */}
          <div className="py-2">
            <div className="flex justify-between items-center mb-3">
                 <label className="text-xs font-bold text-coffee-400 uppercase tracking-wider">Số lượng</label>
            </div>
            <div className="flex items-center justify-between bg-coffee-50 rounded-2xl p-2 border border-coffee-100">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-coffee-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                disabled={quantity <= 1}
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="font-black text-2xl text-coffee-900 w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-brand-red text-white rounded-xl shadow-md shadow-brand-red/20 active:scale-95 transition-all"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-coffee-100 bg-white shrink-0 pb-8 sm:pb-6">
          <button
            onClick={handleAddToCart}
            className="w-full bg-coffee-900 hover:bg-coffee-800 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-coffee-900/20 active:scale-[0.98] transition-all duration-200"
          >
            <span>THÊM VÀO GIỎ</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="text-lg">
              {itemTotal.toLocaleString()}đ
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ProductModal;
