import React, { createContext, useContext, useState, useEffect } from 'react';

const StreakContext = createContext();

// Rewards theo streak
const STREAK_REWARDS = [
  { days: 3, reward: 'voucher', count: 1, title: '3 ngày: +1 voucher' },
  { days: 7, reward: 'voucher', count: 3, title: '7 ngày: +3 vouchers' },
  { days: 14, reward: 'voucher', count: 5, title: '14 ngày: +5 vouchers' },
  { days: 30, reward: 'free_drink', count: 1, title: '30 ngày: 1 ly MIỄN PHÍ' },
];

export const StreakProvider = ({ children }) => {
  const [streak, setStreak] = useState(0);
  const [lastOrderDate, setLastOrderDate] = useState(null);
  const [orderDates, setOrderDates] = useState([]);
  const [streakHistory, setStreakHistory] = useState([]);

  // Load từ LocalStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('peak_streak');
    const savedLastOrderDate = localStorage.getItem('peak_last_order_date');
    const savedOrderDates = localStorage.getItem('peak_order_dates');
    const savedStreakHistory = localStorage.getItem('peak_streak_history');

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastOrderDate) setLastOrderDate(savedLastOrderDate);
    if (savedOrderDates) setOrderDates(JSON.parse(savedOrderDates));
    if (savedStreakHistory) setStreakHistory(JSON.parse(savedStreakHistory));

    checkStreakBreak();
  }, []);

  // Lưu vào LocalStorage
  useEffect(() => {
    localStorage.setItem('peak_streak', streak);
    if (lastOrderDate) localStorage.setItem('peak_last_order_date', lastOrderDate);
    localStorage.setItem('peak_order_dates', JSON.stringify(orderDates));
    localStorage.setItem('peak_streak_history', JSON.stringify(streakHistory));
  }, [streak, lastOrderDate, orderDates, streakHistory]);

  const isNewDay = () => {
    if (!lastOrderDate) return true;
    const last = new Date(lastOrderDate);
    const today = new Date();
    return (
      today.getDate() !== last.getDate() ||
      today.getMonth() !== last.getMonth() ||
      today.getFullYear() !== last.getFullYear()
    );
  };

  const isConsecutiveDay = () => {
    if (!lastOrderDate) return true;
    const last = new Date(lastOrderDate);
    const today = new Date();
    last.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  const checkStreakBreak = () => {
    if (!lastOrderDate) return;
    const last = new Date(lastOrderDate);
    const today = new Date();
    last.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      setStreak(0);
      return true;
    }
    return false;
  };

  const addStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (orderDates.includes(today)) {
      return { success: false, message: 'Bạn đã điểm danh hôm nay rồi!' };
    }

    let newStreak = streak;
    if (isNewDay()) {
      if (isConsecutiveDay()) {
        newStreak = streak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      return { success: false, message: 'Bạn đã điểm danh hôm nay rồi!' };
    }

    setStreak(newStreak);
    setLastOrderDate(new Date().toISOString());
    setOrderDates([...orderDates, today]);
    setStreakHistory([...streakHistory, { date: today, streak: newStreak }]);

    const reward = checkReward(newStreak);
    return { 
      success: true, 
      streak: newStreak,
      reward: reward,
      message: reward ? `🔥 ${newStreak} ngày liên tục! ${reward.message}` : `🔥 Streak: ${newStreak} ngày!`
    };
  };

  const checkReward = (currentStreak) => {
    const rewardTier = STREAK_REWARDS.find(r => r.days === currentStreak);
    if (rewardTier) {
      return {
        type: rewardTier.reward,
        count: rewardTier.count,
        message: rewardTier.title
      };
    }
    return null;
  };

  const getNextReward = () => {
    for (let reward of STREAK_REWARDS) {
      if (streak < reward.days) {
        return { ...reward, daysLeft: reward.days - streak };
      }
    }
    return null;
  };

  const resetStreak = () => {
    setStreak(0);
    setLastOrderDate(null);
    setOrderDates([]);
    setStreakHistory([]);
  };

  const value = {
    streak,
    lastOrderDate,
    orderDates,
    streakHistory,
    addStreak,
    resetStreak,
    getNextReward,
    checkStreakBreak,
    STREAK_REWARDS,
  };

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) throw new Error('useStreak must be used within StreakProvider');
  return context;
};
