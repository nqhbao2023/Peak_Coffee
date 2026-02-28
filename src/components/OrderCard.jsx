import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Card hiển thị thông tin đơn hàng trong Admin Dashboard
 * Tách ra thành component riêng + React.memo để tránh re-render mỗi khi parent re-render
 */
const OrderCard = memo(({ order, actionButton, onDelete }) => (
  <div className="bg-white p-3 rounded-xl shadow-sm border border-coffee-200 flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <span className="font-black text-base text-coffee-premium">#{order.orderCode}</span>
        <span className="text-[10px] text-coffee-400 font-bold bg-coffee-100 px-1.5 py-0.5 rounded">
          {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <span className="font-black text-base text-brand-earth">{order.total.toLocaleString()}đ</span>
    </div>

    <div className="bg-coffee-50 rounded-lg p-2 text-xs font-medium text-coffee-600 space-y-1">
      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between border-b border-coffee-200 last:border-0 pb-0.5 last:pb-0">
          <span><span className="font-bold text-coffee-premium">{item.quantity}x</span> {item.displayName}</span>
        </div>
      ))}
    </div>

    <div className="flex gap-2">
      {actionButton}
      <button
        onClick={() => onDelete(order)}
        className="w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
));

OrderCard.displayName = 'OrderCard';

export default OrderCard;
