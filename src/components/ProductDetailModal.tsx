import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: (product: Product, size: string, color: string, quantity: number) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderNow,
  onOpenLightbox
}) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: product.stock
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    onOrderNow(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black shadow-md transition-all focus:outline-none"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image with Lightbox link */}
          <div className="bg-[#FAF7F2] p-6 flex flex-col items-center justify-center relative group">
            <div
              className="relative w-full aspect-3/4 rounded-xl overflow-hidden cursor-zoom-in shadow-xs"
              onClick={() => onOpenLightbox(product.image, product.name)}
              title="Click to view full image in lightbox"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-3 right-3 text-[11px] bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
                🔍 Click image to enlarge
              </span>
            </div>

            <span className="mt-3 text-xs text-[#78716C]">
              Category: <strong className="text-[#0E7490]">{product.category}</strong>
            </span>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                  {product.category} Collection
                </span>
                {product.stock > 0 ? (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ● In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    ● Out of Stock
                  </span>
                )}
              </div>

              <h2 className="font-brand text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                {product.name}
              </h2>

              <div className="mt-2 text-2xl font-bold text-[#0E7490]">
                ৳{product.price.toLocaleString()}
              </div>

              <div className="mt-4 border-t border-b border-gray-100 py-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed max-h-32 overflow-y-auto pr-2">
                  {product.description}
                </p>
              </div>

              {/* Size selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Size: <span className="text-[#0E7490]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === sz
                            ? 'bg-[#0E7490] text-white border-[#0E7490] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Color: <span className="text-[#0E7490]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setSelectedColor(clr)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedColor === clr
                            ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-semibold text-gray-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Toast */}
            {addedToast && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to your Bag! It will stay there until checkout.</span>
              </div>
            )}

            {/* Action Buttons: Add to Bag & Order Now */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="w-full py-3 px-4 rounded-xl border-2 border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490]/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3 px-4 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
