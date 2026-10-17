import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Headphones,
  Heart,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Star,
  Video,
} from 'lucide-react';
import { Product, PRODUCTS_DATA } from '../data/productsData';
import { playChimeSound } from '../utils/audio';
import { getProductWhatsAppUrl, getSessionBookingWhatsAppUrl } from '../utils/whatsapp';

interface GuidanceDetailPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenBookSession: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const GuidanceDetailPage: React.FC<GuidanceDetailPageProps> = ({
  slug,
  onBack,
  onNavigate,
  onOpenBookSession,
  onAddToCart,
}) => {
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeEssay, setActiveEssay] = useState<number>(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    playChimeSound();
    setSubscribed(true);
    setNewsletterEmail('');
  };

  const handleWhatsAppBooking = (topic: string) => {
    playChimeSound();
    const url = getSessionBookingWhatsAppUrl({
      name: 'Seeker',
      email: '',
      phone: '',
      date: 'Earliest Available',
      time: 'Flexible',
      topic,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const loveReadingProduct = PRODUCTS_DATA.find((p) => p.id === 'love-reading-digital');
  const careerReadingProduct = PRODUCTS_DATA.find((p) => p.id === 'career-reading-digital');
  const liveSessionProduct = PRODUCTS_DATA.find((p) => p.id === 'one-on-one-live-session');

  // 1. Live Video Consultation Page
  if (slug === 'live-consultation') {
    return (
      <div className="min-h-screen bg-[#080914] text-[#f5f0e7] px-4 py-10 sm:px-6 lg:px-10 selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a8a9bf] hover:text-[#e6b967] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to studio</span>
          </button>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-[#e6b967]/25 bg-gradient-to-br from-[#111326] via-[#0d0e1c] to-[#1a122e] p-8 sm:p-12 lg:p-14 shadow-[0_0_80px_rgba(89,55,181,0.22)]">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#e6b967] font-semibold">
                <Video className="w-3.5 h-3.5" />
                Private 1:1 Live Guidance
              </span>
              <h1 className="mt-4 font-serif text-4xl sm:text-6xl text-[#f5f0e7] leading-[1.05]">
                1:1 Live Video Consultation
              </h1>
              <p className="mt-2 text-base text-[#e6b967] font-serif italic">
                A private, high-vibrational sanctuary for your life questions with Neha Arora.
              </p>
              <p className="mt-6 text-sm text-[#c7c8d8] leading-relaxed max-w-2xl font-light">
                Step into a confidential, sixty-minute sacred dialogue. We examine your current crossroads through the Celtic Cross master spread, untangle subconscious knots, and illuminate the timing of your highest path.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={onOpenBookSession}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#e6b967] text-[#080914] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all hover:bg-[#d8a74e] cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Booking Schedule · ₹12,600</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppBooking('1:1 Live Video Consultation')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#25D366] text-[#25D366] text-xs uppercase tracking-[0.18em] rounded-sm transition-colors hover:bg-[#25D366]/10 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* What is Included */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: '60 Min Deep Dive',
                desc: 'An unhurried hour dedicated entirely to your questions, career pivots, or relational dynamics.',
                icon: Clock,
              },
              {
                title: 'Celtic Cross Master',
                desc: 'A full 10-card archetypal spread laid out live on camera, with card-by-card synthesis.',
                icon: Sparkles,
              },
              {
                title: 'Recording Download',
                desc: 'Full high-definition video and pristine audio download delivered within 24 hours to revisit.',
                icon: Headphones,
              },
              {
                title: 'Strict Confidentiality',
                desc: 'Every word spoken is held in absolute sacred trust with zero judgment or fearmongering.',
                icon: Shield,
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/75 p-6 backdrop-blur-md">
                <feature.icon className="w-5 h-5 text-[#e6b967]" />
                <h3 className="mt-4 font-serif text-xl text-[#f5f0e7]">{feature.title}</h3>
                <p className="mt-2 text-xs text-[#a8a9bf] leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* How to Prepare */}
          <div className="mt-14 rounded-2xl border border-[#e6b967]/20 bg-[#111326]/60 p-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f0e7]">
              Preparing For Your Consultation
            </h2>
            <div className="mt-6 space-y-4 text-xs text-[#c7c8d8]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e6b967] shrink-0 mt-0.5" />
                <span><strong>Find a Quiet Space:</strong> Ensure you are in a private room with no interruptions where you feel safe speaking openly.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e6b967] shrink-0 mt-0.5" />
                <span><strong>Bring 2-3 Core Themes:</strong> Write down your central questions or life domains (love, career, soul purpose, family) in advance.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e6b967] shrink-0 mt-0.5" />
                <span><strong>Openness over Fixed Outcomes:</strong> Approach the reading not as a rigid fortune, but as an energetic mirror revealing your clearest choices.</span>
              </div>
            </div>
          </div>

          {/* Bottom Back to Studio Action */}
          <div className="mt-12 flex justify-center border-t border-[#e6b967]/15 pt-8">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-[#e6b967]/30 bg-[#111326] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#f5f0e7] transition-all hover:border-[#e6b967] hover:bg-[#e6b967]/15 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#e6b967]" />
              <span>Back to Studio Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Digital Audio Readings Page
  if (slug === 'digital-readings') {
    return (
      <div className="min-h-screen bg-[#080914] text-[#f5f0e7] px-4 py-10 sm:px-6 lg:px-10 selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a8a9bf] hover:text-[#e6b967] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to studio</span>
          </button>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-[#e6b967]/25 bg-gradient-to-br from-[#111326] via-[#0d0e1c] to-[#131b2e] p-8 sm:p-12 lg:p-14 shadow-[0_0_80px_rgba(89,55,181,0.22)]">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#e6b967] font-semibold">
                <Headphones className="w-3.5 h-3.5" />
                Bespoke Recorded Readings
              </span>
              <h1 className="mt-4 font-serif text-4xl sm:text-6xl text-[#f5f0e7] leading-[1.05]">
                Digital Audio Readings
              </h1>
              <p className="mt-2 text-base text-[#e6b967] font-serif italic">
                Personalized voice memo recordings accompanied by an illustrated 12-page PDF dossier.
              </p>
              <p className="mt-6 text-sm text-[#c7c8d8] leading-relaxed max-w-2xl font-light">
                Crafted for seekers who desire Neha&apos;s personal guidance on their own schedule. Delivered straight to your email or WhatsApp within 48 hours.
              </p>
            </div>
          </div>

          {/* Offerings Grid */}
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Love Reading */}
            {loveReadingProduct && (
              <div className="rounded-2xl border border-[#e6b967]/25 bg-[#111326]/80 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#d48372] font-semibold">
                      Delivered in 48h
                    </span>
                    <span className="font-serif text-2xl text-[#f5f0e7] font-semibold">
                      ${loveReadingProduct.price}
                    </span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-[#f5f0e7]">
                    {loveReadingProduct.name}
                  </h2>
                  <p className="mt-3 text-xs text-[#c7c8d8] leading-relaxed">
                    {loveReadingProduct.description}
                  </p>
                  <ul className="mt-5 space-y-2 text-xs text-[#a8a9bf]">
                    {loveReadingProduct.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e6b967]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(loveReadingProduct, 1);
                      playChimeSound();
                    }}
                    className="flex-1 py-3 bg-[#e6b967] text-[#080914] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#d8a74e] transition-colors cursor-pointer"
                  >
                    Add to Bag
                  </button>
                  <a
                    href={getProductWhatsAppUrl(loveReadingProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 border border-[#25D366] text-[#25D366] text-xs uppercase tracking-wider rounded hover:bg-[#25D366]/10 flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Career Reading */}
            {careerReadingProduct && (
              <div className="rounded-2xl border border-[#e6b967]/25 bg-[#111326]/80 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#e6b967] font-semibold">
                      Delivered in 48h
                    </span>
                    <span className="font-serif text-2xl text-[#f5f0e7] font-semibold">
                      ${careerReadingProduct.price}
                    </span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-[#f5f0e7]">
                    {careerReadingProduct.name}
                  </h2>
                  <p className="mt-3 text-xs text-[#c7c8d8] leading-relaxed">
                    {careerReadingProduct.description}
                  </p>
                  <ul className="mt-5 space-y-2 text-xs text-[#a8a9bf]">
                    {careerReadingProduct.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e6b967]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(careerReadingProduct, 1);
                      playChimeSound();
                    }}
                    className="flex-1 py-3 bg-[#e6b967] text-[#080914] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#d8a74e] transition-colors cursor-pointer"
                  >
                    Add to Bag
                  </button>
                  <a
                    href={getProductWhatsAppUrl(careerReadingProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 border border-[#25D366] text-[#25D366] text-xs uppercase tracking-wider rounded hover:bg-[#25D366]/10 flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Back to Studio Action */}
          <div className="mt-12 flex justify-center border-t border-[#e6b967]/15 pt-8">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-[#e6b967]/30 bg-[#111326] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#f5f0e7] transition-all hover:border-[#e6b967] hover:bg-[#e6b967]/15 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#e6b967]" />
              <span>Back to Studio Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Lunar Archetype Essays Page
  if (slug === 'lunar-essays') {
    const essays = [
      {
        title: 'The Architecture of Surrender: When The Hanged Man Appears',
        meta: 'Tarot Wisdom · 5 min read · Autumn Equinox',
        excerpt: 'Why pausing when everything in modern life screams for frantic acceleration is the most courageous choice an intuitive spirit can make.',
        content: `When The Hanged Man presents himself in your spread, modern instinct is to recoil. Our society worships velocity, outcome, and unrelenting momentum. To hang upside-down by one ankle from a living world tree looks like failure.

Yet in esoteric tradition, the Hanged Man is surrounded by an golden halo around his crown. He is not suffering; he has deliberately surrendered his ego's compulsive grip. He knows that when you are suspended, you see the room upside-down—and the upside-down truth is often the only truth that can break an unconscious spell.

If you find yourself stuck, stalled, or waiting on an answer that refuses to arrive, treat the suspension not as a prison cell, but as a chrysalis. The moment you stop kicking against the rope, the lesson completes itself.`,
      },
      {
        title: 'Cleansing the Vessel: Sacred Smudging & Energetic Hygiene',
        meta: 'Rituals · 4 min read · New Moon in Virgo',
        excerpt: 'A delicate guide to honoring white sage, balancing smoke with water elements, and sealing your sanctuary perimeter.',
        content: `Every physical room collects vibrational debris—unspoken arguments, anxieties lingering from phone calls, the heavy residue of grief or restless insomnia. Just as we sweep our floorboards, our energetic vessel requires regular, reverent clearing.

When burning ethically sourced white sage or lavender bundles, always crack a window. The smoke is not meant to trap energy; it binds with dense particles and carries them out into the atmosphere for transmutation.

Follow your smoke with sound—a chime, a brass bowl, or clear vocal toning. Space that is merely emptied remains vulnerable; fill it immediately with your sovereign intention: peace, clarity, and protected love.`,
      },
      {
        title: 'Reversals as Invitations: Why Inverted Cards Hold the Deepest Medicine',
        meta: 'Archetypes · 6 min read · Waxing Crescent',
        excerpt: 'An upside-down card is not bad luck; it is an internal portal directing you toward what is stirring quietly under the floorboards of your heart.',
        content: `The single biggest misconception among new seekers is fear of reversed cards. Seeing the Three of Swords or The Tower upside-down often triggers a sudden intake of breath.

In our lineage at OpenToSeeYourFuture, reversals are never curses. A card appearing inverted indicates that the energy is working internally rather than externally. While an upright Empress reflects outward abundance in work or nature, a reversed Empress asks: Are you nurturing everyone around you while leaving your own inner well bone dry?

Reversals invite gentle curiosity instead of dread. They show where energy is internalized, delayed for recalibration, or quietly healing away from public eyes.`,
      },
    ];

    return (
      <div className="min-h-screen bg-[#080914] text-[#f5f0e7] px-4 py-10 sm:px-6 lg:px-10 selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a8a9bf] hover:text-[#e6b967] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to studio</span>
          </button>

          <div className="relative overflow-hidden rounded-3xl border border-[#e6b967]/25 bg-gradient-to-br from-[#111326] via-[#0d0e1c] to-[#1a122e] p-8 sm:p-12 lg:p-14">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#e6b967] font-semibold">
              <FileText className="w-3.5 h-3.5" />
              Written Teachings by Neha Arora
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-6xl text-[#f5f0e7] leading-[1.05]">
              Lunar Archetype Essays
            </h1>
            <p className="mt-2 text-base text-[#e6b967] font-serif italic">
              Contemplations on timing, myth, depth psychology, and the living cards.
            </p>
          </div>

          {/* Essay selector and viewer */}
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#a8a9bf] font-semibold block mb-2">
                Table of Essays
              </span>
              {essays.map((essay, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveEssay(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    activeEssay === idx
                      ? 'border-[#e6b967] bg-[#111326] shadow-[0_0_20px_rgba(230,185,103,0.15)]'
                      : 'border-[#e6b967]/20 bg-[#0d0e1c]/60 hover:border-[#e6b967]/40'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider text-[#e6b967]">
                    0{idx + 1} · {essay.meta.split('·')[0].trim()}
                  </span>
                  <h3 className="mt-2 font-serif text-lg text-[#f5f0e7] leading-snug">
                    {essay.title}
                  </h3>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 rounded-2xl border border-[#e6b967]/25 bg-[#111326]/85 p-8 sm:p-10 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-[#e6b967]">
                {essays[activeEssay].meta}
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#f5f0e7] leading-tight">
                {essays[activeEssay].title}
              </h2>
              <div className="my-6 h-px bg-[#e6b967]/20" />
              <div className="space-y-4 text-sm text-[#d4cfc5] leading-relaxed whitespace-pre-line font-light">
                {essays[activeEssay].content}
              </div>
              <div className="mt-8 border-t border-[#e6b967]/20 pt-6 flex items-center justify-between text-xs text-[#a8a9bf]">
                <span>Author: Neha Arora</span>
                <span>OpenToSeeYourFuture Studio</span>
              </div>
            </div>
          </div>

          {/* Bottom Back to Studio Action */}
          <div className="mt-12 flex justify-center border-t border-[#e6b967]/15 pt-8">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-[#e6b967]/30 bg-[#111326] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#f5f0e7] transition-all hover:border-[#e6b967] hover:bg-[#e6b967]/15 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#e6b967]" />
              <span>Back to Studio Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Daily Cosmic Pulse Page
  return (
    <div className="min-h-screen bg-[#080914] text-[#f5f0e7] px-4 py-10 sm:px-6 lg:px-10 selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a8a9bf] hover:text-[#e6b967] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to studio</span>
        </button>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-[#e6b967]/25 bg-gradient-to-br from-[#111326] via-[#0d0e1c] to-[#1f1530] p-8 sm:p-12 lg:p-14 shadow-[0_0_80px_rgba(89,55,181,0.22)]">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#e6b967] font-semibold">
              <Moon className="w-3.5 h-3.5" />
              Daily Atmospheric Energy
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-6xl text-[#f5f0e7] leading-[1.05]">
              Daily Cosmic Pulse
            </h1>
            <p className="mt-2 text-base text-[#e6b967] font-serif italic">
              Today’s collective celestial weather and focal oracle contemplation.
            </p>
          </div>
        </div>

        {/* Today's Pulse Card */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-2xl border border-[#e6b967]/25 bg-[#111326]/80 p-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#e6b967] font-semibold">
                Universal Collective Anchor
              </span>
              <span className="text-xs text-[#a8a9bf]">
                Waxing Gibbous Moon
              </span>
            </div>
            <h2 className="mt-4 font-serif text-3xl text-[#f5f0e7]">
              The High Priestess · Still Water Deep Truth
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#c7c8d8] leading-relaxed font-light">
              Today’s atmospheric field favors intuition over aggressive calculation. The answers you seek are not hiding in an endless search bar; they are waiting quietly beneath the waterline of your breath.
            </p>

            <div className="mt-6 rounded-xl border border-[#e6b967]/20 bg-[#080914]/60 p-4">
              <span className="text-[10px] uppercase tracking-wider text-[#e6b967] block">
                Today’s Focal Mantra
              </span>
              <p className="mt-1.5 font-serif text-lg text-[#fff8ec] italic">
                “I do not need to rush what is naturally blossoming in sacred time.”
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => onNavigate('spread:one-card')}
                className="px-6 py-3 bg-[#e6b967] text-[#080914] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#d8a74e] transition-colors cursor-pointer"
              >
                Pull Your Personal Daily Card
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-[#e6b967]/20 bg-[#111326]/60 p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#a8a9bf] font-semibold">
                Cosmic Alignment Factors
              </span>
              <div className="mt-5 space-y-4 text-xs text-[#c7c8d8]">
                <div className="border-b border-[#e6b967]/15 pb-3">
                  <span className="text-[#a8a9bf] block text-[10px] uppercase">Moon Sign</span>
                  <span className="text-sm font-serif text-[#f5f0e7]">Cancer · Deep Emotional Ocean</span>
                </div>
                <div className="border-b border-[#e6b967]/15 pb-3">
                  <span className="text-[#a8a9bf] block text-[10px] uppercase">Alchemical Element</span>
                  <span className="text-sm font-serif text-[#f5f0e7]">Water · Flow, Receptivity, Cleansing</span>
                </div>
                <div className="border-b border-[#e6b967]/15 pb-3">
                  <span className="text-[#a8a9bf] block text-[10px] uppercase">Suggested Sacred Tool</span>
                  <span className="text-sm font-serif text-[#f5f0e7]">Selenite Wand & Amethyst Figurine</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenBookSession}
              className="mt-6 w-full py-3 border border-[#e6b967]/40 text-[#f5f0e7] text-xs uppercase tracking-wider rounded hover:bg-[#e6b967]/10 transition-colors cursor-pointer"
            >
              Discuss with Neha in 1:1
            </button>
          </div>
        </div>

        {/* Bottom Back to Studio Action */}
        <div className="mt-12 flex justify-center border-t border-[#e6b967]/15 pt-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-[#e6b967]/30 bg-[#111326] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#f5f0e7] transition-all hover:border-[#e6b967] hover:bg-[#e6b967]/15 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e6b967]" />
            <span>Back to Studio Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
