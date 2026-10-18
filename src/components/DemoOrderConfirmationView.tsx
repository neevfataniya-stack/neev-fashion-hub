import React from 'react';
import { DemoOrder, PageView } from '../types';
import { 
  CheckCircle2, 
  ShoppingBag, 
  BarChart3, 
  Truck, 
  MapPin, 
  ArrowRight, 
  ShieldAlert,
  Calendar,
  Sparkles
} from 'lucide-react';
import { COLOR_HEX_MAP } from '../data/products';

interface DemoOrderConfirmationViewProps {
  order: DemoOrder | null;
  onContinueShopping: () => void;
}

export const DemoOrderConfirmationView: React.FC<DemoOrderConfirmationViewProps> = ({
  order,
  onContinueShopping,
}) => {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Demo Order Found</h2>
        <p className="text-sm text-slate-500 mb-6">Explore our catalog and place a demo order.</p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      
      {/* 1. Success Hero Box */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md text-center mb-8 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          Demo Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thank you for shopping, {order.customer.fullName}!
        </h1>
        
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Your demo order has been logged into the local campaign database with Order ID{' '}
          <strong className="text-slate-900">{order.orderId}</strong>.
        </p>

        {/* Prominent Educational / Safety Disclaimer */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block font-bold mb-0.5">ACADEMIC PROJECT DEMONSTRATION NOTICE:</strong>
            This is an illustrative student project for a Google Ads Search campaign. No real payment was processed, no credit card or UPI was charged, and <strong>no real products will be dispatched or delivered</strong>.
          </div>
        </div>

        {/* Continue Shopping CTA */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* 2. Order Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Estimated Delivery & Shipping */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
            <Truck className="w-4 h-4 text-blue-900" />
            <span>Delivery Information (Simulated)</span>
          </div>

          <div className="pt-1">
            <div className="text-xs text-slate-500">Estimated Demo Arrival:</div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{order.estimatedDelivery}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Shipping Address:</span>
            </div>
            <p className="leading-relaxed">
              {order.customer.address}, {order.customer.city}, {order.customer.state} — {order.customer.pincode}
            </p>
            <p className="mt-1 text-slate-500">
              Contact: +91 {order.customer.phone} • {order.customer.email}
            </p>
          </div>
        </div>

        {/* Order Payment & Financial Summary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span>Payment Breakdown</span>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Demo Shipping Fee:</span>
              <span>
                {order.shipping === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-900">₹{order.shipping}</span>
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
              <span>Total Paid (Simulated):</span>
              <span className="text-blue-950">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-1 text-[11px] text-slate-400">
              Payment Status: Simulated Demo Completed (No actual charge)
            </div>
          </div>
        </div>
      </div>

      {/* 3. Items Purchased Summary */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Ordered Items ({order.items.length})</h3>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => {
            const colorHex = COLOR_HEX_MAP[item.selectedColor] || '#64748b';
            return (
              <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.product.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: colorHex }}
                        />
                        {item.selectedColor}
                      </span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
