/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { CategoryType, GenderType, PageView, Product, DemoOrder } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { DemoCheckoutView } from './components/DemoCheckoutView';
import { DemoOrderConfirmationView } from './components/DemoOrderConfirmationView';
import { 
  ContactView, 
  ShippingPolicyView, 
  ReturnPolicyView, 
  PrivacyPolicyView, 
  AboutView 
} from './components/InfoPages';
import { Footer } from './components/Footer';
import { Check, X, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedGender, setSelectedGender] = useState<GenderType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);

  const { notification, dismissNotification, setIsCartDrawerOpen } = useCart();

  // Scroll to top on page view switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle product selection to open details
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  // Handle category navigation from homepage / navbar
  const handleNavigateToCategory = (cat: CategoryType, gen: GenderType = 'all') => {
    setSelectedCategory(cat);
    setSelectedGender(gen);
    setCurrentPage('shop');
  };

  const handleCheckoutSuccess = (order: DemoOrder) => {
    setConfirmedOrder(order);
    setCurrentPage('confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Persistent Cart Drawer (accessible from anywhere) */}
      <CartDrawer
        onNavigateToCheckout={() => setCurrentPage('checkout')}
        onContinueShopping={() => {
          if (currentPage === 'product') {
            setCurrentPage('shop');
          }
        }}
      />

      {/* Floating Add-to-Cart Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold">{notification}</span>
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="ml-2 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={dismissNotification}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onSelectProduct={handleSelectProduct}
            onNavigateToCategory={handleNavigateToCategory}
            onNavigateToShop={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'shop' && (
          <ShopView
            category={selectedCategory}
            setCategory={setSelectedCategory}
            gender={selectedGender}
            setGender={setSelectedGender}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setCurrentPage('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'checkout' && (
          <DemoCheckoutView
            onBackToCart={() => setCurrentPage('shop')}
            onOrderSuccess={handleCheckoutSuccess}
          />
        )}

        {currentPage === 'confirmation' && (
          <DemoOrderConfirmationView
            order={confirmedOrder}
            onContinueShopping={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactView onNavigateToShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'shipping' && (
          <ShippingPolicyView onNavigateToShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'returns' && (
          <ReturnPolicyView onNavigateToShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'privacy' && <PrivacyPolicyView />}

        {currentPage === 'about' && (
          <AboutView onNavigateToShop={() => setCurrentPage('shop')} />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={(page, category = 'all', gender = 'all') => {
          setSelectedCategory(category);
          setSelectedGender(gender);
          setCurrentPage(page);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}
