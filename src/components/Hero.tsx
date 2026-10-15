import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, ShieldCheck, Heart, Moon } from 'lucide-react';
import { MAJOR_ARCANA } from '../data/tarotData';
import { TarotCardView } from './TarotCardView';
import { playChimeSound, playCardShuffleSound } from '../utils/audio';

interface HeroProps {
  onStartReading: () => void;
  onExploreShop: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartReading, onExploreShop }) => {
  // Mouse position for subtle parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [shuffledCards, setShuffledCards] = useState([
    { card: MAJOR_ARCANA[1], flipped: true, reversed: false, rotate: -8, z: 10 },  // The Magician
    { card: MAJOR_ARCANA[2], flipped: true, reversed: false, rotate: 2, z: 20 },   // The High Priestess
    { card: MAJOR_ARCANA[17], flipped: true, reversed: false, rotate: 10, z: 10 }  // The Star
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleShuffleHover = () => {
    playCardShuffleSound();
    setShuffledCards((prev) => [
      { ...prev[1], rotate: -12 + Math.random() * 6 },
      { ...prev[2], rotate: -2 + Math.random() * 6 },
      { ...prev[0], rotate: 8 + Math.random() * 6 }
    ]);
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="cosmic-shell relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20 bg-grain"
    >
      {/* Ambient background glow & subtle decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C4A484]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-16 left-12 w-32 h-32 border border-[#C4A484]/20 rounded-full pointer-events-none -z-10 hidden lg:block" />
      <div className="absolute bottom-20 right-16 w-48 h-48 border border-[#E6E0D6] rounded-full pointer-events-none -z-10 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#a8a9bf]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e6b967]" />
              <span>Sanctuary of Intuition & Archetypes</span>
              <span>·</span>
              <span className="text-[#f5f0e7] font-medium">Curated by Neha Arora</span>
            </div>

            {/* Big Serif Heading: 80px */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[84px] leading-[1.02] tracking-tight text-[#f5f0e7] text-balance">
              Open to See <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#e6b967]">Your Future.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#f5f0e7]/75 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Intuitive tarot readings for love, life & purpose. Grounded sacred mirrors translated into profound, modern clarity without sensationalism or superstition.
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => {
                  playChimeSound();
                  onStartReading();
                }}
                className="w-full sm:w-auto px-8 py-4 bg-[#f5f0e7] text-[#F5F1EB] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#e6b967] transition-all duration-300 rounded-sm shadow-md hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Get Your Reading</span>
                <Sparkles className="w-4 h-4 text-[#C4A484] group-hover:rotate-12 transition-transform" />
              </button>

              <button
                onClick={onExploreShop}
                className="w-full sm:w-auto px-8 py-4 border border-[#f5f0e7]/30 text-[#f5f0e7] text-xs uppercase tracking-[0.2em] font-medium hover:border-[#f5f0e7] hover:bg-[#f5f0e7]/5 transition-all duration-300 rounded-sm cursor-pointer"
              >
                Explore Sacred Shop
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-6 border-t border-[#E6E0D6]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#a8a9bf]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#e6b967]" />
                <span>Zero Judgment Sacred Space</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#e6b967]" />
                <span>12,000+ Seekers Guided</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-[#e6b967]" />
                <span>High-Resonance Modern Archetypes</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Floating Tarot Cards that gently float and follow mouse */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div
              onMouseEnter={handleShuffleHover}
              className="relative w-[320px] sm:w-[380px] h-[440px] flex items-center justify-center cursor-pointer group"
            >
              <div className="brand-orb cosmic-glow absolute inset-10 overflow-hidden rounded-full border border-[#e6b967]/35 opacity-70">
                <img src="/oracle-logo.png" alt="Mystic oracle holding a crystal ball" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_26%,rgba(8,9,20,.82)_78%)]" />
              </div>
              {/* Hint badge */}
              <div className="absolute -top-6 text-[10px] tracking-widest uppercase text-[#a8a9bf] opacity-75 group-hover:opacity-100 transition-opacity">
                Hover to shuffle & align
              </div>

              {/* Card 1: Left */}
              <motion.div
                animate={{
                  x: mousePos.x * 20 - 65,
                  y: mousePos.y * 15 - 10,
                  rotate: shuffledCards[0].rotate
                }}
                transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                className="absolute z-10 filter drop-shadow-lg"
              >
                <TarotCardView
                  card={shuffledCards[0].card}
                  isFlipped={shuffledCards[0].flipped}
                  isReversed={shuffledCards[0].reversed}
                  size="sm"
                  showDetails={false}
                />
              </motion.div>

              {/* Card 2: Center elevated */}
              <motion.div
                animate={{
                  x: mousePos.x * 35,
                  y: mousePos.y * 25,
                  rotate: shuffledCards[1].rotate,
                  scale: 1.05
                }}
                transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                className="absolute z-30 filter drop-shadow-2xl"
              >
                <TarotCardView
                  card={shuffledCards[1].card}
                  isFlipped={shuffledCards[1].flipped}
                  isReversed={shuffledCards[1].reversed}
                  size="md"
                  showDetails={false}
                />
              </motion.div>

              {/* Card 3: Right */}
              <motion.div
                animate={{
                  x: mousePos.x * 20 + 65,
                  y: mousePos.y * 15 + 10,
                  rotate: shuffledCards[2].rotate
                }}
                transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                className="absolute z-20 filter drop-shadow-lg"
              >
                <TarotCardView
                  card={shuffledCards[2].card}
                  isFlipped={shuffledCards[2].flipped}
                  isReversed={shuffledCards[2].reversed}
                  size="sm"
                  showDetails={false}
                />
              </motion.div>
            </div>

            {/* Sub-caption under cards */}
            <div className="mt-8 text-center">
              <p className="text-xs uppercase tracking-widest text-[#a8a9bf]">
                Interactive Portal
              </p>
              <p className="font-serif italic text-sm text-[#f5f0e7]">
                The cards shuffle as your heart settles.
              </p>
            </div>
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={onStartReading}
            className="flex flex-col items-center gap-2 text-[10px] tracking-widest uppercase text-[#a8a9bf] hover:text-[#f5f0e7] transition-colors cursor-pointer group"
          >
            <span>Begin Consultation</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#e6b967] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
