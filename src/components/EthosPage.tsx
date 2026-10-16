import React from 'react';
import { ArrowLeft, ArrowRight, Compass, Heart, Instagram, Lock, MessageCircle, Shield, Sparkles, Star } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface EthosPageProps {
  onBack: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenBookSession: () => void;
}

export const EthosPage: React.FC<EthosPageProps> = ({ onBack, onNavigate, onOpenBookSession }) => {
  const handleWhatsAppContact = () => {
    playChimeSound();
    const text = 'Hi Neha! I loved reading about OpenToSeeYourFuture’s ethos and principles. I would like to learn more about your private readings.';
    window.open(`https://wa.me/918219179738?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

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

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[#e6b967]/25 bg-gradient-to-br from-[#111326] via-[#0e101f] to-[#1a122e] p-8 sm:p-14 shadow-[0_0_80px_rgba(89,55,181,0.22)]">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#e6b967] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Manifesto & Origins
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-6xl text-[#f5f0e7] leading-[1.05]">
              Studio & Ethos
            </h1>
            <p className="mt-3 text-lg text-[#e6b967] font-serif italic">
              Founded on principles of integrity, confidentiality, and deep respect for the seeker&apos;s sacred autonomy.
            </p>
            <p className="mt-6 text-sm sm:text-base text-[#c7c8d8] leading-relaxed font-light">
              OpenToSeeYourFuture is an editorial intuitive sanctuary founded by Neha Arora. Here, tarot is practiced not as fatalistic fortune-telling, but as an ancient, precision language of archetypes, emotional hygiene, and quiet clarity.
            </p>
          </div>
        </div>

        {/* Meet the Guide: Neha Arora */}
        <div className="mt-14 rounded-3xl border border-[#e6b967]/25 bg-[#111326]/80 p-8 sm:p-12 backdrop-blur-md">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 rounded-full p-1.5 border-2 border-[#e6b967]/50 shadow-[0_0_40px_rgba(230,185,103,0.25)]">
                <img
                  src="/oracle-logo.png"
                  alt="Neha Arora"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="mt-5 font-serif text-3xl text-[#f5f0e7]">Neha Arora</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-[#e6b967] font-medium">
                Founder & Intuitive Guide
              </span>
              <p className="mt-2 text-xs text-[#a8a9bf]">
                Tarot Reader · Archetypal Counselor · Sacred Goods Curator
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[#c7c8d8] leading-relaxed font-light">
              <p>
                &ldquo;I created OpenToSeeYourFuture with a singular vow: to offer seekers a quiet, reverent clearing where they can remember their own sovereignty. In a world saturated with loud noise and algorithmic urgency, the cards invite us to pause, listen to what is stirring under the surface, and breathe.&rdquo;
              </p>
              <p>
                Every reading held in this studio is rooted in depth psychology and empathetic resonance. We do not predict rigid doomsdays or make fear-based claims. Instead, we reveal the energetic architecture of your choices, illuminating the path where your greatest joy and peace reside.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={onOpenBookSession}
                  className="px-6 py-3 bg-[#e6b967] text-[#080914] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d8a74e] cursor-pointer"
                >
                  Book a Consultation
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="px-6 py-3 border border-[#25D366] text-[#25D366] text-xs uppercase tracking-wider rounded hover:bg-[#25D366]/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Studio Pillars */}
        <div className="mt-14">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#e6b967] font-semibold block">
            Our Code of Honor
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#f5f0e7]">
            The Four Foundations of Our Sanctuary
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'Radical Confidentiality',
                desc: 'Your private questions, relational dynamics, and session recordings remain 100% sacred and confidential. We never disclose client identities or share reading notes.',
                icon: Lock,
              },
              {
                title: 'Uncompromised Autonomy',
                desc: 'You hold the steering wheel of your life. The cards illuminate current patterns; your divine free will always retains the ultimate authority to shift momentum.',
                icon: Shield,
              },
              {
                title: 'No Fearmongering',
                desc: 'We strictly reject ominous curses, scare tactics, or dependency-building claims. Difficult cards are read with deep psychological compassion and clear medicine.',
                icon: Heart,
              },
              {
                title: 'Consecrated Goods',
                desc: 'Every stone, candle, and journal in our boutique is ethically harvested, cleansed with Palo Santo and mountain lavender, and charged under clean lunar cycles.',
                icon: Star,
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/75 p-7 backdrop-blur-md"
              >
                <pillar.icon className="w-6 h-6 text-[#e6b967]" />
                <h3 className="mt-4 font-serif text-2xl text-[#f5f0e7]">{pillar.title}</h3>
                <p className="mt-2.5 text-xs text-[#a8a9bf] leading-relaxed font-light">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Contact Footer */}
        <div className="mt-14 rounded-2xl border border-[#e6b967]/20 bg-[#111326]/60 p-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#e6b967]">
            Direct Inquiries
          </span>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-[#f5f0e7]">
            Have a question for Neha?
          </h3>
          <p className="mt-2 text-xs text-[#a8a9bf] max-w-md mx-auto">
            Whether inquiring about custom consecrated orders, private group readings, or session details:
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="px-6 py-3 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#20ba5a] flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +91 82191 79738</span>
            </button>
            <a
              href="https://instagram.com/opentoseeyourfuture"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#e6b967]/40 text-[#f5f0e7] text-xs uppercase tracking-wider rounded transition-colors hover:bg-[#e6b967]/10 flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>@opentoseeyourfuture</span>
            </a>
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
