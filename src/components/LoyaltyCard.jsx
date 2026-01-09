import React from 'react';
import { Gift, Star, Sparkles } from 'lucide-react';
import { useLoyalty } from '../contexts/LoyaltyContext';

const LoyaltyCard = () => {
  const { points, vouchers } = useLoyalty();
  const progress = (points / 10) * 100;

  return (
    <div 
      className="relative bg-gradient-to-br from-coffee-800 to-brand-red rounded-2xl p-5 text-white shadow-xl shadow-coffee-200 overflow-hidden animate-fade-in border border-coffee-700/30"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-red rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Star className="fill-white" size={20} />
              <h3 className="font-extrabold text-lg tracking-tight uppercase">Thẻ Thành Viên</h3>
            </div>
            <p className="text-xs text-white/90 font-medium">Tích 10 điểm tặng 1 ly bất kỳ</p>
          </div>
          
          {/* Voucher Badge */}
          {vouchers > 0 && (
            <div 
              className="bg-white text-brand-red px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 animate-bounce-once"
            >
              <Gift size={16} className="fill-brand-red" />
              <span className="font-black text-base">{vouchers}</span>
            </div>
          )}
        </div>

        {/* Progress Circle Stamps */}
        <div className="flex justify-between items-center mb-3 px-1">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border border-white/40 flex items-center justify-center transition-all duration-300 ${
                i < points 
                  ? 'bg-white text-brand-red shadow-lg scale-110 border-white' 
                  : 'bg-white/10'
              }`}
            >
              {i < points && (
                <Sparkles size={12} className="fill-brand-red" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-black/20 h-1.5 rounded-full overflow-hidden mb-3">
          <div 
            style={{ width: `${progress}%` }}
            className="bg-white h-full rounded-full shadow relative transition-all duration-500 ease-out"
          >
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center">
          {points === 10 || vouchers > 0 ? (
            <p 
              className="text-sm font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="fill-white" size={14} />
              Bạn có {vouchers} ly miễn phí!
              <Sparkles className="fill-white" size={14} />
            </p>
          ) : (
            <p className="text-xs font-semibold text-white/90">
              <span className="text-xl font-black text-white">{points}</span>/10 điểm
              <span className="opacity-80 ml-2 font-normal">• {10 - points} ly nữa nhận quà</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard;
