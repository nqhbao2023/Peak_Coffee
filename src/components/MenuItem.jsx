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

  // Layout compact cho nuoc ngot (Premium Style)
  if (item.isQuickAdd) {
    return (
      <div
        onClick={handleClick}
        className="group bg-white/80 glass-card p-3 rounded-3xl flex items-center gap-4 transition-all duration-300 active:scale-95 cursor-pointer border-transparent hover:border-brand-earth/20"
        style={{ contain: 'layout style paint' }}
      >
        <div className="relative overflow-hidden rounded-2xl w-16 h-16 shrink-0 shadow-md">
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
          <h4 className="font-bold text-coffee-premium text-base leading-tight truncate">{item.name}</h4>
          <span className="text-brand-earth font-black text-lg block">
            {item.price.toLocaleString()}đ
          </span>
        </div>

        <button className="bg-coffee-50/50 text-coffee-premium w-11 h-11 rounded-full flex items-center justify-center group-hover:bg-brand-earth group-hover:text-white transition-all duration-300 shadow-sm">
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Layout day du cho cac mon khac (Premium Style)
  return (
    <div
      onClick={handleClick}
      className="group bg-white glass-card p-4 rounded-3xl flex gap-5 transition-all duration-300 active:scale-95 cursor-pointer border-transparent hover:border-brand-earth/20 premium-shadow"
      style={{ contain: 'layout style paint' }}
    >
      <div className="relative overflow-hidden rounded-2xl w-32 h-32 shrink-0 shadow-lg">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          width="128"
          height="128"
          decoding="async"
        />
        {/* Category Badge - Minimalist */}
        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-md px-3 py-1 rounded-br-xl text-[10px] font-bold text-coffee-premium shadow-sm">
          {item.category.toUpperCase()}
        </div>

        {/* Temp Icons */}
        {item.hasTemp && (
          <div className="absolute bottom-1 right-1 flex gap-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-blue-500/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
              <Snowflake size={12} className="text-white" />
            </span>
            <span className="bg-brand-red/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
              <Flame size={12} className="text-white" />
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
        <div>
          <h4 className="font-bold text-coffee-premium text-lg leading-tight truncate pr-2 group-hover:text-brand-earth transition-colors duration-200">{item.name}</h4>
          <p className="text-xs text-coffee-600 mt-2 line-clamp-2 font-medium leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-end mt-3">
          <div className="flex flex-col">
            <span className="text-brand-earth font-black text-xl leading-none tracking-tight">
              {item.price.toLocaleString()}đ
            </span>
          </div>

          <button className="bg-coffee-50 text-coffee-premium w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-brand-earth group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-brand-earth/30">
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
