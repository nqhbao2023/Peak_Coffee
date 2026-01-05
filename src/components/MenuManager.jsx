import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Filter } from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';
import { motion, AnimatePresence } from 'framer-motion';
import EditProductModal from './EditProductModal';
import toast from 'react-hot-toast';

const MenuManager = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, getCategories } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = getCategories();

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'Tất cả' || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSave = (productData) => {
    if (editingProduct) {
      updateMenuItem(editingProduct.id, productData);
    } else {
      addMenuItem(productData);
    }
  };

  const handleDelete = (product) => {
    if (confirm(`Xóa món "${product.name}"?`)) {
      deleteMenuItem(product.id);
      toast.success('Đã xóa món!', { icon: '🗑️' });
    }
  };

  const handleToggleAvailable = (product) => {
    toggleAvailability(product.id);
    toast.success(
      product.isAvailable ? 'Đã ẩn món' : 'Đã hiển thị món',
      { icon: product.isAvailable ? '👁️‍🗨️' : '👁️', duration: 2000 }
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món..."
            className="w-full pl-11 pr-4 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-bold bg-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={handleAddNew}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          Thêm món
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <p className="text-3xl font-black text-blue-700">{menuItems.length}</p>
          <p className="text-xs font-bold text-blue-600 mt-1">Tổng món</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
          <p className="text-3xl font-black text-green-700">
            {menuItems.filter(i => i.isAvailable).length}
          </p>
          <p className="text-xs font-bold text-green-600 mt-1">Đang bán</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200">
          <p className="text-3xl font-black text-amber-700">
            {menuItems.filter(i => !i.isAvailable).length}
          </p>
          <p className="text-xs font-bold text-amber-600 mt-1">Đã ẩn</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-3xl font-black text-purple-700">{categories.length - 1}</p>
          <p className="text-xs font-bold text-purple-600 mt-1">Danh mục</p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`border-2 rounded-2xl overflow-hidden transition-all ${
                item.isAvailable 
                  ? 'border-stone-200 bg-white hover:shadow-lg' 
                  : 'border-stone-200 bg-stone-50 opacity-60'
              }`}
            >
              {/* Image */}
              <div className="relative h-32 bg-stone-100 overflow-hidden group">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                    <span className="bg-stone-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ĐÃ ẨN
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {item.price.toLocaleString()}đ
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-stone-800 truncate">{item.name}</h3>
                    <p className="text-xs text-stone-500 font-bold">{item.category}</p>
                  </div>
                </div>

                {/* Options Tags */}
                {(item.hasTemp || item.hasSugar || item.hasAddon) && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.hasTemp && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                        🧊 Nóng/Lạnh
                      </span>
                    )}
                    {item.hasSugar && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        🍬 Đường
                      </span>
                    )}
                    {item.hasAddon && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                        ➕ Topping
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1 ${
                      item.isAvailable
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {item.isAvailable ? <EyeOff size={16} /> : <Eye size={16} />}
                    {item.isAvailable ? 'Ẩn' : 'Hiện'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1"
                  >
                    <Edit size={16} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Search size={48} className="text-stone-300" />
          </div>
          <p className="text-stone-500 font-bold text-lg">Không tìm thấy món nào</p>
          <p className="text-sm text-stone-400 mt-1">
            {searchQuery ? 'Thử tìm kiếm khác' : 'Thêm món mới để bắt đầu'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProductModal
            isOpen={true}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingProduct(null);
            }}
            product={editingProduct}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManager;
