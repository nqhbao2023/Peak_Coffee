import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLoyaltyCallback } from './OrderContext';
import { useAuth } from './AuthContext';
import { COLLECTIONS, updateDocument } from '../firebase/firestore';

const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [vouchers, setVouchers] = useState(0);
  const { user } = useAuth();

  // Load từ user profile trong Firestore
  useEffect(() => {
    if (user) {
      setPoints(user.loyaltyPoints || 0);
      setVouchers(user.loyaltyVouchers || 0);
    } else {
      // Chưa login: dùng localStorage
      const savedPoints = localStorage.getItem('peak_loyalty_points');
      const savedVouchers = localStorage.getItem('peak_loyalty_vouchers');
      if (savedPoints) setPoints(parseInt(savedPoints));
      if (savedVouchers) setVouchers(parseInt(savedVouchers));
    }
  }, [user]);

  // Backup vào LocalStorage (fallback khi chưa login)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('peak_loyalty_points', points);
      localStorage.setItem('peak_loyalty_vouchers', vouchers);
    }
  }, [points, vouchers, user]);

  // Thêm điểm sau khi đơn hàng được duyệt (mỗi ly = 1 điểm)
  const addPoints = async (itemCount) => {
    const newPoints = points + itemCount;
    const earnedVouchers = Math.floor(newPoints / 10);
    
    const updatedPoints = newPoints % 10;
    const updatedVouchers = vouchers + earnedVouchers;

    // Update state
    setPoints(updatedPoints);
    setVouchers(updatedVouchers);

    // Sync với Firestore nếu đã login
    if (user) {
      try {
        await updateDocument(COLLECTIONS.USERS, user.phone, {
          loyaltyPoints: updatedPoints,
          loyaltyVouchers: updatedVouchers,
        });
      } catch (error) {
        console.error('❌ Error updating loyalty:', error);
      }
    }
    
    return earnedVouchers; // Trả về số voucher vừa nhận
  };

  // Đăng ký callback với OrderContext để tự động tích điểm
  useEffect(() => {
    setLoyaltyCallback(addPoints);
  }, [points, vouchers]); // Re-register khi points/vouchers thay đổi

  // Sử dụng voucher (trả về true nếu thành công)
  const redeemVoucher = async () => {
    if (vouchers > 0) {
      const updatedVouchers = vouchers - 1;
      setVouchers(updatedVouchers);
      
      // Sync với Firestore nếu đã login
      if (user) {
        try {
          await updateDocument(COLLECTIONS.USERS, user.phone, {
            loyaltyVouchers: updatedVouchers,
          });
        } catch (error) {
          console.error('❌ Error using voucher:', error);
        }
      }
      
      return true;
    }
    return false;
  };

  const value = {
    points,
    vouchers,
    addPoints,
    redeemVoucher,
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
