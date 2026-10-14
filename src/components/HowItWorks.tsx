import React from 'react';
import { PenLine, Compass, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Set Your Intention',
      icon: <PenLine className="w-5 h-5 text-[#A98765]" />,
      description: 'Ground your nervous system. Formulate the single question or area of life where your spirit seeks unvarnished clarity.'
    },
    {
      num: '02',
      title: 'Pick Your Spread',
      icon: <Compass className="w-5 h-5 text-[#A98765]" />,
      description: 'Select an architectural alignment — from a quick single pull to the comprehensive 10-card Celtic Cross.'
    },
    {
      num: '03',
      title: 'Reveal Your Future',
      icon: <Sparkles className="w-5 h-5 text-[#A98765]" />,
      description: 'Unveil archetypal mirrors, upright and reversed subtleties, and Neha Arora’s intuitive synthesis tailored to your exact journey.'
    }
  ];

  return (
    <section className="py-24 border-y border-[#E6E0D6]/80 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8E8271]">
            Methodology & Alignment
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight">
            How The Oracle Unfolds
          </h2>
          <p className="text-sm sm:text-base text-[#1A1A1A]/70 font-light">
            Tarot is not passive fortune-telling; it is an active sacred dialogue between your subconscious wisdom and universal archetypes.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative p-8 rounded-lg bg-[#FCFAF7] border border-[#E6E0D6] shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-serif text-3xl sm:text-4xl text-[#C4A484] group-hover:text-[#A98765] transition-colors">
                  {step.num}.
                </span>
                <div className="w-10 h-10 rounded-full bg-[#F5F1EB] border border-[#E6E0D6] flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-medium">
                  {step.title}
                </h3>
                <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {/* Bottom decorative hairline */}
              <div className="mt-8 pt-4 border-t border-[#E6E0D6]/60 flex items-center justify-between text-[11px] text-[#8E8271] uppercase tracking-wider">
                <span>Phase {idx + 1}</span>
                <span>✦</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
