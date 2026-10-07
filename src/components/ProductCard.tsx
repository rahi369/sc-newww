import React from 'react';
import { Eye, ShoppingCart, ZoomIn } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onViewDetails: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenLightbox,
  onViewDetails,
  onOrderNow,
}) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E9E4DC] hover:border-[#CBD5E1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* 
        IMAGE CONTAINER
        CRITICAL RULE: Clicking the image MUST ONLY open the lightbox, NOT details!
      */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#F7F4EE]">
        <button
          type="button"
          onClick={() => onOpenLightbox(product.image, product.name)}
          className="w-full h-full block focus:outline-none cursor-zoom-in relative group/img"
          aria-label={`Open full size photo of ${product.name}`}
          title="Click to view full image in lightbox"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
            <span className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
              <ZoomIn className="w-3.5 h-3.5 text-[#0E7490]" />
              <span>Full Photo</span>
            </span>
          </div>
        </button>

        {/* Category & Stock Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-white/90 text-[#0E7490] shadow-xs backdrop-blur-xs">
            {product.category}
          </span>
          {product.stock <= 0 && (
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#8B5E3C] uppercase tracking-wider block mb-1">
            {product.category} Collection
          </span>
          
          <h3 className="font-brand text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-[#0E7490] transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-[#0E7490]">
              ৳{product.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* 
          BUTTONS SECTION
          1. VIEW DETAILS (separately opens product modal)
          2. ORDER NOW (direct purchase / checkout flow)
        */}
        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="w-full py-2.5 px-2 rounded-xl border border-[#CBD5E1] hover:border-[#0E7490] bg-[#FAF8F5] hover:bg-white text-gray-800 hover:text-[#0E7490] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="truncate">View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onOrderNow(product)}
            disabled={product.stock <= 0}
            className="w-full py-2.5 px-2 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="truncate">Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
