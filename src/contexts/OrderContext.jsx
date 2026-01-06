import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { 
  COLLECTIONS, 
  setDocument, 
  updateDocument, 
  deleteDocument,
  listenToCollection,
} from '../firebase/firestore';

const OrderContext = createContext();

// Callback để tích điểm khi đơn hàng hoàn thành
let loyaltyAddPointsCallback = null;

export const setLoyaltyCallback = (callback) => {
  loyaltyAddPointsCallback = callback;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders từ Firestore với realtime listener
  useEffect(() => {
    let unsubscribe;

    const initOrders = async () => {
      try {
        setIsLoading(true);

        // Setup realtime listener cho orders collection
        // Sort theo createdAt mới nhất lên đầu
        unsubscribe = listenToCollection(COLLECTIONS.ORDERS, (data) => {
          // Sort by createdAt (mới nhất lên đầu)
          const sortedData = data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedData);
          setIsLoading(false);
        });

      } catch (error) {
        console.error('❌ Error initializing orders:', error);
        toast.error('Lỗi khi tải đơn hàng!');
        
        // Fallback: Load từ localStorage
        const savedOrders = localStorage.getItem('peak_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
        setIsLoading(false);
      }
    };

    initOrders();

    // Cleanup listener
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Backup vào localStorage (fallback)
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('peak_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Tạo đơn hàng mới (sync với Firestore)
  const createOrder = async (cartItems, total, paymentMethod, usedVoucher = false) => {
    try {
      const orderId = uuidv4();
      const orderCode = uuidv4().slice(0, 8).toUpperCase();
      
      const newOrder = {
        orderCode,
        items: cartItems,
        total,
        paymentMethod,
        usedVoucher,
        status: 'pending', // pending -> preparing -> ready -> completed
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore (listener sẽ tự động update state)
      await setDocument(COLLECTIONS.ORDERS, orderId, newOrder);
      
      // Toast notification cho khách hàng
      toast.success(
        <div>
          <p className="font-bold">✅ Đặt hàng thành công!</p>
          <p className="text-xs mt-1">Mã đơn: <span className="font-bold text-orange-600">#{orderCode}</span></p>
        </div>,
        { duration: 4000 }
      );
      
      return orderCode;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      toast.error('Lỗi khi tạo đơn hàng. Vui lòng thử lại!');
      throw error;
    }
  };

  // Cập nhật trạng thái đơn hàng (sync với Firestore)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Tìm đơn hàng trước khi update để lấy thông tin
      const targetOrder = orders.find(order => order.id === orderId);
      
      if (!targetOrder) {
        console.error('Order not found:', orderId);
        return;
      }

      // Update Firestore (listener sẽ tự động update state)
      await updateDocument(COLLECTIONS.ORDERS, orderId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // ✅ Tự động tích điểm khi admin duyệt đơn hoàn thành
      if (newStatus === 'completed' && loyaltyAddPointsCallback) {
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
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      toast.error('Lỗi khi cập nhật đơn hàng!');
      throw error;
    }
  };

  // Xóa đơn hàng (sync với Firestore)
  const deleteOrder = async (orderId) => {
    try {
      await deleteDocument(COLLECTIONS.ORDERS, orderId);
      toast.success('✅ Đã xóa đơn hàng!');
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      toast.error('Lỗi khi xóa đơn hàng!');
      throw error;
    }
  };

  // Lấy đơn hàng theo trạng thái
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const value = {
    orders,
    isLoading,
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
