import React from 'react';
import { Coffee, ShoppingCart, MapPin, Package, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ cartCount, onCartClick, onOrderHistoryClick, onAdminClick, onLoginClick, streakBadge }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-coffee-200 transition-all duration-300 shadow-sm">
      <div className="w-full max-w-md mx-auto px-4 h-16 flex justify-between items-center">
        {/* BRANDING: Highlands Coffee Vibe */}
        <div className="flex items-center gap-2">
          <div className="bg-brand-red p-1.5 rounded-full border-2 border-brand-red shadow-sm">
             <Coffee className="text-white transform " size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center -space-y-1">
            <h1 className="font-extrabold text-lg tracking-tight text-coffee-900 leading-none">
              PEAK<span className="text-brand-red ml-0.5">COFFEE</span>
            </h1>
            <div className="flex items-center text-[9px] text-coffee-600 font-bold uppercase tracking-wider ">
              <MapPin size={9} className="mr-0.5 text-brand-red" /> 
              <span>VIET HOA</span>
            </div>
          </div>
        </div>
        
        {/* ACTIONS */}
        <div className="flex items-center gap-2.5">
          {/* Admin Button */}
          {isAdmin && (
            <button 
              onClick={onAdminClick}
              className="p-2 bg-gradient-to-br from-coffee-600 to-coffee-800 rounded-full active:scale-95 transition-all shadow-md"
              title="Admin Dashboard"
            >
              <Shield size={18} className="text-white" />
            </button>
          )}

          {/* Streak Badge */}
          {streakBadge}

          {/* Order History */}
          <button 
            onClick={onOrderHistoryClick}
            className="p-2 bg-coffee-50 active:bg-coffee-100 rounded-full active:scale-95 transition-all border border-coffee-200 group"
            title="Đơn hàng của tôi"
          >
            <Package size={18} className="text-coffee-700 group-hover:text-brand-red transition-colors" />
          </button>

          {/* User/Login Button */}
          {user ? (
            <button 
              onClick={logout}
              className="p-2 bg-coffee-50 active:bg-coffee-100 rounded-full active:scale-95 transition-all border border-coffee-200 relative group"
              title={`${user.name} - Đăng xuất`}
            >
              <LogOut size={18} className="text-coffee-700 group-hover:text-brand-red transition-colors" />
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="p-2 bg-coffee-900 active:bg-coffee-800 rounded-full active:scale-95 transition-all shadow-md"
              title="Đăng nhập"
            >
              <User size={18} className="text-white" />
            </button>
          )}

          {/* Cart */}
          <button 
            onClick={onCartClick}
            className="relative p-2 bg-coffee-50 hover:bg-white active:bg-coffee-50 rounded-full active:scale-95 transition-all border border-coffee-200 shadow-sm"
            title="Giỏ hàng"
          >
            <ShoppingCart size={18} className="text-coffee-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white">
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
