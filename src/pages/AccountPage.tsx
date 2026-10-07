import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Award, Wallet, Package, LogOut, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { rewardsService } from '../services/rewardsService';
import { Order, Voucher, RewardProfile } from '../types';

interface AccountPageProps {
  navigate: (route: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { user, profile, logout, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [rewardProfile, setRewardProfile] = useState<RewardProfile | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubOrders = orderService.subscribeToCustomerOrders(user.uid, setOrders);
    const unsubVouchers = rewardsService.subscribeToCustomerVouchers(user.uid, setVouchers);
    const unsubProfile = rewardsService.subscribeToRewardProfile(user.uid, setRewardProfile);

    return () => {
      unsubOrders();
      unsubVouchers();
      unsubProfile();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#F3EDE2] text-[#0E7490] rounded-full flex items-center justify-center mx-auto text-3xl">
          👤
        </div>
        <div className="space-y-2">
          <h2 className="font-brand text-2xl font-bold text-gray-900">
            Sign In to Customer Account
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            View your customer code, past purchase records, streak points, and voucher balance.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-8 py-3.5 rounded-xl bg-[#0E7490] text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const activeVouchers = vouchers.filter((v) => v.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Account Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0E7490] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md">
            {(profile?.displayName || user.displayName || user.email || 'C')[0]}
          </div>

          <div className="space-y-1">
            <h1 className="font-brand text-2xl font-bold text-gray-900">
              {profile?.displayName || user.displayName || 'Customer'}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.email}</span>
            </p>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] font-mono font-bold text-[#0E7490]">
              <span>Customer ID: {profile?.customerCode || 'SC-ACTIVE'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="px-5 py-2.5 rounded-xl border border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{orders.length}</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-[11px] font-bold text-[#0E7490] hover:underline mt-2 block"
          >
            View Order History &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Vouchers</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{activeVouchers.length}</p>
          <button
            onClick={() => navigate('/rewards')}
            className="text-[11px] font-bold text-[#0E7490] hover:underline mt-2 block"
          >
            Open Voucher Wallet &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Streak</span>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{rewardProfile?.streak || 0}</p>
          <span className="text-[11px] text-gray-500 mt-2 block">
            Target: 20 orders for Special Gift
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Role</span>
          <p className="text-3xl font-extrabold text-gray-900 mt-1 capitalize">
            {profile?.role || 'Customer'}
          </p>
          <span className="text-[11px] text-gray-500 mt-2 block">
            Verified with Firebase Auth
          </span>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-brand text-lg font-bold text-gray-900">
            Recent Purchases
          </h3>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-bold text-[#0E7490] hover:underline uppercase tracking-wider"
          >
            All Orders ({orders.length}) &rarr;
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">No purchases made yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-gray-900">{o.orderId}</span>
                  <span className="text-gray-500 ml-2">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#0E7490]">৳{o.total.toLocaleString()}</span>
                  <span className="ml-3 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
