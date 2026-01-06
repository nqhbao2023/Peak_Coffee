import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle, Coffee, Trash2, Search, Menu as MenuIcon, BarChart3, Settings, DollarSign } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MenuManager from './MenuManager';
import StatsOverview from './StatsOverview';
import FeedbackList from './FeedbackList';
import DebtManagement from './DebtManagement';

const AdminDashboard = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu, stats, debt, settings

  if (!isOpen) return null;

  // Filter orders
  const filteredOrders = orders.filter(order => 
    order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by status
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const preparingOrders = filteredOrders.filter(o => o.status === 'preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const completedOrders = filteredOrders.filter(o => o.status === 'completed');

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    
    const statusText = {
      'preparing': 'Đang pha chế',
      'ready': 'Sẵn sàng',
      'completed': 'Hoàn thành'
    };
    
    toast.success(`Đơn hàng → ${statusText[newStatus]}`, {
      icon: '✅',
      duration: 2000,
    });

    // Vibration
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleDelete = (orderId, orderCode) => {
    if (confirm(`Xóa đơn #${orderCode}?`)) {
      deleteOrder(orderId);
      toast.success('Đã xóa đơn hàng', { icon: '🗑️' });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const OrderCard = ({ order }) => {
    const getNextStatus = (currentStatus) => {
      const flow = {
        'pending': 'preparing',
        'preparing': 'ready',
        'ready': 'completed'
      };
      return flow[currentStatus];
    };

    const getStatusColor = (status) => {
      const colors = {
        'pending': 'bg-amber-50 border-amber-200 text-amber-700',
        'preparing': 'bg-blue-50 border-blue-200 text-blue-700',
        'ready': 'bg-green-50 border-green-200 text-green-700',
        'completed': 'bg-stone-50 border-stone-200 text-stone-500'
      };
      return colors[status] || colors.pending;
    };

    const getStatusText = (status) => {
      const texts = {
        'pending': 'Chờ duyệt',
        'preparing': 'Đang pha',
        'ready': 'Sẵn sàng',
        'completed': 'Hoàn thành'
      };
      return texts[status];
    };

    const getButtonText = (status) => {
      const texts = {
        'pending': 'Bắt đầu pha',
        'preparing': 'Đã xong',
        'ready': 'Đã giao',
      };
      return texts[status];
    };

    const nextStatus = getNextStatus(order.status);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`border-2 rounded-2xl p-4 ${getStatusColor(order.status)}`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-black text-lg">#{order.orderCode}</h3>
            <p className="text-xs opacity-75 font-bold">
              {formatTime(order.createdAt)} • {getStatusText(order.status)}
            </p>
          </div>
          {order.status === 'completed' && (
            <button
              onClick={() => handleDelete(order.id, order.orderCode)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          )}
        </div>

        {/* Items */}
        <div className="space-y-1.5 mb-3 bg-white/50 rounded-xl p-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="font-medium">
                {item.quantity}x {item.displayName || item.name}
              </span>
              <span className="font-bold">{(item.finalPrice * item.quantity).toLocaleString()}đ</span>
            </div>
          ))}
          {order.usedVoucher && (
            <div className="text-xs text-orange-600 font-bold pt-1 border-t border-current/20">
              🎁 Đã dùng voucher
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-current/20">
          <span className="font-bold">Tổng cộng</span>
          <span className="text-xl font-black">{order.total.toLocaleString()}đ</span>
        </div>

        {/* Payment Method */}
        <div className="flex justify-between items-center text-xs mb-3">
          <span className="opacity-75">Thanh toán</span>
          <span className="font-bold">
            {order.paymentMethod === 'qr' ? '💳 Chuyển khoản' : '💵 Tiền mặt'}
          </span>
        </div>

        {/* Actions */}
        {nextStatus && (
          <button
            onClick={() => handleStatusChange(order.id, nextStatus)}
            className="w-full bg-white hover:bg-white/80 py-3 rounded-xl font-black text-sm transition-all active:scale-[0.98] shadow-sm"
          >
            {getButtonText(order.status)} →
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-stone-900/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white w-full max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
                <Coffee className="text-orange-600" size={28} />
                Admin Dashboard
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {activeTab === 'orders' && 'Quản lý đơn hàng realtime'}
                {activeTab === 'menu' && 'Quản lý menu & món ăn'}
                {activeTab === 'stats' && 'Thống kê & báo cáo'}
                {activeTab === 'debt' && 'Quản lý công nợ khách hàng'}
                {activeTab === 'settings' && 'Cài đặt hệ thống'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={24} className="text-stone-500" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Package size={18} />
              Đơn hàng
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <MenuIcon size={18} />
              Menu
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <BarChart3 size={18} />
              Thống kê
            </button>
            <button
              onClick={() => setActiveTab('debt')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'debt'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <DollarSign size={18} />
              Công nợ
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Settings size={18} />
              Cài đặt
            </button>
          </div>

          {/* Search & Stats - Only show for Orders tab */}
          {activeTab === 'orders' && (
            <>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm mã đơn..."
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="bg-amber-100 rounded-xl p-2 text-center">
                  <p className="text-2xl font-black text-amber-700">{pendingOrders.length}</p>
                  <p className="text-[10px] font-bold text-amber-600">Chờ duyệt</p>
                </div>
                <div className="bg-blue-100 rounded-xl p-2 text-center">
                  <p className="text-2xl font-black text-blue-700">{preparingOrders.length}</p>
                  <p className="text-[10px] font-bold text-blue-600">Đang pha</p>
                </div>
                <div className="bg-green-100 rounded-xl p-2 text-center">
                  <p className="text-2xl font-black text-green-700">{readyOrders.length}</p>
                  <p className="text-[10px] font-bold text-green-600">Sẵn sàng</p>
                </div>
                <div className="bg-stone-100 rounded-xl p-2 text-center">
                  <p className="text-2xl font-black text-stone-700">{completedOrders.length}</p>
                  <p className="text-[10px] font-bold text-stone-600">Hoàn thành</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'orders' && (
            filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Package size={48} className="text-stone-300" />
                </div>
                <p className="text-stone-500 font-bold text-lg">Chưa có đơn hàng nào</p>
                <p className="text-sm text-stone-400 mt-1">
                  {searchQuery ? 'Không tìm thấy đơn hàng' : 'Đợi khách đặt món...'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </AnimatePresence>
              </div>
            )
          )}

          {activeTab === 'menu' && <MenuManager />}
          
          {activeTab === 'stats' && <StatsOverview />}
          
          {activeTab === 'debt' && <DebtManagement />}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <FeedbackList />
              
              {/* Các cài đặt khác */}
              <div className="text-center py-8 text-stone-400 text-sm">
                <Settings size={32} className="mx-auto mb-2 opacity-30" />
                Các cài đặt khác sẽ được bổ sung sau
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
