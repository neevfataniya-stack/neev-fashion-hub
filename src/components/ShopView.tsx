import React, { useMemo, useState, useEffect } from 'react';
import { Product, CategoryType, GenderType } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { trackEvent } from '../utils/analytics';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowUpDown, 
  Tag, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface ShopViewProps {
  category: CategoryType;
  setCategory: (cat: CategoryType) => void;
  gender: GenderType;
  setGender: (gender: GenderType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export const ShopView: React.FC<ShopViewProps> = ({
  category,
  setCategory,
  gender,
  setGender,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(1200);

  // Track view_item_list analytics event
  useEffect(() => {
    trackEvent('view_item_list', {
      category,
      gender,
      itemCount: PRODUCTS.length,
    });
  }, [category, gender]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // 1. Category Filter
      if (category !== 'all' && p.category !== category) return false;
      // 2. Gender Filter
      if (gender !== 'all' && p.gender !== gender) return false;
      // 3. Max Price Filter
      if (p.price > selectedMaxPrice) return false;
      // 4. Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchCat = p.category.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchColors = p.colors.some((c) => c.toLowerCase().includes(query));
        if (!matchName && !matchCat && !matchDesc && !matchColors) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0; // 'featured' retains catalogue order
    });
  }, [category, gender, searchQuery, sortOption, selectedMaxPrice]);

  const handleResetFilters = () => {
    setCategory('all');
    setGender('all');
    setSearchQuery('');
    setSelectedMaxPrice(1200);
    setSortOption('featured');
  };

  const getPageTitle = () => {
    let title = '';
    if (gender === 'men') title += "Men's ";
    else if (gender === 'women') title += "Women's ";

    if (category === 'tshirts') title += 'T-Shirts';
    else if (category === 'shirts') title += 'Shirts';
    else if (category === 'jeans') title += 'Jeans';
    else title += 'Complete Everyday Collection';

    return title.trim();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header & Breadcrumb */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              <span>Catalog</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">{gender === 'all' ? 'All Genders' : gender}</span>
              <span>•</span>
              <span className="capitalize">{category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} of {PRODUCTS.length} clothing styles with Indian rupee pricing (₹ INR)
            </p>
          </div>

          {/* Active search indicator */}
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 self-start md:self-auto">
              <span>Search query: &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="font-bold text-orange-700 hover:text-orange-900"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Sorting Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Category & Gender Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown/Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'tshirts', 'shirts', 'jeans'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  category === cat
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Gender Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'men', 'women'] as const).map((gen) => (
              <button
                key={gen}
                type="button"
                onClick={() => setGender(gen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  gender === gen
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {gen === 'all' ? 'Both' : gen}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Price Sort and Reset */}
        <div className="flex items-center gap-3 justify-between lg:justify-end">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-950"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {(category !== 'all' || gender !== 'all' || searchQuery || sortOption !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No clothing items match your search
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            We couldn&apos;t find any items matching &ldquo;{searchQuery}&rdquo; in the selected filter combination.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-bold transition-all shadow-sm"
          >
            Clear All Filters & Show 30 Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
