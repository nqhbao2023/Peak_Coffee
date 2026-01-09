import React, { useRef, useEffect, useState } from 'react';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  // Check scroll position to show gradient shadows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  return (
    <div className="sticky top-16 z-40 bg-coffee-50/95 backdrop-blur-md py-3 border-b border-coffee-200/50 shadow-sm">
      <div className="relative w-full max-w-md mx-auto">
        
        {/* Left Shadow Gradient */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-coffee-50 to-transparent z-10 transition-opacity duration-300 pointer-events-none ${showLeftShadow ? 'opacity-100' : 'opacity-0'}`} 
        />

        {/* Categories List */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-4 py-1"
        >
          {categories.map((category) => (
            <button 
              key={category} 
              onClick={() => onSelectCategory(category)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap snap-start border
                transition-all duration-300 ease-out flex-shrink-0
                ${activeCategory === category 
                  ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20 scale-100' 
                  : 'bg-white text-coffee-700 border-coffee-100 hover:border-coffee-300 hover:bg-coffee-50'}
              `}
            >
              {category}
            </button>
          ))}
          {/* Padding for right edge */}
          <div className="w-1 flex-shrink-0" /> 
        </div>

        {/* Right Shadow Gradient */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-coffee-50 to-transparent z-10 transition-opacity duration-300 pointer-events-none ${showRightShadow ? 'opacity-100' : 'opacity-0'}`} 
        />
      </div>
    </div>
  );
};

export default CategoryFilter;
