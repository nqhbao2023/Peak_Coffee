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
        className="group bg-white p-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md border border-coffee-100 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        style={{ contain: 'layout style paint' }}
      >
        <div className="relative overflow-hidden rounded-lg w-16 h-16 shrink-0 bg-coffee-50 border border-coffee-50">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width="64"
            height="64"
            decoding="async"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-coffee-900 text-sm leading-tight truncate">{item.name}</h4>
          <span className="text-brand-red font-extrabold text-base">
            {item.price.toLocaleString()}đ
          </span>
        </div>
        
        <button className="bg-coffee-100 text-coffee-800 w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors shadow-sm shrink-0">
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Layout day du cho cac mon khac
  return (
    <div 
      onClick={handleClick}
      className="group bg-white p-3 rounded-2xl flex gap-4 shadow-sm hover:shadow-md border border-coffee-100 transition-all duration-200 active:scale-[0.99] cursor-pointer"
      style={{ contain: 'layout style paint' }}
    >
      <div className="relative overflow-hidden rounded-xl w-28 h-28 shrink-0 bg-coffee-50 border border-coffee-50">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          width="112"
          height="112"
          decoding="async"
        />
        {/* Category Badge */}
        <div className="absolute top-0 left-0 bg-white/95 px-2 py-1 rounded-br-lg text-[9px] font-bold text-coffee-800 shadow-sm border-r border-b border-coffee-100">
          {item.category}
        </div>
        
        {/* Temp Icons */}
        {item.hasTemp && (
          <div className="absolute bottom-1 right-1 flex gap-1">
            <span className="bg-blue-500 p-0.5 rounded shadow-sm">
              <Snowflake size={10} className="text-white" />
            </span>
            <span className="bg-brand-red p-0.5 rounded shadow-sm">
              <Flame size={10} className="text-white" />
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
        <div>
          <h4 className="font-bold text-coffee-900 text-base leading-tight truncate pr-2">{item.name}</h4>
          <p className="text-[11px] text-coffee-600 mt-1 line-clamp-2 font-medium leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-brand-red font-black text-lg leading-none">
              {item.price.toLocaleString()} <span className="text-[10px] font-bold text-brand-red decoration-slice">đ</span>
            </span>
            {/* Show Addon Preview if available */}
            {item.hasAddon && (
              <span className="text-[10px] text-coffee-400 mt-0.5 font-medium">
                + Topping?
              </span>
            )}
          </div>
          
          <button className="bg-coffee-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors shadow-md shadow-coffee-200">
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
