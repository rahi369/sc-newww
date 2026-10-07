import React from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface StoryPageProps {
  navigate: (route: string) => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
          HERITAGE &amp; PURPOSE
        </span>
        <h1 className="font-brand text-3xl sm:text-5xl font-bold text-gray-900">
          The Story Behind SAMIA’S CLOSET
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Founded and personally directed by <strong>Md. Humaun Husen Rahi</strong> in Moulvibazar, Sylhet.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-brand text-2xl font-bold text-gray-900">
              A Vision of Dignified Fashion
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              SAMIA’S CLOSET was born from a profound appreciation for South Asian textile heritage and modern modest elegance. Rather than relying on generic factory surplus, our founder, <strong>Md. Humaun Husen Rahi</strong>, established direct artisan channels with traditional master weavers.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every celebratory Anarkali suit, pure georgette party kurti, and tailored men’s Egyptian cotton panjabi is selected for its high GSM density, fastness of dye, and comfortable, timeless wearability.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md bg-[#1C1917] flex items-center justify-center p-3 border border-gray-200">
            <img
              src="/logo.jpg"
              alt="SAMIA'S CLOSET Official Logo"
              className="w-full h-80 object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-2">
            <span className="text-2xl">🌿</span>
            <h3 className="font-brand text-sm font-bold text-gray-900">Authentic Material Sourcing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Dhakai muslin, Mulberry silk, micro-velvet, and long-staple combed cotton free from synthetic degradation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-2">
            <span className="text-2xl">✂️</span>
            <h3 className="font-brand text-sm font-bold text-gray-900">Equal Balance: Women &amp; Men</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Equal dedication to opulent women’s three-pieces and sharp, comfortable festive panjabis for boys and men.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-2">
            <span className="text-2xl">🤝</span>
            <h3 className="font-brand text-sm font-bold text-gray-900">Personalized Ownership</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Zero impersonal call centers. Customers enjoy direct WhatsApp support and guidance from Rahi himself.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all"
          >
            <span>Explore the Curated Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
