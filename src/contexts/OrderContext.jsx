import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const OrderContext = createContext();

// Callback để tích điểm khi đơn hàng hoàn thành
let loyaltyAddPointsCallback = null;

export const setLoyaltyCallback = (callback) => {
  loyaltyAddPointsCallback = callback;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders từ LocalStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('peak_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Lưu orders vào LocalStorage
  useEffect(() => {
    localStorage.setItem('peak_orders', JSON.stringify(orders));
  }, [orders]);

  // Tạo đơn hàng mới
  const createOrder = (cartItems, total, paymentMethod, usedVoucher = false) => {
    const orderCode = uuidv4().slice(0, 8).toUpperCase();
    
    const newOrder = {
      id: uuidv4(),
      orderCode,
      items: cartItems,
      total,
      paymentMethod,
      usedVoucher,
      status: 'pending', // pending -> preparing -> ready -> completed
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    return orderCode;
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = (orderId, newStatus) => {
    // Tìm đơn hàng trước khi update để lấy thông tin
    const targetOrder = orders.find(order => order.id === orderId);
    
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );

    // ✅ Tự động tích điểm khi admin duyệt đơn hoàn thành
    if (newStatus === 'completed' && targetOrder && loyaltyAddPointsCallback) {
      const totalItems = targetOrder.items.reduce((sum, item) => sum + item.quantity, 0);
      const earnedVouchers = loyaltyAddPointsCallback(totalItems);
      
      // Thông báo cho khách hàng
      if (earnedVouchers > 0) {
        toast.success(
          <div>
            <p className="font-bold">🎉 Đơn hàng hoàn thành!</p>
            <p className="text-xs mt-1">Mã đơn: #{targetOrder.orderCode}</p>
            <p className="text-xs mt-1 text-orange-600 font-bold">
              🎁 Bạn nhận được +{earnedVouchers} voucher miễn phí!
            </p>
          </div>,
          { duration: 5000, position: 'top-center' }
        );
      } else {
        toast.success(
          `✅ Đơn hàng #${targetOrder.orderCode} hoàn thành! (+${totalItems} điểm)`,
          { duration: 3000, position: 'top-center' }
        );
      }
      
      // Vibration feedback
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  // Xóa đơn hàng
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Lấy đơn hàng theo trạng thái
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
