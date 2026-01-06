import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-16 z-40 bg-stone-50/95 backdrop-blur-sm py-4 border-b border-stone-100/50">
      <div className="px-4 flex gap-2 max-w-md mx-auto overflow-x-auto no-scrollbar snap-x">
        {categories.map((category) => (
          <button 
            key={category} 
            onClick={() => onSelectCategory(category)}
            className={`
              px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap snap-start
              transition-all duration-200 ease-out
              ${activeCategory === category 
                ? 'bg-stone-900 text-white shadow-lg scale-105' 
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200 active:scale-95'}
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
