import React from 'react';
import { Coffee, ShoppingCart, MapPin, Package, Shield, User, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ cartCount, onCartClick, onOrderHistoryClick, onAdminClick, onLoginClick, streakBadge }) => {
  const { user, isAdmin, logout } = useAuth();
  
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-coffee-100 shadow-sm transition-all duration-300" style={{ contain: 'layout style paint' }}>
      <div className="w-full max-w-md mx-auto px-4 h-16 flex justify-between items-center">
        {/* BRANDING: Highlands Coffee Vibe */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-brand-red p-2 rounded-xl shadow-lg shadow-brand-red/20 group-hover:scale-105 transition-transform duration-300">
             <Coffee className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-black text-xl tracking-tight text-coffee-900 leading-none group-hover:text-brand-red transition-colors duration-300">
              PEAK<span className="text-brand-red">COFFEE</span>
            </h1>
            <div className="flex items-center text-[10px] text-coffee-500 font-bold uppercase tracking-widest mt-0.5">
              <MapPin size={10} className="mr-1 text-brand-red" /> 
              <span>VIET HOA</span>
            </div>
          </div>
        </div>
        
        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Reload Button */}
          <button 
            onClick={handleReload}
            className="p-2.5 bg-coffee-50 text-coffee-600 hover:bg-coffee-100 active:bg-coffee-200 rounded-xl active:scale-95 transition-all duration-200"
            title="Tải lại trang"
          >
            <RefreshCw size={18} strokeWidth={2} />
          </button>

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
            className="p-2.5 bg-coffee-50 text-coffee-600 hover:bg-white hover:text-brand-red hover:shadow-md active:bg-coffee-50 rounded-xl active:scale-95 transition-all duration-200 border border-transparent hover:border-coffee-100"
            title="Đơn hàng của tôi"
          >
            <Package size={18} strokeWidth={2} />
          </button>

          {/* User/Login Button */}
          {user ? (
            <button 
              onClick={logout}
              className="p-2.5 bg-coffee-50 text-coffee-600 hover:bg-red-50 hover:text-red-500 active:bg-red-100 rounded-xl active:scale-95 transition-all duration-200 border border-transparent hover:border-red-100"
              title={`${user.name} - Đăng xuất`}
            >
              <LogOut size={18} strokeWidth={2} />
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="p-2.5 bg-coffee-900 text-white hover:bg-coffee-800 active:bg-coffee-950 rounded-xl active:scale-95 transition-all duration-200 shadow-md shadow-coffee-900/20"
              title="Đăng nhập"
            >
              <User size={18} strokeWidth={2} />
            </button>
          )}

          {/* Cart */}
          <button 
            onClick={onCartClick}
            className="relative p-2.5 bg-white text-coffee-800 hover:bg-brand-red hover:text-white rounded-xl active:scale-95 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-brand-red/30 border border-coffee-100 hover:border-brand-red group"
            title="Giỏ hàng"
          >
            <ShoppingCart size={18} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm border-2 border-white group-hover:border-brand-red group-hover:bg-white group-hover:text-brand-red transition-colors">
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
