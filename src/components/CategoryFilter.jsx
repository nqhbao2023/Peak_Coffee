import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-16 z-40 bg-stone-50/95 backdrop-blur-sm py-4 border-b border-stone-100/50">
      <div className="px-4 flex gap-2 max-w-md mx-auto overflow-x-auto no-scrollbar snap-x">
        {categories.map((category) => (
          <button 
            key={category} 
            onClick={() => onSelectCategory(category)}
            className={`
              relative px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors snap-start
              ${activeCategory === category 
                ? 'text-white' 
                : 'text-stone-500 hover:bg-stone-100'}
            `}
          >
            {activeCategory === category && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-stone-900 rounded-full shadow-lg shadow-stone-200"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
