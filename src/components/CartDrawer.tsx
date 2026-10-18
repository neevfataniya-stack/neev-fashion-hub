import React from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { COLOR_HEX_MAP } from '../data/products';
import { PageView } from '../types';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    isFreeShipping,
    total,
    totalItemsCount,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Shopping Cart</h2>
                <p className="text-xs text-slate-500">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in cart
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress alert */}
          <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              {isFreeShipping ? (
                <strong className="text-emerald-700">Congratulations! You unlocked Free Demo Shipping!</strong>
              ) : (
                <>Add <strong>₹{(999 - subtotal).toLocaleString('en-IN')}</strong> more for Free Demo Delivery</>
              )}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Explore our curated Indian everyday collection of T-shirts, shirts, and jeans.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const colorHex = COLOR_HEX_MAP[item.selectedColor] || '#64748b';
                return (
                  <div key={item.cartItemId} className="py-4 flex gap-4">
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-24 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    />

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected Attributes */}
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            Size: {item.selectedSize}
                          </span>
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: colorHex }}
                            />
                            {item.selectedColor}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-slate-400">
                              ₹{item.unitPrice.toLocaleString('en-IN')} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="flex justify-between text-slate-600 items-center">
                  <span className="flex items-center gap-1">
                    Demo Shipping Fee:
                    <span className="text-[10px] text-slate-400">(Illustrative)</span>
                  </span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">FREE</span>
                    ) : (
                      <span className="font-semibold text-slate-900">₹{shippingFee}</span>
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Final Total (₹ INR):</span>
                  <span className="text-base text-blue-950">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Demo Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onContinueShopping();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Demo shopping journey — No real payment required</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
