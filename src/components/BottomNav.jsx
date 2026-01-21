import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const BottomNav = ({ onFeedbackClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full p-0">
      <div className="glass px-4 py-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex gap-4 border-t border-white/20">
        {/* Gọi Zalo */}
        <a
          href="https://zalo.me/0988099125"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all duration-300"
        >
          <Phone size={20} fill="currentColor" />
          <span>ZALO</span>
        </a>

        {/* Góp ý */}
        <button
          onClick={onFeedbackClick}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all duration-300"
        >
          <MessageSquare size={20} fill="currentColor" />
          <span>GÓP Ý</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
