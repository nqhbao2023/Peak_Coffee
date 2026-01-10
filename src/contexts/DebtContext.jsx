import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { 
  COLLECTIONS, 
  setDocument, 
  updateDocument, 
  deleteDocument,
  listenToCollection,
  createDocument,
  getDocument 
} from '../firebase/firestore';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [debtOrders, setDebtOrders] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data từ Firestore với realtime listeners
  useEffect(() => {
    const unsubCustomers = listenToCollection(COLLECTIONS.CUSTOMERS, (data) => {
      setCustomers(data);
    });

    const unsubDebtOrders = listenToCollection(COLLECTIONS.DEBT_ORDERS, (data) => {
      // Sort client-side
      setDebtOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });

    const unsubTransactions = listenToCollection(COLLECTIONS.DEBT_TRANSACTIONS, (data) => {
       setTransactionHistory(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    });

    setIsLoading(false);
    
    return () => {
      if (unsubCustomers) unsubCustomers();
      if (unsubDebtOrders) unsubDebtOrders();
      if (unsubTransactions) unsubTransactions();
    };
  }, []);

  // Tạo đơn hàng ghi nợ
  const createDebtOrder = async (orderData) => {
    const { customerName, customerPhone, items, total, orderCode } = orderData;
    const orderId = `DEBT_${uuidv4()}`;

    const newOrder = {
      id: orderId,
      orderCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items,
      total,
      paid: 0,
      remaining: total,
      status: 'DEBT',
      createdAt: new Date().toISOString(),
      paidAt: null,
      paymentHistory: [],
    };

    try {
      await setDocument(COLLECTIONS.DEBT_ORDERS, orderId, newOrder);

      const txnId = `TXN_${uuidv4()}`;
      await setDocument(COLLECTIONS.DEBT_TRANSACTIONS, txnId, {
        id: txnId,
        type: 'CREATE_DEBT',
        customerName,
        customerPhone,
        orderCode,
        orderId: orderId,
        amount: total,
        timestamp: new Date().toISOString(),
        description: `Ghi nợ đơn #${orderCode} cho ${customerName}`
      });

      const existingCustomer = customers.find(c => c.phone === customerPhone);
      
      const debtAmount = Number(total);

      if (existingCustomer) {
        await updateDocument(COLLECTIONS.CUSTOMERS, existingCustomer.id, {
          totalDebt: (Number(existingCustomer.totalDebt) || 0) + debtAmount,
          orderCount: (existingCustomer.orderCount || 0) + 1,
          lastOrderDate: new Date().toISOString(),
          orders: [orderId, ...(existingCustomer.orders || [])],
        });
      } else {
        const newCustomerId = `CUST_${customerPhone}`;
        await setDocument(COLLECTIONS.CUSTOMERS, newCustomerId, {
          id: newCustomerId,
          phone: customerPhone,
          name: customerName,
          totalDebt: debtAmount,
          totalPaid: 0,
          orderCount: 1,
          orders: [orderId],
          createdAt: new Date().toISOString(),
          lastOrderDate: new Date().toISOString(),
          lastPaymentDate: null,
        });
      }

      return newOrder;
    } catch (error) {
      console.error('❌ Error creating debt order:', error);
      toast.error('Lỗi khi tạo đơn nợ!');
      return null;
    }
  };

  // Thanh toán từng phần hoặc toàn bộ
  const payDebt = async (orderId, amount) => {
    const order = debtOrders.find(o => o.id === orderId);
    if (!order || order.status === 'PAID') return false;

    const paymentAmount = Math.min(amount, order.remaining);
    const newPaid = order.paid + paymentAmount;
    const newRemaining = order.total - newPaid;
    const isFullyPaid = newRemaining === 0;

    const payment = {
      id: `PAY_${uuidv4()}`,
      amount: paymentAmount,
      paidAt: new Date().toISOString(),
    };

    try {
      await updateDocument(COLLECTIONS.DEBT_ORDERS, orderId, {
        paid: newPaid,
        remaining: newRemaining,
        status: isFullyPaid ? 'PAID' : 'DEBT',
        paidAt: isFullyPaid ? new Date().toISOString() : order.paidAt,
        paymentHistory: [...(order.paymentHistory || []), payment],
      });

      const txnId = `TXN_${uuidv4()}`;
      await setDocument(COLLECTIONS.DEBT_TRANSACTIONS, txnId, {
        id: txnId,
        type: isFullyPaid ? 'PAY_FULL' : 'PAY_PARTIAL',
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderCode: order.orderCode,
        orderId: order.id,
        amount: paymentAmount,
        remaining: newRemaining,
        timestamp: new Date().toISOString(),
        description: isFullyPaid 
          ? `Thanh toán đủ đơn #${order.orderCode} (${paymentAmount.toLocaleString()}đ)`
          : `Thanh toán từng phần đơn #${order.orderCode} (${paymentAmount.toLocaleString()}đ, còn ${newRemaining.toLocaleString()}đ)`
      });

      const customer = customers.find(c => c.phone === order.customerPhone);
      if (customer) {
        await updateDocument(COLLECTIONS.CUSTOMERS, customer.id, {
          totalDebt: Math.max(0, (customer.totalDebt || 0) - paymentAmount),
          totalPaid: (customer.totalPaid || 0) + paymentAmount,
          lastPaymentDate: new Date().toISOString(),
        });
      }

      return { success: true, isFullyPaid, remaining: newRemaining };
    } catch (error) {
      console.error('❌ Error paying debt:', error);
      toast.error('Lỗi khi thanh toán nợ!');
      return { success: false };
    }
  };

  // Thanh toán toàn bộ nợ của 1 khách (tất cả đơn)
  const payAllDebtByCustomer = async (customerPhone, amount) => {
    const customerOrders = debtOrders
      .filter(o => o.customerPhone === customerPhone && o.status === 'DEBT')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Trả nợ cũ trước

    let remainingAmount = amount;
    let paidOrders = 0;

    for (const order of customerOrders) {
      if (remainingAmount <= 0) break;

      const payAmount = Math.min(remainingAmount, order.remaining);
      const result = await payDebt(order.id, payAmount);
      
      if (result && result.success) {
        paidOrders++;
        remainingAmount -= payAmount;
      }
    }

    return { paidOrders, remainingAmount };
  };

  // Lấy tổng nợ của 1 khách
  const getCustomerDebt = (customerPhone) => {
    const customer = customers.find(c => c.phone === customerPhone);
    return customer ? customer.totalDebt : 0;
  };

  // Lấy danh sách đơn nợ của 1 khách
  const getCustomerDebtOrders = (customerPhone) => {
    return debtOrders.filter(o => o.customerPhone === customerPhone);
  };

  // Lấy tổng nợ của tất cả khách
  const getTotalDebt = () => {
    return customers.reduce((sum, c) => sum + c.totalDebt, 0);
  };

  // Lấy số khách đang nợ
  const getDebtCustomerCount = () => {
    return customers.filter(c => c.totalDebt > 0).length;
  };

  // Xóa khách hàng
  const deleteCustomer = async (customerId) => {
    try {
      let targetId = customerId;
      let targetPhone = '';
      
      const foundByPhone = customers.find(c => c.phone === customerId);
      if (foundByPhone) {
        targetId = foundByPhone.id;
        targetPhone = foundByPhone.phone;
      } else {
        const c = customers.find(c => c.id === customerId);
        targetPhone = c?.phone;
        targetId = c?.id;
      }

      if (!targetId) return;

      await deleteDocument(COLLECTIONS.CUSTOMERS, targetId);
      
      const ordersToDelete = debtOrders.filter(o => o.customerPhone === targetPhone);
      for (const order of ordersToDelete) {
         await deleteDocument(COLLECTIONS.DEBT_ORDERS, order.id);
      }
      
      toast.success('Đã xóa khách hàng và dữ liệu nợ');
    } catch (e) {
      console.error(e);
      toast.error('Lỗi khi xóa khách hàng');
    }
  };

  // Thống kê chi tiết
  const getDebtStats = () => {
    const totalDebt = getTotalDebt();
    const totalPaid = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
    const debtCustomerCount = getDebtCustomerCount();
    const unpaidOrderCount = debtOrders.filter(o => o.status === 'DEBT').length;
    const paidOrderCount = debtOrders.filter(o => o.status === 'PAID').length;
    const totalOrderCount = debtOrders.length;
    
    // Top khách nợ nhiều nhất
    const topDebtors = [...customers]
      .filter(c => c.totalDebt > 0)
      .sort((a, b) => b.totalDebt - a.totalDebt)
      .slice(0, 5);

    return {
      totalDebt,
      totalPaid,
      totalRevenue: totalDebt + totalPaid,
      debtCustomerCount,
      unpaidOrderCount,
      paidOrderCount,
      totalOrderCount,
      topDebtors,
    };
  };

  const value = {
    customers,
    debtOrders,
    transactionHistory,
    isLoading,
    createDebtOrder,
    payDebt,
    payAllDebtByCustomer,
    getCustomerDebt,
    getCustomerDebtOrders,
    getTotalDebt,
    getDebtCustomerCount,
    deleteCustomer,
    getDebtStats,
  };

  return <DebtContext.Provider value={value}>{children}</DebtContext.Provider>;
};

export const useDebt = () => {
  const context = useContext(DebtContext);
  if (!context) {
    throw new Error('useDebt must be used within DebtProvider');
  }
  return context;
};
