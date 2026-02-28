import React, { useState, useMemo, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
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
import useCart from './hooks/useCart';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import MenuItem from './components/MenuItem';
import MenuSkeleton from './components/MenuSkeleton';
import BottomNav from './components/BottomNav';
import CartModal from './components/CartModal';
import ProductModal from './components/ProductModal';
import PaymentModal from './components/PaymentModal';
import OrderHistory from './components/OrderHistory';
import LoginModal from './components/LoginModal';
import FeedbackModal from './components/FeedbackModal';
import StreakBadge from './components/StreakBadge';
import StreakModal from './components/StreakModal';
import ScrollEdgeEffect from './components/common/ScrollEdgeEffect';

// Lazy load AdminDashboard — chỉ admin mới cần, ~330 dòng + sub-components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

function AppContent() {
  // === Cart (custom hook — memoized internally) ===
  const {
    cartItems, addToCart, updateQuantity, removeFromCart,
    clearCart, totalItems, mostExpensiveItem,
  } = useCart();

  // === UI state ===
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

  // === Context hooks ===
  const { addPoints, useVoucher, vouchers } = useLoyalty();
  const { createOrder } = useOrders();
  const { user, isAdmin, isLoggedIn } = useAuth();
  const { menuItems, isLoading: isMenuLoading, getCategories } = useMenu();
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

  // Xử lý checkout từ CartModal — memoized
  const handleCheckout = useCallback((useVoucherFlag) => {
    if (cartItems.length === 0) return;

    if (!isLoggedIn) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      toast.error('Vui lòng đăng nhập để đặt món!', {
        duration: 3000,
        icon: '🔒',
      });
      return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const discount = useVoucherFlag && vouchers > 0 ? mostExpensiveItem : 0;
    const total = subtotal - discount;
    const tempOrderCode = Date.now().toString().slice(-8).toUpperCase();

    setOrderCodeForPayment(tempOrderCode);
    setTotalForPayment(total);
    setUsedVoucherInCart(useVoucherFlag);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  }, [cartItems, isLoggedIn, vouchers, mostExpensiveItem]);

  // Xác nhận thanh toán — memoized
  const handlePaymentConfirm = useCallback((paymentMethod) => {
    if (cartItems.length === 0) return;

    if (usedVoucherInCart && vouchers > 0) {
      useVoucher();
    }

    const orderCode = createOrder(cartItems, totalForPayment, paymentMethod, usedVoucherInCart);

    const streakResult = addStreak();

    clearCart();
    setIsPaymentOpen(false);

    toast.success(
      <div>
        <p className="font-bold">Đặt hàng thành công! 🎉</p>
        <p className="text-xs mt-1">Mã đơn: #{orderCode}</p>
        <p className="text-xs mt-1 text-stone-500">
          Điểm thưởng sẽ được cộng sau khi đơn hoàn thành
        </p>
        {streakResult?.success && (
          <p className="text-xs mt-1 text-orange-600 font-bold">
            {streakResult.message}
          </p>
        )}
      </div>,
      { duration: 5000, position: 'top-center' }
    );

    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }, [cartItems, usedVoucherInCart, vouchers, useVoucher, createOrder, totalForPayment, addStreak, clearCart]);

  // Scroll to top handler — memoized
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  // Scroll to top when category changes — memoized
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div id="app-root" className='min-h-screen bg-coffee-50 font-sans text-coffee-premium pb-24 selection:bg-orange-200 selection:text-orange-900 will-change-scroll'>
      {/* Toast Container */}
      <Toaster 
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          bottom: 120,
        }}
        toastOptions={{
          className: 'font-sans',
          duration: 2000,
          style: {
            borderRadius: '16px',
            fontWeight: '600',
            padding: '12px 20px',
            fontSize: '14px',
            maxWidth: '90vw',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
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
        streakBadge={<StreakBadge onClick={() => setIsStreakOpen(true)} />}
      />

      <Hero />

      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={handleCategoryChange} 
      />

      <main ref={mainRef} className='w-full max-w-md mx-auto px-4 mt-6 space-y-4 min-h-[50vh] will-change-scroll'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-black text-coffee-premium text-lg flex items-center gap-2'>
            {activeCategory === 'Tất cả' ? 'THỰC ĐƠN HÔM NAY' : activeCategory.toUpperCase()}
          </h3>
          <span className='text-xs font-medium text-coffee-400 bg-coffee-100 px-2 py-1 rounded-full'>
            {filteredMenu.length} món
          </span>
        </div>
        
        {/* Loading Skeleton */}
        {isMenuLoading ? (
          <MenuSkeleton count={4} />
        ) : filteredMenu.length === 0 ? (
          /* Empty State */
          <div className='flex flex-col items-center justify-center py-16 text-coffee-400'>
            <div className='w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mb-4'>
              <span className='text-3xl'>☕</span>
            </div>
            <p className='font-bold text-coffee-600 mb-1'>Chưa có món nào</p>
            <p className='text-sm text-coffee-400'>Danh mục này đang trống, thử chọn danh mục khác!</p>
          </div>
        ) : (
          /* Menu Grid */
          <div className={`grid ${activeCategory === 'Nước Ngọt' ? 'grid-cols-1 gap-3' : 'gap-4'} contain-layout`}>
            {filteredMenu.map((item, index) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onAddToCart={addToCart}
                onOpenModal={setSelectedProduct}
                priority={index < 3}
              />
            ))}
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

      <ScrollEdgeEffect />

      <BottomNav onFeedbackClick={() => setIsFeedbackOpen(true)} />

      <AnimatePresence>
        {isCartOpen && (
          <CartModal 
            key="cart-modal"
            isOpen={true} 
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
            onAddItem={addToCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            key="product-modal"
            isOpen={true}
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaymentOpen && (
          <PaymentModal
            key="payment-modal"
            isOpen={true}
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
            isOpen={true}
            onClose={() => setIsOrderHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal
            key="login-modal"
            isOpen={true}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 bg-coffee-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-brand-earth border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-coffee-600 font-bold text-sm">Đang tải Admin...</p>
              </div>
            </div>
          }>
            <AdminDashboard
              key="admin-dashboard"
              isOpen={true}
              onClose={() => setIsAdminOpen(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFeedbackOpen && (
          <FeedbackModal
            key="feedback-modal"
            isOpen={true}
            onClose={() => setIsFeedbackOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStreakOpen && (
          <StreakModal
            key="streak-modal"
            isOpen={true}
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
