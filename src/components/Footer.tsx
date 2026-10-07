import React from 'react';
import { Phone, MessageCircle, MapPin, Shield, CheckCircle2, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#1C1917] text-[#E7E5E4] pt-16 pb-10 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#292524]">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#292524]/60 border border-[#44403C]/40">
            <div className="w-12 h-12 rounded-full bg-[#0E7490]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Owner Verified Authenticity</h4>
              <p className="text-xs text-[#A8A29E] mt-0.5">Every piece quality-checked directly by Md. Humaun Husen Rahi.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#292524]/60 border border-[#44403C]/40">
            <div className="w-12 h-12 rounded-full bg-[#D97706]/20 text-[#FBBF24] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Fair & Reliable Delivery</h4>
              <p className="text-xs text-[#A8A29E] mt-0.5">Moulvibazar: ৳50 &bull; Outside Moulvibazar: ৳150 nationwide.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#292524]/60 border border-[#44403C]/40">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#34D399] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Direct Contact with Rahi</h4>
              <p className="text-xs text-[#A8A29E] mt-0.5">WhatsApp hotline 01834012069 for sizing & order support.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div>
              <BrandLogo variant="light" size="md" />
            </div>
            <p className="text-xs leading-relaxed text-[#A8A29E]">
              Dedicated to bespoke tailoring, luxurious modest wear, and premium festive clothing for the entire family.
            </p>
            <div className="pt-2 text-xs text-[#E7E5E4] space-y-1">
              <p className="font-semibold text-white">Owner: <span className="text-[#38BDF8]">Md. Humaun Husen Rahi</span></p>
              <p className="text-[#A8A29E]">Moulvibazar, Sylhet, Bangladesh</p>
            </div>
          </div>

          {/* Customer Navigation */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#44403C] pb-2">
              Collections & Shopping
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A29E]">
              <li>
                <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">
                  Women’s Festive & Silk Suits
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">
                  Boys & Men’s Premium Panjabis
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cart')} className="hover:text-white transition-colors">
                  My Shopping Bag
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/orders')} className="hover:text-white transition-colors">
                  Track Orders (📦 Orders)
                </button>
              </li>
            </ul>
          </div>

          {/* Rewards & Vouchers */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#44403C] pb-2">
              Exclusive Rewards
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A29E]">
              <li>
                <button onClick={() => navigate('/rewards')} className="hover:text-white transition-colors">
                  Daily Business Quiz (Win ৳2)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/rewards')} className="hover:text-white transition-colors">
                  Weekly Mystery Box (Up to ৳80)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/rewards')} className="hover:text-white transition-colors">
                  Streak Program (20 Streak Gift)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/account')} className="hover:text-white transition-colors">
                  Voucher Wallet
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/story')} className="hover:text-white transition-colors">
                  Our Brand Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels & Direct Contact */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#44403C] pb-2">
              Direct Contact with Rahi
            </h5>
            
            <div className="space-y-3">
              <a
                href="https://wa.me/8801834012069"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0E7490] hover:bg-[#0891B2] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: 01834012069</span>
              </a>

              <div className="text-xs text-[#A8A29E] space-y-1 pt-1">
                <p>Payment Hotline (bKash/Nagad):</p>
                <p className="font-mono font-bold text-[#FDE047]">01314652599</p>
              </div>

              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-[#78716C] mb-2 font-semibold">
                  Official Social Channels
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/share/1DxQzbBqLc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded bg-[#292524] hover:bg-[#44403C] text-xs text-white transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/shop.with.samia?stkn=MWVtem5jdzJoNnNpyMw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded bg-[#292524] hover:bg-[#44403C] text-xs text-white transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@shop.with.samia?_r=1&_t=ZS-9A8d6CHf0a6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded bg-[#292524] hover:bg-[#44403C] text-xs text-white transition-colors"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#292524] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© {new Date().getFullYear()} SAMIA’S CLOSET. All Rights Reserved. Owner: Md. Humaun Husen Rahi.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/story')} className="hover:text-white">Brand Story</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white">Contact</button>
            <span className="text-[#A8A29E] flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Moulvibazar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
