import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ALL_78_TAROT_CARDS,
  TarotCard,
  TarotSpread,
  TAROT_SPREADS
} from '../data/tarotData';
import { TarotCardView } from './TarotCardView';
import { CardDetailModal } from './CardDetailModal';
import {
  Sparkles,
  RefreshCw,
  Compass,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Share2,
  Printer,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  playChimeSound,
  playCardShuffleSound,
  playCardFlipSound
} from '../utils/audio';

interface InteractiveReadingProps {
  currentSpread: TarotSpread;
  onChangeSpread: (spread: TarotSpread) => void;
  onBookSession: () => void;
}

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  isFlipped: boolean;
  positionIndex: number;
}

export const InteractiveReading: React.FC<InteractiveReadingProps> = ({
  currentSpread,
  onChangeSpread,
  onBookSession
}) => {
  // Steps: 1: Intention -> 2: Shuffle -> 3: Pick Cards (Fan) -> 4 & 5: Reveal Spread
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [intention, setIntention] = useState<string>('');
  const [shufflingProgress, setShufflingProgress] = useState<number>(0);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [selectedCardForModal, setSelectedCardForModal] = useState<{
    card: TarotCard;
    isReversed: boolean;
    posName: string;
    posDesc: string;
  } | null>(null);

  // 26 cards representing the fanned deck on screen
  const [fannedDeck, setFannedDeck] = useState<number[]>(
    Array.from({ length: 26 }, (_, i) => i)
  );

  // Suggested intentions
  const SUGGESTIONS = [
    "Where should I direct my creative energy this month?",
    "What is the hidden truth in my current relationship?",
    "What subconscious block am I ready to release?",
    "What is the highest alignment for my career right now?",
    "General guidance for my spiritual and life path"
  ];

  // Reset when spread changes
  useEffect(() => {
    setDrawnCards([]);
    setCurrentStep(1);
  }, [currentSpread.id]);

  // Step 2 Shuffle timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 2) {
      playCardShuffleSound();
      setShufflingProgress(0);
      interval = setInterval(() => {
        setShufflingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep(3);
              playChimeSound();
            }, 400);
            return 100;
          }
          return prev + 12;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  // Start Shuffle from Step 1
  const handleStartShuffle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!intention.trim()) {
      setIntention('General Cosmic Guidance');
    }
    setCurrentStep(2);
  };

  // User clicks a card from the fanned deck in Step 3
  const handlePickCardFromDeck = (deckIndex: number) => {
    if (drawnCards.length >= currentSpread.cardCount) return;

    playCardFlipSound();

    // Pick a pseudo-random unique card from all 78 cards
    const alreadyDrawnIds = new Set(drawnCards.map((d) => d.card.id));
    const availableCards = ALL_78_TAROT_CARDS.filter(
      (c) => !alreadyDrawnIds.has(c.id)
    );
    const randomCard =
      availableCards[Math.floor(Math.random() * availableCards.length)];

    // 25% chance of card appearing in reverse
    const isReversed = Math.random() < 0.25;

    const newDrawn: DrawnCard = {
      card: randomCard,
      isReversed,
      isFlipped: false,
      positionIndex: drawnCards.length
    };

    const updated = [...drawnCards, newDrawn];
    setDrawnCards(updated);

    // Remove picked visual card from fan
    setFannedDeck((prev) => prev.filter((idx) => idx !== deckIndex));

    // If all cards drawn, automatically advance to Reveal Spread Step 4
    if (updated.length === currentSpread.cardCount) {
      setTimeout(() => {
        setCurrentStep(4);
        playChimeSound();
      }, 700);
    }
  };

  // Flip a single card in Reveal step
  const handleFlipCard = (index: number) => {
    playCardFlipSound();
    setDrawnCards((prev) =>
      prev.map((d, i) => (i === index ? { ...d, isFlipped: !d.isFlipped } : d))
    );
  };

  // Flip all cards at once
  const handleFlipAllCards = () => {
    playChimeSound();
    setDrawnCards((prev) => prev.map((d) => ({ ...d, isFlipped: true })));
  };

  // Reset entire reading
  const handleResetReading = () => {
    playChimeSound();
    setDrawnCards([]);
    setFannedDeck(Array.from({ length: 26 }, (_, i) => i));
    setCurrentStep(1);
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-7jhft7fsbc4nlbh5xm6kd6-859149636008.asia-southeast1.run.app';
    const text = `✨ *My Tarot Reading from openToSeeYourFuture* ✨\n\n🔮 *Spread:* ${currentSpread.title}\n💭 *Intention:* "${intention}"\n\n🎴 *Cards Drawn:*\n` +
      drawnCards
        .map((d, i) => {
          const pos = currentSpread.positions[i]?.name || `Position ${i + 1}`;
          return `• *${pos}:* ${d.card.name} (${d.isReversed ? 'Inverted' : 'Upright'}) - _${d.card.keywordsUpright[0]}_`;
        })
        .join('\n') +
      `\n\n🌿 *Guidance by Neha Arora:*\n"Honor the quiet shift. Every card placed today points toward reclaiming sovereignty over your timeline."\n\n👉 *Get your own reading here:* ${siteUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy reading summary
  const handleCopySummary = () => {
    const text = `Oracle Reading: ${currentSpread.title}\nIntention: "${intention}"\nGuided by Neha Arora · OpenToSeeYourFuture\n\nCards Drawn:\n` +
      drawnCards
        .map((d, i) => {
          const pos = currentSpread.positions[i]?.name || `Position ${i + 1}`;
          return `${pos}: ${d.card.name} (${d.isReversed ? 'Reversed' : 'Upright'}) - ${d.card.keywordsUpright.join(', ')}`;
        })
        .join('\n') +
      `\n\nNeha's Synthesis:\n"Honor the quiet shift. Every card placed today points toward reclaiming sovereignty over your timeline."`;

    navigator.clipboard?.writeText(text);
    alert('Reading summary copied to your clipboard!');
  };

  return (
    <section id="readings" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Spread switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8E8271] mb-2">
            <span>Oracle Sanctuary</span>
            <span>·</span>
            <span className="text-[#A98765] font-medium">Interactive Consultation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight">
            Consult the Cards
          </h2>
          <p className="text-sm text-[#8E8271] mt-1 font-light">
            Current Alignment: <strong className="font-medium text-[#1A1A1A]">{currentSpread.title}</strong> ({currentSpread.cardCount} {currentSpread.cardCount === 1 ? 'Card' : 'Cards'})
          </p>
        </div>

        {/* Change Spread Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF7F2] rounded-lg border border-[#E6E0D6]">
          {TAROT_SPREADS.map((sp) => (
            <button
              key={sp.id}
              onClick={() => {
                if (currentSpread.id !== sp.id) {
                  playChimeSound();
                  onChangeSpread(sp);
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                currentSpread.id === sp.id
                  ? 'bg-[#1A1A1A] text-[#F5F1EB] shadow-sm'
                  : 'text-[#8E8271] hover:text-[#1A1A1A]'
              }`}
            >
              {sp.title}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto text-xs font-medium text-[#8E8271]">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#1A1A1A]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-[#1A1A1A] text-[#F5F1EB]' : 'bg-[#E6E0D6]'}`}>
              1
            </span>
            <span className="hidden sm:inline">Set Intention</span>
          </div>
          <div className="w-12 sm:w-20 h-[1px] bg-[#E6E0D6]" />
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#1A1A1A]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-[#1A1A1A] text-[#F5F1EB]' : 'bg-[#E6E0D6]'}`}>
              2
            </span>
            <span className="hidden sm:inline">Shuffle Deck</span>
          </div>
          <div className="w-12 sm:w-20 h-[1px] bg-[#E6E0D6]" />
          <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#1A1A1A]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-[#1A1A1A] text-[#F5F1EB]' : 'bg-[#E6E0D6]'}`}>
              3
            </span>
            <span className="hidden sm:inline">Pick {currentSpread.cardCount} Cards</span>
          </div>
          <div className="w-12 sm:w-20 h-[1px] bg-[#E6E0D6]" />
          <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-[#1A1A1A]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 4 ? 'bg-[#1A1A1A] text-[#F5F1EB]' : 'bg-[#E6E0D6]'}`}>
              4
            </span>
            <span className="hidden sm:inline">Reveal & Read</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: SET INTENTION */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-2xl bg-[#FCFAF7] border border-[#E6E0D6] shadow-sm text-center">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98765] block font-medium mb-2">
            Step 1 of 4
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mb-3">
            What is on your heart?
          </h3>
          <p className="text-sm text-[#1A1A1A]/70 font-light max-w-lg mx-auto mb-8">
            Take a gentle inhalation. Hold what weighs upon your spirit or the path you wish illuminated. Write your intention below.
          </p>

          <form onSubmit={handleStartShuffle} className="space-y-6">
            <div className="relative">
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="e.g. What guidance does my soul need as I make this life transition?"
                rows={3}
                className="w-full p-4 rounded-lg bg-[#FAF7F2] border border-[#C4A484]/40 text-[#1A1A1A] placeholder:text-[#8E8271]/50 focus:outline-none focus:ring-1 focus:ring-[#A98765] focus:border-[#A98765] text-sm leading-relaxed"
              />
            </div>

            {/* Suggestion Chips */}
            <div className="text-left space-y-2">
              <span className="text-[10px] tracking-wider uppercase text-[#8E8271] block font-medium">
                Or select an inquiry template:
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setIntention(sug)}
                    className="text-xs text-[#1A1A1A]/80 hover:text-[#1A1A1A] px-3 py-1.5 bg-[#F5F1EB] hover:bg-[#E6E0D6] rounded-md border border-[#E6E0D6] transition-colors cursor-pointer text-left"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A98765] transition-all rounded-sm shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Shuffle the Deck</span>
                <ArrowRight className="w-4 h-4 text-[#C4A484]" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SHUFFLE ANIMATION */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="max-w-xl mx-auto py-16 text-center space-y-8">
          <div className="relative w-48 h-64 mx-auto flex items-center justify-center">
            {/* Visual deck shuffling cards */}
            {[0, 1, 2, 3, 4].map((idx) => (
              <motion.div
                key={idx}
                animate={{
                  x: [0, (idx % 2 === 0 ? 1 : -1) * (30 + idx * 8), 0],
                  rotate: [0, (idx % 2 === 0 ? 1 : -1) * (8 + idx * 2), 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.85,
                  delay: idx * 0.1,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-36 h-56 mx-auto rounded-xl bg-[#1C1A18] border border-[#C4A484]/50 shadow-xl flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full border border-dashed border-[#C4A484]/40 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#C4A484] animate-spin-slow stroke-[1.2]" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98765] block font-medium">
              Grounding Intention
            </span>
            <h3 className="font-serif text-3xl text-[#1A1A1A]">
              Shuffling the Cosmic Deck...
            </h3>
            <p className="text-xs text-[#8E8271] italic">
              "{intention}"
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-64 mx-auto bg-[#E6E0D6] h-1 rounded-full overflow-hidden">
            <div
              className="bg-[#A98765] h-full transition-all duration-200"
              style={{ width: `${shufflingProgress}%` }}
            />
          </div>

          <p className="text-xs text-[#8E8271]">
            Feel your breath slow down as the archetypes arrange themselves.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: FANNED DECK PICKING */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-12">
          {/* Status Kicker */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98765] font-medium block">
              Step 3: Select Your Cards
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
              Draw {currentSpread.cardCount - drawnCards.length} More {currentSpread.cardCount - drawnCards.length === 1 ? 'Card' : 'Cards'}
            </h3>
            <p className="text-sm text-[#1A1A1A]/70 font-light">
              Trust your immediate intuitive pull. Hover over the fan and click whichever card calls to your spirit.
            </p>
          </div>

          {/* Drawn Slots Bar */}
          <div className="p-4 sm:p-6 bg-[#FAF7F2] rounded-xl border border-[#E6E0D6] max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="font-medium text-[#1A1A1A]">
                Spread Alignment Slots:
              </span>
              <span className="text-[#8E8271] tabular-nums">
                {drawnCards.length} / {currentSpread.cardCount} Cards Drawn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: currentSpread.cardCount }).map((_, i) => {
                const drawn = drawnCards[i];
                const pos = currentSpread.positions[i];

                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                      drawn
                        ? 'bg-[#FCFAF7] border-[#A98765] shadow-xs'
                        : 'bg-transparent border-dashed border-[#E6E0D6]'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#8E8271] mb-1">
                      {i + 1}
                    </span>
                    <span className="text-xs font-serif text-[#1A1A1A] font-medium truncate w-full mb-1">
                      {pos?.name || `Card ${i + 1}`}
                    </span>
                    {drawn ? (
                      <span className="text-[10px] text-[#A98765] flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Drawn</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8E8271]/60 italic">
                        Awaiting Pick
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FANNED DECK ARC */}
          <div className="relative py-12 px-4 flex items-center justify-center min-h-[380px] overflow-x-auto overflow-y-visible">
            <div className="relative flex items-center justify-center h-72 w-full max-w-4xl">
              {fannedDeck.map((deckIdx, arrayIndex) => {
                const total = fannedDeck.length;
                const mid = (total - 1) / 2;
                const offset = arrayIndex - mid;
                const rotation = offset * 2.8; // degrees fan arc
                const translateY = Math.abs(offset) * 3.5; // arc curve
                const translateX = offset * 26; // horizontal distribution

                return (
                  <motion.div
                    key={deckIdx}
                    whileHover={{
                      y: translateY - 40,
                      scale: 1.15,
                      zIndex: 50,
                      transition: { duration: 0.15 }
                    }}
                    style={{
                      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`,
                      transformOrigin: 'bottom center',
                      zIndex: arrayIndex
                    }}
                    onClick={() => handlePickCardFromDeck(deckIdx)}
                    className="absolute cursor-pointer transition-shadow"
                  >
                    <div className="w-24 sm:w-28 h-40 sm:h-44 rounded-lg bg-[#1C1A18] border border-[#C4A484]/60 shadow-md hover:shadow-2xl flex flex-col justify-between p-2 select-none group">
                      <div className="w-full flex justify-between text-[8px] text-[#C4A484]/60 uppercase">
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                      <div className="my-auto mx-auto w-8 h-8 rounded-full border border-[#C4A484]/40 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-[#C4A484] group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-center text-[7px] tracking-widest text-[#C4A484]/60 uppercase">
                        Select
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* If ready to reveal */}
          {drawnCards.length === currentSpread.cardCount && (
            <div className="text-center animate-in fade-in duration-300">
              <button
                onClick={() => {
                  playChimeSound();
                  setCurrentStep(4);
                }}
                className="px-10 py-4 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A98765] transition-all rounded-sm shadow-md hover:shadow-xl cursor-pointer"
              >
                Reveal Your Oracle Reading
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4 & 5: READING REVEAL & INTERPRETATIONS */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-16 animate-in fade-in duration-500">
          
          {/* Header & Controls */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98765] font-semibold block">
              The Oracle Has Spoken
            </span>
            <h3 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A]">
              Your Reading for "{intention}"
            </h3>
            <p className="text-sm text-[#8E8271] font-light">
              Click individual cards to flip them and uncover their archetypal message, or reveal the entire spread at once.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleFlipAllCards}
                className="px-4 py-2 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-colors rounded-sm cursor-pointer"
              >
                Flip All Cards
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 bg-[#25D366] text-white text-xs uppercase tracking-widest hover:bg-[#20ba59] transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer shadow-xs font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 border border-[#1A1A1A]/30 text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#1A1A1A]/30 text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Reading</span>
              </button>
              <button
                onClick={handleResetReading}
                className="px-4 py-2 border border-[#1A1A1A]/30 text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Draw Again</span>
              </button>
            </div>
          </div>

          {/* SPREAD CARDS DISPLAY GRID */}
          <div className="p-6 sm:p-10 rounded-2xl bg-[#FCFAF7] border border-[#E6E0D6] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-4 mb-8 text-xs text-[#8E8271]">
              <span className="uppercase tracking-widest font-medium">Spread Architecture: {currentSpread.title}</span>
              <span>Tap card to flip · Click title to inspect</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-10">
              {drawnCards.map((item, idx) => {
                const pos = currentSpread.positions[idx];
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <TarotCardView
                      card={item.card}
                      isFlipped={item.isFlipped}
                      isReversed={item.isReversed}
                      size="md"
                      positionLabel={pos?.name || `Position ${idx + 1}`}
                      onClick={() => handleFlipCard(idx)}
                    />

                    {item.isFlipped && (
                      <button
                        onClick={() =>
                          setSelectedCardForModal({
                            card: item.card,
                            isReversed: item.isReversed,
                            posName: pos?.name || `Card ${idx + 1}`,
                            posDesc: pos?.description || ''
                          })
                        }
                        className="mt-3 text-xs text-[#A98765] hover:text-[#1A1A1A] flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      >
                        <span>Deep Dive Meaning</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEHA ARORA'S SYNTHESIS & POSITION BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Neha's Holistic Guidance */}
            <div className="lg:col-span-5 p-8 rounded-xl bg-[#FAF7F2] border border-[#C4A484]/40 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1C1A18] text-[#C4A484] flex items-center justify-center font-serif text-xl border border-[#C4A484]/40">
                  NA
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#1A1A1A]">Neha Arora</h4>
                  <p className="text-xs text-[#8E8271]">Master Tarot Reader & Guide</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#A98765] font-semibold block">
                  Holistic Synthesis
                </span>
                <p className="font-serif italic text-lg sm:text-xl text-[#1A1A1A] leading-relaxed">
                  "Notice the subtle balance of elements appearing in your spread today. The oracle is asking you to stop over-analyzing what your intuition already knows."
                </p>
                <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-light">
                  Your intention regarding <em>"{intention}"</em> is not an isolated event; it is a sacred turning of the wheel. Allow the lessons of your foundation to root you so you can open your hands to the upcoming horizon.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E0D6] space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8271] block">
                  Want Neha to read this spread personally with you?
                </span>
                <button
                  onClick={onBookSession}
                  className="w-full py-3 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C4A484]" />
                  <span>Book 1:1 Live Deep Dive ($150)</span>
                </button>
              </div>
            </div>

            {/* Right: Detailed Position Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <h4 className="font-serif text-2xl text-[#1A1A1A] border-b border-[#E6E0D6] pb-3">
                Position Analysis & Interpretations
              </h4>

              <div className="space-y-4">
                {drawnCards.map((item, idx) => {
                  const pos = currentSpread.positions[idx];
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-lg bg-[#FCFAF7] border border-[#E6E0D6] space-y-3 hover:border-[#C4A484] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-mono text-[#A98765] uppercase tracking-wider">
                            Position {idx + 1} · {pos?.name}
                          </span>
                          <h5 className="font-serif text-lg text-[#1A1A1A]">
                            {item.card.name} {item.isReversed ? '(Inverted)' : '(Upright)'}
                          </h5>
                        </div>
                        <span className="text-xs text-[#8E8271] italic">
                          {pos?.description}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-light">
                        {item.isReversed ? item.card.reversedMeaning : item.card.uprightMeaning}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-[#8E8271] border-t border-[#E6E0D6]/60">
                        <span>Frequency: {(item.isReversed ? item.card.keywordsReversed : item.card.keywordsUpright).join(' · ')}</span>
                        <button
                          onClick={() =>
                            setSelectedCardForModal({
                              card: item.card,
                              isReversed: item.isReversed,
                              posName: pos?.name || `Position ${idx + 1}`,
                              posDesc: pos?.description || ''
                            })
                          }
                          className="text-[#A98765] hover:text-[#1A1A1A] font-medium cursor-pointer"
                        >
                          View Symbol Detail →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Deep Dive Card Modal */}
      <CardDetailModal
        card={selectedCardForModal?.card || null}
        positionName={selectedCardForModal?.posName}
        positionDescription={selectedCardForModal?.posDesc}
        isReversed={selectedCardForModal?.isReversed || false}
        isOpen={!!selectedCardForModal}
        onClose={() => setSelectedCardForModal(null)}
      />
    </section>
  );
};
