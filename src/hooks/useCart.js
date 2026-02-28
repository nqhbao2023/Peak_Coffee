import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook quản lý giỏ hàng
 * Tách ra từ AppContent để giảm re-render và tăng reusability
 */
const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Thêm món vào giỏ - memoized để tránh re-render children
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.cartId === item.cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    toast.success('Đã thêm vào giỏ hàng!', {
      duration: 2000,
      position: 'top-center',
      icon: '🛒',
    });

    // Vibration feedback cho mobile
    if (navigator.vibrate) navigator.vibrate(50);
  }, []);

  // Cập nhật số lượng - memoized
  const updateQuantity = useCallback((cartId, change) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.cartId === cartId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  }, []);

  // Xóa món khỏi giỏ - memoized
  const removeFromCart = useCallback((cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  }, []);

  // Xóa toàn bộ giỏ hàng - memoized
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Tổng số món - memoized
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Tổng tiền tạm tính - memoized
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
    [cartItems]
  );

  // Món đắt nhất (dùng cho voucher) - memoized
  const mostExpensiveItem = useMemo(
    () =>
      cartItems.length > 0
        ? Math.max(...cartItems.map(item => item.finalPrice))
        : 0,
    [cartItems]
  );

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    mostExpensiveItem,
  };
};

export default useCart;
