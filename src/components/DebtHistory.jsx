import React, { useState } from 'react';
import { History, DollarSign, PlusCircle, CheckCircle, Search, Calendar, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDebt } from '../contexts/DebtContext';

const DebtHistory = () => {
  const { transactionHistory } = useDebt();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'CREATE_DEBT', 'PAY_PARTIAL', 'PAY_FULL'

  // Format datetime
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Filter transactions
  const filteredHistory = transactionHistory.filter(txn => {
    // Filter by type
    if (filterType !== 'all' && txn.type !== filterType) return false;

    // Filter by search
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      txn.customerName.toLowerCase().includes(search) ||
      txn.customerPhone.includes(search) ||
      txn.orderCode.toLowerCase().includes(search)
    );
  });

  // Get icon và color theo type
  const getTransactionStyle = (type) => {
    switch (type) {
      case 'CREATE_DEBT':
        return {
          icon: <PlusCircle size={20} />,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          label: 'Ghi nợ'
        };
      case 'PAY_PARTIAL':
        return {
          icon: <DollarSign size={20} />,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'Trả từng phần'
        };
      case 'PAY_FULL':
        return {
          icon: <CheckCircle size={20} />,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Trả đủ'
        };
      default:
        return {
          icon: <History size={20} />,
          color: 'text-stone-600',
          bg: 'bg-stone-50',
          border: 'border-stone-200',
          label: 'Khác'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-stone-800 mb-2 flex items-center gap-2">
          <History size={28} className="text-orange-600" />
          Lịch sử giao dịch
        </h2>
        <p className="text-sm text-stone-500">
          Toàn bộ lịch sử ghi nợ và thanh toán
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          Tất cả ({transactionHistory.length})
        </button>
        <button
          onClick={() => setFilterType('CREATE_DEBT')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            filterType === 'CREATE_DEBT'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <PlusCircle size={16} />
          Ghi nợ
        </button>
        <button
          onClick={() => setFilterType('PAY_PARTIAL')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            filterType === 'PAY_PARTIAL'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <DollarSign size={16} />
          Trả từng phần
        </button>
        <button
          onClick={() => setFilterType('PAY_FULL')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            filterType === 'PAY_FULL'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <CheckCircle size={16} />
          Trả đủ
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input
          type="text"
          placeholder="Tìm theo tên, SĐT hoặc mã đơn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-400 focus:outline-none text-sm"
        />
      </div>

      {/* Transaction Timeline */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-xl">
            <History className="mx-auto text-stone-300 mb-3" size={48} />
            <p className="text-stone-500 font-medium">
              {searchTerm ? 'Không tìm thấy giao dịch' : 'Chưa có giao dịch nào'}
            </p>
          </div>
        ) : (
          filteredHistory.map((txn) => {
            const style = getTransactionStyle(txn.type);
            const datetime = formatDateTime(txn.timestamp);

            return (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white p-4 rounded-xl border-2 ${style.border} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center ${style.color} flex-shrink-0`}>
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Type + Time */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-black text-sm ${style.color}`}>
                        {style.label}
                      </span>
                      <div className="text-right">
                        <p className="text-xs text-stone-500">{datetime.date}</p>
                        <p className="text-xs text-stone-400">{datetime.time}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-stone-700 mb-2 font-medium">
                      {txn.description}
                    </p>

                    {/* Details */}
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {txn.customerName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {txn.customerPhone}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-semibold">Số tiền</span>
                      <span className={`text-lg font-black ${style.color}`}>
                        {txn.type === 'CREATE_DEBT' ? '+' : '-'}{txn.amount.toLocaleString()}đ
                      </span>
                    </div>

                    {/* Remaining (if partial payment) */}
                    {txn.type === 'PAY_PARTIAL' && txn.remaining !== undefined && (
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-stone-500">Còn lại</span>
                        <span className="text-xs font-bold text-red-600">
                          {txn.remaining.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {filteredHistory.length > 0 && (
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-2xl border-2 border-stone-200">
          <h3 className="font-black text-stone-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Tổng kết
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-orange-600">
                {transactionHistory.filter(t => t.type === 'CREATE_DEBT').length}
              </p>
              <p className="text-xs text-stone-500 font-semibold mt-1">Đơn ghi nợ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600">
                {transactionHistory.filter(t => t.type === 'PAY_PARTIAL').length}
              </p>
              <p className="text-xs text-stone-500 font-semibold mt-1">Trả từng phần</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">
                {transactionHistory.filter(t => t.type === 'PAY_FULL').length}
              </p>
              <p className="text-xs text-stone-500 font-semibold mt-1">Trả đủ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtHistory;
