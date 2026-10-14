/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TAROT_SPREADS, TarotSpread } from './data/tarotData';
import { Product } from './data/productsData';
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

export default function App() {
  // Selected Spread for reading
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread>(TAROT_SPREADS[1]); // Past, Present, Future default
  
  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Initial delightful seed item
    {
      product: {
        id: 'intention-candle',
        name: 'Intention Candle',
        price: 38,
        category: 'Ritual Goods',
        tag: 'Hand-Poured',
        rating: 4.9,
        reviewsCount: 142,
        description: 'Natural coconut-soy wax infused with wild vetiver and clear quartz crystals.',
        details: ['100% Organic Coconut Soy', '55+ Hour Burn Time'],
        image: '/src/assets/images/boutique_ritual_candle_1790673095609.jpg',
        inStock: true
      },
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Book 1:1 Session Modal State
  const [isBookSessionOpen, setIsBookSessionOpen] = useState(false);

  // Audio ambient sound state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
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

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

        {/* 5. Shop Section (Grid of 8 products) */}
        <ShopSection onAddToCart={handleAddToCart} />

        {/* 6. Testimonials Minimal Carousel */}
        <Testimonials />

        {/* 7. Journal Section */}
        <JournalSection />
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
