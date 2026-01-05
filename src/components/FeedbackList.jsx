import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Eye } from 'lucide-react';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  // Load feedbacks từ localStorage
  useEffect(() => {
    const loadFeedbacks = () => {
      const saved = localStorage.getItem('peak_feedbacks');
      if (saved) {
        setFeedbacks(JSON.parse(saved));
      }
    };

    loadFeedbacks();
    
    // Tự động refresh mỗi 5 giây
    const interval = setInterval(loadFeedbacks, 5000);
    return () => clearInterval(interval);
  }, []);

  // Đánh dấu đã đọc
  const markAsRead = (feedbackId) => {
    const updated = feedbacks.map(fb => 
      fb.id === feedbackId ? { ...fb, status: 'read' } : fb
    );
    setFeedbacks(updated);
    localStorage.setItem('peak_feedbacks', JSON.stringify(updated));
  };

  // Format thời gian
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const pendingCount = feedbacks.filter(fb => fb.status === 'pending').length;

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-stone-800 flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={20} />
            Góp ý từ khách hàng
          </h3>
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingCount} mới
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-stone-100 max-h-[400px] overflow-y-auto">
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-stone-400">
            <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Chưa có góp ý nào</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              className={`p-4 hover:bg-stone-50 transition-colors ${
                feedback.status === 'pending' ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800">{feedback.name}</span>
                  {feedback.status === 'pending' && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      Mới
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock size={12} />
                  {formatTime(feedback.timestamp)}
                </div>
              </div>
              
              <p className="text-sm text-stone-600 mb-3 leading-relaxed">
                {feedback.message}
              </p>

              {feedback.status === 'pending' && (
                <button
                  onClick={() => markAsRead(feedback.id)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Eye size={14} />
                  Đánh dấu đã đọc
                </button>
              )}
              
              {feedback.status === 'read' && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle size={14} />
                  Đã đọc
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
