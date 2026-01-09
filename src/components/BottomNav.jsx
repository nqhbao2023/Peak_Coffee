import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const BottomNav = ({ onFeedbackClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full p-0">
      <div className="bg-white/95 backdrop-blur-xl border-t border-stone-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex gap-3">
        {/* Gọi Zalo */}
        <a 
          href="https://zalo.me/0988099125" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
        >
          <Phone size={18} fill="currentColor" /> 
          <span>ZALO</span>
        </a>

        {/* Góp ý */}
        <button
          onClick={onFeedbackClick}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
        >
          <MessageSquare size={18} fill="currentColor" />
          <span>GÓP Ý</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
