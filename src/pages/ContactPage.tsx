import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Copy, Check, Share2, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [copiedPayment, setCopiedPayment] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleCopyPayment = () => {
    navigator.clipboard.writeText('01314652599');
    setCopiedPayment(true);
    setTimeout(() => setCopiedPayment(false), 2000);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText('01834012069');
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
          PERSONAL CUSTOMER CARE
        </span>
        <h1 className="font-brand text-3xl sm:text-4xl font-bold text-gray-900">
          Direct Contact with Rahi
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Reach out directly to owner <strong>Md. Humaun Husen Rahi</strong> for sizing recommendations, order tracking, bulk celebratory bookings, and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Contact Cards */}
        <div className="space-y-4">
          
          {/* WhatsApp Direct */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0E7490]/10 text-[#0E7490] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-brand text-lg font-bold text-gray-900">
                  Direct WhatsApp Support
                </h3>
                <p className="text-xs text-gray-500">Fastest response for sizing &amp; orders</p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 block">WhatsApp Number:</span>
                <span className="font-mono font-bold text-base text-[#0E7490]">01834012069</span>
              </div>
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:border-[#0E7490] flex items-center gap-1 shadow-2xs"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span>{copiedWhatsApp ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <a
              href="https://wa.me/8801834012069"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Conversation Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-brand text-lg font-bold text-gray-900">
                  Payment Account
                </h3>
                <p className="text-xs text-gray-500">Official bKash &amp; Nagad Send Money</p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 block">Payment Number:</span>
                <span className="font-mono font-bold text-base text-gray-900">01314652599</span>
              </div>
              <button
                type="button"
                onClick={handleCopyPayment}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:border-[#D97706] flex items-center gap-1 shadow-2xs"
              >
                {copiedPayment ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span>{copiedPayment ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              Accepted: Cash on Delivery, bKash Send Money, Nagad Send Money.
            </p>
          </div>

        </div>

        {/* Business Details & Official Social Accounts */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            <h3 className="font-brand text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Store Credentials
            </h3>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium">Business Name:</span>
                <span className="font-bold text-gray-900">SAMIA’S CLOSET</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium">Owner &amp; Manager:</span>
                <span className="font-bold text-[#0E7490]">Md. Humaun Husen Rahi</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium">Authorized Email:</span>
                <span className="font-mono text-gray-900">rahihumaun369@gmail.com</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium">Origin Location:</span>
                <span className="font-bold text-gray-900">Moulvibazar, Sylhet, Bangladesh</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium">Delivery Speed:</span>
                <span className="font-bold text-gray-900">24-48 Hours within Sylhet Division</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Delivery Charges:</span>
                <span className="font-bold text-gray-900">Moulvibazar ৳50 &bull; Outside ৳150</span>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="font-brand text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#0E7490]" />
              <span>Official Social Media</span>
            </h3>

            <div className="space-y-3">
              <a
                href="https://www.facebook.com/share/1DxQzbBqLc/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-gray-200 hover:border-[#1877F2] hover:bg-blue-50/50 flex items-center justify-between text-xs font-bold text-gray-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center font-bold">f</span>
                  <span>Facebook Official Page</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#1877F2]" />
              </a>

              <a
                href="https://www.instagram.com/shop.with.samia?stkn=MWVtem5jdzJoNnNpyMw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-gray-200 hover:border-[#E1306C] hover:bg-pink-50/50 flex items-center justify-between text-xs font-bold text-gray-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center font-bold">IG</span>
                  <span>Instagram (@shop.with.samia)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#E1306C]" />
              </a>

              <a
                href="https://www.tiktok.com/@shop.with.samia?_r=1&_t=ZS-9A8d6CHf0a6"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-100 flex items-center justify-between text-xs font-bold text-gray-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">TK</span>
                  <span>TikTok Official Account</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
