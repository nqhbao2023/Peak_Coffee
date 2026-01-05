import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = ({ isOpen, onClose }) => {
  const { orders, deleteOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  if (!isOpen) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, text: 'Chờ xác nhận', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'preparing':
        return { icon: Package, text: 'Đang pha chế', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'ready':
        return { icon: CheckCircle, text: 'Sẵn sàng', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'completed':
        return { icon: CheckCircle, text: 'Hoàn thành', color: 'text-stone-400', bg: 'bg-stone-50', border: 'border-stone-200' };
      default:
        return { icon: Package, text: 'Đơn hàng', color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-200' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-br from-stone-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
              <Package className="text-orange-600" size={28} />
              Đơn hàng của tôi
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={24} className="text-stone-500" />
            </button>
          </div>
          <p className="text-sm text-stone-500 mt-1">{orders.length} đơn hàng</p>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto p-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package size={48} className="text-stone-300" />
              </div>
              <p className="text-stone-500 font-bold text-lg mb-2">Chưa có đơn hàng</p>
              <p className="text-sm text-stone-400">Đặt món ngay để xem lịch sử đơn hàng</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 ${statusInfo.border} rounded-2xl overflow-hidden ${statusInfo.bg}`}
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${statusInfo.bg} border ${statusInfo.border} flex items-center justify-center`}>
                          <StatusIcon className={statusInfo.color} size={24} />
                        </div>
                        <div className="text-left">
                          <p className="font-black text-stone-800">#{order.orderCode}</p>
                          <p className={`text-xs font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="font-black text-stone-800">{order.total.toLocaleString()}đ</p>
                          <p className="text-xs text-stone-400">{formatDate(order.createdAt)}</p>
                        </div>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {/* Order Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-stone-200 bg-white"
                        >
                          <div className="p-4 space-y-3">
                            {/* Items */}
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-stone-600">
                                    {item.quantity}x {item.displayName || item.name}
                                  </span>
                                  <span className="font-bold text-stone-800">
                                    {(item.finalPrice * item.quantity).toLocaleString()}đ
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Payment Method */}
                            <div className="pt-3 border-t border-stone-100 flex justify-between text-sm">
                              <span className="text-stone-500">Thanh toán</span>
                              <span className="font-bold text-stone-800">
                                {order.paymentMethod === 'qr' ? 'Chuyển khoản' : 'Tiền mặt'}
                              </span>
                            </div>

                            {order.usedVoucher && (
                              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-2 text-xs text-orange-600 font-bold text-center">
                                🎁 Đã sử dụng voucher miễn phí
                              </div>
                            )}

                            {/* Delete Button */}
                            {order.status === 'completed' && (
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="w-full mt-2 py-2 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                              >
                                <Trash2 size={16} />
                                Xóa đơn hàng
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderHistory;
