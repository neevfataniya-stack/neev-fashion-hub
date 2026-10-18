import React from 'react';
import { Product, CategoryType, GenderType } from '../types';
import { CATEGORIES_META, PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Tag, 
  Star, 
  CheckCircle2, 
  BarChart3,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToCategory: (category: CategoryType, gender?: GenderType) => void;
  onNavigateToShop: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onNavigateToCategory,
  onNavigateToShop,
}) => {
  // Featured products (handpicked bestsellers from T-Shirts, Shirts, Jeans)
  const featuredProducts = PRODUCTS.filter((p) => p.badge === 'Bestseller' || p.badge === 'Trending').slice(0, 8);

  // Men's Fashion Highlights (first 4 men's products)
  const menHighlights = PRODUCTS.filter((p) => p.gender === 'men').slice(0, 4);

  // Women's Fashion Highlights (first 4 women's products)
  const womenHighlights = PRODUCTS.filter((p) => p.gender === 'women').slice(0, 4);

  return (
    <div className="space-y-16 animate-in fade-in duration-300 pb-16">
      
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl border border-slate-800">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80"
            alt="Fashion model everyday clothing"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 lg:py-28 flex flex-col items-start justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Everyday Indian Fashion • All 30 Styles Available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-2xl leading-[1.1]">
            Discover Your Style.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-xl font-normal leading-relaxed">
            Explore stylish T-shirts, shirts, and jeans for every occasion. Crafted for modern Indian everyday life with breathable cotton and premium stretch denim.
          </p>

          {/* Hero Buttons: Shop Men & Shop Women */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
            <button
              onClick={() => onNavigateToCategory('all', 'men')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm tracking-wide shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Shop Men</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToCategory('all', 'women')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Shop Women</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-700" />
            </button>
          </div>

          {/* Quick Stats in Hero */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 pt-8 border-t border-slate-800 text-xs text-slate-300 w-full max-w-lg">
            <div>
              <div className="text-2xl font-black text-white">30</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Staple Styles</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">₹249</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Starting Price</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-400">100%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Demo Project</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Handcrafted Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={onNavigateToShop}
            className="text-xs font-bold text-blue-950 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>Browse All 30 Products</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES_META.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateToCategory(cat.id as CategoryType)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-orange-600 text-white px-2.5 py-1 rounded-md shadow-xs">
                  From ₹{cat.startingPrice}
                </span>
                <h3 className="text-2xl font-black tracking-tight text-white mt-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-orange-300 group-hover:text-white transition-colors">
                  <span>Explore {cat.count} styles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider">
                Trending Right Now
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top trending T-shirts, shirts, and jeans chosen for everyday Indian comfort
            </p>
          </div>
          <button
            onClick={onNavigateToShop}
            className="text-xs font-bold text-blue-950 hover:underline"
          >
            View Complete Collection →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner — Affordable Everyday Fashion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500 text-white mb-3">
              <Tag className="w-3.5 h-3.5" />
              Everyday Fashion Value
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Premium Fits at Pocket-Friendly Indian Prices
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              From ₹249 plain tees to ₹1,199 designer wide-leg denim — Neev Fashion Hub proves that looking sharp everyday doesn&apos;t require overspending.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={onNavigateToShop}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-md"
              >
                Shop All Everyday Essentials
              </button>
              <a
                href="https://wa.me/917862828010?text=Hello%20Neev%20Fashion%20Hub,%20I%20have%20an%20inquiry%20regarding%20your%20clothing%20store."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>WhatsApp Inquiries</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Men's Fashion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-950">
              Tailored For Him
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Men&apos;s Fashion
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Plain & polo t-shirts, oxford shirts, rugged denim, and relaxed streetwear
            </p>
          </div>
          <button
            onClick={() => onNavigateToCategory('all', 'men')}
            className="text-xs font-bold text-blue-950 hover:underline"
          >
            Explore All 15 Men&apos;s Styles →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menHighlights.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. Women's Fashion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Modern Aesthetics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Women&apos;s Fashion
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Crop & oversized t-shirts, tailored workwear shirts, mom fit & bootcut jeans
            </p>
          </div>
          <button
            onClick={() => onNavigateToCategory('all', 'women')}
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            Explore All 15 Women&apos;s Styles →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {womenHighlights.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. Benefits Section (Easy Shopping, Multiple Sizes, Multiple Colors, Demo Experience) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Why Neev Fashion Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Built For Everyday Indian Living
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Easy Shopping</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant category filtering, real-time cart drawer, and frictionless demo checkout in Indian Rupees (₹).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Multiple Sizes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comprehensive size availability from XS to XXL and waist 26 to 36, calibrated for Indian body measurements.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Multiple Colors</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rich palettes spanning staple neutrals, deep indigos, and lively seasonal accents with true color swatches.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Fast Delivery Across India</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard door-to-door delivery across metro and regional PIN codes with free shipping on orders over ₹999.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
