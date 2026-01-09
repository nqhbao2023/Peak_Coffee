import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CreditCard, Banknote, QrCode, Copy, Check, Smartphone, ArrowRight, Sparkles, Clock, User, Phone, Edit2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebt } from '../contexts/DebtContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, total, orderCode, onConfirm, cartItems }) => {
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr', 'cash', 'debt'
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isEditingDebtInfo, setIsEditingDebtInfo] = useState(false); // Cho phép chỉnh sửa nếu mua hộ
  const { createDebtOrder } = useDebt();
  const { user } = useAuth();

  // Auto-fill thông tin từ user đăng nhập khi chọn ghi nợ
  useEffect(() => {
    if (paymentMethod === 'debt' && user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setIsEditingDebtInfo(false); // Reset edit mode
    }
  }, [paymentMethod, user]);

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

  // Thông tin ngân hàng - BẠN CẦN THAY ĐỔI THÔNG TIN NÀY
  const BANK_INFO = {
    bankName: 'MB Bank', // Thay tên ngân hàng của bạn
    bankCode: '970422', // Mã BIN của ngân hàng (MB Bank: 970422)
    accountNumber: '0123456789', // THAY SỐ TÀI KHOẢN CỦA BẠN
    accountName: 'NGUYEN VAN A', // THAY TÊN TÀI KHOẢN CỦA BẠN
  };

  // Tạo QR Code động từ VietQR API
  const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.jpg?amount=${total}&addInfo=PEAK${orderCode}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

  const copyContent = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Vibration feedback
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleConfirm = () => {
    if (paymentMethod === 'debt') {
      // Kiểm tra đăng nhập
      if (!user) {
        toast.error('⚠️ Vui lòng đăng nhập để sử dụng tính năng ghi nợ!', {
          duration: 3000,
          icon: '🔐'
        });
        return;
      }

      // Validate customer info
      if (!customerName.trim() || !customerPhone.trim()) {
        toast.error('Vui lòng nhập đầy đủ thông tin khách hàng');
        return;
      }
      
      // Validate phone number (basic)
      if (customerPhone.length < 10) {
        toast.error('Số điện thoại không hợp lệ');
        return;
      }

      // Create debt order
      const debtOrder = createDebtOrder({
        orderCode,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: cartItems || [],
        total
      });

      if (debtOrder) {
        toast.success(`✅ Đã ghi nợ cho ${customerName}!`);
        onConfirm('debt');
      }
    } else {
      onConfirm(paymentMethod);
    }
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

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0"
      style={{ touchAction: 'none' }}
    >
      {/* Backdrop FULL */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/95"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ y: '100%', scale: 0.9, rotateX: 15 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        exit={{ y: '100%', scale: 0.9, rotateX: 10 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.9 }}
        className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_-20px_70px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-hidden flex flex-col border-t-[6px] border-orange-500"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1000px' }}
      >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 bg-gradient-to-br from-stone-50 to-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
                <CreditCard className="text-orange-600" size={28} />
                Thanh toán
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-500" />
              </button>
            </div>
            <p className="text-sm text-stone-500">Mã đơn: <span className="font-bold text-orange-600">#{orderCode}</span></p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${
                  paymentMethod === 'qr' 
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg shadow-orange-200/50 scale-[1.02]' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'qr' ? 'bg-orange-500' : 'bg-stone-100'
                  }`}>
                    <QrCode className={paymentMethod === 'qr' ? 'text-white' : 'text-stone-500'} size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-stone-800">Chuyển khoản QR</p>
                    <p className="text-xs text-stone-500">Quét mã & thanh toán nhanh</p>
                  </div>
                </div>
                {paymentMethod === 'qr' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${
                  paymentMethod === 'cash' 
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50 scale-[1.02]' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'bg-green-500' : 'bg-stone-100'
                  }`}>
                    <Banknote className={paymentMethod === 'cash' ? 'text-white' : 'text-stone-500'} size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-stone-800">Tiền mặt</p>
                    <p className="text-xs text-stone-500">Thanh toán khi nhận hàng</p>
                  </div>
                </div>
                {paymentMethod === 'cash' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod('debt')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${
                  paymentMethod === 'debt' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-200/50 scale-[1.02]' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'debt' ? 'bg-blue-500' : 'bg-stone-100'
                  }`}>
                    <Clock className={paymentMethod === 'debt' ? 'text-white' : 'text-stone-500'} size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-stone-800">Ghi nợ</p>
                    <p className="text-xs text-stone-500">Thanh toán sau (khách quen)</p>
                  </div>
                </div>
                {paymentMethod === 'debt' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}
              </button>
            </div>

            {/* QR Code Section */}
            <AnimatePresence mode="wait">
              {paymentMethod === 'qr' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-2 border-orange-200 rounded-3xl p-6 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-xl"
                >
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 mx-auto w-fit">
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      className="w-56 h-56 mx-auto rounded-xl"
                      onError={(e) => {
                        // Fallback nếu API lỗi
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224"><rect width="224" height="224" fill="%23f5f5f4"/><text x="50%" y="50%" text-anchor="middle" fill="%23a8a29e" font-family="Arial" font-size="16">QR Code</text></svg>';
                      }}
                    />
                  </div>

                  {/* Bank Info */}
                  <div className="space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-sm border border-orange-100">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">Ngân hàng</span>
                      <span className="font-black text-stone-800">{BANK_INFO.bankName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">Số tài khoản</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-stone-800">{BANK_INFO.accountNumber}</span>
                        <button 
                          onClick={() => copyContent(BANK_INFO.accountNumber)}
                          className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-orange-600" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">Chủ tài khoản</span>
                      <span className="font-black text-stone-800">{BANK_INFO.accountName}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-orange-100">
                      <span className="text-stone-500 font-medium">Nội dung CK</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-orange-600">PEAK{orderCode}</span>
                        <button 
                          onClick={() => copyContent(`PEAK${orderCode}`)}
                          className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-orange-600" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <Smartphone className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <span className="font-bold text-stone-800">Hướng dẫn:</span> Mở app ngân hàng → Quét mã QR → Kiểm tra thông tin → Xác nhận thanh toán
                    </p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'cash' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-2 border-green-200 rounded-3xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 text-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Banknote size={40} className="text-white" />
                  </div>
                  <h3 className="font-black text-xl text-stone-800 mb-2">Thanh toán khi nhận</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Vui lòng chuẩn bị <span className="font-black text-green-600">{total.toLocaleString()}đ</span> tiền mặt để thanh toán khi nhận hàng.
                  </p>
                </motion.div>
              )}

              {paymentMethod === 'debt' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-2 border-blue-200 rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50"
                >
                  <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Clock size={40} className="text-white" />
                  </div>
                  <h3 className="font-black text-xl text-stone-800 mb-4 text-center">Thông tin ghi nợ</h3>
                  
                  {/* Hiển thị thông tin user nếu đã đăng nhập */}
                  {user && !isEditingDebtInfo ? (
                    <div className="space-y-3">
                      {/* Thông tin tài khoản */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={20} />
                            <span className="text-sm font-bold text-stone-600">Tài khoản đang đăng nhập</span>
                          </div>
                          <button
                            onClick={() => setIsEditingDebtInfo(true)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Chỉnh sửa (mua hộ)"
                          >
                            <Edit2 size={16} className="text-blue-500 group-hover:text-blue-600" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="text-blue-500" size={20} />
                            </div>
                            <div>
                              <p className="text-xs text-stone-500">Họ tên</p>
                              <p className="font-black text-stone-800">{user.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Phone className="text-blue-500" size={20} />
                            </div>
                            <div>
                              <p className="text-xs text-stone-500">Số điện thoại</p>
                              <p className="font-black text-stone-800">{user.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs text-stone-600 leading-relaxed">
                          <span className="font-bold text-stone-800">✓</span> Đơn hàng sẽ được ghi nợ vào tài khoản của bạn. Nhấn <span className="font-bold text-blue-600">Sửa</span> nếu bạn đang mua hộ người khác.
                        </p>
                      </div>
                    </div>
                  ) : !user ? (
                    // Chưa đăng nhập - Hiển thị thông báo
                    <div className="space-y-4">
                      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <User className="text-red-500" size={32} />
                        </div>
                        <h4 className="font-black text-stone-800 mb-2">Vui lòng đăng nhập</h4>
                        <p className="text-sm text-stone-600 leading-relaxed">
                          Bạn cần đăng nhập để sử dụng tính năng <span className="font-bold text-blue-600">Ghi nợ</span>.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs text-stone-600 leading-relaxed">
                          <span className="font-bold text-stone-800">💡 Gợi ý:</span> Đăng nhập giúp bạn:
                        </p>
                        <ul className="text-xs text-stone-600 mt-2 space-y-1 ml-4">
                          <li>✓ Theo dõi đơn hàng ghi nợ</li>
                          <li>✓ Quản lý công nợ dễ dàng</li>
                          <li>✓ Đặt hàng nhanh hơn lần sau</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    // Chế độ chỉnh sửa (mua hộ)
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-stone-600 leading-relaxed">
                          <span className="font-bold text-stone-800">📝 Chế độ mua hộ:</span> Nhập thông tin người nhận nợ thay vì tài khoản của bạn.
                        </p>
                      </div>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          type="text"
                          placeholder="Họ tên khách hàng *"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none font-semibold text-stone-800"
                        />
                      </div>
                      
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          type="tel"
                          placeholder="Số điện thoại *"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none font-semibold text-stone-800"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setCustomerName(user.name);
                          setCustomerPhone(user.phone);
                          setIsEditingDebtInfo(false);
                        }}
                        className="w-full py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        ← Quay lại dùng tài khoản của tôi
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gradient-to-br from-white to-stone-50 border-t border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-500 font-bold">Tổng thanh toán</span>
              <div className="text-right">
                <span className="text-3xl font-black text-stone-800">
                  {total.toLocaleString()}
                </span>
                <span className="text-sm text-stone-500 font-bold ml-1">đ</span>
              </div>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-black text-lg shadow-2xl shadow-orange-300/50 hover:shadow-orange-400/50 transition-all flex items-center justify-center gap-3 group"
            >
              <Sparkles className="fill-white group-hover:animate-spin" size={20} />
              XÁC NHẬN ĐẶT HÀNG
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>,
    document.body
  );
};

export default PaymentModal;
