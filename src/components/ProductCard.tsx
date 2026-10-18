import React, { useState } from 'react';
import { Product } from '../types';
import { COLOR_HEX_MAP } from '../data/products';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);

  const fallbackImage = `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize || !selectedColor) {
      onViewDetails(product);
      return;
    }
    const result = addToCart(product, selectedSize, selectedColor, 1);
    if (result.success) {
      setQuickAdded(true);
      setTimeout(() => setQuickAdded(false), 2000);
    }
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Top Image Container */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={imgError ? fallbackImage : product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-slate-900 text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Gender / Category tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-slate-700 shadow-xs capitalize">
            {product.gender}&apos;s {product.category}
          </span>
        </div>

        {/* Hover overlay with action */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-semibold shadow-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{product.fit}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-blue-950 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          {/* Pricing in INR */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Available Sizes List */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Sizes:</span>
              <span className="font-semibold text-slate-700">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`min-w-[28px] h-6 px-1.5 text-[10px] font-bold rounded border transition-all ${
                    selectedSize === s
                      ? 'border-blue-950 bg-blue-950 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Available Colors with True Swatches */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Colors:</span>
              <span className="font-semibold text-slate-700">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => {
                const hex = COLOR_HEX_MAP[c] || '#64748b';
                const isSelected = selectedColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    title={c}
                    className={`relative w-5 h-5 rounded-full border transition-transform ${
                      isSelected
                        ? 'ring-2 ring-blue-950 ring-offset-1 scale-110'
                        : 'hover:scale-105'
                    } ${c === 'White' ? 'border-slate-300' : 'border-black/10'}`}
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <span className="sr-only">Selected: {c}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors"
          >
            Details
          </button>
          
          <button
            onClick={handleQuickAdd}
            disabled={quickAdded}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              quickAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-blue-950 text-white hover:shadow'
            }`}
          >
            {quickAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
