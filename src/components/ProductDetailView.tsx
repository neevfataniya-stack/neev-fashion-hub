import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { COLOR_HEX_MAP, PRODUCTS } from '../data/products';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Share2, 
  Plus, 
  Minus,
  Sparkles,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../utils/analytics';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // When product changes, track view_item analytics and reset local selection state
  useEffect(() => {
    setSelectedImage(product.image);
    // Don't auto-select size/color so user explicitly selects as requested in spec
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setErrorMessage(null);
    setAddedSuccess(false);

    // Track Google Ads & e-commerce event
    trackEvent('view_item', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      gender: product.gender,
      price: product.price,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize && !selectedColor) {
      setErrorMessage('Please choose your preferred Size and Color.');
      return;
    }
    if (!selectedSize) {
      setErrorMessage('Please select a size to proceed.');
      return;
    }
    if (!selectedColor) {
      setErrorMessage('Please select a color to proceed.');
      return;
    }

    setErrorMessage(null);
    const result = addToCart(product, selectedSize, selectedColor, quantity);
    if (result.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-950 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </button>

        <div className="text-xs text-slate-500 hidden sm:block">
          Home / {product.gender === 'men' ? "Men's" : "Women's"} / <span className="capitalize">{product.category}</span> / <span className="text-slate-800 font-semibold">{product.name}</span>
        </div>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Images */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImage === img
                    ? 'border-blue-950 ring-2 ring-blue-950/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Large Main View */}
          <div className="flex-1 relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase bg-slate-950 text-white shadow-md">
                  {product.badge}
                </span>
              </div>
            )}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm capitalize">
                {product.gender}&apos;s Collection
              </span>
            </div>
          </div>
        </div>

        {/* Right: Product Buying Actions & Info */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Product Title & Category */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {product.gender}&apos;s {product.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock (Demo)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500">
                {product.reviewsCount} customer reviews
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Verified Indian Fit</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-6 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Incl. all taxes</span>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>1. Select Color:</span>
                {selectedColor ? (
                  <span className="text-orange-600 font-semibold">{selectedColor}</span>
                ) : (
                  <span className="text-xs text-rose-500 font-normal italic">*Required</span>
                )}
              </label>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {product.colors.map((c) => {
                const hex = COLOR_HEX_MAP[c] || '#64748b';
                const isSelected = selectedColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c);
                      setErrorMessage(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-950 bg-blue-50/50 shadow-sm ring-1 ring-blue-950'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border ${c === 'White' ? 'border-slate-300' : 'border-black/10'}`}
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-xs font-medium">{c}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-950 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>2. Select Size:</span>
                {selectedSize ? (
                  <span className="text-orange-600 font-semibold">{selectedSize}</span>
                ) : (
                  <span className="text-xs text-rose-500 font-normal italic">*Required</span>
                )}
              </label>
              <span className="text-xs text-slate-500 font-medium">Standard Indian Sizing</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSize(s);
                      setErrorMessage(null);
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-blue-950 bg-blue-950 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-bold text-slate-900">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-l-xl transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 font-bold text-sm text-slate-900 min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-r-xl transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Error Banner if user tries to add without selection */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {addedSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Added to your shopping cart!</span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="font-bold underline text-emerald-900 hover:text-emerald-950"
              >
                View Cart
              </button>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                !selectedSize || !selectedColor
                  ? 'bg-slate-900 hover:bg-blue-950 text-white cursor-pointer'
                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {!selectedSize || !selectedColor 
                  ? 'Select Size & Color to Add' 
                  : `Add to Cart • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
              </span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="py-3.5 px-6 rounded-2xl font-bold text-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Product Specifications & Trust Badges */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4 text-xs text-slate-600">
            <div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Product Description</h4>
              <p className="leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-900 block mb-0.5">Fabric & Material</span>
                <span>{product.fabric}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-900 block mb-0.5">Fit & Styling</span>
                <span>{product.fit}</span>
              </div>
            </div>

            {/* Demo Value Proposition */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-slate-800 text-[11px]">Free Shipping</span>
                <span className="text-[10px] text-slate-400">On demo orders &gt; ₹999</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-blue-900" />
                <span className="font-bold text-slate-800 text-[11px]">7-Day Demo Return</span>
                <span className="text-[10px] text-slate-400">Sample return flow</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 text-[11px]">Indian Sizing</span>
                <span className="text-[10px] text-slate-400">True to measurements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Related {product.category.toUpperCase()} Styles
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customers also viewed these {product.category} for everyday wear
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-blue-950 hover:underline"
            >
              View All {product.category} →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onViewDetails={(p) => onSelectProduct(p)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
