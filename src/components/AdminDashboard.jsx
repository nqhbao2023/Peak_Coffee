import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle, Menu as MenuIcon, BarChart3, Settings, DollarSign, Trash2, Check, RefreshCw, MessageSquare } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MenuManager from './MenuManager';
import StatsOverview from './StatsOverview';
import FeedbackList from './FeedbackList';
import DebtManagement from './DebtManagement';

const AdminDashboard = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu, stats, debt, feedback
  const [orderFilter, setOrderFilter] = useState('pending'); // pending, preparing, ready, completed
  const [deletingOrder, setDeletingOrder] = useState(null); // State for delete confirmation modal

  if (!isOpen) return null;

  // Filter orders by status
  const getOrdersByStatus = (status) => orders.filter(o => o.status === status);

  const pendingOrders = getOrdersByStatus('pending');
  const preparingOrders = getOrdersByStatus('preparing');
  const readyOrders = getOrdersByStatus('ready');
  const completedOrders = getOrdersByStatus('completed');

  // Calculate badges
  const badges = {
    pending: pendingOrders.length,
    preparing: preparingOrders.length,
    ready: readyOrders.length,
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);

    // Xóa toast tại đây vì trong updateOrderStatus đã có toast success/error rồi
    // Việc duplicate notification gây khó chịu cho user
    // Chỉ rung để báo hiệu đã bấm
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const confirmDelete = (order) => {
    setDeletingOrder(order);
  };

  const performDelete = () => {
    if (deletingOrder) {
      deleteOrder(deletingOrder.id);
      setDeletingOrder(null);
      // Không cần toast ở đây nữa vì Context đã handle
    }
  };

  const OrderCard = ({ order, actionButton, secondaryAction }) => (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="font-black text-base text-stone-800">#{order.orderCode}</span>
          <span className="text-[10px] text-stone-400 font-bold bg-stone-100 px-1.5 py-0.5 rounded">
            {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <span className="font-black text-base text-orange-600">{order.total.toLocaleString()}đ</span>
      </div>

      <div className="bg-stone-50 rounded-lg p-2 text-xs font-medium text-stone-700 space-y-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between border-b border-stone-200 last:border-0 pb-0.5 last:pb-0">
            <span><span className="font-bold text-stone-900">{item.quantity}x</span> {item.displayName}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {actionButton}
        <button
          onClick={() => confirmDelete(order)}
          className="w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-stone-50 flex flex-col"
    >
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setDeletingOrder(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-black text-center text-stone-800 mb-2">Xóa đơn hàng?</h3>
              <p className="text-center text-stone-500 mb-6">
                Bạn có chắc muốn xóa đơn <span className="font-bold text-stone-800">#{deletingOrder.orderCode}</span> không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingOrder(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200"
                >
                  Hủy
                </button>
                <button
                  onClick={performDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header - Compact */}
      <div className="bg-stone-900 text-white px-4 py-2 flex justify-between items-center shadow-md z-20">
        <h2 className="text-lg font-black flex items-center gap-2">
          <Settings size={18} className="text-orange-500" />
          Admin
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center active:bg-stone-700"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Nav Tabs - Compact horizontal */}
      <div className="bg-white border-b border-stone-200 px-2 py-1.5 flex gap-1 overflow-x-auto no-scrollbar z-10">
        {[
          { id: 'orders', label: 'Đơn', icon: Package },
          { id: 'menu', label: 'Menu', icon: MenuIcon },
          { id: 'stats', label: 'Thu', icon: BarChart3 },
          { id: 'debt', label: 'Nợ', icon: DollarSign },
          { id: 'feedback', label: 'Góp ý', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[60px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                ? 'bg-stone-800 text-white'
                : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
              }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? 'text-orange-400' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-hidden relative bg-stone-100">

        {/* ORDERS VIEW */}
        {activeTab === 'orders' && (
          <div className="absolute inset-0 flex flex-col">
            {/* Status Filters */}
            <div className="flex p-2 gap-2 overflow-x-auto bg-white/80 backdrop-blur-sm border-b border-stone-200">
              {[
                { id: 'pending', label: 'Mới', color: 'bg-amber-100 text-amber-700' },
                { id: 'preparing', label: 'Đang làm', color: 'bg-blue-100 text-blue-700' },
                { id: 'ready', label: 'Chờ lấy', color: 'bg-green-100 text-green-700' },
                { id: 'completed', label: 'Lịch sử', color: 'bg-stone-200 text-stone-600' }
              ].map(status => (
                <button
                  key={status.id}
                  onClick={() => setOrderFilter(status.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${orderFilter === status.id
                      ? 'bg-stone-800 text-white shadow-md'
                      : 'bg-white text-stone-500 border border-stone-200'
                    }`}
                >
                  {status.label}
                  {badges[status.id] > 0 && status.id !== 'completed' && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                      {badges[status.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
              {/* PENDING */}
              {orderFilter === 'pending' && (
                <>
                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">Không có đơn mới</div>
                  ) : (
                    pendingOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actionButton={
                          <button
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-bold hover:bg-amber-600 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                          >
                            <Clock size={16} /> Nhận đơn
                          </button>
                        }
                      />
                    ))
                  )}
                </>
              )}

              {/* PREPARING */}
              {orderFilter === 'preparing' && (
                <>
                  {preparingOrders.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">Không có đơn đang pha</div>
                  ) : (
                    preparingOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actionButton={
                          <button
                            onClick={() => handleStatusChange(order.id, 'ready')}
                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={16} className="animate-spin-slow" /> Xong món
                          </button>
                        }
                      />
                    ))
                  )}
                </>
              )}

              {/* READY */}
              {orderFilter === 'ready' && (
                <>
                  {readyOrders.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">Không có đơn chờ lấy</div>
                  ) : (
                    readyOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actionButton={
                          <button
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                          >
                            <Check size={16} /> Đã giao khách
                          </button>
                        }
                      />
                    ))
                  )}
                </>
              )}

              {/* COMPLETED */}
              {orderFilter === 'completed' && (
                <div className="space-y-3 opacity-75">
                  {completedOrders.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">Chưa có lịch sử đơn</div>
                  ) : (
                    completedOrders.slice(0, 50).map(order => ( // Limit check history
                      <OrderCard
                        key={order.id}
                        order={order}
                        actionButton={
                          <div className="flex-1 text-center py-2 text-xs font-bold text-stone-400 bg-stone-100 rounded-lg">
                            Đã hoàn thành lúc {(() => {
                              const dateStr = order.completedAt || order.updatedAt || order.createdAt;
                              if (!dateStr) return '---';
                              try {
                                return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                              } catch (e) {
                                return '---';
                              }
                            })()}
                          </div>
                        }
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* OTHER TABS - Render full components wrapped in scrollable div if needed */}
        {activeTab === 'menu' && (
          <div className="h-full overflow-y-auto p-4 pb-20"><MenuManager /></div>
        )}
        {activeTab === 'stats' && (
          <div className="h-full overflow-y-auto p-4 pb-20"><StatsOverview orders={orders} /></div>
        )}
        {activeTab === 'debt' && (
          <div className="h-full overflow-y-auto p-4 pb-20"><DebtManagement /></div>
        )}
        {activeTab === 'feedback' && (
          <div className="h-full overflow-y-auto p-4 pb-20"><FeedbackList /></div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
