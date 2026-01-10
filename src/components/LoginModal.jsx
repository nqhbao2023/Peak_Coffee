import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const { register, login, isPhoneRegistered, getUserByPhone } = useAuth();

  if (!isOpen) return null;

  // Kiểm tra SĐT khi user nhập xong (sau 500ms không gõ nữa)
  useEffect(() => {
    if (phone.length >= 10) {
      const timer = setTimeout(async () => {
        const registered = await isPhoneRegistered(phone);
        if (registered) {
          // SĐT đã đăng ký → Chế độ đăng nhập
          setIsRegistering(false);
          const user = await getUserByPhone(phone);
          if (user) {
            setName(''); // Clear name field
            // Không toast ở đây - chỉ toast khi submit
          }
        } else {
          // SĐT mới → Chế độ đăng ký
          setIsRegistering(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsRegistering(false);
      setName('');
    }
  }, [phone, isPhoneRegistered, getUserByPhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submit
    if (isSubmitting) return;

    // Validate SĐT
    if (!phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại!');
      return;
    }
    if (phone.length < 10) {
      toast.error('Số điện thoại phải có ít nhất 10 số!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Nếu là đăng ký → cần tên
      if (isRegistering) {
        if (!name.trim()) {
          toast.error('Vui lòng nhập tên của bạn!');
          setIsSubmitting(false);
          return;
        }

        // Đăng ký
        const result = await register(phone.trim(), name.trim());
        if (result.success) {
          toast.success(`🎉 Chào mừng ${name}!`);
          
          // Vibration feedback
          if (navigator.vibrate) navigator.vibrate(100);
          
          // Đóng modal sau khi thành công
          setTimeout(() => onClose(), 300);
        } else {
          toast.error(result.message);
          setIsSubmitting(false);
        }
      } else {
        // Đăng nhập
        const result = await login(phone.trim());
        if (result.success) {
          toast.success(`👋 Chào lại ${result.user.name}!`);
          
          // Vibration feedback
          if (navigator.vibrate) navigator.vibrate(100);
          
          // Đóng modal sau khi thành công
          setTimeout(() => onClose(), 300);
        } else {
          toast.error(result.message);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      toast.error('Lỗi không xác định. Vui lòng thử lại!');
      setIsSubmitting(false);
    }
  };

  // LOCK SCROLL HOÀN TOÀN
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ touchAction: 'none' }}
      onClick={onClose}
    >
      {/* Backdrop FULL với animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-black/60"
        style={{ touchAction: 'none' }}
      />
      
      <motion.div 
        initial={{ scale: 0.7, opacity: 0, y: 50, rotateX: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30, rotateX: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.9 }}
        className="relative bg-white w-full max-w-sm rounded-3xl shadow-[0_20px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-4 ring-orange-500/30"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
      >
        {/* Header */}
        <div className={`p-6 text-white relative overflow-hidden ${
          isRegistering 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
            : 'bg-gradient-to-br from-orange-500 to-red-500'
        }`}>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              {isRegistering ? <UserPlus size={32} className="text-white" /> : <LogIn size={32} className="text-white" />}
            </div>
            <h2 className="text-2xl font-black mb-1">
              {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
            </h2>
            <p className="text-sm opacity-90">
              {isRegistering ? 'Lần đầu tiên đặt món' : 'Chào mừng bạn quay lại'}
            </p>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-20"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0988099125"
                maxLength={11}
                className="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium"
                autoFocus
              />
            </div>
            {phone.length >= 10 && !isRegistering && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                ✓ Số này đã đăng ký
              </p>
            )}
            {phone.length >= 10 && isRegistering && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                → Số mới, vui lòng nhập tên
              </p>
            )}
          </div>

          {/* Name Input - Chỉ hiện khi đăng ký */}
          {isRegistering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Tên của bạn <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  maxLength={50}
                  className="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-medium"
                />
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <div className={`border rounded-xl p-3 ${
            isRegistering 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <p className="text-xs text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-800">
                {isRegistering ? '🎉 Đăng ký mới:' : '🔐 Bảo mật:'}
              </span>{' '}
              {isRegistering 
                ? '1 số điện thoại = 1 tài khoản. Lần sau chỉ cần nhập SĐT.' 
                : 'Thông tin được lưu an toàn trên thiết bị này.'
              }
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3.5 rounded-xl font-black text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isRegistering
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-300/50 hover:shadow-blue-400/50'
                : 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-300/50 hover:shadow-orange-400/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isRegistering ? 'ĐĂNG KÝ NGAY' : 'ĐĂNG NHẬP'}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default LoginModal;
