import React from 'react';
import { Flame } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

const StreakBadge = ({ onClick }) => {
  const { streak, getNextReward } = useStreak();
  const nextReward = getNextReward();

  if (streak === 0) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
    >
      <Flame size={18} fill="currentColor" className="animate-pulse" />
      <div className="text-left">
        <p className="text-xs font-black leading-none">{streak} NGÀY</p>
        {nextReward && (
          <p className="text-[10px] opacity-90 leading-none mt-0.5">
            Còn {nextReward.daysLeft} ngày
          </p>
        )}
      </div>
    </button>
  );
};

export default StreakBadge;
