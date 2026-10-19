import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Menu,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
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
  onNavigate,
}) => {
  const { categories, products } = useStore();
  const availableCategories = categories.filter((category) =>
    products.some((product) => product.category === category.label),
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const handleShareWhatsApp = () => {
    playChimeSound();
    const siteUrl = typeof window !== 'undefined'
      ? window.location.href
      : 'https://opentoseeyourfuture.com';
    const text = `Discover openToSeeYourFuture by Neha Arora.\n\nIntuitive tarot readings, interactive card spreads, and thoughtfully selected ritual goods.\n\nExplore your reading here:\n${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNavClick = (id: string) => {
    if (soundEnabled) playChimeSound();
    onNavigate(id);
    setMobileMenuOpen(false);
    setShopMenuOpen(false);
    setMobileShopOpen(false);
  };

  const navButtonClass = 'relative cursor-pointer py-2 text-[10px] font-medium uppercase tracking-[.17em] text-[#c7c8d8] transition-colors hover:text-[#8d6d4e] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#b69570] after:transition-all after:duration-300 hover:after:w-full';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e6b967]/20 bg-[#080914]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => handleNavClick('hero')}
          className="group shrink-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8d6d4e]"
          aria-label="Open to See Your Future home"
        >
          <span className="flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#e6b967]/60 bg-[#090a16] shadow-[0_0_24px_rgba(111,72,200,.35)]">
              <img src="/oracle-logo.png" alt="" className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110" />
            </span>
            <span className="font-serif text-[1.28rem] tracking-[-.035em] text-[#f5f0e7] transition-colors group-hover:text-[#e6b967] sm:text-[1.5rem]">
              openToSeeYourFuture<span className="text-[#e6b967]">.</span>
            </span>
          </span>
        </button>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
          <button type="button" onClick={() => handleNavClick('readings')} className={navButtonClass}>Readings</button>
          <button type="button" onClick={() => handleNavClick('spreads')} className={navButtonClass}>Spreads</button>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playChimeSound();
                onNavigate('shop');
                setShopMenuOpen((open) => !open);
              }}
              className={`${navButtonClass} flex items-center gap-1.5`}
              aria-expanded={shopMenuOpen}
              aria-haspopup="true"
            >
              Shop
              <ChevronDown className={`h-3 w-3 transition-transform ${shopMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {shopMenuOpen && (
              <div className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 border border-[#ded5c8] bg-[#111326] p-2 shadow-[0_18px_45px_rgba(45,38,29,.14)]">
                <button
                  type="button"
                  onClick={() => handleNavClick('shop')}
                  className="flex w-full items-center justify-between px-3 py-3 text-left text-[10px] uppercase tracking-[.16em] text-[#8d6d4e] transition-colors hover:bg-[#f0e9de]"
                >
                  All collections
                  <span aria-hidden="true">→</span>
                </button>
                <div className="my-1 border-t border-[#ded5c8]" />
                <div className="max-h-[60vh] overflow-y-auto">
                  {availableCategories.map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => handleNavClick(category.id)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs text-[#c7c8d8] transition-colors hover:bg-[#f0e9de] hover:text-[#8d6d4e]"
                    >
                      {category.label}
                      <span className="text-[10px] text-[#9b907f]">
                        {products.filter((product) => product.category === category.label).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setShopMenuOpen(false);
              setMobileMenuOpen(false);
              onOpenBookSession();
            }}
            className={`${navButtonClass} flex items-center gap-1.5`}
          >
            <span>Book a session</span>
            <span className="font-serif text-sm italic normal-case tracking-normal text-[#8d6d4e]">with Neha</span>
          </button>
          <button type="button" onClick={() => handleNavClick('journal')} className={navButtonClass}>Journal</button>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
            className="hidden rounded-full p-2 text-[#8d6d4e] transition-colors hover:bg-[#e8dfd2] sm:inline-flex"
            aria-label={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-[#999080]" />}
          </button>
          <Link
            to="/admin"
            aria-label="Studio Admin Portal"
            title="Studio Admin Portal (Add & Remove Goods, Live Price Changes, Reviews Moderation)"
            className="flex items-center gap-1.5 rounded-full border border-[#e6b967]/40 bg-[#e6b967]/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#e6b967] hover:bg-[#e6b967]/20 transition-all"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#e6b967]" />
            <span className="hidden md:inline">Admin</span>
          </Link>
          <Link
            to="/login"
            aria-label="Sign in or open your dashboard"
            title="Your account"
            className="rounded-full p-2.5 text-[#f5f0e7] transition-colors hover:bg-[#e8dfd2] hover:text-[#8d6d4e]"
          >
            <UserRound className="h-[19px] w-[19px]" strokeWidth={1.55} />
          </Link>
          <button
            type="button"
            onClick={() => handleNavClick('readings')}
            className="hidden items-center gap-2 border border-[#b69570] px-3 py-2 text-[9px] uppercase tracking-[.14em] text-[#c7c8d8] transition-colors hover:bg-[#b69570] hover:text-[#fbf8f1] xl:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Draw cards
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            className="relative rounded-full p-2.5 text-[#f5f0e7] transition-colors hover:bg-[#e8dfd2] hover:text-[#8d6d4e]"
            aria-label={`Open shopping bag${cartCount > 0 ? `, ${cartCount} items` : ''}`}
          >
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.55} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#655e50] px-1 text-[9px] font-medium tabular-nums text-[#fffaf1]">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-full p-2 text-[#f5f0e7] transition-colors hover:bg-[#e8dfd2] lg:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#ded5c8] bg-[#f7f2e9] px-5 pb-6 pt-4 shadow-[0_18px_32px_rgba(45,38,29,.12)] lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-2xl flex-col">
            <button type="button" onClick={() => handleNavClick('readings')} className="border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#c7c8d8]">Interactive readings</button>
            <button type="button" onClick={() => handleNavClick('spreads')} className="border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#c7c8d8]">Choose a spread</button>
            <button
              type="button"
              onClick={() => {
                onNavigate('shop');
                setMobileShopOpen((open) => !open);
              }}
              className="flex items-center justify-between border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#c7c8d8]"
              aria-expanded={mobileShopOpen}
            >
              Sacred shop
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileShopOpen && (
              <div className="grid grid-cols-2 gap-x-5 border-b border-[#ded5c8] bg-[#eee7dc] px-3 py-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleNavClick('shop')}
                  className="py-2.5 text-left text-xs font-medium text-[#8d6d4e]"
                >
                  All collections
                </button>
                {availableCategories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => handleNavClick(category.id)}
                    className="py-2.5 text-left text-xs text-[#c7c8d8] transition-colors hover:text-[#8d6d4e]"
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileShopOpen(false);
                onOpenBookSession();
              }}
              className="flex items-center justify-between border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#c7c8d8]"
            >
              Book a session
              <Calendar className="h-4 w-4 text-[#8d6d4e]" />
            </button>
            <button type="button" onClick={() => handleNavClick('journal')} className="border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#c7c8d8]">Editorial journal</button>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#c7c8d8]"
            >
              Sign in or open your dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-[#ded5c8] py-3 text-left text-xs uppercase tracking-[.14em] text-[#8d6d4e] font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#8d6d4e]" />
                <span>Studio Admin Suite</span>
              </span>
              <span className="text-[10px] bg-[#8d6d4e]/10 px-2 py-0.5 rounded text-[#8d6d4e]">Pro Max</span>
            </Link>
          </nav>
          <div className="mx-auto mt-4 flex max-w-2xl gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('readings')}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 bg-[#302d27] px-3 text-[10px] uppercase tracking-[.14em] text-[#f7f1e7]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Draw cards
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-[#b69570] px-3 text-[10px] uppercase tracking-[.12em] text-[#5c5142]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Share the studio
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
