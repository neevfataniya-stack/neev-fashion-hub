import React from 'react';
import { PageView, CategoryType, GenderType } from '../types';
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  BarChart3, 
  Heart,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView, category?: CategoryType, gender?: GenderType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Benefits / Trust Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800/80 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-orange-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Shopping</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Streamlined browse, filter, and demo cart experience.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Multiple Sizes</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">XS to XXL & 26 to 36 standard Indian sizing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Multiple Colors</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Rich shades in bio-washed cotton & denim washes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">All-India Delivery</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Prompt standard delivery across metro & regional PIN codes.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-sm">
                N
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Neev <span className="text-orange-400">Fashion</span> Hub
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              &ldquo;Your Style, Your Choice.&rdquo; Dedicated to affordable everyday clothing for Indian men and women — featuring 30 staple t-shirts, shirts, and jeans.
            </p>

            <div className="text-xs text-slate-400 space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <a 
                  href="mailto:neevfataniya@gemil.com" 
                  className="hover:text-orange-400 transition-colors font-mono"
                  title="Send email to Neev Fashion Hub"
                >
                  neevfataniya@gemil.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <a 
                  href="tel:+917862828010" 
                  className="hover:text-orange-400 transition-colors font-mono"
                  title="Call Neev Fashion Hub"
                >
                  +91 78628 28010
                </a>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href="tel:+917862828010"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-semibold text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
                >
                  Call Us
                </a>
                <a
                  href="https://wa.me/917862828010?text=Hello%20Neev%20Fashion%20Hub,%20I%20have%20an%20inquiry%20regarding%20your%20clothing%20store."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 hover:bg-emerald-900 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'tshirts')}
                  className="hover:text-white transition-colors"
                >
                  T-Shirts Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'shirts')}
                  className="hover:text-white transition-colors"
                >
                  Shirts Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'jeans')}
                  className="hover:text-white transition-colors"
                >
                  Jeans Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'all', 'men')}
                  className="hover:text-white transition-colors"
                >
                  Men&apos;s Fashion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'all', 'women')}
                  className="hover:text-white transition-colors"
                >
                  Women&apos;s Fashion
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Support Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Neev Fashion Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('returns')}
                  className="hover:text-white transition-colors"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Assistance with sizes, order inquiries, and fit recommendations across India.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p className="max-w-3xl mx-auto text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Neev Fashion Hub:</strong> Premium everyday clothing for Indian men and women. For customer support, reach us at <a href="mailto:neevfataniya@gemil.com" className="text-orange-400 hover:underline">neevfataniya@gemil.com</a> or call <a href="tel:+917862828010" className="text-orange-400 hover:underline">+91 78628 28010</a>.
          </p>
          <p className="text-[11px] text-slate-500 pt-1">
            © 2026 Neev Fashion Hub • Your Style, Your Choice • All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
};
