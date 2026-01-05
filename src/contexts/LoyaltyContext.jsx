import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLoyaltyCallback } from './OrderContext';

const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [vouchers, setVouchers] = useState(0);

  // Load từ LocalStorage khi app khởi động
  useEffect(() => {
    const savedPoints = localStorage.getItem('peak_loyalty_points');
    const savedVouchers = localStorage.getItem('peak_loyalty_vouchers');
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedVouchers) setVouchers(parseInt(savedVouchers));
  }, []);

  // Lưu vào LocalStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('peak_loyalty_points', points);
    localStorage.setItem('peak_loyalty_vouchers', vouchers);
  }, [points, vouchers]);

  // Thêm điểm sau khi đơn hàng được duyệt (mỗi ly = 1 điểm)
  const addPoints = (itemCount) => {
    const newPoints = points + itemCount;
    const earnedVouchers = Math.floor(newPoints / 10);
    
    if (earnedVouchers > 0) {
      setVouchers(vouchers + earnedVouchers);
      setPoints(newPoints % 10);
      return earnedVouchers; // Trả về số voucher vừa nhận để hiển thị notification
    } else {
      setPoints(newPoints);
      return 0;
    }
  };

  // Đăng ký callback với OrderContext để tự động tích điểm
  useEffect(() => {
    setLoyaltyCallback(addPoints);
  }, [points, vouchers]); // Re-register khi points/vouchers thay đổi

  // Sử dụng voucher (trả về true nếu thành công)
  const useVoucher = () => {
    if (vouchers > 0) {
      setVouchers(vouchers - 1);
      return true;
    }
    return false;
  };

  const value = {
    points,
    vouchers,
    addPoints,
    useVoucher,
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within LoyaltyProvider');
  }
  return context;
};
