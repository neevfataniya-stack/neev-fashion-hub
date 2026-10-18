import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  RotateCcw, 
  Lock, 
  Info,
  HelpCircle,
  AlertCircle,
  MessageCircle,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PageView } from '../types';

// ==========================================
// 1. CONTACT US PAGE (FUNCTIONAL)
// ==========================================
export const ContactView: React.FC<{ onNavigateToShop: () => void }> = ({ onNavigateToShop }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Check backend email configuration status on mount
  useEffect(() => {
    fetch('/api/contact/status')
      .then((res) => res.json())
      .then((data) => {
        setIsConfigured(Boolean(data.configured));
      })
      .catch(() => {
        setIsConfigured(false);
      });
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Customer email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!phoneClean) {
      errs.phone = 'Phone number is required.';
    } else if (phoneClean.length < 10) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject line is required.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = 'Please enter a message of at least 5 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setServerMessage(data.message || 'Your message has been delivered to neevfataniya@gemil.com.');
      } else {
        setStatus('error');
        setServerMessage(data.error || 'Failed to dispatch email. Please check server configuration.');
        if (data.configured === false) {
          setShowSetupGuide(true);
        }
      }
    } catch (err: any) {
      setStatus('error');
      setServerMessage('Network connection error: ' + (err.message || 'Unable to reach email server.'));
    }
  };

  // Pre-filled direct email client link as client-side fallback
  const directMailtoUrl = `mailto:neevfataniya@gemil.com?subject=${encodeURIComponent(
    formData.subject || 'Inquiry from Neev Fashion Hub Website'
  )}&body=${encodeURIComponent(
    `Hello Neev Fashion Hub,\n\nCustomer Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}\n`
  )}`;

  // WhatsApp chat link with India country code (+91)
  const whatsappUrl = `https://wa.me/917862828010?text=${encodeURIComponent(
    formData.message 
      ? `Hello Neev Fashion Hub, my name is ${formData.fullName || 'Customer'}. ${formData.message}`
      : 'Hello Neev Fashion Hub, I have an inquiry regarding your clothing collection.'
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 mb-3 border border-orange-200">
          <Phone className="w-3.5 h-3.5 text-orange-600" />
          Customer Support & Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Neev Fashion Hub
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          We are here to help you with sizes, fits, custom styling, or order questions. Reach us directly via phone, WhatsApp, or through our functional contact form.
        </p>
      </div>

      {/* Quick Direct Action Strip: Call Us, WhatsApp Us, Email Us */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* 1. Call Us Button */}
        <a
          href="tel:+917862828010"
          className="p-4 rounded-2xl bg-blue-950 text-white hover:bg-slate-900 transition-all shadow-sm hover:shadow flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-900 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Direct Phone Call</div>
            <div className="text-sm font-extrabold text-white mt-0.5">Call 7862828010</div>
            <div className="text-[11px] text-orange-300 font-medium">Opens phone app</div>
          </div>
        </a>

        {/* 2. WhatsApp Us Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm hover:shadow flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200 group-hover:scale-110 transition-transform flex-shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">Instant Chat (+91)</div>
            <div className="text-sm font-extrabold text-white mt-0.5">WhatsApp Us</div>
            <div className="text-[11px] text-emerald-200 font-medium">+91 78628 28010</div>
          </div>
        </a>

        {/* 3. Direct Email Button */}
        <a
          href="mailto:neevfataniya@gemil.com"
          className="p-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Primary Email</div>
            <div className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">neevfataniya@gemil.com</div>
            <div className="text-[11px] text-orange-300 font-medium">Click to send email</div>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contact Info & Business Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-950 text-white shadow-xl space-y-6 border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400">Official Brand Info</span>
              </div>
              <h2 className="text-xl font-black text-white">Neev Fashion Hub</h2>
              <p className="text-xs text-slate-400 mt-1">&ldquo;Your Style, Your Choice.&rdquo;</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-300 text-[11px] uppercase">Business Email</span>
                  <a 
                    href="mailto:neevfataniya@gemil.com" 
                    className="text-white hover:text-orange-400 font-mono text-xs font-semibold underline underline-offset-2"
                  >
                    neevfataniya@gemil.com
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-300 text-[11px] uppercase">Direct Phone</span>
                  <a 
                    href="tel:+917862828010" 
                    className="text-white hover:text-orange-400 font-mono text-xs font-semibold underline underline-offset-2"
                  >
                    +91 78628 28010 (7862828010)
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-300 text-[11px] uppercase">Working Hours</span>
                  <span className="text-slate-200">Monday to Saturday: 9:30 AM – 7:30 PM IST</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-300 text-[11px] uppercase">Service Region</span>
                  <span className="text-slate-200">All India shipping & online delivery inquiries</span>
                </div>
              </div>
            </div>

            {/* Email Backend Status Indicator */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Server Email Dispatch:</span>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SMTP Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  <AlertCircle className="w-3 h-3" />
                  Direct / App Mode
                </span>
              )}
            </div>
          </div>

          {/* Quick Setup Explainer Dropdown */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs space-y-3">
            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full flex items-center justify-between text-left font-bold text-slate-900 hover:text-blue-950"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-orange-500" />
                <span>How Real Email Delivery Works</span>
              </span>
              {showSetupGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSetupGuide && (
              <div className="pt-2 text-slate-600 space-y-2 border-t border-slate-100 animate-in fade-in">
                <p>
                  To deliver emails directly from the web server into <strong className="text-slate-900">neevfataniya@gemil.com</strong> without opening your personal email app:
                </p>
                <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <li>Configure <span className="text-blue-700">SMTP_HOST</span> (e.g. smtp.gmail.com)</li>
                  <li>Set <span className="text-blue-700">SMTP_USER</span> (your sending account)</li>
                  <li>Set <span className="text-blue-700">SMTP_PASS</span> (16-char App Password)</li>
                  <li>Set <span className="text-blue-700">CONTACT_RECIPIENT_EMAIL</span> = &ldquo;neevfataniya@gemil.com&rdquo;</li>
                </ol>
                <p className="text-[11px] text-slate-500">
                  Credentials are kept strictly server-side in environment variables and are never exposed in frontend client code.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Functional Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">Send a Message</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target recipient address: <strong className="text-slate-800 font-mono">neevfataniya@gemil.com</strong>
              </p>
            </div>

            {/* Success Banner (shown only when verified) */}
            {status === 'success' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-sm">Message Delivered Successfully!</h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      {serverMessage || 'Your message has been delivered to neevfataniya@gemil.com.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-700">A copy of your message has been processed.</span>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner with Immediate Alternative */}
            {status === 'error' && (
              <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wide text-rose-800">
                      Email Delivery Notice
                    </h3>
                    <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                      {serverMessage}
                    </p>
                  </div>
                </div>

                {/* Instant 1-Click Fallback via User's Email Client */}
                <div className="p-3.5 bg-white rounded-xl border border-rose-200 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block">
                    Instant 1-Click Option: Send via your email application
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    Click below to open your Gmail/Outlook/Mail app with all your entered details pre-addressed to <strong>neevfataniya@gemil.com</strong>:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={directMailtoUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                      <span>Open in Email App & Send</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp (+91 78628 28010)</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* The Contact Form */}
            {status !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                        : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName}</p>}
                </div>

                {/* 2. Customer Email & Phone Number Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="customer@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        errors.email
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 7862828010"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                {/* 3. Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Inquiry regarding Men's Denim Shirts and Sizing"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.subject
                        ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                        : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                    }`}
                  />
                  {errors.subject && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.subject}</p>}
                </div>

                {/* 4. Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Please write your questions or order inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.message
                        ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                        : 'border-slate-300 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.message}</p>}
                </div>

                {/* 5. Submit Message Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white font-extrabold text-sm shadow-md shadow-orange-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message to neevfataniya@gemil.com...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Alternative link */}
                <div className="pt-3 text-center text-xs text-slate-500">
                  Or email directly:{' '}
                  <a
                    href="mailto:neevfataniya@gemil.com"
                    className="font-bold text-blue-950 hover:underline font-mono"
                  >
                    neevfataniya@gemil.com
                  </a>
                  {' '}• Phone:{' '}
                  <a
                    href="tel:+917862828010"
                    className="font-bold text-blue-950 hover:underline font-mono"
                  >
                    +91 78628 28010
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SHIPPING POLICY PAGE
// ==========================================
export const ShippingPolicyView: React.FC<{ onNavigateToShop: () => void }> = ({ onNavigateToShop }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300 space-y-6">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">DEMO SHIPPING NOTICE:</strong>
          This is an illustrative shipping policy for a college Google Ads campaign prototype. Neev Fashion Hub does not operate commercial freight or courier contracts, and <strong>no real parcels will be shipped</strong>.
        </div>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipping Policy (Illustrative)</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated for Academic Year 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-500" />
            1. Estimated Delivery Timelines (Sample Data)
          </h2>
          <p>
            For demonstration purposes, sample shipping timelines across India are modeled as follows:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Tier 1 Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 3 business days.</li>
            <li><strong>Tier 2 & Tier 3 Regional Cities:</strong> 3 to 5 business days.</li>
            <li><strong>Northeast & Remote Island Regions:</strong> 5 to 7 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Example Shipping Fees</h2>
          <p>
            Standard demo shipping is calculated at a flat nominal fee of <strong>₹49</strong> per order. Orders with a cart value of <strong>₹999 or more</strong> qualify for <strong>FREE Demo Shipping</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Order Processing</h2>
          <p>
            Orders placed before 2:00 PM IST on working days would theoretically undergo quality inspection, barcode assignment, and secure waterproof poly-packaging on the same day.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Delivery Address & PIN Code Accuracy</h2>
          <p>
            Our demo checkout validates Indian 6-digit postal PIN codes to ensure realistic delivery estimations. No real consignments are generated.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <button
          onClick={onNavigateToShop}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs"
        >
          Explore Catalog
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. RETURN POLICY PAGE
// ==========================================
export const ReturnPolicyView: React.FC<{ onNavigateToShop: () => void }> = ({ onNavigateToShop }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300 space-y-6">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">ILLUSTRATIVE POLICY NOTICE:</strong>
          This sample return policy is prepared solely for an advertising classroom assignment. No real purchases or commercial returns can be processed on this website.
        </div>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Return & Exchange Policy (Illustrative)</h1>
        <p className="text-xs text-slate-500 mt-1">Illustrative Terms for Everyday Apparel</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-orange-500" />
            1. 7-Day Demo Return Window
          </h2>
          <p>
            In our modeled e-commerce framework, customers may request a size exchange or full return within 7 calendar days of receipt of their apparel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Sample Return Eligibility Criteria</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Garments must remain unworn, unwashed, and unsoiled.</li>
            <li>Original brand tags and size labels must remain intact.</li>
            <li>Original polybag packaging must be preserved for courier handover.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Example Return Request Flow</h2>
          <p>
            Customers would submit their order ID via the demo portal. A courier agent would perform reverse pickup at their doorstep, followed by quality check and demo store refund.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <button
          onClick={onNavigateToShop}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs"
        >
          Return to Shopping
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 4. PRIVACY POLICY PAGE
// ==========================================
export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Educational Project Demonstration Privacy Statement</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
        <p>
          <strong>Neev Fashion Hub</strong> is a student mock e-commerce web application created exclusively for educational purposes in connection with a college Google Ads marketing campaign study.
        </p>

        <h2 className="text-base font-bold text-slate-900">1. Information We Do NOT Collect</h2>
        <p>
          We do not collect, process, or transmit real credit/debit card numbers, CVVs, net banking passwords, UPI PINs, or biometric credentials. No payment gateways are integrated into this website.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Local Browser Storage</h2>
        <p>
          To enable shopping cart persistence and event count tracking on the Campaign Demo Dashboard, this website stores lightweight mock identifiers in your local browser storage (<code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">localStorage</code>). No telemetry is sent to advertising networks without user consent.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Project Ownership</h2>
        <p>
          All product names, clothing images, and prices are sample demo data used for academic presentation.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 5. ABOUT US PAGE
// ==========================================
export const AboutView: React.FC<{ onNavigateToShop: () => void }> = ({ onNavigateToShop }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
          About Neev Fashion Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
          Your Style, Your Choice.
        </h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Neev Fashion Hub is an online everyday clothing brand delivering affordable, stylish, and high-quality T-shirts, shirts, and jeans tailored for Indian men and women.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black">
            01
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Everyday Indian Apparel</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Curated 30-item core collection spanning breathable cotton T-shirts, smart shirts, and durable denim tailored for Indian weather and lifestyle.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
            02
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Real E-Commerce Flow</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every step of the customer journey is fully interactive: product discovery, filtering, size/color validation, cart drawer, and seamless checkout.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            03
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Quality & Comfort First</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every garment features bio-washed 100% combed cotton, reinforced seams, and power-flex denim engineered for daily Indian comfort.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-white">Experience the Demo Shopping Journey</h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore all 30 products and test the checkout funnel</p>
        </div>
        <button
          onClick={onNavigateToShop}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors whitespace-nowrap"
        >
          Shop The Collection
        </button>
      </div>
    </div>
  );
};
