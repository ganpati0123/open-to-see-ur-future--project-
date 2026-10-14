import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX, Menu, X, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBookSession: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenBookSession,
  soundEnabled,
  onToggleSound,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShareWhatsApp = () => {
    playChimeSound();
    const siteUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-7jhft7fsbc4nlbh5xm6kd6-859149636008.asia-southeast1.run.app';
    const text = `✨ Discover *openToSeeYourFuture* by Neha Arora ✨\n\nIntuitive tarot readings, interactive card spreads, and sacred ritual goods.\n\n🔮 Try your card reading here:\n${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNavClick = (id: string) => {
    if (soundEnabled) playChimeSound();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F5F1EB]/85 border-b border-[#E6E0D6]/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-left group focus-visible:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#1A1A1A] group-hover:text-[#A98765] transition-colors">
              openToSeeYourFuture<span className="text-[#C4A484]">.</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium text-[#1A1A1A]/70">
          <button
            onClick={() => handleNavClick('readings')}
            className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#C4A484] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Readings
          </button>
          <button
            onClick={() => handleNavClick('spreads')}
            className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#C4A484] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Spreads
          </button>
          <button
            onClick={() => handleNavClick('shop')}
            className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#C4A484] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Shop
          </button>
          <button
            onClick={onOpenBookSession}
            className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#C4A484] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 flex items-center gap-1.5"
          >
            <span>Book Session</span>
            <span className="text-[10px] text-[#A98765] lowercase font-normal italic">with Neha</span>
          </button>
          <button
            onClick={() => handleNavClick('journal')}
            className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#C4A484] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Journal
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mute ambient whispers" : "Enable ambient whispers"}
            className="p-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-[#E6E0D6]/40 cursor-pointer"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#A98765]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#1A1A1A]/40" />
            )}
          </button>

          {/* Quick Consultation CTA */}
          <button
            onClick={() => handleNavClick('readings')}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 border border-[#C4A484] text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#C4A484] hover:text-[#FFFFFF] transition-all duration-300 rounded-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A98765]" />
            <span>Draw Cards</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={handleShareWhatsApp}
            title="Share on WhatsApp"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/40 hover:border-[#25D366] rounded-sm text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xl:inline">WhatsApp</span>
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-[#1A1A1A] hover:text-[#A98765] transition-colors rounded-full hover:bg-[#E6E0D6]/40 cursor-pointer"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1A1A1A] text-[#F5F1EB] rounded-full text-[10px] font-medium flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#E6E0D6]/50 rounded-sm cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F5F1EB] border-b border-[#E6E0D6] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-4 text-sm tracking-widest uppercase font-medium">
            <button
              onClick={() => handleNavClick('readings')}
              className="text-left text-[#1A1A1A]/80 hover:text-[#1A1A1A] py-1 border-b border-[#E6E0D6]/40"
            >
              Interactive Tarot Readings
            </button>
            <button
              onClick={() => handleNavClick('spreads')}
              className="text-left text-[#1A1A1A]/80 hover:text-[#1A1A1A] py-1 border-b border-[#E6E0D6]/40"
            >
              Choose Your Spread
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="text-left text-[#1A1A1A]/80 hover:text-[#1A1A1A] py-1 border-b border-[#E6E0D6]/40"
            >
              Sacred Shop & Crystals
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookSession();
              }}
              className="text-left text-[#1A1A1A]/80 hover:text-[#1A1A1A] py-1 border-b border-[#E6E0D6]/40 flex items-center justify-between"
            >
              <span>1:1 Session with Neha Arora</span>
              <Calendar className="w-4 h-4 text-[#A98765]" />
            </button>
            <button
              onClick={() => handleNavClick('journal')}
              className="text-left text-[#1A1A1A]/80 hover:text-[#1A1A1A] py-1"
            >
              Editorial Journal
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => handleNavClick('readings')}
              className="w-full py-3 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-colors rounded-sm"
            >
              Get Your Reading
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 bg-[#25D366] text-white text-xs uppercase tracking-widest hover:bg-[#20ba59] transition-colors rounded-sm flex items-center justify-center gap-2 font-medium"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share Website on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
