import React, { useState } from 'react';
import { X, CreditCard, Banknote, QrCode, Copy, Check, Smartphone, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ isOpen, onClose, total, orderCode, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' hoặc 'cash'
  const [copied, setCopied] = useState(false);

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
    onConfirm(paymentMethod);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
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
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
