import React from 'react';
import { Phone } from 'lucide-react';

// Compact floating Zalo button - frees up screen space
const BottomNav = () => {
  return (
    <a
      href="https://zalo.me/0988099125"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-xl shadow-green-600/30 active:scale-95 transition-all duration-300 hover:shadow-2xl hover:shadow-green-600/40"
      title="Liên hệ Zalo"
    >
      <Phone size={24} fill="currentColor" />
    </a>
  );
};

export default BottomNav;

