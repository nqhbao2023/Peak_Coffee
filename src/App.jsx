import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MENU_DATA } from './data/menu';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import MenuItem from './components/MenuItem';
import BottomNav from './components/BottomNav';
import CartModal from './components/CartModal';
import ProductModal from './components/ProductModal';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef(null);

  // Get unique categories
  const categories = useMemo(() => {
    const allCategories = MENU_DATA.map(item => item.category);
    return ['Tất cả', ...new Set(allCategories)];
  }, []);

  // Filter menu items
  const filteredMenu = useMemo(() => {
    if (activeCategory === 'Tất cả') return MENU_DATA;
    return MENU_DATA.filter(item => item.category === activeCategory);
  }, [activeCategory]);

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
    if (isCartOpen || selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen, selectedProduct]);

  // Scroll to top when category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='min-h-screen bg-stone-50 font-sans text-stone-900 pb-24 selection:bg-orange-200 selection:text-orange-900'>
      <Header 
        cartCount={totalItems} 
        onCartClick={() => setIsCartOpen(true)} 
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
        
        {/* Grid layout cho nuoc ngot (compact) */}
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

      <BottomNav />

      <AnimatePresence>
        {isCartOpen && (
          <CartModal 
            key="cart-modal"
            isOpen={true} 
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
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
    </div>
  );
}

export default App;
