import React from 'react';
import { Gift, Star, Sparkles } from 'lucide-react';
import { useLoyalty } from '../contexts/LoyaltyContext';
import { motion } from 'framer-motion';

const LoyaltyCard = () => {
  const { points, vouchers } = useLoyalty();
  const progress = (points / 10) * 100;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-2xl overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="fill-white" size={24} />
              <h3 className="font-black text-xl tracking-tight">TÍCH ĐIỂM</h3>
            </div>
            <p className="text-sm opacity-90 font-medium">Mua 10 ly tặng 1 ly bất kỳ</p>
          </div>
          
          {/* Voucher Badge */}
          {vouchers > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -5, 0] }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white text-orange-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5"
            >
              <Gift size={18} className="fill-orange-600" />
              <span className="font-black text-lg">{vouchers}</span>
            </motion.div>
          )}
        </div>

        {/* Progress Circle Stamps */}
        <div className="flex justify-between items-center mb-3">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 ${
                i < points 
                  ? 'bg-white text-orange-600 shadow-lg scale-110' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              {i < points && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Sparkles size={16} className="fill-orange-600" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 backdrop-blur-sm h-2 rounded-full overflow-hidden mb-3 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="bg-white h-full rounded-full shadow-lg relative"
          >
            {progress > 0 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
            )}
          </motion.div>
        </div>

        {/* Status Text */}
        <div className="text-center">
          {points === 10 || vouchers > 0 ? (
            <motion.p 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-base font-black flex items-center justify-center gap-2"
            >
              <Sparkles className="fill-white" size={18} />
              Bạn có {vouchers} voucher miễn phí!
              <Sparkles className="fill-white" size={18} />
            </motion.p>
          ) : (
            <p className="text-sm font-bold">
              <span className="text-2xl font-black">{points}</span>/10 điểm
              <span className="opacity-90 ml-2">• Còn {10 - points} ly nữa nhận quà</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoyaltyCard;
