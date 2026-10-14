import React from 'react';
import { TarotCard } from '../data/tarotData';
import { Sparkles, Compass, Flame, Droplets, Wind, Mountain, Moon, Sun, Star } from 'lucide-react';

interface TarotCardViewProps {
  card?: TarotCard;
  isFlipped?: boolean; // true = show front, false = show back
  isReversed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  positionLabel?: string;
  showDetails?: boolean;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  isFlipped = false,
  isReversed = false,
  size = 'md',
  onClick,
  className = '',
  positionLabel,
  showDetails = true
}) => {
  // Sizing styles
  const sizeClasses = {
    sm: 'w-28 h-44 text-xs',
    md: 'w-44 h-72 text-sm',
    lg: 'w-64 h-[26rem] text-base'
  }[size];

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Fire': return <Flame className="w-3.5 h-3.5 text-[#C4A484]" />;
      case 'Water': return <Droplets className="w-3.5 h-3.5 text-[#A98765]" />;
      case 'Air': return <Wind className="w-3.5 h-3.5 text-[#C4A484]" />;
      case 'Earth': return <Mountain className="w-3.5 h-3.5 text-[#8E8271]" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />;
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {positionLabel && (
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8E8271] mb-2 text-center max-w-[12rem] truncate">
          {positionLabel}
        </span>
      )}

      <div
        onClick={onClick}
        className={`relative ${sizeClasses} perspective-1000 cursor-pointer select-none group transition-transform duration-300 hover:-translate-y-1.5`}
      >
        <div
          className={`w-full h-full relative transform-style-3d transition-transform duration-700 rounded-xl shadow-md group-hover:shadow-xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-[#1C1A18] text-[#F5F1EB] p-3 border border-[#C4A484]/40 shadow-inner flex flex-col items-center justify-between overflow-hidden">
            {/* Corner Filigree */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C4A484]/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C4A484]/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C4A484]/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C4A484]/60" />

            {/* Inner Border */}
            <div className="absolute inset-2 border border-[#C4A484]/30 rounded-lg pointer-events-none" />
            
            {/* Celestial Centerpiece */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-[#C4A484]/60 uppercase px-1 z-10">
              <span>✦</span>
              <span>OpenToSee</span>
              <span>✦</span>
            </div>

            <div className="relative my-auto flex flex-col items-center justify-center">
              {/* Concentric Gold Rings */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-[#C4A484]/40 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-dashed border-[#C4A484]/50 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-[#C4A484]/70 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-[#C4A484] animate-spin-slow stroke-[1.2]" />
                  </div>
                </div>
                {/* Orbital dots */}
                <div className="absolute -top-1 w-2 h-2 rounded-full bg-[#C4A484]" />
                <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#C4A484]" />
                <div className="absolute -left-1 w-2 h-2 rounded-full bg-[#C4A484]" />
                <div className="absolute -right-1 w-2 h-2 rounded-full bg-[#C4A484]" />
              </div>
            </div>

            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-[#C4A484]/60 uppercase px-1 z-10">
              <span>Your</span>
              <span>✦</span>
              <span>Future</span>
            </div>
          </div>

          {/* ================= CARD FRONT ================= */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-[#FCFAF7] text-[#1A1A1A] p-3 sm:p-4 border border-[#C4A484]/60 shadow-lg flex flex-col justify-between overflow-hidden ${
              isReversed ? 'rotate-180' : ''
            }`}
          >
            {/* Corner details */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#C4A484]" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#C4A484]" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#C4A484]" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#C4A484]" />
            <div className="absolute inset-2 border border-[#C4A484]/30 rounded-lg pointer-events-none" />

            {/* Top header of card */}
            <div className="flex items-center justify-between z-10 text-[10px] tracking-widest uppercase text-[#8E8271]">
              <span className="font-mono">{card?.number || 'I'}</span>
              <span className="flex items-center gap-1">
                {card?.element && getElementIcon(card.element)}
                <span className="text-[9px]">{card?.element}</span>
              </span>
            </div>

            {/* Central Mystical Artwork */}
            <div className="my-auto flex flex-col items-center justify-center text-center px-1 z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F5F1EB] border border-[#C4A484]/40 flex items-center justify-center mb-3 shadow-inner">
                {card?.arcana === 'major' ? (
                  card?.number === 'XIX' ? (
                    <Sun className="w-8 h-8 text-[#A98765] stroke-[1.2]" />
                  ) : card?.number === 'XVIII' ? (
                    <Moon className="w-8 h-8 text-[#A98765] stroke-[1.2]" />
                  ) : (
                    <Star className="w-8 h-8 text-[#A98765] stroke-[1.2]" />
                  )
                ) : (
                  <Sparkles className="w-8 h-8 text-[#A98765] stroke-[1.2]" />
                )}
              </div>

              <h4 className="font-serif text-base sm:text-lg text-[#1A1A1A] leading-tight mb-1">
                {card?.name || 'Tarot Card'}
              </h4>

              <p className="text-[10px] text-[#8E8271] italic tracking-wide max-w-[12rem] line-clamp-2">
                "{card?.symbol}"
              </p>
            </div>

            {/* Bottom Card Footer */}
            <div className="z-10 text-center border-t border-[#E6E0D6] pt-1.5">
              <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-wider text-[#A98765] font-medium">
                <span>{isReversed ? '↺ Reversed' : '✦ Upright'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetails && card && isFlipped && (
        <div className="mt-2 text-center max-w-[14rem]">
          <p className="text-xs font-serif text-[#1A1A1A] font-medium">{card.name}</p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#8E8271]">
            <span>{isReversed ? 'Inverted' : 'Upright'}</span>
            <span>·</span>
            <span>{card.keywordsUpright[0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};
