import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CheckoutForm, DemoOrder, PageView } from '../types';
import { trackEvent } from '../utils/analytics';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag, 
  Lock, 
  Truck, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { COLOR_HEX_MAP } from '../data/products';

interface DemoCheckoutViewProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: DemoOrder) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Gujarat', 'Haryana', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const DemoCheckoutView: React.FC<DemoCheckoutViewProps> = ({
  onBackToCart,
  onOrderSuccess,
}) => {
  const { cart, subtotal, shippingFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track begin_checkout event on load
  useEffect(() => {
    trackEvent('begin_checkout', {
      value: total,
      itemCount: cart.reduce((acc, i) => acc + i.quantity, 0),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fillSampleDetails = () => {
    setFormData({
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma.demo@example.com',
      phone: '9876543210',
      address: 'Flat 402, Lotus Residency, MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      notes: 'Please leave parcel with society security desk if unavailable.',
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!phoneClean) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Street delivery address is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state) {
      newErrors.state = 'Please select a state.';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN Code is required.';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian postal PIN code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to checkout.');
      onBackToCart();
      return;
    }

    setIsSubmitting(true);

    // Simulate short network processing for realistic UI feedback
    setTimeout(() => {
      const randomId = Math.floor(10000 + Math.random() * 90000);
      const orderId = `NFH-2026-${randomId}`;

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const demoOrder: DemoOrder = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...cart],
        customer: { ...formData },
        subtotal,
        shipping: shippingFee,
        discount: 0,
        total,
        status: 'Confirmed (Demo Order)',
        estimatedDelivery: formattedDelivery,
      };

      // 1. Track purchase event for Google Ads campaign analytics
      trackEvent('purchase', {
        orderId,
        value: total,
        itemCount: cart.reduce((acc, i) => acc + i.quantity, 0),
      });

      // 2. Clear the cart
      clearCart();

      // 3. Navigate to confirmation view
      onOrderSuccess(demoOrder);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* 1. Mandatory Safety & Demo Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-amber-950 uppercase tracking-wide">
              DEMO CHECKOUT — No Real Payment Will Be Processed
            </h3>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              This is a college Google Ads campaign demonstration project. No real cards, UPI PINs, or bank credentials are ever requested or stored.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={fillSampleDetails}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
          Fill Demo Test Details
        </button>
      </div>

      {/* Top back button */}
      <div className="mb-6">
        <button
          onClick={onBackToCart}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Customer & Delivery Details Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Contact Information */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs flex items-center justify-center">1</span>
                <span>Customer Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error={!!errors.fullName} className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                        : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div data-error={!!errors.email}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                        : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div data-error={!!errors.phone}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (India) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs flex items-center justify-center">2</span>
                <span>Shipping Address (India)</span>
              </h2>

              <div className="space-y-4">
                <div data-error={!!errors.address}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address, Flat/House No., Building <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Flat 402, Lotus Residency, MG Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.address
                        ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                        : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div data-error={!!errors.city}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pune"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        errors.city
                          ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-blue-950'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city}</p>
                    )}
                  </div>

                  <div data-error={!!errors.state}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-950"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div data-error={!!errors.pincode}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 411001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        errors.pincode
                          ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-blue-950'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring doorbell twice, deliver after 2 PM"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-950"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs flex items-center justify-center">3</span>
                <span>Payment Method (Demo Mode)</span>
              </h2>

              <div className="p-4 rounded-xl border-2 border-emerald-500/50 bg-emerald-50/50 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Demo Simulation Mode (Instant Confirmation)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    No credit/debit card, UPI, net banking, or OTP is needed. Clicking Place Demo Order below will simulate a complete e-commerce conversion and log analytics for your college Google Ads campaign.
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order CTA for mobile */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-base shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <span>Place Demo Order (₹{total.toLocaleString('en-IN')})</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Order Summary</h3>
              <span className="text-xs font-semibold text-slate-500">
                {cart.length} {cart.length === 1 ? 'product' : 'products'}
              </span>
            </div>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const colorHex = COLOR_HEX_MAP[item.selectedColor] || '#64748b';
                return (
                  <div key={item.cartItemId} className="flex gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-16 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span>Size: <strong className="text-slate-800">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: colorHex }}
                          />
                          {item.selectedColor}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 text-right">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 items-center">
                <span className="flex items-center gap-1">
                  Sample Shipping Fee:
                  <span className="text-[10px] text-slate-400">(Illustrative)</span>
                </span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{shippingFee}</span>
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>Final Total (₹ INR):</span>
                <span className="text-lg text-blue-950">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA for desktop */}
            <div className="hidden lg:block pt-2">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md shadow-orange-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <span>Place Demo Order • ₹{total.toLocaleString('en-IN')}</span>
                )}
              </button>
            </div>

            {/* Illustrative Delivery Note */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Truck className="w-3.5 h-3.5 text-orange-500" />
                <span>Estimated Demo Dispatch</span>
              </div>
              <p>
                Standard courier delivery simulated across Indian metro & tier-2 cities. For academic demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
