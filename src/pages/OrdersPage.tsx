import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';

interface OrdersPageProps {
  navigate: (route: string) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, onOpenLightbox }) => {
  const { user, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = orderService.subscribeToCustomerOrders(user.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#F3EDE2] text-[#0E7490] rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
          📦
        </div>
        <div className="space-y-2">
          <h2 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900">
            View Your Orders
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Please sign in to your customer account to view your past and active orders sent to Md. Humaun Husen Rahi.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-8 py-3.5 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Access Orders</span>
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
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">Purchase Records</span>
          <h1 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            📦 Customer Order History
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time status updates directly from Firestore. Orders persist indefinitely.
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="px-5 py-2.5 rounded-xl border border-gray-300 hover:border-[#0E7490] text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#0E7490] transition-colors"
        >
          Explore More Products
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0E7490] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gray-500">Loading your purchase history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 space-y-4 max-w-xl mx-auto">
          <p className="text-4xl">🛍️</p>
          <h3 className="font-brand text-xl font-bold text-gray-800">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            You haven't placed an order yet. Select from our beautiful women and boys/men fashion collections to place your first order!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 rounded-xl bg-[#0E7490] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 mt-2 shadow-sm"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#CBD5E1] shadow-xs overflow-hidden transition-all hover:shadow-md"
            >
              {/* Order Header Card */}
              <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500">Order ID:</span>
                    <span className="font-mono font-bold text-sm text-[#0E7490]">{order.orderId}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Total Amount:</span>
                    <span className="text-base font-extrabold text-gray-900">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => onOpenLightbox(item.image, item.name)}
                        className="w-14 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200 cursor-zoom-in"
                        title="Click to zoom image"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                        />
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          {item.size} &bull; {item.color}
                        </p>
                        <p className="text-xs font-bold text-[#0E7490] mt-0.5">
                          ৳{item.price.toLocaleString()} &times; {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Metadata Footer */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-3">
                  <div>
                    <span>Delivery: </span>
                    <strong className="text-gray-900">{order.area}</strong> (Charge: ৳{order.deliveryCharge})
                  </div>
                  <div>
                    <span>Payment: </span>
                    <strong className="text-gray-900">{order.paymentMethod}</strong>
                    {order.transactionId && (
                      <span className="font-mono text-gray-500 ml-1">
                        (TrxID: {order.transactionId})
                      </span>
                    )}
                  </div>
                  {order.discount > 0 && (
                    <div className="text-emerald-700 font-bold">
                      Voucher Savings: ৳{order.discount}
                    </div>
                  )}
                  <div className="text-gray-500">
                    Recipient: <strong className="text-gray-800">{order.customerName}</strong> ({order.phone})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
