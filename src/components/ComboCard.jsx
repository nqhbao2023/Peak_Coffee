import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

const ComboCard = ({ combo, onAddToCart }) => {
  const handleAddToCart = () => {
    const comboItem = {
      id: combo.id,
      cartId: combo.id,
      name: combo.name,
      description: combo.description,
      finalPrice: combo.comboPrice,
      originalPrice: combo.originalPrice,
      image: combo.image,
      category: 'Combo',
      isCombo: true,
    };
    onAddToCart(comboItem);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} fill="currentColor" />
          <span className="font-black text-sm">
            {combo.discountPercent 
              ? `GIẢM ${combo.discountPercent}%` 
              : `TIẾT KIỆM ${combo.discount.toLocaleString()}đ`
            }
          </span>
        </div>
        <Tag size={16} />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-4xl">{combo.image}</div>
          <div className="flex-1">
            <h3 className="font-black text-stone-800 text-lg mb-1">{combo.name}</h3>
            <p className="text-xs text-stone-500 mb-2">{combo.description}</p>
            {combo.bestFor && (
              <div className="inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                ⏰ {combo.bestFor}
              </div>
            )}
          </div>
        </div>

        <div className="bg-stone-50 rounded-xl p-3 mb-3">
          <p className="text-xs font-bold text-stone-500 mb-2">Bao gồm:</p>
          <ul className="space-y-1">
            {combo.items.map((item, index) => (
              <li key={index} className="text-sm text-stone-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            {combo.originalPrice > 0 && (
              <p className="text-xs text-stone-400 line-through">
                {combo.originalPrice.toLocaleString()}đ
              </p>
            )}
            <p className="text-2xl font-black text-orange-600">
              {combo.comboPrice > 0 
                ? `${combo.comboPrice.toLocaleString()}đ`
                : `Giảm ${combo.discountPercent}%`
              }
            </p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-[0.98] transition-all"
        >
          CHỌN COMBO
        </button>
      </div>
    </div>
  );
};

export default ComboCard;
