import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Lưu góp ý vào localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Vui lòng nhập nội dung góp ý!', {
        duration: 2000,
        icon: '⚠️',
      });
      return;
    }

    setIsSubmitting(true);

    // Tạo feedback object
    const feedback = {
      id: Date.now().toString(),
      name: name.trim() || 'Khách hàng',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, read, replied
    };

    // Lấy danh sách feedback cũ
    const existingFeedbacks = JSON.parse(localStorage.getItem('peak_feedbacks') || '[]');
    
    // Thêm feedback mới vào đầu mảng
    const updatedFeedbacks = [feedback, ...existingFeedbacks];
    
    // Lưu vào localStorage
    localStorage.setItem('peak_feedbacks', JSON.stringify(updatedFeedbacks));

    // Simulate loading
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Toast success
      toast.success(
        <div>
          <p className="font-bold">Gửi góp ý thành công! 🎉</p>
          <p className="text-xs mt-1">Cảm ơn bạn đã đóng góp ý kiến!</p>
        </div>,
        {
          duration: 3000,
          position: 'top-center',
        }
      );

      // Vibration feedback
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      // Reset form và đóng modal
      setName('');
      setMessage('');
      onClose();
    }, 800);
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0"
      style={{ touchAction: 'none' }}
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/85"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ y: '100%', scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.9 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
        className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_-20px_70px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-hidden flex flex-col border-t-4 border-blue-500"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={28} />
                Góp ý
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-500" />
              </button>
            </div>
            <p className="text-sm text-stone-500 mt-2">
              Ý kiến của bạn giúp Peak Coffee phục vụ tốt hơn! 💙
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            {/* Tên (optional) */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Tên của bạn <span className="text-stone-400 font-normal">(không bắt buộc)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-stone-800 placeholder:text-stone-400"
              />
            </div>

            {/* Nội dung góp ý */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Nội dung góp ý <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="VD: Shop có thể thêm trà sữa matcha không ạ?"
                required
                maxLength={500}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-stone-800 placeholder:text-stone-400 resize-none"
              />
              <p className="text-xs text-stone-400 mt-1 text-right">
                {message.length}/500 ký tự
              </p>
            </div>

            {/* Gợi ý nhanh */}
            <div className="mb-6">
              <p className="text-xs font-bold text-stone-500 mb-2">💡 Gợi ý nhanh:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Muốn thêm món mới',
                  'Phục vụ chậm',
                  'Đồ uống ngon',
                  'Giá hợp lý',
                  'Nhân viên thân thiện'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setMessage(suggestion)}
                    className="px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-blue-100 hover:text-blue-700 text-stone-600 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
                isSubmitting
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-300 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send size={20} />
                  GỬI GÓP Ý
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
  );
};

export default FeedbackModal;
