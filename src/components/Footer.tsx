import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Mail, Compass, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBookSession: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookSession }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleShareWhatsApp = () => {
    playChimeSound();
    const siteUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-7jhft7fsbc4nlbh5xm6kd6-859149636008.asia-southeast1.run.app';
    const text = `✨ Discover *openToSeeYourFuture* by Neha Arora ✨\n\nIntuitive tarot readings, interactive card spreads, and sacred ritual goods.\n\n🔮 Try your card reading here:\n${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playChimeSound();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1C1A18] text-[#F5F1EB] pt-20 pb-12 border-t border-[#C4A484]/30 relative overflow-hidden">
      
      {/* Decorative celestial background watermark linework */}
      <div className="absolute top-0 right-0 w-96 h-96 border border-[#C4A484]/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 border border-[#C4A484]/10 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Newsletter & Studio Manifesto Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#332F2B]">
          
          {/* Manifesto Left */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-3">
              <img src="/oracle-logo.png" alt="" className="h-12 w-12 rounded-full border border-[#e6b967]/40 object-cover" />
              <span className="font-serif text-3xl sm:text-4xl text-[#F5F1EB] tracking-tight block">
                openToSeeYourFuture<span className="text-[#C4A484]">.</span>
              </span>
            </div>
            <p className="text-sm text-[#F5F1EB]/70 leading-relaxed font-light max-w-lg">
              A high-vibrational sanctuary for modern seekers, founded by Neha Arora. Grounded in archetypal depth psychology, sacred symbology, and intuitive clarity for love, career & spiritual alignment.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#C4A484] tracking-widest uppercase">
              <a
                href="https://instagram.com/opentoseeyourfuture"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 text-[#F5F1EB]"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Open To See Your Future on Instagram</span>
              </a>
              <span>·</span>
              <button
                onClick={handleShareWhatsApp}
                className="hover:underline flex items-center gap-1.5 text-[#25D366] hover:text-white transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Newsletter Subscription Right */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs tracking-[0.25em] uppercase text-[#C4A484] font-medium block">
              Letters on Intuition & Timing
            </span>
            <h4 className="font-serif text-2xl text-[#F5F1EB]">
              Receive The Weekly Lunar Oracle
            </h4>
            <p className="text-xs text-[#F5F1EB]/70 font-light">
              Every Sunday evening, Neha Arora pens an exclusive astrological forecast and intuitive collective card pull directly to your inbox.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your sacred email address..."
                  className="px-4 py-3 bg-[#262320] border border-[#3E3832] rounded-sm text-xs text-[#F5F1EB] placeholder:text-[#F5F1EB]/40 focus:outline-none focus:border-[#C4A484] flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C4A484] text-[#1C1A18] text-xs uppercase tracking-widest font-medium hover:bg-[#F5F1EB] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Join The Circle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 bg-[#262320] border border-[#C4A484]/40 rounded text-xs text-[#C4A484] flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4" />
                <span>You have been consecrated into the weekly circle. Welcome.</span>
              </div>
            )}
          </div>
        </div>

        {/* Links Navigation */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[#F5F1EB]/70">
          <div className="space-y-3">
            <span className="uppercase tracking-[0.2em] text-[#C4A484] font-medium text-[10px] block">
              Sacred Spreads
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('spread:one-card')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  One Card Quick Pull (Free)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('spread:three-card')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Past, Present, Future
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('spread:love-connection')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Love & Connection Spread
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('spread:celtic-cross')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Celtic Cross Master Spread
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="uppercase tracking-[0.2em] text-[#C4A484] font-medium text-[10px] block">
              Boutique & Goods
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('product:intention-candle')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Intention Soy Candles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product:crystal-kit')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Consecrated Crystal Kits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product:sage-bundle')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  White Sage & Lavender Bundles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product:tarot-journal')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Embossed Tarot Journals
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="uppercase tracking-[0.2em] text-[#C4A484] font-medium text-[10px] block">
              Private Guidance
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('guidance:live-consultation')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  1:1 Live Video Consultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guidance:digital-readings')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Digital Audio Readings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guidance:lunar-essays')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Lunar Archetype Essays
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guidance:cosmic-pulse')} className="hover:text-[#F5F1EB] transition-colors cursor-pointer text-left">
                  Daily Cosmic Pulse
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button type="button" onClick={() => onNavigate('guide:ethos')} className="text-left uppercase tracking-[0.2em] text-[#C4A484] font-medium text-[10px] block hover:text-[#F5F1EB] transition-colors cursor-pointer">
              Studio & Ethos
            </button>
            <p className="text-xs text-[#F5F1EB]/60 leading-relaxed font-light">
              OpenToSeeYourFuture studio is founded on principles of integrity, confidentiality, and deep respect for the seeker&apos;s sacred autonomy.
            </p>
            <p className="text-xs text-[#C4A484] pt-2">
              Guide: Neha Arora
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded border border-[#C4A484]/40 bg-[#262320] px-3 py-1.5 text-[11px] text-[#C4A484] hover:bg-[#C4A484] hover:text-[#1C1A18] transition-colors"
              >
                <span>Studio Admin Suite</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 border-t border-[#332F2B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5F1EB]/50 gap-4">
          <p>© {new Date().getFullYear()} OpenToSeeYourFuture. Curated by Neha Arora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Crafted with quiet devotion</span>
            <span>·</span>
            <span>Earth & Stars</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
