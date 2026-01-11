import React, { useEffect } from 'react';
import { X, Flame, Calendar, Trophy, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStreak } from '../contexts/StreakContext';

const StreakModal = ({ isOpen, onClose }) => {
  const { streak, orderDates, STREAK_REWARDS, getNextReward } = useStreak();
  const nextReward = getNextReward();

  // LOCK SCROLL
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Lấy 30 ngày gần nhất để hiển thị calendar
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: date.getDate(),
        isOrdered: orderDates.includes(dateStr),
        isToday: i === 0,
      });
    }
    return days;
  };

  const last30Days = getLast30Days();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0"
      style={{ touchAction: 'none' }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/95"
        style={{ touchAction: 'none' }}
      />
      
      <motion.div 
        initial={{ y: '100%', scale: 0.85, rotateX: 20 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        exit={{ y: '100%', scale: 0.85, rotateX: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 260, mass: 0.9 }}
        className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_-20px_80px_rgba(251,146,60,0.5)] max-h-[92vh] overflow-hidden flex flex-col border-t-[6px] border-gradient-to-r from-orange-500 to-red-500"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
      >
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Flame size={32} fill="currentColor" className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">{streak} NGÀY</h2>
                    <p className="text-sm opacity-90">Điểm danh liên tục</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Next Reward */}
              {nextReward && (
                <div className="bg-white/20 rounded-2xl p-3">
                  <p className="text-xs opacity-90 mb-1">Phần thưởng tiếp theo:</p>
                  <p className="font-black flex items-center gap-2">
                    <Gift size={16} />
                    {nextReward.title} (còn {nextReward.daysLeft} ngày)
                  </p>
                </div>
              )}
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Calendar */}
            <div>
              <h3 className="font-black text-stone-800 flex items-center gap-2 mb-3">
                <Calendar size={20} className="text-orange-600" />
                30 ngày gần đây
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {last30Days.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      day.isOrdered
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg'
                        : day.isToday
                        ? 'bg-stone-200 text-stone-600 ring-2 ring-orange-500'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-red-500"></div>
                  <span className="text-stone-600">Đã đặt</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-stone-200 ring-2 ring-orange-500"></div>
                  <span className="text-stone-600">Hôm nay</span>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h3 className="font-black text-stone-800 flex items-center gap-2 mb-3">
                <Trophy size={20} className="text-orange-600" />
                Phần thưởng
              </h3>
              <div className="space-y-2">
                {STREAK_REWARDS.map((reward, index) => {
                  const isCompleted = streak >= reward.days;
                  const isCurrent = nextReward && nextReward.days === reward.days;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-500'
                          : isCurrent
                          ? 'bg-orange-50 border-orange-500'
                          : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent ? 'bg-orange-500 text-white' : 'bg-stone-300 text-stone-600'
                            }`}>
                              {reward.days}
                            </div>
                          )}
                          <span className={`text-sm font-bold ${
                            isCompleted ? 'text-green-700' : isCurrent ? 'text-orange-700' : 'text-stone-600'
                          }`}>
                            {reward.title}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold">
                            Tiếp theo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                <span className="font-bold text-stone-800">💡 Mẹo:</span> Đặt món mỗi ngày để giữ streak! Nếu bỏ lỡ 1 ngày, streak sẽ reset về 0.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default StreakModal;
