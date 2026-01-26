import React from 'react';
import { Coffee, ShoppingCart, MapPin, Package, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ cartCount, onCartClick, onOrderHistoryClick, onAdminClick, onLoginClick, streakBadge }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="glass sticky top-0 z-50 transition-all duration-300" style={{ contain: 'layout style paint' }}>
      <div className="w-full max-w-md mx-auto px-4 h-16 flex justify-between items-center">
        {/* BRANDING: Premium Coffee Vibe */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-brand-earth to-brand-dark p-2 rounded-xl shadow-lg shadow-brand-earth/20 group-hover:scale-110 transition-transform duration-300">
            <Coffee className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-black text-xl tracking-tight text-coffee-premium leading-none group-hover:text-brand-earth transition-colors duration-300 text-shadow-sm">
              PEAK<span className="text-brand-earth">COFFEE</span>
            </h1>
            <div className="flex items-center text-[10px] text-coffee-600 font-bold uppercase tracking-widest mt-0.5">
              <MapPin size={10} className="mr-1 text-brand-earth" />
              <span>VIET HOA</span>
            </div>
          </div>
        </div>

        {/* ACTIONS - Simplified: No Reload button */}
        <div className="flex items-center gap-2">

          {/* Admin Button */}
          {isAdmin && (
            <button
              onClick={onAdminClick}
              className="p-2.5 bg-gradient-to-br from-coffee-700 to-coffee-900 text-white rounded-xl active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg shadow-coffee-900/20"
              title="Admin Dashboard"
            >
              <Shield size={18} strokeWidth={2} />
            </button>
          )}

          {/* Order History */}
          <button
            onClick={onOrderHistoryClick}
            className="p-2.5 bg-white/50 text-coffee-600 hover:bg-white hover:text-brand-earth hover:shadow-md rounded-xl active:scale-95 transition-all duration-200"
            title="Đơn hàng của tôi"
          >
            <Package size={18} strokeWidth={2} />
          </button>

          {/* User/Login Button */}
          {user ? (
            <button
              onClick={logout}
              className="p-2.5 bg-white/50 text-coffee-600 hover:bg-red-50 hover:text-red-500 rounded-xl active:scale-95 transition-all duration-200"
              title={`${user.name} - Đăng xuất`}
            >
              <LogOut size={18} strokeWidth={2} />
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="p-2.5 bg-coffee-premium text-white hover:bg-coffee-800 active:bg-coffee-950 rounded-xl active:scale-95 transition-all duration-200 shadow-md shadow-coffee-900/20"
              title="Đăng nhập"
            >
              <User size={18} strokeWidth={2} />
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative p-2.5 bg-white text-coffee-premium hover:bg-brand-earth hover:text-white rounded-xl active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-brand-earth/30 border border-transparent hover:border-brand-earth group"
            title="Giỏ hàng"
          >
            <ShoppingCart size={18} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-earth text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm border-2 border-white group-hover:border-brand-earth group-hover:bg-white group-hover:text-brand-earth transition-colors">
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
