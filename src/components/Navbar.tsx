import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CategoryType, GenderType, PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  selectedGender: GenderType;
  setSelectedGender: (gender: GenderType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
  searchQuery,
  setSearchQuery,
}) => {
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (page: PageView, category: CategoryType = 'all', gender: GenderType = 'all') => {
    setSelectedCategory(category);
    setSelectedGender(gender);
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 'shop') {
      setCurrentPage('shop');
    }
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* 1. Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500 text-white uppercase tracking-wider">
              Special Demo
            </span>
            <span className="font-medium text-slate-200">
              Discover Your Everyday Style — Free demo delivery across India on orders over ₹999!
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <a 
              href="tel:+917862828010" 
              className="hidden lg:inline-flex items-center gap-1 text-slate-300 hover:text-orange-400 font-mono transition-colors"
            >
              <Phone className="w-3 h-3 text-orange-400" />
              <span>+91 78628 28010</span>
            </a>
            <a 
              href="https://wa.me/917862828010?text=Hello%20Neev%20Fashion%20Hub,%20I%20have%20an%20inquiry%20regarding%20your%20clothing%20store." 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>WhatsApp Us</span>
            </a>
            <a 
              href="mailto:neevfataniya@gemil.com" 
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-orange-400 font-mono transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span>neevfataniya@gemil.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform border border-slate-700">
                <span className="text-white font-extrabold text-xl tracking-tighter">N</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mb-2"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    Neev <span className="text-blue-950">Fashion</span>
                  </span>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest px-1.5 py-0.5 bg-orange-50 rounded border border-orange-200">
                    HUB
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 -mt-0.5 tracking-wide">
                  Your Style, Your Choice.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-950 font-bold bg-slate-100'
                  : 'hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', 'tshirts')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'shop' && selectedCategory === 'tshirts'
                  ? 'text-blue-950 font-bold bg-slate-100'
                  : 'hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => handleNavClick('shop', 'shirts')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'shop' && selectedCategory === 'shirts'
                  ? 'text-blue-950 font-bold bg-slate-100'
                  : 'hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              Shirts
            </button>
            <button
              onClick={() => handleNavClick('shop', 'jeans')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'shop' && selectedCategory === 'jeans'
                  ? 'text-blue-950 font-bold bg-slate-100'
                  : 'hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              Jeans
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'shop' && selectedCategory === 'all'
                  ? 'text-blue-950 font-bold bg-slate-100'
                  : 'hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              All Clothing
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'contact'
                  ? 'text-blue-950 font-bold bg-slate-100'
                  : 'hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Header Actions: Search & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input on Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
              <input
                type="text"
                placeholder="Search T-shirts, shirts, jeans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-3 py-2 text-xs rounded-full border border-slate-300 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-medium text-xs shadow-sm hover:shadow transition-all group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-orange-500 text-white rounded-full">
                  {totalItemsCount}
                </span>
              ) : (
                <span className="text-slate-400 text-xs hidden sm:inline">0</span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Expanded */}
        {searchOpen && (
          <div className="sm:hidden pb-3 pt-1 border-t border-slate-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('shop', 'all', 'men')}
              className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 text-center"
            >
              Shop Men
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all', 'women')}
              className="py-2 px-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-xs font-semibold text-orange-700 text-center"
            >
              Shop Women
            </button>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentPage === 'home' ? 'bg-blue-50 text-blue-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          
          <button
            onClick={() => handleNavClick('shop', 'tshirts')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentPage === 'shop' && selectedCategory === 'tshirts' ? 'bg-blue-50 text-blue-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>T-Shirts (Men & Women)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('shop', 'shirts')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentPage === 'shop' && selectedCategory === 'shirts' ? 'bg-blue-50 text-blue-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Shirts (Formal, Casual, Denim)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('shop', 'jeans')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentPage === 'shop' && selectedCategory === 'jeans' ? 'bg-blue-50 text-blue-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Jeans (Slim, Straight, Wide Leg)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('shop', 'all')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentPage === 'shop' && selectedCategory === 'all' ? 'bg-blue-50 text-blue-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Explore All 30 Styles</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
              <a
                href="tel:+917862828010"
                className="py-2 px-3 rounded-xl bg-blue-950 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Call Us</span>
              </a>
              <a
                href="https://wa.me/917862828010?text=Hello%20Neev%20Fashion%20Hub,%20I%20have%20an%20inquiry%20regarding%20your%20clothing%20store."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-between"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('shipping')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Shipping Policy
            </button>
            <button
              onClick={() => handleNavClick('returns')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Return Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
