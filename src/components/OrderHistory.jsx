import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, Clock, CheckCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = ({ isOpen, onClose }) => {
  const { orders, deleteOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Early return nếu modal đóng
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

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center sm:p-4"
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ y: '100%', opacity: 0.8 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[650px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2 tracking-tight">
              <span className="bg-orange-100 p-2 rounded-xl">
                <Package className="text-orange-600" size={24} />
              </span>
              Đơn hàng
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-stone-50 hover:bg-stone-100 rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-90"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Order Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
           {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                <Package size={40} className="text-stone-300" />
              </div>
              <h3 className="font-bold text-lg text-stone-600">Chưa có đơn hàng</h3>
              <p className="text-stone-400 text-sm mt-1">Các món bạn đặt sẽ hiện ở đây</p>
            </div>
           ) : (
             orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border ${statusInfo.border} rounded-2xl overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md`}
                  >
                    {/* Compact View */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl ${statusInfo.bg} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={statusInfo.color} size={22} strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg text-stone-800">#{order.orderCode}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-stone-400 mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                         <span className="block font-black text-stone-800 text-lg">{order.total.toLocaleString()}đ</span>
                      </div>
                    </button>

                    {/* Detailed Expanded View */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-stone-100 bg-stone-50/50"
                        >
                          <div className="p-4 space-y-3">
                            {/* Items List */}
                            <div className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-start text-sm">
                                  <div className="flex gap-2">
                                    <span className="font-bold text-orange-600 bg-orange-50 w-5 h-5 flex items-center justify-center rounded text-xs shrink-0 mt-0.5">
                                      {item.quantity}
                                    </span>
                                    <span className="text-stone-700 font-medium leading-tight">
                                      {item.displayName || item.name}
                                    </span>
                                  </div>
                                  <span className="font-bold text-stone-900 shrink-0 ml-4">
                                    {(item.finalPrice * item.quantity).toLocaleString()}đ
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Payment Meta */}
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Thanh toán</span>
                                <span className="text-sm font-bold text-stone-800 bg-white border border-stone-200 px-3 py-1 rounded-lg">
                                  {order.paymentMethod === 'qr' ? '💳 Chuyển khoản' : '💵 Tiền mặt'}
                                </span>
                            </div>

                            {order.usedVoucher && (
                              <div className="bg-brand-red/5 p-2 rounded-lg text-center border dashed border-brand-red/20">
                                <span className="text-xs font-bold text-brand-red flex items-center justify-center gap-1">
                                  🎁 Đã áp dụng voucher quà tặng
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            {order.status === 'completed' && (
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="w-full py-3 bg-white hover:bg-red-50 text-stone-400 hover:text-red-500 border border-stone-200 hover:border-red-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-2"
                              >
                                <Trash2 size={16} />
                                Xóa lịch sử đơn này
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
             })
           )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default OrderHistory;
