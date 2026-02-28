import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { setLoyaltyCallback } from './OrderContext';
import { useAuth } from './AuthContext';
import { COLLECTIONS, updateDocument } from '../firebase/firestore';

const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [vouchers, setVouchers] = useState(0);
  const { user } = useAuth();

  // Ref để luôn trỏ đến giá trị mới nhất — tránh stale closure trong callback
  const pointsRef = useRef(points);
  const vouchersRef = useRef(vouchers);
  const userRef = useRef(user);

  useEffect(() => { pointsRef.current = points; }, [points]);
  useEffect(() => { vouchersRef.current = vouchers; }, [vouchers]);
  useEffect(() => { userRef.current = user; }, [user]);

  // Load từ user profile trong Firestore
  useEffect(() => {
    if (user) {
      setPoints(user.loyaltyPoints || 0);
      setVouchers(user.loyaltyVouchers || 0);
    } else {
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

  // Thêm điểm — dùng ref để tránh stale closure, stable identity
  const addPoints = useCallback(async (itemCount) => {
    const currentPoints = pointsRef.current;
    const currentVouchers = vouchersRef.current;
    const currentUser = userRef.current;

    const newPoints = currentPoints + itemCount;
    const earnedVouchers = Math.floor(newPoints / 10);
    const updatedPoints = newPoints % 10;
    const updatedVouchers = currentVouchers + earnedVouchers;

    setPoints(updatedPoints);
    setVouchers(updatedVouchers);

    if (currentUser) {
      try {
        await updateDocument(COLLECTIONS.USERS, currentUser.phone, {
          loyaltyPoints: updatedPoints,
          loyaltyVouchers: updatedVouchers,
        });
      } catch (error) {
        console.error('❌ Error updating loyalty:', error);
      }
    }

    return earnedVouchers;
  }, []); // Stable — không phụ thuộc vào points/vouchers nhờ ref

  // Đăng ký callback 1 lần duy nhất (stable reference)
  useEffect(() => {
    setLoyaltyCallback(addPoints);
  }, [addPoints]);

  // Sử dụng voucher
  const redeemVoucher = useCallback(async () => {
    const currentVouchers = vouchersRef.current;
    const currentUser = userRef.current;

    if (currentVouchers > 0) {
      const updatedVouchers = currentVouchers - 1;
      setVouchers(updatedVouchers);

      if (currentUser) {
        try {
          await updateDocument(COLLECTIONS.USERS, currentUser.phone, {
            loyaltyVouchers: updatedVouchers,
          });
        } catch (error) {
          console.error('❌ Error using voucher:', error);
        }
      }
      return true;
    }
    return false;
  }, []);

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
