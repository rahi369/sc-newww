import React, { useState, useEffect } from 'react';
import { Copy, Check, ShieldCheck, AlertCircle, ShoppingBag, ArrowLeft, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { rewardsService } from '../services/rewardsService';
import { DeliveryArea, PaymentMethod, Voucher } from '../types';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  navigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const {
    items,
    subtotal,
    deliveryArea,
    setDeliveryArea,
    deliveryCharge,
    appliedVouchers,
    applyVoucher,
    removeVoucher,
    voucherDiscount,
    grandTotal,
    removeOrderedItems
  } = useCart();

  const { user, profile, openAuthModal } = useAuth();

  // Form fields
  const [customerName, setCustomerName] = useState(profile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');

  // States
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [voucherError, setVoucherError] = useState('');

  // Confirmed Order Success State
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Sync profile fields
  useEffect(() => {
    if (profile?.displayName && !customerName) {
      setCustomerName(profile.displayName);
    }
    if (profile?.phone && !phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

  // Load user's active vouchers from Firestore
  useEffect(() => {
    if (!user) return;
    const unsubscribe = rewardsService.subscribeToCustomerVouchers(user.uid, (vouchers) => {
      const active = vouchers.filter((v) => v.status === 'active' && v.usageCount < v.maxUsage);
      setAvailableVouchers(active);
    });
    return () => unsubscribe();
  }, [user]);

  const handleCopyPayment = () => {
    navigator.clipboard.writeText('01314652599');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleApplyVoucherClick = (v: Voucher) => {
    setVoucherError('');
    const res = applyVoucher(v);
    if (!res.success) {
      setVoucherError(res.message);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Must be logged in to securely save and attach order to customer
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid phone number for delivery confirmation.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Please provide your complete shipping address.');
      return;
    }

    if ((paymentMethod === 'bKash' || paymentMethod === 'Nagad') && !transactionId.trim()) {
      setErrorMessage(`Please provide the ${paymentMethod} Transaction ID after sending payment to 01314652599.`);
      return;
    }

    setSubmitting(true);

    try {
      const customerCode = profile?.customerCode || `SC-${Math.floor(100000 + Math.random() * 900000)}`;

      // Construct Order payload
      const orderPayload = {
        customerId: user.uid,
        customerCode,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        area: deliveryArea,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          image: i.image,
          size: i.size,
          color: i.color,
          quantity: i.quantity
        })),
        quantity: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal,
        discount: voucherDiscount,
        deliveryCharge,
        total: grandTotal,
        paymentMethod,
        transactionId: transactionId.trim() || undefined,
        appliedVoucherIds: appliedVouchers.map((v) => v.id)
      };

      // REAL FIRESTORE CALL: Save order to database
      const orderId = await orderService.createOrder(orderPayload);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }

      // Record ordered items IDs
      const orderedItemIds = items.map((i) => i.id);

      // Rule: "Only the successfully ordered products should be removed from the Bag. Products that were not ordered must remain in the Bag."
      removeOrderedItems(orderedItemIds);

      // Set confirmed order ID to show real success UI
      setConfirmedOrderId(orderId);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(
        err.message || 'We could not save your order. Please check your network connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS UI
  if (confirmedOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md border-4 border-emerald-50">
          🎉
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
            Order Confirmed by SAMIA’S CLOSET
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-bold text-gray-900">
            Congratulations! 🎉
          </h1>
          <p className="text-base font-semibold text-[#0E7490]">
            Your order has been sent to Rahi.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto pt-1 leading-relaxed">
            Md. Humaun Husen Rahi will inspect your requested garments and contact you on WhatsApp or phone for order verification before packaging.
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1] shadow-md text-left space-y-3 max-w-md mx-auto">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500 font-medium">Order Reference:</span>
            <span className="font-mono font-bold text-sm text-[#0E7490]">{confirmedOrderId}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500 font-medium">Initial Status:</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              ● Pending Review
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500 font-medium">Payment Mode:</span>
            <span className="text-xs font-bold text-gray-800">{paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Delivery Destination:</span>
            <span className="text-xs font-bold text-gray-800">{deliveryArea}</span>
          </div>
        </div>

        {/* Buttons Required by Prompt */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>VIEW ORDER HISTORY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-bold text-xs uppercase tracking-wider transition-all"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  // If bag is empty
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-4xl">🛍️</p>
        <h2 className="font-brand text-2xl font-bold text-gray-900">Your Bag is Empty</h2>
        <p className="text-xs text-gray-500">Please add items to your bag before checking out.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 rounded-xl bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">Secure Checkout</span>
          <h1 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Complete Your Fashion Order
          </h1>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bag</span>
        </button>
      </div>

      {/* Guest Login Banner */}
      {!user && (
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <h4 className="text-sm font-bold text-[#92400E]">Ordering as Guest?</h4>
              <p className="text-xs text-[#B45309]">
                Sign in with Google or Email to link this order to your streak, vouchers, and rewards wallet.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-5 py-2.5 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-xs"
          >
            Sign In Now
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Details Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-brand text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. Customer Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Farhana Ahmed"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number (WhatsApp / Active Mobile) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none bg-gray-50 focus:bg-white"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Owner Md. Humaun Husen Rahi will verify details on this number prior to dispatch.
              </p>
            </div>
          </div>

          {/* Delivery & Address Details Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-brand text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Delivery Address &amp; Region
            </h3>

            {/* Area Toggle */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Destination:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryArea('Moulvibazar')}
                  className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    deliveryArea === 'Moulvibazar'
                      ? 'border-[#0E7490] bg-[#0E7490]/10 text-[#0E7490] shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Moulvibazar</span>
                    <span className="text-xs font-extrabold text-[#0E7490]">৳50</span>
                  </div>
                  <p className="text-[11px] font-normal text-gray-500 mt-0.5">Local courier within town &amp; sadar</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryArea('Outside Moulvibazar')}
                  className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    deliveryArea === 'Outside Moulvibazar'
                      ? 'border-[#0E7490] bg-[#0E7490]/10 text-[#0E7490] shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Outside Moulvibazar</span>
                    <span className="text-xs font-extrabold text-[#0E7490]">৳150</span>
                  </div>
                  <p className="text-[11px] font-normal text-gray-500 mt-0.5">Nationwide home delivery (Sundarban/Steadfast)</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Street Address, House &amp; Landmark *
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Road #, Area/Village, Thana, District"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Details Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-brand text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              3. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#0E7490] bg-[#0E7490]/10 text-[#0E7490]'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                💵 Cash on Delivery
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-[#D12053] bg-[#D12053]/10 text-[#D12053]'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                📱 bKash Send Money
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#F1592A] bg-[#F1592A]/10 text-[#F1592A]'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                💳 Nagad Send Money
              </button>
            </div>

            {/* bKash / Nagad instructions with COPY button */}
            {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-3 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-700">Official Merchant/Send Money Number:</span>
                    <p className="font-mono text-base font-bold text-[#0E7490]">01314652599</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPayment}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:border-[#0E7490] text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                    <span>{copiedNumber ? 'Number Copied!' : 'COPY NUMBER'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Enter {paymentMethod} Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 9J4K2L8X"
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none bg-white font-mono"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Send exact grand total (৳{grandTotal.toLocaleString()}) to 01314652599, then paste TrxID here.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Voucher Wallet Integration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Vouchers Application Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-brand text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#D97706]" />
                <span>Voucher Wallet</span>
              </h3>
              <span className="text-[11px] font-semibold text-gray-500">
                Max 3 Vouchers per order
              </span>
            </div>

            {voucherError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                {voucherError}
              </p>
            )}

            {/* Currently Applied Vouchers */}
            {appliedVouchers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  Applied to this order ({appliedVouchers.length}/3):
                </span>
                {appliedVouchers.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"
                  >
                    <div>
                      <span className="font-bold">৳{v.amount} Voucher</span>
                      <span className="text-[10px] text-emerald-600 block capitalize">
                        Source: {v.source.replace('_', ' ')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVoucher(v.id)}
                      className="p-1 hover:bg-emerald-200 rounded text-emerald-700"
                      title="Remove voucher"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Vouchers to Apply */}
            {user ? (
              availableVouchers.length === 0 ? (
                <div className="p-3 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                  <span>No active vouchers available. </span>
                  <button
                    type="button"
                    onClick={() => navigate('/rewards')}
                    className="font-bold text-[#0E7490] hover:underline"
                  >
                    Play Daily Quiz &amp; Win ৳2!
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                    Available in your wallet:
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {availableVouchers
                      .filter((v) => !appliedVouchers.some((av) => av.id === v.id))
                      .map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-[#FAF8F5] text-xs hover:border-[#0E7490]"
                        >
                          <div>
                            <span className="font-bold text-gray-900">৳{v.amount} Discount</span>
                            <span className="text-[10px] text-gray-500 block">
                              {v.amount >= 20 ? 'One-time use voucher' : `Can use ${v.maxUsage - v.usageCount} more times`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyVoucherClick(v)}
                            className="px-3 py-1 rounded-lg bg-[#0E7490] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#0891B2]"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-[#0E7490] hover:underline"
                >
                  Sign in
                </button>{' '}
                to redeem your earned quiz and mystery box vouchers.
              </div>
            )}
          </div>

          {/* Items Summary & Financial Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-md space-y-4">
            <h3 className="font-brand text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Order Items ({items.length})
            </h3>

            <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded-md border border-gray-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {item.size} &bull; {item.color} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
              </div>

              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Voucher Savings:</span>
                  <span>-৳{voucherDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge ({deliveryArea}):</span>
                <span className="font-semibold text-gray-900">৳{deliveryCharge}</span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                <span>Grand Total:</span>
                <span className="text-[#0E7490] text-xl">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-4 px-4 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <span>CONFIRM &amp; PLACE ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-gray-500">
              By confirming, your order will be recorded in Firestore and delivered directly by Md. Humaun Husen Rahi.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
};
