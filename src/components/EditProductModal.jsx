import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    price: '',
    category: 'Cafe Máy',
    image: '',
    description: '',
    hasTemp: false,
    hasSugar: false,
    hasAddon: false,
    addonName: '',
    addonPrice: '',
  });

  if (!isOpen) return null;

  const categories = [
    'Cafe Máy',
    'Cafe Phin',
    'Giải Khát',
    'Trà Sữa',
    'Nước Ngọt',
    'Đồ Ăn Nhẹ'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên món!');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá hợp lệ!');
      return;
    }
    if (!formData.image.trim()) {
      toast.error('Vui lòng nhập URL hình ảnh!');
      return;
    }

    // Prepare data
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      addonPrice: formData.hasAddon && formData.addonPrice ? parseInt(formData.addonPrice) : 0,
    };

    onSave(productData);
    toast.success(product ? 'Cập nhật món thành công!' : 'Thêm món mới thành công!', {
      icon: '✅',
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-900/90"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">
              {product ? '✏️ Chỉnh sửa món' : '➕ Thêm món mới'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={24} className="text-stone-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Tên món <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Cafe Sữa"
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium"
                autoFocus
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="25000"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                URL hình ảnh <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium"
                />
                {formData.image && (
                  <div className="w-20 h-20 border-2 border-stone-200 rounded-xl overflow-hidden bg-stone-100">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'} 
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-1">Dùng Unsplash, Pexels hoặc link trực tiếp</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Cafe máy đậm đà kết hợp sữa đặc béo ngậy..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-medium resize-none"
              />
            </div>

            {/* Options */}
            <div className="border-2 border-stone-200 rounded-2xl p-4 bg-stone-50">
              <p className="font-bold text-stone-800 mb-3">Tùy chọn món</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasTemp}
                    onChange={(e) => handleChange('hasTemp', e.target.checked)}
                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                  />
                  <span className="font-medium text-stone-700">Chọn nóng/lạnh</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasSugar}
                    onChange={(e) => handleChange('hasSugar', e.target.checked)}
                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                  />
                  <span className="font-medium text-stone-700">Chọn có/không đường</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAddon}
                    onChange={(e) => handleChange('hasAddon', e.target.checked)}
                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                  />
                  <span className="font-medium text-stone-700">Có topping thêm</span>
                </label>
              </div>

              {/* Addon Details */}
              {formData.hasAddon && (
                <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-stone-200">
                  <input
                    type="text"
                    value={formData.addonName}
                    onChange={(e) => handleChange('addonName', e.target.value)}
                    placeholder="Tên topping (VD: Kem tươi)"
                    className="px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm font-medium"
                  />
                  <input
                    type="number"
                    value={formData.addonPrice}
                    onChange={(e) => handleChange('addonPrice', e.target.value)}
                    placeholder="Giá (VD: 8000)"
                    min="0"
                    step="1000"
                    className="px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-gradient-to-br from-white to-stone-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border-2 border-stone-200 rounded-xl font-bold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {product ? 'Cập nhật' : 'Thêm món'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProductModal;
