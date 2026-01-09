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
    const cartItem = {
      ...product,
      cartId: `${product.id}-${temperature}-${sugar}-${addon}-${Date.now()}`,
      displayName: getDisplayName(),
      finalPrice: product.price + addonTotal,
      options: {
        temperature: product.hasTemp ? temperature : null,
        sugar: product.hasSugar ? sugar : null,
        addon: product.hasAddon ? addon : null,
      }
    };
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart(cartItem);
    }
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
        animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/90 to-black/95"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />

      {/* Modal với 3D effect */}
      <motion.div 
        initial={{ y: '100%', scale: 0.85, rotateX: 20 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        exit={{ y: '100%', scale: 0.85, rotateX: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 1 }}
        className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_-25px_80px_rgba(0,0,0,0.7)] max-h-[92vh] overflow-hidden flex flex-col border-t-[6px] border-gradient-to-r from-orange-500 to-red-500"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
      >
        {/* Header with Image */}
        <div className="relative h-48 bg-stone-200 shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg"
          >
            <X size={20} className="text-stone-700" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              {product.category}
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{product.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          <p className="text-stone-500 text-sm">{product.description}</p>

          {/* Temperature Option */}
          {product.hasTemp && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Chọn nhiệt độ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTemperature('cold')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    temperature === 'cold' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <Snowflake size={18} />
                  <span className="font-bold">Đá (Lạnh)</span>
                  {temperature === 'cold' && <Check size={16} className="ml-auto" />}
                </button>
                <button
                  onClick={() => setTemperature('hot')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    temperature === 'hot' 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <Flame size={18} />
                  <span className="font-bold">Nóng</span>
                  {temperature === 'hot' && <Check size={16} className="ml-auto" />}
                </button>
              </div>
            </div>
          )}

          {/* Sugar Option */}
          {product.hasSugar && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Chọn đường</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSugar(true)}
                  className={`p-3 rounded-xl border-2 font-bold transition-all ${
                    sugar 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  Có đường
                </button>
                <button
                  onClick={() => setSugar(false)}
                  className={`p-3 rounded-xl border-2 font-bold transition-all ${
                    !sugar 
                      ? 'border-amber-500 bg-amber-50 text-amber-700' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  Không đường
                </button>
              </div>
            </div>
          )}

          {/* Addon Option */}
          {product.hasAddon && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Thêm topping</label>
              <button
                onClick={() => setAddon(!addon)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  addon 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className={`font-bold ${addon ? 'text-orange-700' : 'text-stone-600'}`}>
                  + {product.addonName}
                </span>
                <span className={`font-bold ${addon ? 'text-orange-600' : 'text-stone-400'}`}>
                  +{product.addonPrice?.toLocaleString()}đ
                </span>
              </button>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-700">Số lượng</label>
            <div className="flex items-center gap-4 bg-stone-100 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-95 transition-transform"
                disabled={quantity <= 1}
              >
                <Minus size={18} className={quantity <= 1 ? 'text-stone-300' : 'text-stone-700'} />
              </button>
              <span className="font-black text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-95 transition-transform"
              >
                <Plus size={18} className="text-stone-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 bg-white shrink-0">
          <button
            onClick={handleAddToCart}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
          >
            <span>THÊM VÀO GIỎ</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg">
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
