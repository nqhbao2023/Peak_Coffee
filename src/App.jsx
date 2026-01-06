import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MENU_DATA } from './data/menu';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { LoyaltyProvider, useLoyalty } from './contexts/LoyaltyContext';
import { OrderProvider, useOrders } from './contexts/OrderContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MenuProvider, useMenu } from './contexts/MenuContext';
import { StreakProvider, useStreak } from './contexts/StreakContext';
import { DebtProvider } from './contexts/DebtContext';
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

  const { addPoints, useVoucher, vouchers } = useLoyalty();
  const { createOrder } = useOrders();
  const { user, isAdmin, isLoggedIn } = useAuth();
  const { menuItems, getCategories } = useMenu();
  const { addStreak } = useStreak();

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
    setCartItems(prev => {
      // Tim mon co cung cartId (bao gom ca options)
      const existingIndex = prev.findIndex(i => i.cartId === item.cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    // Toast notification
    toast.success('Đã thêm vào giỏ hàng!', {
      duration: 2000,
      position: 'top-center',
      icon: '🛒',
    });
    
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
  const handlePaymentConfirm = (paymentMethod) => {
    if (cartItems.length === 0) return;

    // Sử dụng voucher nếu có
    if (usedVoucherInCart && vouchers > 0) {
      useVoucher();
    }

    // Tạo đơn hàng
    const orderCode = createOrder(cartItems, totalForPayment, paymentMethod, usedVoucherInCart);

    // ❌ KHÔNG tích điểm ngay khi đặt hàng
    // ✅ Chỉ tích điểm khi admin duyệt đơn (status = 'completed')

    // ✅ TĂNG STREAK khi đặt món
    const streakResult = addStreak();
    if (streakResult.success && streakResult.reward) {
      // Có nhận reward từ streak
      if (streakResult.reward.type === 'voucher') {
        // TODO: Thêm voucher vào LoyaltyContext
        // Tạm thời chỉ toast
      }
    }

    // Xóa giỏ hàng
    setCartItems([]);
    setIsPaymentOpen(false);

    // Toast notification
    toast.success(
      <div>
        <p className="font-bold">Đặt hàng thành công! 🎉</p>
        <p className="text-xs mt-1">Mã đơn: #{orderCode}</p>
        <p className="text-xs mt-1 text-stone-500">
          Điểm thưởng sẽ được cộng sau khi đơn hoàn thành
        </p>
        {streakResult.success && (
          <p className="text-xs mt-1 text-orange-600 font-bold">
            {streakResult.message}
          </p>
        )}
      </div>,
      {
        duration: 5000,
        position: 'top-center',
      }
    );

    // Vibration feedback
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
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

  // Scroll to top when category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='min-h-screen bg-stone-50 font-sans text-stone-900 pb-24 selection:bg-orange-200 selection:text-orange-900'>
      {/* Toast Container */}
      <Toaster 
        toastOptions={{
          className: 'font-sans',
          style: {
            borderRadius: '12px',
            fontWeight: '600',
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

      <main ref={mainRef} className='px-4 mt-6 max-w-md mx-auto space-y-4 min-h-[50vh]'>
        <div className='flex items-center justify-between'>
          <h3 className='font-black text-stone-800 text-lg flex items-center gap-2'>
            {activeCategory === 'Tất cả' ? 'THỰC ĐƠN HÔM NAY' : activeCategory.toUpperCase()}
          </h3>
          <span className='text-xs font-medium text-stone-400 bg-stone-100 px-2 py-1 rounded-full'>
            {filteredMenu.length} món
          </span>
        </div>
        
        {/* Grid layout */}
        {activeCategory === 'Nước Ngọt' ? (
          <div className='grid grid-cols-1 gap-3'>
            {filteredMenu.map((item) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onAddToCart={addToCart}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className='grid gap-4'>
            {filteredMenu.map((item) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onAddToCart={addToCart}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        )}

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
          <AdminDashboard
            key="admin-dashboard"
            isOpen={true}
            onClose={() => setIsAdminOpen(false)}
          />
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
