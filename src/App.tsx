import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { RewardsPage } from './pages/RewardsPage';
import { AccountPage } from './pages/AccountPage';
import { StoryPage } from './pages/StoryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { productService } from './services/productService';
import { testFirestoreConnection } from './firebase/config';
import { Product } from './types';

function MainApp() {
  // Direct client-side route tracking with popstate support
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  // Modal states
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: ''
  });

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Subscribe to products & test connection
  useEffect(() => {
    testFirestoreConnection().catch((err) => console.warn('Firestore test:', err));

    const unsubscribe = productService.subscribeToProducts((list) => {
      setProducts(list);
    });

    return () => unsubscribe();
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Image lightbox handler: CRITICAL - Clicking image MUST ONLY open full lightbox
  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightboxData({
      isOpen: true,
      imageUrl,
      title
    });
  };

  // View details handler
  const handleViewDetails = (product: Product) => {
    setDetailProduct(product);
  };

  // Direct "Order Now" action
  const handleOrderNow = (product: Product, size?: string, color?: string, qty: number = 1) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size || product.sizes?.[0] || 'Standard',
      color: color || product.colors?.[0] || 'Standard',
      quantity: qty,
      maxStock: product.stock
    });
    setDetailProduct(null);
    navigate('/checkout');
  };

  // Render current page
  const renderPage = () => {
    switch (currentRoute) {
      case '/':
        return (
          <HomePage
            products={products}
            navigate={navigate}
            onOpenLightbox={handleOpenLightbox}
            onViewDetails={handleViewDetails}
            onOrderNow={handleOrderNow}
          />
        );
      case '/products':
        return (
          <ProductsPage
            products={products}
            onOpenLightbox={handleOpenLightbox}
            onViewDetails={handleViewDetails}
            onOrderNow={handleOrderNow}
          />
        );
      case '/cart':
        return <CartPage navigate={navigate} onOpenLightbox={handleOpenLightbox} />;
      case '/checkout':
        return <CheckoutPage navigate={navigate} />;
      case '/orders':
        return <OrdersPage navigate={navigate} onOpenLightbox={handleOpenLightbox} />;
      case '/rewards':
        return <RewardsPage navigate={navigate} />;
      case '/account':
        return <AccountPage navigate={navigate} />;
      case '/story':
        return <StoryPage navigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/admin':
        return <AdminPage />;
      default:
        return (
          <HomePage
            products={products}
            navigate={navigate}
            onOpenLightbox={handleOpenLightbox}
            onViewDetails={handleViewDetails}
            onOrderNow={handleOrderNow}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] text-[#222120]">
      {/* Header with ☰ Menu, 📦 Orders, Bag, and Logo */}
      <Header currentRoute={currentRoute} navigate={navigate} />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Global Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData({ isOpen: false, imageUrl: '', title: '' })}
        imageUrl={lightboxData.imageUrl}
        title={lightboxData.title}
      />

      {/* Global Product Details Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={detailProduct !== null}
        onClose={() => setDetailProduct(null)}
        onOrderNow={(prod, size, color, qty) => handleOrderNow(prod, size, color, qty)}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
