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
import { StoreProvider, useStore } from './context/StoreContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminPage } from './pages/AdminPage';
import { OfferingPage } from './components/OfferingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SpreadDetailPage } from './components/SpreadDetailPage';
import { GuidanceDetailPage } from './components/GuidanceDetailPage';
import { EthosPage } from './components/EthosPage';

function ExistingWebsite() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, categories } = useStore();

  const categoryMatch = location.pathname.match(/^\/shop\/([^/]+)\/?$/);
  const categoryId = categoryMatch && categories.some((c) => c.id === categoryMatch[1]) ? categoryMatch[1] : null;
  const isShopRoot = location.pathname === '/shop' || location.pathname === '/shop/';
  const productMatch = location.pathname.match(/^\/product\/([^/]+)\/?$/);
  const requestedProductId = productMatch?.[1] ?? null;
  const currentProduct = requestedProductId ? products.find((p) => p.id === requestedProductId) : null;

  // Dedicated Spread routes: /spread/:spreadId
  const spreadMatch = location.pathname.match(/^\/spread\/([^/]+)\/?$/);
  const spreadId = spreadMatch?.[1] ?? null;

  // Dedicated Guidance routes: /guidance/:guidanceSlug
  const guidanceMatch = location.pathname.match(/^\/guidance\/([^/]+)\/?$/);
  const guidanceSlug = guidanceMatch?.[1] ?? null;

  // Dedicated Ethos route: /guide/ethos or /ethos
  const isEthos =
    location.pathname === '/guide/ethos' ||
    location.pathname === '/guide/ethos/' ||
    location.pathname === '/ethos' ||
    location.pathname === '/ethos/';

  // Legacy guide route
  const offeringMatch = location.pathname.match(/^\/guide\/(spreads|guidance)\/?$/);
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

  useEffect(() => {
    const rawPath = location.pathname.replace(/^\/+|\/+$/g, '');
    if (['readings', 'spreads', 'how-it-works', 'journal', 'testimonials', 'shop'].includes(rawPath)) {
      window.requestAnimationFrame(() => {
        document.getElementById(rawPath)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.pathname]);

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
    if (sectionId.startsWith('spread:')) {
      const targetSlug = sectionId.slice(7);
      navigate(`/spread/${targetSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId.startsWith('product:')) {
      const targetProdId = sectionId.slice(8);
      navigate(`/product/${targetProdId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId.startsWith('guidance:')) {
      const targetGuideSlug = sectionId.slice(9);
      navigate(`/guidance/${targetGuideSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'guide:ethos' || sectionId === 'ethos') {
      navigate('/guide/ethos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId.startsWith('guide:')) {
      navigate(`/guide/${sectionId.slice(6)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isCategory = categories.some((category) => category.id === sectionId);
    if (isCategory) {
      const targetPath = `/shop/${sectionId}`;
      if (location.pathname !== targetPath) navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetPath = '/';
    if (location.pathname !== targetPath) navigate(targetPath);
    if (categoryId || requestedProductId || spreadId || guidanceSlug || isEthos) {
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
    navigate('/');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('readings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
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
        {isEthos ? (
          <EthosPage
            onBack={() => navigate('/')}
            onNavigate={handleNavigate}
            onOpenBookSession={() => setIsBookSessionOpen(true)}
          />
        ) : spreadId ? (
          <SpreadDetailPage
            spreadId={spreadId}
            onStartReading={handleSelectSpreadAndScroll}
            onBack={() => navigate('/')}
            onNavigate={handleNavigate}
            onOpenBookSession={() => setIsBookSessionOpen(true)}
          />
        ) : guidanceSlug ? (
          <GuidanceDetailPage
            slug={guidanceSlug}
            onBack={() => navigate('/')}
            onNavigate={handleNavigate}
            onOpenBookSession={() => setIsBookSessionOpen(true)}
            onAddToCart={handleAddToCart}
          />
        ) : offeringSlug ? (
          <OfferingPage
            slug={offeringSlug}
            onBack={() => navigate('/')}
            onNavigate={handleNavigate}
            onOpenBookSession={() => setIsBookSessionOpen(true)}
          />
        ) : requestedProductId ? (
          currentProduct ? (
            <ProductDetailPage
              key={currentProduct.id}
              product={currentProduct}
              onAddToCart={handleAddToCart}
              onOpenProduct={handleOpenProduct}
              onNavigate={handleNavigate}
            />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
              <span className="text-xs uppercase tracking-widest text-[#a87532]">Item Not Found</span>
              <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-[#f5f0e7]">This sacred piece could not be found</h1>
              <p className="mt-3 text-sm text-[#a8a9bf] max-w-md">
                It may have been consecrated and archived, or the link may have a typo.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('shop')}
                className="mt-6 inline-flex items-center px-6 py-3 bg-[#e6b967] text-[#080914] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d8a74e]"
              >
                Browse All Offerings
              </button>
            </div>
          )
        ) : (categoryId || isShopRoot) ? (
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

const AuthSessionSyncer = () => {
  const { user } = useAuth();
  const { recordUserSession } = useStore();

  useEffect(() => {
    if (user) {
      recordUserSession({
        name: user.displayName || (user.email ? user.email.split('@')[0] : 'Registered Seeker'),
        email: user.email,
      });
    }
  }, [user, recordUserSession]);

  return null;
};

const AppRoutes = () => (
  <>
    <AuthSessionSyncer />
    <Routes>
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<ExistingWebsite />} />
    </Routes>
  </>
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <StoreProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </StoreProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
