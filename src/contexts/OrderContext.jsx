import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
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
  const { user, isAdmin } = useAuth();

  // Load orders từ Firestore với realtime listener
  useEffect(() => {
    let unsubscribe;

    const initOrders = async () => {
      try {
        setIsLoading(true);

        // Filter conditions
        let conditions = [];
        
        // Logic phân quyền:
        // 1. Admin: Xem ALL (không filter)
        // 2. User: Xem đơn của mình (filter theo phone)
        // 3. Guest: Không xem được gì (hoặc chỉ xem local - handled by fallback)
        
        if (isAdmin) {
          // Admin sees everything
          conditions = [];
        } else if (user) {
          // User sees their own orders
          conditions = [['userId', '==', user.phone]];
        } else {
          // Guest: Fallback to localStorage only
          // Stop here if strictly from Firestore
          const savedOrders = localStorage.getItem('peak_orders');
          if (savedOrders) {
             const parsed = JSON.parse(savedOrders);
             // 🛡️ SECURITY FIX: Filter orders strictly
             // Guest chỉ thấy đơn KHÔNG có userId (cũ) hoặc userId='GUEST'
             // Tuyệt đối không hiển thị đơn của user đã đăng ký
             const guestOrders = parsed.filter(o => {
                const isOwnedByGuest = !o.userId || o.userId === 'GUEST';
                // Double check: Nếu có userPhone thì phải trùng khớp (mà guest thì ko có phone)
                const hasPhone = o.userPhone && o.userPhone.length > 5;
                if (hasPhone && !isOwnedByGuest) return false;
                return isOwnedByGuest;
             });
             
             setOrders(guestOrders);
          } else {
             setOrders([]);
          }
          setIsLoading(false);
          return; 
        }

        // Setup realtime listener cho orders collection
        unsubscribe = listenToCollection(COLLECTIONS.ORDERS, (data) => {
          // Client-side sort vì Firestore query limit
          const sortedData = data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedData);
          setIsLoading(false);
        }, conditions);

      } catch (error) {
        console.error('❌ Error initializing orders:', error);
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
  }, [user, isAdmin]); // Re-run khi auth state change

  // Backup vào localStorage (fallback)
  useEffect(() => {
    // SECURITY PATCH: Ngăn chặn leak databse của Admin sang máy Guest
    // Chỉ lưu khi user đang login HOẶC là guest thực sự (chưa từng login admin framework ở session này)
    
    // Nếu đang là Admin, không lưu vào 'peak_orders' (local storage của guest)
    if (isAdmin) return;

    // Filter chặt chẽ chỉ lưu những đơn của user hiện tại hoặc đơn guest
    // Điều này ngăn chặn việc state 'orders' còn chứa data của admin trước khi component re-render
    const safeOrdersToSave = orders.filter(o => {
      // Nếu có user login, chỉ giữ đơn của họ
      if (user) return o.userId === user.phone;
      
      // Nếu là guest, chỉ giữ đơn guest (userId='GUEST' hoặc k có userId)
      return !o.userId || o.userId === 'GUEST';
    });

    if (safeOrdersToSave.length > 0) {
      localStorage.setItem('peak_orders', JSON.stringify(safeOrdersToSave));
    } else if (orders.length === 0 && !isLoading) {
       // Nếu state rỗng và đã load xong, clear local storage để đồng bộ
       // Nhưng cẩn thận không clear nhầm khi mới mount
    }
  }, [orders, isAdmin, user, isLoading]);

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
        // Add User Info
        userId: user?.phone || 'GUEST',
        userName: user?.name || 'Khách lẻ',
        userPhone: user?.phone || '',
      };

      // Save to Firestore (listener sẽ tự động update state)
      await setDocument(COLLECTIONS.ORDERS, orderId, newOrder);
      
      // Nếu là Guest, update local state ngay lập tức (vì không có listener)
      if (!user && !isAdmin) {
        // Add ID to local object for consistency
        const localOrder = { ...newOrder, id: orderId };
        
        setOrders(prev => [localOrder, ...prev]);
        // Also save to localStorage immediately for persistence
        const currentLocal = JSON.parse(localStorage.getItem('peak_orders') || '[]');
        localStorage.setItem('peak_orders', JSON.stringify([localOrder, ...currentLocal]));
      }
      
      return orderCode;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      toast.error((t) => (
        <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer">
          Lỗi khi tạo đơn hàng. Vui lòng thử lại!
        </span>
      ));
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
        // Note: Logic này đang chạy ở phía client thực hiện hành động (Admin)
        // Nên Admin sẽ thấy thông báo này.
        // TODO: Cần chuyển logic thông báo này sang Cloud Functions để bắn notification cho user thật.
        
        const earnedVouchers = loyaltyAddPointsCallback(totalItems);
        
        // Thông báo cho khách hàng
        if (earnedVouchers > 0) {
          toast.success((t) => (
            <div onClick={() => toast.dismiss(t.id)} className="cursor-pointer flex flex-col gap-1 min-w-[200px]">
              <p className="font-bold">🎉 Đơn hàng hoàn thành!</p>
              <p className="text-xs">Mã đơn: #{targetOrder.orderCode}</p>
              <p className="text-xs text-orange-600 font-bold">
                🎁 Bạn nhận được +{earnedVouchers} voucher miễn phí!
              </p>
              <p className="text-[10px] text-stone-400 mt-1 italic">(Chạm để đóng)</p>
            </div>
          ), { duration: 4000, position: 'top-center' });
        } else {
          toast.success((t) => (
            <div onClick={() => toast.dismiss(t.id)} className="cursor-pointer flex items-center gap-2">
              <span>✅ Đơn hàng #{targetOrder.orderCode} hoàn thành! (+{totalItems} điểm)</span>
            </div>
          ), { duration: 3000, position: 'top-center' });
        }
        
        // Vibration feedback
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      toast.error((t) => (
         <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer">Lỗi cập nhật trạng thái!</span>
      ));
      throw error;
    }
  };

  // Xóa đơn hàng (sync với Firestore)
  const deleteOrder = async (orderId) => {
    try {
      await deleteDocument(COLLECTIONS.ORDERS, orderId);
      toast.success((t) => (
         <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer">✅ Đã xóa đơn hàng!</span>
      ));
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      toast.error((t) => (
         <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer">Lỗi khi xóa đơn hàng!</span>
      ));
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
