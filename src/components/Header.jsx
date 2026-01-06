import React from 'react';
import { Coffee, ShoppingCart, MapPin, Package, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ cartCount, onCartClick, onOrderHistoryClick, onAdminClick, onLoginClick, streakBadge }) => {
  const { user, isAdmin, logout } = useAuth();

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
              <span className="truncate max-w-[120px]">COFFEE VIETHOA</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Admin Button */}
          {isAdmin && (
            <button 
              onClick={onAdminClick}
              className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full active:scale-90 transition-all shadow-lg"
              title="Admin Dashboard"
            >
              <Shield size={20} className="text-white" />
            </button>
          )}

          {/* Streak Badge */}
          {streakBadge}

          {/* Order History */}
          <button 
            onClick={onOrderHistoryClick}
            className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-full active:scale-90 transition-all border border-stone-100"
            title="Đơn hàng của tôi"
          >
            <Package size={20} className="text-stone-700" />
          </button>

          {/* User/Login Button */}
          {user ? (
            <button 
              onClick={logout}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-full active:scale-90 transition-all border border-stone-100 relative group"
              title={`${user.name} - Đăng xuất`}
            >
              <LogOut size={20} className="text-stone-700" />
              <div className="absolute -bottom-8 right-0 bg-stone-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {user.name}
              </div>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="p-2.5 bg-orange-500 hover:bg-orange-600 rounded-full active:scale-90 transition-all shadow-lg"
              title="Đăng nhập"
            >
              <User size={20} className="text-white" />
            </button>
          )}

          {/* Cart */}
          <button 
            onClick={onCartClick}
            className="relative p-2.5 bg-stone-50 hover:bg-stone-100 rounded-full active:scale-90 transition-all border border-stone-100"
            title="Giỏ hàng"
          >
            <ShoppingCart size={20} className="text-stone-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
