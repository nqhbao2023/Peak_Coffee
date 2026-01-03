import React from 'react';
import { Plus, Flame, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuItem = ({ item, onAddToCart, onOpenModal }) => {
  // Neu la mon "quick add" (nuoc ngot) -> them thang vao gio
  const handleClick = () => {
    if (item.isQuickAdd) {
      onAddToCart({
        ...item,
        cartId: `${item.id}-${Date.now()}`,
        displayName: item.name,
        finalPrice: item.price,
        options: {}
      });
    } else {
      onOpenModal(item);
    }
  };

  // Layout compact cho nuoc ngot
  if (item.isQuickAdd) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        onClick={handleClick}
        className="group bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md border border-stone-100 transition-all active:scale-[0.98] cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl w-16 h-16 shrink-0 bg-stone-100">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            loading="lazy"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-stone-800 text-sm leading-tight truncate">{item.name}</h4>
          <span className="text-orange-600 font-black text-base">
            {item.price.toLocaleString()}đ
          </span>
        </div>
        
        <button className="bg-stone-900 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-colors shadow-md shrink-0">
          <Plus size={18} strokeWidth={3} />
        </button>
      </motion.div>
    );
  }

  // Layout day du cho cac mon khac
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={handleClick}
      className="group bg-white p-3 rounded-2xl flex gap-4 shadow-sm hover:shadow-md border border-stone-100 transition-all active:scale-[0.99] cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl w-28 h-28 shrink-0 bg-stone-100">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-bold text-stone-800 shadow-sm uppercase tracking-wider border border-stone-100">
          {item.category}
        </div>
        
        {/* Hien thi icon neu co options */}
        {item.hasTemp && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <span className="bg-blue-500/90 p-1 rounded-md">
              <Snowflake size={12} className="text-white" />
            </span>
            <span className="bg-orange-500/90 p-1 rounded-md">
              <Flame size={12} className="text-white" />
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
        <div>
          <h4 className="font-bold text-stone-800 text-base leading-tight truncate pr-2">{item.name}</h4>
          <p className="text-[11px] text-stone-500 mt-1.5 line-clamp-2 font-medium leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-orange-600 font-black text-lg leading-none">
              {item.price.toLocaleString()} <span className="text-[10px] font-bold text-orange-500">đ</span>
            </span>
            {item.hasAddon && (
              <span className="text-[10px] text-stone-400 mt-0.5">
                + {item.addonName} {item.addonPrice?.toLocaleString()}đ
              </span>
            )}
          </div>
          
          <button 
            className="bg-stone-900 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-orange-600 active:bg-orange-700 transition-colors shadow-lg shadow-stone-200"
            aria-label={`Thêm ${item.name} vào giỏ`}
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;
