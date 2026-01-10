import React from 'react';
import { Plus, Flame, Snowflake } from 'lucide-react';

const MenuItem = ({ item, onAddToCart, onOpenModal, priority = false }) => {
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
      <div 
        onClick={handleClick}
        className="group bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-lg hover:shadow-coffee-900/5 border border-transparent hover:border-coffee-100 transition-all duration-300 active:scale-[0.98] cursor-pointer"
        style={{ contain: 'layout style paint' }}
      >
        <div className="relative overflow-hidden rounded-xl w-16 h-16 shrink-0 bg-coffee-50 shadow-inner">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width="64"
            height="64"
            decoding="async"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-coffee-900 text-sm leading-tight truncate">{item.name}</h4>
          <span className="text-brand-red font-black text-base mt-1 block">
            {item.price.toLocaleString()}đ
          </span>
        </div>
        
        <button className="bg-coffee-50 text-coffee-600 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-brand-red/30 shrink-0">
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Layout day du cho cac mon khac
  return (
    <div 
      onClick={handleClick}
      className="group bg-white p-3 rounded-2xl flex gap-4 shadow-sm hover:shadow-xl hover:shadow-coffee-900/10 border border-transparent hover:border-coffee-100 transition-all duration-300 active:scale-[0.99] cursor-pointer"
      style={{ contain: 'layout style paint' }}
    >
      <div className="relative overflow-hidden rounded-xl w-28 h-28 shrink-0 bg-coffee-50 shadow-inner">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          width="112"
          height="112"
          decoding="async"
        />
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-coffee-800 shadow-sm border border-white/50">
          {item.category}
        </div>
        
        {/* Temp Icons */}
        {item.hasTemp && (
          <div className="absolute bottom-1 right-1 flex gap-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-blue-500/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
              <Snowflake size={10} className="text-white" />
            </span>
            <span className="bg-brand-red/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
              <Flame size={10} className="text-white" />
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
        <div>
          <h4 className="font-bold text-coffee-900 text-base leading-tight truncate pr-2 group-hover:text-brand-red transition-colors duration-200">{item.name}</h4>
          <p className="text-xs text-coffee-500 mt-1.5 line-clamp-2 font-medium leading-relaxed group-hover:text-coffee-600">
            {item.description}
          </p>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-brand-red font-black text-lg leading-none">
              {item.price.toLocaleString()}đ
            </span>
          </div>
          
          <button className="bg-coffee-50 text-coffee-700 w-9 h-9 rounded-xl flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-brand-red/30">
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
