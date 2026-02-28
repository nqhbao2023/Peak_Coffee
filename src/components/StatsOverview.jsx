import React, { useMemo } from 'react';
import { TrendingUp, Package, DollarSign, Users, Calendar } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { useMenu } from '../contexts/MenuContext';

const StatsOverview = () => {
  const { orders } = useOrders();
  const { menuItems } = useMenu();

  // === Memoize all heavy calculations ===
  const completedOrders = useMemo(
    () => orders.filter(o => o.status === 'completed'),
    [orders]
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((sum, order) => sum + order.total, 0),
    [completedOrders]
  );

  const totalOrders = orders.length;

  // Best selling items - computed from completed orders
  const bestSellers = useMemo(() => {
    const itemStats = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemStats[item.id]) {
          itemStats[item.id] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
        }
        itemStats[item.id].quantity += item.quantity;
        itemStats[item.id].revenue += item.price * item.quantity;
      });
    });
    return Object.values(itemStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [completedOrders]);

  // Orders by status — memoized
  const statusCounts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: completedOrders.length,
  }), [orders, completedOrders]);

  // Recent orders (last 7 days)
  const recentOrders = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <span className="text-green-600 text-xs font-bold bg-green-200 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-3xl font-black text-green-800 mb-1">
            {(totalRevenue / 1000).toFixed(0)}K
          </p>
          <p className="text-sm font-bold text-green-600">Doanh thu</p>
          <p className="text-xs text-green-500 mt-1">
            {completedOrders.length} đơn hoàn thành
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-blue-600 text-xs font-bold bg-blue-200 px-2 py-1 rounded-full">
              Tổng
            </span>
          </div>
          <p className="text-3xl font-black text-blue-800 mb-1">{totalOrders}</p>
          <p className="text-sm font-bold text-blue-600">Đơn hàng</p>
          <p className="text-xs text-blue-500 mt-1">
            {recentOrders.length} đơn trong 7 ngày
          </p>
        </div>

        {/* Menu Items */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-orange-600 text-xs font-bold bg-orange-200 px-2 py-1 rounded-full">
              Menu
            </span>
          </div>
          <p className="text-3xl font-black text-orange-800 mb-1">{menuItems.length}</p>
          <p className="text-sm font-bold text-orange-600">Món trong menu</p>
          <p className="text-xs text-orange-500 mt-1">
            {menuItems.filter(i => i.isAvailable).length} đang bán
          </p>
        </div>

        {/* Average Order */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-purple-600 text-xs font-bold bg-purple-200 px-2 py-1 rounded-full">
              TB
            </span>
          </div>
          <p className="text-3xl font-black text-purple-800 mb-1">
            {completedOrders.length > 0 
              ? Math.round(totalRevenue / completedOrders.length / 1000)
              : 0}K
          </p>
          <p className="text-sm font-bold text-purple-600">Giá trị TB</p>
          <p className="text-xs text-purple-500 mt-1">
            Mỗi đơn hàng
          </p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl p-6 border-2 border-stone-200 shadow-lg">
        <h3 className="text-xl font-black text-stone-800 mb-4 flex items-center gap-2">
          <Package size={24} className="text-orange-500" />
          Trạng thái đơn hàng
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
            <p className="text-4xl font-black text-amber-600 mb-1">{statusCounts.pending}</p>
            <p className="text-sm font-bold text-amber-700">Chờ duyệt</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-4xl font-black text-blue-600 mb-1">{statusCounts.preparing}</p>
            <p className="text-sm font-bold text-blue-700">Đang pha</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <p className="text-4xl font-black text-green-600 mb-1">{statusCounts.ready}</p>
            <p className="text-sm font-bold text-green-700">Sẵn sàng</p>
          </div>
          <div className="text-center p-4 bg-stone-50 rounded-xl border-2 border-stone-200">
            <p className="text-4xl font-black text-stone-600 mb-1">{statusCounts.completed}</p>
            <p className="text-sm font-bold text-stone-700">Hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white rounded-2xl p-6 border-2 border-stone-200 shadow-lg">
        <h3 className="text-xl font-black text-stone-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-orange-500" />
          Top 5 bán chạy
        </h3>
        
        {bestSellers.length > 0 ? (
          <div className="space-y-3">
            {bestSellers.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border-2 border-stone-100 hover:border-orange-300 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-stone-200">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-stone-800 truncate">{item.name}</h4>
                  <p className="text-sm text-stone-500 font-bold">
                    {item.quantity} ly • {item.revenue.toLocaleString()}đ
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">
                    {item.quantity} ly
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <TrendingUp size={40} className="text-stone-300" />
            </div>
            <p className="text-stone-500 font-bold">Chưa có dữ liệu</p>
            <p className="text-sm text-stone-400 mt-1">
              Dữ liệu sẽ xuất hiện khi có đơn hoàn thành
            </p>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 border-2 border-amber-200">
          <h4 className="font-black text-amber-800 mb-3 flex items-center gap-2">
            📊 Thống kê nhanh
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold">
              <span className="text-amber-700">Tỷ lệ hoàn thành:</span>
              <span className="text-amber-900">
                {totalOrders > 0 ? Math.round(completedOrders.length / totalOrders * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-amber-700">Đơn đang xử lý:</span>
              <span className="text-amber-900">
                {statusCounts.pending + statusCounts.preparing + statusCounts.ready}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-amber-700">Món trung bình/đơn:</span>
              <span className="text-amber-900">
                {completedOrders.length > 0 
                  ? (completedOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0) / completedOrders.length).toFixed(1)
                  : 0} món
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border-2 border-blue-200">
          <h4 className="font-black text-blue-800 mb-3 flex items-center gap-2">
            💡 Gợi ý
          </h4>
          <div className="space-y-2 text-sm font-bold text-blue-700">
            {statusCounts.pending > 5 && (
              <p>⚠️ {statusCounts.pending} đơn chờ duyệt, xử lý ngay!</p>
            )}
            {menuItems.filter(i => !i.isAvailable).length > 3 && (
              <p>👁️ Nhiều món đang ẩn, cân nhắc mở lại?</p>
            )}
            {bestSellers.length > 0 && (
              <p>🔥 "{bestSellers[0].name}" bán chạy nhất!</p>
            )}
            {completedOrders.length === 0 && (
              <p>🎯 Chưa có đơn hoàn thành, hãy bắt đầu!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
