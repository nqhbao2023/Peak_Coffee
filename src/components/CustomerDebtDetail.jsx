import React, { useState } from 'react';
import { X, DollarSign, Calendar, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDebt } from '../contexts/DebtContext';
import toast from 'react-hot-toast';

const CustomerDebtDetail = ({ customer, onClose }) => {
  const { getCustomerDebtOrders, payDebt, payAllDebtByCustomer } = useDebt();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = getCustomerDebtOrders(customer.phone);
  const debtOrders = orders.filter(o => o.status === 'DEBT');
  const paidOrders = orders.filter(o => o.status === 'PAID');

  // Thanh toán từng đơn
  const handlePayOrder = (order) => {
    const amount = parseInt(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (amount > order.remaining) {
      toast.error(`Số tiền vượt quá nợ còn lại (${order.remaining.toLocaleString()}đ)`);
      return;
    }

    const result = payDebt(order.id, amount);
    if (result.success) {
      if (result.isFullyPaid) {
        toast.success('✅ Đã thanh toán đủ đơn hàng!');
      } else {
        toast.success(`✅ Đã thanh toán ${amount.toLocaleString()}đ. Còn nợ ${result.remaining.toLocaleString()}đ`);
      }
      setPaymentAmount('');
      setSelectedOrder(null);
    }
  };

  // Thanh toán tất cả
  const handlePayAll = () => {
    const amount = parseInt(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (amount > customer.totalDebt) {
      toast.error(`Số tiền vượt quá tổng nợ (${customer.totalDebt.toLocaleString()}đ)`);
      return;
    }

    const result = payAllDebtByCustomer(customer.phone, amount);
    if (result.paidOrders > 0) {
      toast.success(`✅ Đã thanh toán ${result.paidOrders} đơn hàng!`);
      setPaymentAmount('');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="font-black text-xl text-stone-800">{customer.name}</h2>
            <p className="text-sm text-stone-500 mt-1">📞 {customer.phone}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="px-3 py-1.5 bg-red-100 rounded-lg">
                <span className="text-xs font-bold text-red-700">
                  Tổng nợ: {customer.totalDebt.toLocaleString()}đ
                </span>
              </div>
              {customer.totalPaid > 0 && (
                <div className="px-3 py-1.5 bg-green-100 rounded-lg">
                  <span className="text-xs font-bold text-green-700">
                    Đã trả: {customer.totalPaid.toLocaleString()}đ
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={24} className="text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Thanh toán nhanh */}
          {debtOrders.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
              <h3 className="font-bold text-stone-800 text-sm mb-3 flex items-center gap-2">
                <DollarSign size={16} />
                Thanh toán nhanh
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Nhập số tiền..."
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-sm"
                />
                <button
                  onClick={handlePayAll}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                >
                  Thanh toán
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentAmount(customer.totalDebt.toString())}
                  className="px-3 py-1.5 bg-white border border-orange-300 rounded-lg text-xs font-semibold text-orange-700 hover:bg-orange-50 transition-colors"
                >
                  Trả hết ({customer.totalDebt.toLocaleString()}đ)
                </button>
                <button
                  onClick={() => setPaymentAmount((customer.totalDebt / 2).toFixed(0))}
                  className="px-3 py-1.5 bg-white border border-orange-300 rounded-lg text-xs font-semibold text-orange-700 hover:bg-orange-50 transition-colors"
                >
                  Trả 1/2
                </button>
              </div>
            </div>
          )}

          {/* Đơn chưa thanh toán */}
          {debtOrders.length > 0 && (
            <div>
              <h3 className="font-bold text-stone-700 text-sm mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Chưa thanh toán ({debtOrders.length})
              </h3>
              <div className="space-y-2">
                {debtOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-red-50 p-3 rounded-xl border-2 border-red-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-stone-800 text-sm">#{order.orderCode}</p>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-red-600 text-sm">
                          {order.remaining.toLocaleString()}đ
                        </p>
                        {order.paid > 0 && (
                          <p className="text-[10px] text-green-600 font-semibold">
                            Đã trả {order.paid.toLocaleString()}đ
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="text-xs text-stone-600 mb-2">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i}>• {item.quantity}x {item.displayName || item.name}</div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-stone-400">... và {order.items.length - 2} món khác</div>
                      )}
                    </div>

                    {/* Payment history */}
                    {order.paymentHistory && order.paymentHistory.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <p className="text-[10px] text-stone-500 font-semibold mb-1">Lịch sử thanh toán:</p>
                        {order.paymentHistory.map((payment, i) => (
                          <div key={i} className="text-[10px] text-stone-600 flex justify-between">
                            <span>{formatDate(payment.paidAt)}</span>
                            <span className="font-semibold text-green-600">
                              +{payment.amount.toLocaleString()}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pay button cho từng đơn */}
                    {selectedOrder === order.id ? (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="number"
                          placeholder="Số tiền..."
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-lg border border-red-300 focus:border-red-500 focus:outline-none text-xs"
                          autoFocus
                        />
                        <button
                          onClick={() => handlePayOrder(order)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            setPaymentAmount('');
                          }}
                          className="px-3 py-1.5 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Thanh toán đơn này
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Đơn đã thanh toán */}
          {paidOrders.length > 0 && (
            <div>
              <h3 className="font-bold text-stone-700 text-sm mb-3 flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Đã thanh toán ({paidOrders.length})
              </h3>
              <div className="space-y-2">
                {paidOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-green-50 p-3 rounded-xl border border-green-200 opacity-60"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-stone-700 text-sm">#{order.orderCode}</p>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-green-600 text-sm">
                          {order.total.toLocaleString()}đ
                        </p>
                        <p className="text-[10px] text-green-600">✓ Đã thanh toán</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-stone-400">Chưa có đơn hàng nào</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerDebtDetail;
