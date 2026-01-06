import React, { createContext, useContext, useState, useEffect } from 'react';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [debtOrders, setDebtOrders] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]); // NEW: Lịch sử giao dịch

  // Load từ LocalStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('peak_customers');
    const savedDebtOrders = localStorage.getItem('peak_debt_orders');
    const savedHistory = localStorage.getItem('peak_transaction_history');
    
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (e) {
        console.error('Error loading customers:', e);
      }
    }
    if (savedDebtOrders) {
      try {
        setDebtOrders(JSON.parse(savedDebtOrders));
      } catch (e) {
        console.error('Error loading debt orders:', e);
      }
    }
    if (savedHistory) {
      try {
        setTransactionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Lưu vào LocalStorage
  useEffect(() => {
    localStorage.setItem('peak_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('peak_debt_orders', JSON.stringify(debtOrders));
  }, [debtOrders]);

  useEffect(() => {
    localStorage.setItem('peak_transaction_history', JSON.stringify(transactionHistory));
  }, [transactionHistory]);

  // Tạo đơn hàng ghi nợ
  const createDebtOrder = (orderData) => {
    const { customerName, customerPhone, items, total, orderCode } = orderData;

    const newOrder = {
      id: `DEBT_${Date.now()}`,
      orderCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items,
      total,
      paid: 0, // Số tiền đã trả
      remaining: total, // Số tiền còn nợ
      status: 'DEBT', // DEBT (chưa trả hết), PAID (đã thanh toán đủ)
      createdAt: new Date().toISOString(),
      paidAt: null,
      paymentHistory: [], // Lịch sử thanh toán từng phần
    };

    setDebtOrders(prev => [newOrder, ...prev]);

    // Ghi lịch sử giao dịch
    setTransactionHistory(prev => [{
      id: `TXN_${Date.now()}`,
      type: 'CREATE_DEBT',
      customerName,
      customerPhone,
      orderCode,
      orderId: newOrder.id,
      amount: total,
      timestamp: new Date().toISOString(),
      description: `Ghi nợ đơn #${orderCode} cho ${customerName}`
    }, ...prev]);

    // Cập nhật thông tin khách hàng
    setCustomers(prev => {
      const existingIndex = prev.findIndex(c => c.phone === customerPhone);
      
      if (existingIndex !== -1) {
        // Khách cũ
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          totalDebt: updated[existingIndex].totalDebt + total,
          orderCount: updated[existingIndex].orderCount + 1,
          lastOrderDate: new Date().toISOString(),
          orders: [newOrder.id, ...updated[existingIndex].orders],
        };
        return updated;
      } else {
        // Khách mới
        return [...prev, {
          phone: customerPhone,
          name: customerName,
          totalDebt: total,
          totalPaid: 0,
          orderCount: 1,
          orders: [newOrder.id],
          createdAt: new Date().toISOString(),
          lastOrderDate: new Date().toISOString(),
          lastPaymentDate: null,
        }];
      }
    });

    return newOrder;
  };

  // Thanh toán từng phần hoặc toàn bộ
  const payDebt = (orderId, amount) => {
    const order = debtOrders.find(o => o.id === orderId);
    if (!order || order.status === 'PAID') return false;

    const paymentAmount = Math.min(amount, order.remaining);
    const newPaid = order.paid + paymentAmount;
    const newRemaining = order.total - newPaid;
    const isFullyPaid = newRemaining === 0;

    // Tạo record thanh toán
    const payment = {
      id: `PAY_${Date.now()}`,
      amount: paymentAmount,
      paidAt: new Date().toISOString(),
    };

    // Cập nhật đơn hàng
    setDebtOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              paid: newPaid,
              remaining: newRemaining,
              status: isFullyPaid ? 'PAID' : 'DEBT',
              paidAt: isFullyPaid ? new Date().toISOString() : o.paidAt,
              paymentHistory: [...o.paymentHistory, payment],
            }
          : o
      )
    );

    // Ghi lịch sử giao dịch
    setTransactionHistory(prev => [{
      id: `TXN_${Date.now()}`,
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
    }, ...prev]);

    // Cập nhật công nợ khách hàng
    setCustomers(prev =>
      prev.map(c =>
        c.phone === order.customerPhone
          ? {
              ...c,
              totalDebt: Math.max(0, c.totalDebt - paymentAmount),
              totalPaid: (c.totalPaid || 0) + paymentAmount,
              lastPaymentDate: new Date().toISOString(),
            }
          : c
      )
    );

    return { success: true, isFullyPaid, remaining: newRemaining };
  };

  // Thanh toán toàn bộ nợ của 1 khách (tất cả đơn)
  const payAllDebtByCustomer = (customerPhone, amount) => {
    const customerOrders = debtOrders
      .filter(o => o.customerPhone === customerPhone && o.status === 'DEBT')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Trả nợ cũ trước

    let remainingAmount = amount;
    let paidOrders = 0;

    for (const order of customerOrders) {
      if (remainingAmount <= 0) break;

      const payAmount = Math.min(remainingAmount, order.remaining);
      const result = payDebt(order.id, payAmount);
      
      if (result.success) {
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
  const deleteCustomer = (customerPhone) => {
    setCustomers(prev => prev.filter(c => c.phone !== customerPhone));
    setDebtOrders(prev => prev.filter(o => o.customerPhone !== customerPhone));
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
