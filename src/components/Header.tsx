import React, { useState } from 'react';
import { ShoppingBag, User, LogIn, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemCount } = useCart();
  const { user, profile, isAdmin, openAuthModal } = useAuth();

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#E8E2D9] transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#0E7490] text-white text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#FDE047] animate-pulse" />
        <span>Owner: Md. Humaun Husen Rahi &bull; Moulvibazar Delivery ৳50 &bull; All Bangladesh ৳150</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Mobile ☰ Menu button & Desktop Navigation */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-[#1E293B] hover:bg-[#F3EDE2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
              aria-label="Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <span className="text-2xl font-light leading-none select-none">☰</span>
              )}
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-medium tracking-wide">
              <button
                onClick={() => handleNav('/')}
                className={`transition-colors py-1 hover:text-[#0E7490] ${
                  currentRoute === '/' ? 'text-[#0E7490] border-b-2 border-[#0E7490]' : 'text-[#475569]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNav('/products')}
                className={`transition-colors py-1 hover:text-[#0E7490] ${
                  currentRoute === '/products' ? 'text-[#0E7490] border-b-2 border-[#0E7490]' : 'text-[#475569]'
                }`}
              >
                Collections
              </button>
              <button
                onClick={() => handleNav('/rewards')}
                className={`transition-colors py-1 hover:text-[#0E7490] flex items-center gap-1.5 ${
                  currentRoute === '/rewards' ? 'text-[#0E7490] border-b-2 border-[#0E7490]' : 'text-[#475569]'
                }`}
              >
                <span>Rewards</span>
                <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] font-bold px-1.5 py-0.5 rounded-full border border-[#FDE68A]">
                  Quiz & Box
                </span>
              </button>
              <button
                onClick={() => handleNav('/story')}
                className={`transition-colors py-1 hover:text-[#0E7490] ${
                  currentRoute === '/story' ? 'text-[#0E7490] border-b-2 border-[#0E7490]' : 'text-[#475569]'
                }`}
              >
                Our Story
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className={`transition-colors py-1 hover:text-[#0E7490] ${
                  currentRoute === '/contact' ? 'text-[#0E7490] border-b-2 border-[#0E7490]' : 'text-[#475569]'
                }`}
              >
                Direct Contact
              </button>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 text-center md:flex-initial">
            <button
              onClick={() => handleNav('/')}
              className="group inline-block focus:outline-none"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Right: Directly Visible Orders, Cart, Account */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Directly visible 📦 Orders button as required */}
            <button
              onClick={() => handleNav('/orders')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentRoute === '/orders'
                  ? 'bg-[#0E7490] text-white shadow-sm'
                  : 'bg-[#F4EFE6] text-[#1E293B] hover:bg-[#EAE2D5]'
              }`}
              title="View your orders"
            >
              <span className="text-base">📦</span>
              <span className="hidden sm:inline">Orders</span>
            </button>

            {/* Cart / Bag with Badge */}
            <button
              onClick={() => handleNav('/cart')}
              className="relative p-2.5 rounded-lg text-[#1E293B] hover:bg-[#F3EDE2] transition-colors focus:outline-none"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#0E7490]" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D97706] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Account / Auth */}
            {user ? (
              <button
                onClick={() => handleNav('/account')}
                className={`p-2 rounded-lg flex items-center gap-2 hover:bg-[#F3EDE2] transition-colors ${
                  currentRoute === '/account' ? 'text-[#0E7490] ring-1 ring-[#0E7490]' : 'text-[#334155]'
                }`}
                title="Customer Account"
              >
                <div className="w-8 h-8 rounded-full bg-[#0E7490]/10 text-[#0E7490] flex items-center justify-center font-bold text-xs uppercase">
                  {(profile?.displayName || user.displayName || user.email || 'U')[0]}
                </div>
                <span className="hidden lg:inline text-xs font-semibold max-w-[90px] truncate text-left">
                  {profile?.displayName || 'My Account'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4 text-[#0E7490]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Admin icon link (only if authenticated admin) */}
            {isAdmin && (
              <button
                onClick={() => handleNav('/admin')}
                className="p-2 rounded-lg bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] transition-colors"
                title="Admin Control Center"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCFAF7] border-b border-[#E8E2D9] px-5 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNav('/')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNav('/products')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/products' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              👗 All Products
            </button>
            <button
              onClick={() => handleNav('/rewards')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/rewards' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              🎁 Rewards & Quiz
            </button>
            <button
              onClick={() => handleNav('/cart')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/cart' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              🛍️ Bag ({totalItemCount})
            </button>
            <button
              onClick={() => handleNav('/orders')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/orders' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              📦 My Orders
            </button>
            <button
              onClick={() => handleNav('/account')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/account' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              👤 My Account
            </button>
            <button
              onClick={() => handleNav('/story')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/story' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              📖 Our Story
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`p-3 rounded-xl text-left ${currentRoute === '/contact' ? 'bg-[#0E7490] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155]'}`}
            >
              📞 Direct Contact
            </button>
          </div>

          {isAdmin && (
            <div className="pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => handleNav('/admin')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FEF3C7] text-[#92400E] font-semibold text-sm flex items-center justify-center gap-2 border border-[#FDE68A]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Panel</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs text-[#64748B]">
            <span>Owner: <strong className="text-[#0E7490]">Md. Humaun Husen Rahi</strong></span>
            <span>Moulvibazar, Bangladesh</span>
          </div>
        </div>
      )}
    </header>
  );
};
