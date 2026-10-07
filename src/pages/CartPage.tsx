import React from 'react';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DeliveryArea } from '../types';

interface CartPageProps {
  navigate: (route: string) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate, onOpenLightbox }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryArea,
    setDeliveryArea,
    deliveryCharge,
    voucherDiscount,
    grandTotal
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#F3EDE2] text-[#0E7490] rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
          🛍️
        </div>
        <div className="space-y-2">
          <h2 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Discover exquisite handcrafted sarees, festive suits, and tailored Egyptian cotton panjabis from SAMIA’S CLOSET.
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D9] gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">Review Items</span>
          <h1 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="text-xs font-bold text-[#0E7490] hover:text-[#0891B2] flex items-center gap-1.5 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              {/* Product Info with Image */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenLightbox(item.image, item.name)}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-200 cursor-zoom-in"
                  title="Click to view full photo"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </button>

                <div className="space-y-1">
                  <h3 className="font-brand text-sm sm:text-base font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                      Size: {item.size}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                      Color: {item.color}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-[#0E7490]">
                    ৳{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls and Remove */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-900 bg-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-bold text-gray-900">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  aria-label="Remove item"
                  title="Remove from bag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] text-xs text-[#78716C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0E7490] shrink-0" />
            <span>
              Your bag persists safely across page refreshes. Items remain saved until you complete checkout.
            </span>
          </div>
        </div>

        {/* Order Summary & Destination */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-md space-y-6">
          <h3 className="font-brand text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Summary &amp; Delivery
          </h3>

          {/* Delivery Region Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Delivery Destination:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryArea('Moulvibazar')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  deliveryArea === 'Moulvibazar'
                    ? 'border-[#0E7490] bg-[#0E7490]/10 text-[#0E7490]'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div>Moulvibazar</div>
                <div className="text-[11px] font-normal text-gray-500">৳50 charge</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryArea('Outside Moulvibazar')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  deliveryArea === 'Outside Moulvibazar'
                    ? 'border-[#0E7490] bg-[#0E7490]/10 text-[#0E7490]'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div>Outside Moulvibazar</div>
                <div className="text-[11px] font-normal text-gray-500">৳150 charge</div>
              </button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5 text-xs border-t border-b border-gray-100 py-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
            </div>

            {voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Voucher Discount:</span>
                <span className="font-bold">-৳{voucherDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge ({deliveryArea}):</span>
              <span className="font-semibold text-gray-900">৳{deliveryCharge}</span>
            </div>

            <div className="pt-2 flex justify-between text-base font-bold text-gray-900 border-t border-gray-100">
              <span>Grand Total:</span>
              <span className="text-[#0E7490] text-lg">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Proceed to Checkout button */}
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
