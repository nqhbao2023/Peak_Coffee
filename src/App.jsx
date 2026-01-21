import React, { useState, useMemo, useEffect, useRef, startTransition } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { LoyaltyProvider, useLoyalty } from './contexts/LoyaltyContext';
import { OrderProvider, useOrders } from './contexts/OrderContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MenuProvider, useMenu } from './contexts/MenuContext';
import { StreakProvider, useStreak } from './contexts/StreakContext';
import { DebtProvider } from './contexts/DebtContext';
import { getFCMToken, setupForegroundMessaging } from './firebase/messaging.jsx';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import MenuItem from './components/MenuItem';
import BottomNav from './components/BottomNav';
import CartModal from './components/CartModal';
import ProductModal from './components/ProductModal';
import PaymentModal from './components/PaymentModal';
import OrderHistory from './components/OrderHistory';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import FeedbackModal from './components/FeedbackModal';
import StreakBadge from './components/StreakBadge';
import StreakModal from './components/StreakModal';

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [orderCodeForPayment, setOrderCodeForPayment] = useState('');
  const [totalForPayment, setTotalForPayment] = useState(0);
  const [usedVoucherInCart, setUsedVoucherInCart] = useState(false);
  const mainRef = useRef(null);

  const { addPoints, redeemVoucher, vouchers } = useLoyalty();
  const { createOrder } = useOrders();
  const { user, isAdmin, isLoggedIn } = useAuth();
  const { menuItems, getCategories } = useMenu();
  const { addStreak } = useStreak();

  // Setup Firebase Cloud Messaging cho admin
  useEffect(() => {
    let unsubscribe;

    const initFCM = async () => {
      // Chỉ setup FCM cho admin
      if (isAdmin && user) {
        console.log('🔔 Setting up FCM for admin...');

        // Request permission và lấy token
        await getFCMToken(user.phone);

        // Setup foreground messaging listener
        unsubscribe = setupForegroundMessaging();
      }
    };

    initFCM();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAdmin, user]);

  // Get unique categories from dynamic menu
  const categories = useMemo(() => {
    return getCategories();
  }, [menuItems]);

  // Filter menu items from dynamic menu
  const filteredMenu = useMemo(() => {
    const availableItems = menuItems.filter(item => item.isAvailable);
    if (activeCategory === 'Tất cả') return availableItems;
    return availableItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  // Cart Logic - Su dung cartId de phan biet cac mon co options khac nhau
  const addToCart = (item) => {
    // Lấy số lượng cần thêm (mặc định là 1 nếu không có addQuantity)
    const quantityToAdd = item.addQuantity || 1;

    setCartItems(prev => {
      // Vì cartId chứa timestamp (từ ProductModal) nên mỗi lần thêm từ P.Modal là duy nhất
      // Tuy nhiên nếu logic thay đổi sau này, vẫn giữ logic check existing
      const existingIndex = prev.findIndex(i => i.cartId === item.cartId);

      // Loại bỏ thuộc tính tạm 'addQuantity' trước khi lưu vào state
      // eslint-disable-next-line no-unused-vars
      const { addQuantity, ...itemToSave } = item;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd
        };
        return updated;
      }
      return [...prev, { ...itemToSave, quantity: quantityToAdd }];
    });

    // Toast notification - Hiển thị số lượng đã thêm
    toast.success(
      quantityToAdd > 1
        ? `Đã thêm ${quantityToAdd} món vào giỏ!`
        : 'Đã thêm vào giỏ hàng!',
      {
        duration: 2000,
        position: 'top-center',
        icon: '🛒',
      }
    );

    // Vibration feedback cho mobile
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const updateQuantity = (cartId, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Xử lý checkout từ CartModal
  const handleCheckout = (useVoucherFlag) => {
    if (cartItems.length === 0) return;

    // Kiểm tra đăng nhập
    if (!isLoggedIn) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      toast.error('Vui lòng đăng nhập để đặt món!', {
        duration: 3000,
        icon: '🔒',
      });
      return;
    }

    // Tính tổng tiền
    const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const mostExpensiveItem = Math.max(...cartItems.map(item => item.finalPrice));
    const discount = useVoucherFlag && vouchers > 0 ? mostExpensiveItem : 0;
    const total = subtotal - discount;

    // Tạo mã đơn hàng tạm thời (sẽ được tạo chính thức khi confirm payment)
    const tempOrderCode = Date.now().toString().slice(-8).toUpperCase();

    setOrderCodeForPayment(tempOrderCode);
    setTotalForPayment(total);
    setUsedVoucherInCart(useVoucherFlag);

    // Đóng cart, mở payment
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  // Xác nhận thanh toán
  const handlePaymentConfirm = async (paymentMethod) => {
    if (cartItems.length === 0) return;

    try {
      // Sử dụng voucher nếu có
      if (usedVoucherInCart && vouchers > 0) {
        redeemVoucher();
      }

      // Tạo đơn hàng - Await here to get real string, not Promise
      // Use logic consistent with Debt creation: use existing orderCodeForPayment if available
      const newOrderCode = await createOrder(
        cartItems,
        totalForPayment,
        paymentMethod,
        usedVoucherInCart,
        orderCodeForPayment // Pass the pre-generated code (matches Debt Record)
      );

      // ❌ KHÔNG tích điểm ngay khi đặt hàng
      // ✅ Chỉ tích điểm khi admin duyệt đơn (status = 'completed')

      // ✅ TĂNG STREAK khi đặt món
      const streakResult = addStreak();

      // Xóa giỏ hàng
      setCartItems([]);
      setIsPaymentOpen(false);

      // Toast notification
      const isDebt = paymentMethod === 'debt';
      const title = isDebt
        ? `✅ Đã ghi nợ cho ${user?.name || 'Khách hàng'}!`
        : 'Đặt hàng thành công! 🎉';

      toast.success(
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-xs mt-1">Mã đơn: #{newOrderCode}</p>
          {!isDebt && (
            <p className="text-xs mt-1 text-stone-500">
              Điểm thưởng sẽ được cộng sau khi đơn hoàn thành
            </p>
          )}
          {streakResult.success && streakResult.message && (
            <p className="text-xs mt-1 text-orange-600 font-bold">
              {streakResult.message}
            </p>
          )}
        </div>,
        {
          duration: 3000,
          position: 'top-center',
          id: 'order-success', // Prevent duplicates
        }
      );

      // Vibration feedback
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll to top button - THROTTLED for performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isCartOpen || selectedProduct || isPaymentOpen || isOrderHistoryOpen || isLoginOpen || isAdminOpen || isFeedbackOpen || isStreakOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen, selectedProduct, isPaymentOpen, isOrderHistoryOpen, isLoginOpen, isAdminOpen, isFeedbackOpen, isStreakOpen]);

  // Scroll to top when category changes - INSTANT for better performance
  const handleCategoryChange = (category) => {
    // Wrap state update in startTransition to prevent UI blocking (INP improvement)
    startTransition(() => {
      setActiveCategory(category);
    });
    // Removed scroll to top as requested by user
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-coffee-50 via-white to-coffee-50 font-sans text-coffee-premium pb-24 selection:bg-brand-earth/20 selection:text-brand-earth will-change-scroll'>
      {/* Toast Container - Limit toasts to prevent freezing */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        limit={2} // Limit to 2 to prevent stacking too much
        containerStyle={{
          top: 80,
          bottom: 'auto',
        }}
        toastOptions={{
          className: 'font-sans glass shadow-lg active:scale-95 transition-transform',
          duration: 1500, // Faster (1.5s)
          style: {
            borderRadius: '16px',
            fontWeight: '600',
            padding: '12px 20px',
            fontSize: '14px',
            maxWidth: '90vw',
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#C25E00',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Header
        cartCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onOrderHistoryClick={() => setIsOrderHistoryOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <Hero />

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
      />

      <main ref={mainRef} className='w-full max-w-md mx-auto px-4 mt-8 space-y-6 min-h-[50vh] will-change-scroll pb-32'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-black text-coffee-premium text-xl flex items-center gap-2 tracking-tight'>
            {activeCategory === 'Tất cả' ? 'THỰC ĐƠN HÔM NAY' : activeCategory.toUpperCase()}
          </h3>
          <span className='text-xs font-bold text-coffee-500 bg-white/50 px-3 py-1.5 rounded-full border border-white/50 shadow-sm'>
            {filteredMenu.length} món
          </span>
        </div>

        {/* Grid layout - Optimized with contain */}
        <div className={`grid gap-5 contain-layout grid-cols-1`}>
          {filteredMenu.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onOpenModal={setSelectedProduct}
              priority={index < 20} // Tăng số lượng ảnh load eager để tránh warning intervention
            />
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className='text-center py-10 text-stone-400'>
            Không tìm thấy món nào trong danh mục này.
          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-24 right-4 z-30 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center border border-stone-200 active:scale-90 transition-all animate-in fade-in slide-in-from-bottom-4'
        >
          <ArrowUp size={20} className='text-stone-600' />
        </button>
      )}

      <BottomNav onFeedbackClick={() => setIsFeedbackOpen(true)} />

      <AnimatePresence>
        {isCartOpen && (
          <CartModal
            key="cart-modal"
            isOpen={isCartOpen}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
            onAddItem={addToCart}
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            key={selectedProduct.id}
            isOpen={!!selectedProduct}
            product={selectedProduct}
            onAddToCart={addToCart}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPaymentOpen && (
          <PaymentModal
            key="payment-modal"
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            total={totalForPayment}
            orderCode={orderCodeForPayment}
            cartItems={cartItems}
            onConfirm={handlePaymentConfirm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOrderHistoryOpen && (
          <OrderHistory
            key="order-history"
            isOpen={isOrderHistoryOpen}
            onClose={() => setIsOrderHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal
            key="login-modal"
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard
            key="admin-dashboard"
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFeedbackOpen && (
          <FeedbackModal
            key="feedback-modal"
            isOpen={isFeedbackOpen}
            onClose={() => setIsFeedbackOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStreakOpen && (
          <StreakModal
            key="streak-modal"
            isOpen={isStreakOpen}
            onClose={() => setIsStreakOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main App with Providers
function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <LoyaltyProvider>
          <OrderProvider>
            <StreakProvider>
              <DebtProvider>
                <AppContent />
              </DebtProvider>
            </StreakProvider>
          </OrderProvider>
        </LoyaltyProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
