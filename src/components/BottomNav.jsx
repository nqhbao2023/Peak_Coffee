import React from 'react';
import { Phone } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-stone-200 p-2 rounded-2xl shadow-2xl shadow-stone-300/50 flex gap-2">
        <a 
          href="tel:0909000000" 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-[0.98] transition-all"
        >
          <Phone size={18} fill="currentColor" /> 
          <span>GOI CHU QUAN</span>
        </a>
      </div>
    </div>
  );
};

export default BottomNav;
