import React from 'react';
import { TAROT_SPREADS, TarotSpread } from '../data/tarotData';
import { Clock, ArrowRight, Sparkles, Crown } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface ChooseSpreadProps {
  onSelectSpread: (spread: TarotSpread) => void;
  selectedSpreadId: string;
}

export const ChooseSpread: React.FC<ChooseSpreadProps> = ({
  onSelectSpread,
  selectedSpreadId
}) => {
  return (
    <section id="spreads" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8E8271]">
          <span>Architectures of Divination</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight">
          Choose Your Sacred Spread
        </h2>
        <p className="text-sm sm:text-base text-[#1A1A1A]/70 font-light">
          Each spread operates as a distinct lens. Select the configuration that honors the depth of the inquiry in your heart today.
        </p>
      </div>

      {/* Grid of 4 Spreads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {TAROT_SPREADS.map((spread) => {
          const isSelected = selectedSpreadId === spread.id;

          return (
            <div
              key={spread.id}
              onClick={() => {
                playChimeSound();
                onSelectSpread(spread);
              }}
              className={`relative rounded-xl bg-[#FCFAF7] p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-2 hover:shadow-xl ${
                isSelected
                  ? 'border-[#A98765] ring-2 ring-[#C4A484]/30 shadow-lg'
                  : 'border-[#E6E0D6] hover:border-[#C4A484]'
              }`}
            >
              {/* Top Tag & Card Count */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] tracking-widest uppercase font-medium flex items-center gap-1 ${
                    spread.isPremium ? 'text-[#A98765]' : 'text-[#8E8271]'
                  }`}>
                    {spread.isPremium && <Crown className="w-3.5 h-3.5 text-[#A98765]" />}
                    {spread.tag}
                  </span>
                  
                  <span className="text-[11px] font-mono text-[#8E8271] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{spread.duration}</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="font-serif text-2xl text-[#1A1A1A] group-hover:text-[#A98765] transition-colors mb-1">
                  {spread.title}
                </h3>

                <p className="text-xs text-[#8E8271] italic mb-4">
                  {spread.subtitle}
                </p>

                <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-light mb-6">
                  {spread.description}
                </p>

                {/* Visual Card Archetype Layout preview */}
                <div className="py-3 px-3 bg-[#F5F1EB] rounded-lg border border-[#E6E0D6]/80 mb-6">
                  <div className="flex items-center justify-between text-[11px] text-[#1A1A1A] font-medium mb-2">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#A98765]" />
                      <span>{spread.cardCount} {spread.cardCount === 1 ? 'Card' : 'Cards'}</span>
                    </span>
                    <span className="text-[10px] text-[#8E8271] uppercase tracking-wider">Spread Geometry</span>
                  </div>

                  {/* Micro mini cards visual representation */}
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    {Array.from({ length: Math.min(spread.cardCount, 6) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-6 rounded-xs bg-[#1C1A18] border border-[#C4A484]/40"
                      />
                    ))}
                    {spread.cardCount > 6 && (
                      <span className="text-[10px] font-mono text-[#8E8271] ml-1">+{spread.cardCount - 6}</span>
                    )}
                  </div>
                </div>

                {/* Position names teaser */}
                <div className="space-y-1 mb-6 text-[11px] text-[#8E8271]">
                  <span className="uppercase text-[9px] tracking-wider text-[#A98765] block font-medium mb-1">
                    Positions Include:
                  </span>
                  {spread.positions.slice(0, 3).map((pos) => (
                    <div key={pos.name} className="flex items-center gap-1.5 truncate">
                      <span className="text-[#C4A484]">·</span>
                      <span className="truncate">{pos.name}</span>
                    </div>
                  ))}
                  {spread.positions.length > 3 && (
                    <span className="text-[10px] italic text-[#8E8271] block">
                      +{spread.positions.length - 3} additional oracle positions
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-4 border-t border-[#E6E0D6]/60">
                <button
                  className={`w-full py-2.5 px-3 rounded-sm text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-[#F5F1EB]'
                      : 'border border-[#1A1A1A]/30 text-[#1A1A1A] group-hover:border-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#F5F1EB]'
                  }`}
                >
                  <span>{isSelected ? 'Active Spread' : 'Select Spread'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
