import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck, Gift, MessageCircle, Copy, Check } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  navigate: (route: string) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onViewDetails: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  navigate,
  onOpenLightbox,
  onViewDetails,
  onOrderNow
}) => {
  const [copiedNumber, setCopiedNumber] = React.useState(false);

  const handleCopyPayment = () => {
    navigator.clipboard.writeText('01314652599');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const womenProducts = products.filter((p) => p.category === 'Women' && p.visibility);
  const menProducts = products.filter((p) => p.category === 'Boys/Men' && p.visibility);
  const featuredProducts = products.filter((p) => p.visibility).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION: Light, Premium, Champagne & Soft Teal */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F4EE] via-[#FAF8F5] to-[#FCFAF7] border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2.5 p-1 pr-3.5 rounded-full bg-white border border-[#E8E2D9] shadow-2xs">
                  <img
                    src="/logo.jpg"
                    alt="SAMIA'S CLOSET"
                    className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
                  />
                  <span className="text-xs font-bold text-[#1C1917]">
                    Official Store &bull; Md. Humaun Husen Rahi
                  </span>
                </div>
              </div>

              <h1 className="font-brand text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] leading-[1.15]">
                Timeless Elegance For{' '}
                <span className="text-[#0E7490] underline decoration-[#F59E0B]/50 decoration-wavy decoration-2">
                  Women
                </span>{' '}
                &amp;{' '}
                <span className="text-[#B45309]">
                  Boys / Men
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience bespoke heritage styling, hand-finished embroidery, Dhakai muslins, and sharp celebratory panjabis. Direct contact with Rahi guarantees peerless fabric authenticity and personalized service.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-7 py-3.5 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/rewards')}
                  className="px-6 py-3.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[#FCD34D] transition-all"
                >
                  <Gift className="w-4 h-4 text-[#D97706]" />
                  <span>Daily Quiz &amp; Vouchers</span>
                </button>
              </div>

              {/* Delivery highlights */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#E8E2D9] max-w-lg mx-auto lg:mx-0 text-left">
                <div className="p-2.5 rounded-lg bg-white/70 border border-[#E8E2D9]">
                  <p className="text-[11px] font-bold text-gray-800">Moulvibazar</p>
                  <p className="text-xs font-extrabold text-[#0E7490]">৳50 Delivery</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/70 border border-[#E8E2D9]">
                  <p className="text-[11px] font-bold text-gray-800">All Bangladesh</p>
                  <p className="text-xs font-extrabold text-[#0E7490]">৳150 Delivery</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/70 border border-[#E8E2D9] col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-bold text-gray-800">Direct Contact</p>
                  <p className="text-xs font-extrabold text-[#D97706]">With Rahi</p>
                </div>
              </div>
            </div>

            {/* Right Visual Grid: Women + Boys/Men both represented */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-3/4 cursor-zoom-in relative group"
                  onClick={() =>
                    onOpenLightbox(
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                      'Festive Georgette Anarkali Suit'
                    )
                  }
                >
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                    alt="Women Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/75 to-transparent text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FDE047]">Women’s Line</span>
                    <p className="text-xs font-semibold leading-tight">Festive Anarkali &amp; Silks</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-bold">Guaranteed</span>
                  <p className="text-xs font-extrabold text-[#0E7490] mt-0.5">100% Quality Inspected</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-4 rounded-xl bg-[#0E7490] text-white shadow-xs text-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#BAE6FD] font-bold">New Arrival</span>
                  <p className="text-xs font-extrabold mt-0.5">Heritage Cotton Panjabis</p>
                </div>

                <div
                  className="rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-3/4 cursor-zoom-in relative group"
                  onClick={() =>
                    onOpenLightbox(
                      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
                      'Executive Egyptian Cotton Panjabi'
                    )
                  }
                >
                  <img
                    src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
                    alt="Boys and Men Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/75 to-transparent text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BAE6FD]">Boys &amp; Men</span>
                    <p className="text-xs font-semibold leading-tight">Egyptian Cotton Panjabis</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WOMEN COLLECTION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">Curated Elegance</span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Women’s Festive &amp; Silk Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1">
              Hand-worked Anarkalis, pure Dhakai muslins, velvet shawls, and regal kurti sets.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-bold text-[#0E7490] hover:text-[#0891B2] flex items-center gap-1.5 uppercase tracking-wider shrink-0"
          >
            <span>View All Women ({womenProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {womenProducts.slice(0, 3).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenLightbox={onOpenLightbox}
              onViewDetails={onViewDetails}
              onOrderNow={onOrderNow}
            />
          ))}
        </div>
      </section>

      {/* 3. BOYS & MEN COLLECTION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">Refined Heritage</span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Boys &amp; Men’s Festive Panjabis
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1">
              Tailored Egyptian cottons, raw silk celebratory attire, linen kurtas, and festive sets for young boys.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-bold text-[#B45309] hover:text-[#92400E] flex items-center gap-1.5 uppercase tracking-wider shrink-0"
          >
            <span>View All Boys/Men ({menProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menProducts.slice(0, 3).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenLightbox={onOpenLightbox}
              onViewDetails={onViewDetails}
              onOrderNow={onOrderNow}
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">Handpicked Selections</span>
          <h2 className="font-brand text-2xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Featured Best-Sellers
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-2">
            Each product is physically authenticated and inspected before dispatch. Click image for full view, or click Details for sizes and fabric specs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenLightbox={onOpenLightbox}
              onViewDetails={onViewDetails}
              onOrderNow={onOrderNow}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 rounded-xl bg-white border-2 border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            Browse Full Catalog ({products.length} Items)
          </button>
        </div>
      </section>

      {/* 5. OFFERS & REWARDS TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0E7490] via-[#155E75] to-[#0891B2] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-widest">
                Interactive Rewards System
              </span>
              <h3 className="font-brand text-2xl sm:text-4xl font-bold">
                Win Real Vouchers With Our Daily Fashion Quiz &amp; Weekly Mystery Box
              </h3>
              <p className="text-xs sm:text-sm text-cyan-100 max-w-xl leading-relaxed">
                Test your fabric and business knowledge to earn ৳2 vouchers daily, open the weekly Mystery Box for rewards up to ৳80, and unlock special gifts at 20 purchase streak!
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/rewards')}
                  className="px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Play Daily Quiz &amp; Open Box</span>
                </button>
                <button
                  onClick={() => navigate('/account')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/30 transition-all"
                >
                  View Voucher Wallet
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-3">
              <div className="text-3xl">🎁</div>
              <h4 className="font-brand text-lg font-bold">Voucher Rules</h4>
              <ul className="text-xs text-cyan-100 text-left space-y-2">
                <li>&bull; Up to 3 vouchers per order</li>
                <li>&bull; ৳20–৳80: Max 1 use</li>
                <li>&bull; ৳1–৳19: Max 3 uses</li>
                <li>&bull; 1-month inactivity expiry enforced</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BRAND STORY & CRAFTSMANSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#E8E2D9]">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
              The Founder’s Philosophy
            </span>
            <h3 className="font-brand text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Crafted With Passion by Md. Humaun Husen Rahi
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              At SAMIA’S CLOSET, fashion is not mass manufactured; it is curated with integrity. Headquartered in Moulvibazar, Sylhet, owner Md. Humaun Husen Rahi personally sources fabric loomed in traditional heritage hubs.
            </p>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              From hand-embroidered Anarkalis with intricate zardozi needlework to breathable Egyptian cotton panjabis for men and young boys, our garments stand the test of time and celebratory elegance.
            </p>
            <div>
              <button
                onClick={() => navigate('/story')}
                className="px-6 py-3 rounded-xl bg-[#1C1917] hover:bg-[#292524] text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Read Our Story
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
              alt="Silk fabric craftsmanship"
              className="rounded-2xl object-cover h-64 w-full shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
              alt="Panjabi stitching craftsmanship"
              className="rounded-2xl object-cover h-64 w-full shadow-md mt-6"
            />
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TRUST & DIRECT CONTACT WITH RAHI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#CBD5E1] rounded-3xl p-8 sm:p-12 bg-white shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
                Customer Assurance
              </span>
              <h3 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900">
                Direct Contact with Rahi
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Have questions regarding fabric GSM, color matching, size measurements, or customized wedding packages? Reach out directly to owner Md. Humaun Husen Rahi on WhatsApp or call our hotline.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/8801834012069"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp 01834012069</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyPayment}
                  className="px-5 py-3 rounded-xl border border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-800 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  {copiedNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  <span>{copiedNumber ? 'Number Copied!' : 'Copy Payment (01314652599)'}</span>
                </button>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E2D9] space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm">Official Business Credentials</h4>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-medium">Business:</span>
                  <span className="font-bold text-gray-900">SAMIA’S CLOSET</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-medium">Owner:</span>
                  <span className="font-bold text-[#0E7490]">Md. Humaun Husen Rahi</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-medium">Location:</span>
                  <span className="font-bold text-gray-900">Moulvibazar, Sylhet</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-medium">Delivery:</span>
                  <span className="font-bold text-gray-900">Moulvibazar ৳50 &bull; Outside ৳150</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Methods:</span>
                  <span className="font-bold text-gray-900">Cash on Delivery, bKash, Nagad</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
