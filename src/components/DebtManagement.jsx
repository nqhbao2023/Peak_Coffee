import React, { useState } from 'react';
import { Search, DollarSign, Users, FileText, TrendingUp, ChevronRight, X, Check, Filter, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebt } from '../contexts/DebtContext';
import CustomerDebtDetail from './CustomerDebtDetail';
import DebtHistory from './DebtHistory';

const DebtManagement = () => {
  const { customers, getDebtStats } = useDebt();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('debt'); // 'debt', 'paid', 'all'
  const [activeView, setActiveView] = useState('customers'); // 'customers' or 'history'

  const stats = getDebtStats();

  // Filter customers theo status và search
  const filteredCustomers = customers.filter(customer => {
    // Filter theo status
    let statusMatch = true;
    if (filterStatus === 'debt') {
      statusMatch = customer.totalDebt > 0;
    } else if (filterStatus === 'paid') {
      statusMatch = customer.totalDebt === 0 && customer.totalPaid > 0;
    }
    // filterStatus === 'all' thì không filter

    // Filter theo search
    if (!searchTerm) return statusMatch;
    const search = searchTerm.toLowerCase();
    return statusMatch && (
      customer.name.toLowerCase().includes(search) ||
      customer.phone.includes(search)
    );
  }).sort((a, b) => b.totalDebt - a.totalDebt); // Sắp xếp theo nợ giảm dần

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-3 border-b-2 border-stone-200">
        <button
          onClick={() => setActiveView('customers')}
          className={`px-6 py-3 font-bold text-sm transition-all flex items-center gap-2 border-b-4 ${
            activeView === 'customers'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <Users size={18} />
          Quản lý khách hàng
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`px-6 py-3 font-bold text-sm transition-all flex items-center gap-2 border-b-4 ${
            activeView === 'history'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <History size={18} />
          Lịch sử giao dịch
        </button>
      </div>

      {/* Content */}
      {activeView === 'customers' ? (
        <>
          {/* Header + Stats */}
          <div>
            <h2 className="text-2xl font-black text-stone-800 mb-4">Quản lý Công Nợ</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Tổng nợ */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-red-600" size={20} />
              <span className="text-xs font-bold text-red-700">Tổng nợ</span>
            </div>
            <p className="text-2xl font-black text-red-600">
              {stats.totalDebt.toLocaleString()}đ
            </p>
          </div>

          {/* Số khách nợ */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={20} />
              <span className="text-xs font-bold text-blue-700">Khách nợ</span>
            </div>
            <p className="text-2xl font-black text-blue-600">
              {stats.debtCustomerCount} người
            </p>
          </div>

          {/* Đơn chưa thanh toán */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-amber-600" size={20} />
              <span className="text-xs font-bold text-amber-700">Đơn chưa TT</span>
            </div>
            <p className="text-2xl font-black text-amber-600">
              {stats.unpaidOrderCount}
            </p>
          </div>

          {/* Đã thu */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={20} />
              <span className="text-xs font-bold text-green-700">Đã thu</span>
            </div>
            <p className="text-2xl font-black text-green-600">
              {stats.totalPaid.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilterStatus('debt')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            filterStatus === 'debt'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <Filter size={16} />
          Đang nợ
        </button>
        <button
          onClick={() => setFilterStatus('paid')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            filterStatus === 'paid'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <Check size={16} />
          Đã trả hết
        </button>
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            filterStatus === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
              : 'bg-white text-stone-600 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <Users size={16} />
          Tất cả ({customers.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input
          type="text"
          placeholder="Tìm khách hàng (tên hoặc SĐT)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-400 focus:outline-none text-sm"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-xl">
            <Users className="mx-auto text-stone-300 mb-3" size={48} />
            <p className="text-stone-500 font-medium">
              {searchTerm ? 'Không tìm thấy khách hàng' : 'Chưa có khách nợ'}
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <motion.div
              key={customer.phone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-xl border-2 border-stone-200 hover:border-orange-300 transition-all cursor-pointer"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Name + Phone */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-stone-800 truncate">{customer.name}</h3>
                    {customer.totalDebt === 0 && customer.totalPaid > 0 ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded flex items-center gap-1">
                        <Check size={10} />
                        Đã trả hết
                      </span>
                    ) : customer.totalDebt > 50000 ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                        Nợ cao
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-stone-500 mb-2">📞 {customer.phone}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs">
                    {customer.totalDebt > 0 ? (
                      <span className="font-bold text-red-600">
                        💰 Còn nợ: {customer.totalDebt.toLocaleString()}đ
                      </span>
                    ) : (
                      <span className="font-bold text-green-600">
                        ✅ Không còn nợ
                      </span>
                    )}
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600">
                      {customer.orderCount} đơn
                    </span>
                    {customer.totalPaid > 0 && (
                      <>
                        <span className="text-stone-400">•</span>
                        <span className="text-green-600 font-semibold">
                          Đã trả {customer.totalPaid.toLocaleString()}đ
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="text-stone-400 flex-shrink-0" size={20} />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDebtDetail
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </AnimatePresence>
        </>
      ) : (
        <DebtHistory />
      )}
    </div>
  );
};

export default DebtManagement;
