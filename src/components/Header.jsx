import React from 'react';
import { Coffee, ShoppingCart, MapPin } from 'lucide-react';

const Header = ({ cartCount, onCartClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 transition-all duration-300">
      <div className="max-w-md mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl shadow-lg shadow-orange-200">
            <Coffee className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-stone-800 leading-none">
              PEAK <span className="text-orange-600">COFFEE</span>
            </h1>
            <div className="flex items-center text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-0.5">
              <MapPin size={10} className="mr-1 text-orange-500" /> 
              <span className="truncate max-w-[120px]">Khu Cong Nghiep VSIP 1</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onCartClick}
          className="relative p-2.5 bg-stone-50 hover:bg-stone-100 rounded-full active:scale-90 transition-all border border-stone-100"
        >
          <ShoppingCart size={22} className="text-stone-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
