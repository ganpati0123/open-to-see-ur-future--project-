import React, { useState } from 'react';
import { TESTIMONIALS_DATA } from '../data/productsData';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    playChimeSound();
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const next = () => {
    playChimeSound();
    setCurrentIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section className="py-24 bg-[#FAF7F2] border-t border-[#E6E0D6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8E8271]">
            Echoes of Clarity
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A]">
            Words From The Circle
          </h2>
        </div>

        {/* Minimalist Carousel Card */}
        <div className="relative rounded-2xl bg-[#FCFAF7] border border-[#E6E0D6] p-8 sm:p-14 shadow-sm text-center">
          
          <div className="w-10 h-10 rounded-full bg-[#F5F1EB] border border-[#E6E0D6] flex items-center justify-center mx-auto mb-8 text-[#A98765]">
            <Quote className="w-5 h-5 fill-[#C4A484]/20 text-[#A98765]" />
          </div>

          <p className="font-serif text-xl sm:text-3xl text-[#1A1A1A] leading-relaxed max-w-3xl mx-auto mb-8 font-normal">
            "{current.quote}"
          </p>

          <div className="space-y-1">
            <h4 className="font-serif text-lg text-[#1A1A1A] font-medium">
              {current.author}
            </h4>
            <p className="text-xs text-[#8E8271]">
              {current.role} · {current.location}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-[#A98765] pt-1">
              Spread Experienced: {current.spread}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-[#E6E0D6] text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playChimeSound();
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#A98765]' : 'bg-[#E6E0D6]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full border border-[#E6E0D6] text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
