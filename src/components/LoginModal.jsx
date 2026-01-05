import React, { useState, useEffect } from 'react';
import { X, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // true = đăng ký, false = đăng nhập
  const { register, login, isPhoneRegistered, getUserByPhone } = useAuth();

  if (!isOpen) return null;

  // Kiểm tra SĐT khi user nhập xong (sau 500ms không gõ nữa)
  useEffect(() => {
    if (phone.length >= 10) {
      const timer = setTimeout(() => {
        const registered = isPhoneRegistered(phone);
        if (registered) {
          // SĐT đã đăng ký → Chế độ đăng nhập
          setIsRegistering(false);
          const user = getUserByPhone(phone);
          if (user) {
            setName(''); // Clear name field
            toast.success(`Chào lại ${user.name}! 👋`, { duration: 2000 });
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
  }, [phone]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate SĐT
    if (!phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại!', { icon: '📱' });
      return;
    }
    if (phone.length < 10) {
      toast.error('Số điện thoại phải có ít nhất 10 số!', { icon: '⚠️' });
      return;
    }

    // Nếu là đăng ký → cần tên
    if (isRegistering) {
      if (!name.trim()) {
        toast.error('Vui lòng nhập tên của bạn!', { icon: '👤' });
        return;
      }

      // Đăng ký
      const result = register(phone.trim(), name.trim());
      if (result.success) {
        if (phone === '1111111111') {
          toast.success(`Chào Admin ${name}! 👨‍💼`, { duration: 3000 });
        } else {
          toast.success(
            <div>
              <p className="font-bold">Đăng ký thành công! 🎉</p>
              <p className="text-xs mt-1">Chào mừng {name} đến Peak Coffee!</p>
            </div>,
            { duration: 3000 }
          );
        }
        onClose();
      } else {
        toast.error(result.message, { icon: '❌' });
      }
    } else {
      // Đăng nhập
      const result = login(phone.trim());
      if (result.success) {
        if (phone === '1111111111') {
          toast.success(`Chào Admin ${result.user.name}! 👨‍💼`, { duration: 3000 });
        } else {
          toast.success(`Chào lại ${result.user.name}! 👋`, { duration: 3000 });
        }
        onClose();
      } else {
        toast.error(result.message, { icon: '❌' });
      }
    }

    // Vibration feedback
    if (navigator.vibrate) navigator.vibrate(100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 text-white relative overflow-hidden ${
          isRegistering 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
            : 'bg-gradient-to-br from-orange-500 to-red-500'
        }`}>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
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
            className={`w-full text-white py-3.5 rounded-xl font-black text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isRegistering
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-300/50 hover:shadow-blue-400/50'
                : 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-300/50 hover:shadow-orange-400/50'
            }`}
          >
            {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isRegistering ? 'ĐĂNG KÝ NGAY' : 'ĐĂNG NHẬP'}
          </button>

          {/* Admin Hint */}
          <p className="text-xs text-center text-stone-400">
            Admin test: 1111111111
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
