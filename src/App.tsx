/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { TAROT_SPREADS, TarotSpread } from './data/tarotData';
import { PRODUCT_CATEGORIES, PRODUCTS_DATA, Product } from './data/productsData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ChooseSpread } from './components/ChooseSpread';
import { InteractiveReading } from './components/InteractiveReading';
import { ShopSection } from './components/ShopSection';
import { Testimonials } from './components/Testimonials';
import { JournalSection } from './components/JournalSection';
import { Footer } from './components/Footer';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { BookSessionModal } from './components/BookSessionModal';
import { WhatsAppShareWidget } from './components/WhatsAppShareWidget';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AuthLoading } from './components/AuthShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OfferingPage } from './components/OfferingPage';

const categoryFromPath = (pathname: string): string | null => {
  const match = pathname.match(/^\/shop\/([^/]+)\/?$/);
  if (!match) return null;
  return PRODUCT_CATEGORIES.some((category) => category.id === match[1]) ? match[1] : null;
};

const productFromPath = (pathname: string): string | null => {
  const match = pathname.match(/^\/product\/([^/]+)\/?$/);
  if (!match) return null;
  return PRODUCTS_DATA.some((product) => product.id === match[1]) ? match[1] : null;
};

function ExistingWebsite() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = categoryFromPath(location.pathname);
  const productId = productFromPath(location.pathname);
  const offeringMatch = location.pathname.match(/^\/guide\/(spreads|guidance|ethos)\/?$/);
  const offeringSlug = offeringMatch?.[1] ?? null;

  // Selected Spread for reading
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread>(TAROT_SPREADS[1]); // Past, Present, Future default
  
  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Book 1:1 Session Modal State
  const [isBookSessionOpen, setIsBookSessionOpen] = useState(false);

  // Audio ambient sound state
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const restoreScroll = () => window.scrollTo({ top: 0, behavior: 'auto' });
    window.addEventListener('popstate', restoreScroll);
    return () => window.removeEventListener('popstate', restoreScroll);
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    const requestedQuantity = Math.max(1, Math.floor(quantity));
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + requestedQuantity } : i
        );
      }
      return [...prev, { product, quantity: requestedQuantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Small history-based router keeps collection URLs shareable without replacing the existing experience.
  const handleNavigate = (sectionId: string) => {
    if (sectionId.startsWith('guide:')) {
      navigate(`/guide/${sectionId.slice(6)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isCategory = PRODUCT_CATEGORIES.some((category) => category.id === sectionId);
    if (isCategory) {
      const targetPath = `/shop/${sectionId}`;
      if (location.pathname !== targetPath) navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetPath = '/';
    if (location.pathname !== targetPath) navigate(targetPath);
    if (categoryId || productId) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenProduct = (selectedProductId: string) => {
    const targetPath = `/product/${selectedProductId}`;
    if (location.pathname !== targetPath) navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (selectedCategoryId: string | null) => {
    handleNavigate(selectedCategoryId ?? 'shop');
  };

  const handleSelectSpreadAndScroll = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    handleNavigate('readings');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C4A484]/30 selection:text-[#1A1A1A]">
      {/* Sticky Blur Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBookSession={() => setIsBookSessionOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {offeringSlug ? (
          <OfferingPage
            slug={offeringSlug}
            onBack={() => navigate('/')}
            onNavigate={handleNavigate}
            onOpenBookSession={() => setIsBookSessionOpen(true)}
          />
        ) : productId ? (
          <ProductDetailPage
            key={productId}
            product={PRODUCTS_DATA.find((product) => product.id === productId)!}
            onAddToCart={handleAddToCart}
            onOpenProduct={handleOpenProduct}
            onNavigate={handleNavigate}
          />
        ) : categoryId ? (
          <ShopSection
            categoryId={categoryId}
            onSelectCategory={handleSelectCategory}
            onAddToCart={handleAddToCart}
            onOpenProduct={handleOpenProduct}
          />
        ) : (
          <>
            {/* 1. Hero Section with 3 floating tarot cards */}
            <Hero
              onStartReading={() => handleNavigate('readings')}
              onExploreShop={() => handleNavigate('shop')}
            />

            {/* 2. How It Works (3 columns) */}
            <HowItWorks />

            {/* 3. Choose Your Spread Section */}
            <ChooseSpread
              onSelectSpread={handleSelectSpreadAndScroll}
              selectedSpreadId={selectedSpread.id}
            />

            {/* 4. Interactive Tarot Reading Experience (Main) */}
            <InteractiveReading
              currentSpread={selectedSpread}
              onChangeSpread={(sp) => setSelectedSpread(sp)}
              onBookSession={() => setIsBookSessionOpen(true)}
            />

            {/* 5. Boutique landing and all available collections */}
            <ShopSection
              onAddToCart={handleAddToCart}
              onOpenProduct={handleOpenProduct}
              categoryId={null}
              onSelectCategory={handleSelectCategory}
            />

            {/* 6. Testimonials Minimal Carousel */}
            <Testimonials />

            {/* 7. Journal Section */}
            <JournalSection />
          </>
        )}
      </main>

      {/* 8. Editorial Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookSession={() => setIsBookSessionOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Book Session with Neha Arora Modal */}
      <BookSessionModal
        isOpen={isBookSessionOpen}
        onClose={() => setIsBookSessionOpen(false)}
      />

      {/* Floating WhatsApp Share Pill & Modal */}
      <WhatsAppShareWidget />
    </div>
  );
}

const PublicOnly = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
    <Route path="/signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Route>
    <Route path="*" element={<ExistingWebsite />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
