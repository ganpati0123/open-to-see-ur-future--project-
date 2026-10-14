import React from 'react';
import { TarotCard } from '../data/tarotData';
import { TarotCardView } from './TarotCardView';
import { X, Sparkles, Compass, Bookmark, Share2 } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface CardDetailModalProps {
  card: TarotCard | null;
  positionName?: string;
  positionDescription?: string;
  isReversed: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  positionName,
  positionDescription,
  isReversed,
  isOpen,
  onClose
}) => {
  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-xl border border-[#C4A484]/40 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E6E0D6]/50 transition-colors cursor-pointer"
          aria-label="Close card detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        {positionName && (
          <div className="mb-6 pb-4 border-b border-[#E6E0D6]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#A98765] block font-medium">
              Spread Position
            </span>
            <h4 className="font-serif text-2xl text-[#1A1A1A]">{positionName}</h4>
            {positionDescription && (
              <p className="text-xs text-[#8E8271] mt-0.5">{positionDescription}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Card Visual Left */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <TarotCardView
              card={card}
              isFlipped={true}
              isReversed={isReversed}
              size="lg"
              showDetails={false}
            />
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wider text-[#A98765]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isReversed ? 'Inverted Medicine' : 'Upright Resonance'}</span>
            </div>
          </div>

          {/* Card Interpretations Right */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8E8271]">
                <span>{card.arcana} Arcana</span>
                <span>·</span>
                <span>Element: {card.element}</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-1">
                {card.name}
              </h3>
              <p className="text-xs text-[#8E8271] italic mt-1">
                Motif: {card.symbol}
              </p>
            </div>

            {/* Keywords */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A98765] font-medium block mb-1.5">
                Active Energetic Frequencies
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-[#1A1A1A]/80">
                {(isReversed ? card.keywordsReversed : card.keywordsUpright).map((kw, i) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-[#F5F1EB] border border-[#E6E0D6] rounded text-[11px]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* In-depth Meaning */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#A98765] font-medium block">
                {isReversed ? 'Reversed Interpretation' : 'Upright Interpretation'}
              </span>
              <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-light">
                {isReversed ? card.reversedMeaning : card.uprightMeaning}
              </p>
            </div>

            {/* Neha Arora's Intuitive Guidance */}
            <div className="p-4 bg-[#F5F1EB] rounded-lg border-l-2 border-[#A98765]">
              <span className="text-[10px] uppercase tracking-widest text-[#A98765] font-semibold block mb-1">
                Guidance from Neha Arora
              </span>
              <p className="font-serif italic text-base text-[#1A1A1A]">
                "{card.guidance}"
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  playChimeSound();
                  alert(`Copied notes for ${card.name} to journal clipboard!`);
                }}
                className="px-4 py-2 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#1A1A1A]/30 text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors rounded-sm cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
