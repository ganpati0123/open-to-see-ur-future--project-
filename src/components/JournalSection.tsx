import React, { useState } from 'react';
import { JOURNAL_ARTICLES, JournalArticle } from '../data/productsData';
import { ArrowRight, BookOpen, X } from 'lucide-react';

export const JournalSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  return (
    <section id="journal" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E6E0D6]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8E8271] mb-2">
            <span>The Intuitive Archive</span>
            <span>·</span>
            <span className="text-[#A98765]">Essays by Neha Arora</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight">
            The Oracle Journal
          </h2>
        </div>
        <p className="text-sm text-[#1A1A1A]/70 max-w-md font-light">
          Dispatches on lunar cycles, tarot archetypes, and living with unhurried discernment in a noisy world.
        </p>
      </div>

      {/* 3 Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {JOURNAL_ARTICLES.map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group p-7 rounded-xl bg-[#FCFAF7] border border-[#E6E0D6] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#C4A484] hover:shadow-md cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8E8271]">
                <span className="text-[10px] uppercase tracking-wider text-[#A98765] font-medium">
                  {article.category}
                </span>
                <span>{article.readTime}</span>
              </div>

              <h3 className="font-serif text-2xl text-[#1A1A1A] group-hover:text-[#A98765] transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E6E0D6]/60 flex items-center justify-between text-xs font-medium text-[#1A1A1A]">
              <span>Read Essay</span>
              <ArrowRight className="w-4 h-4 text-[#A98765] group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* Article Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-xl border border-[#C4A484]/40 shadow-2xl p-6 sm:p-10 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E6E0D6]/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2 border-b border-[#E6E0D6] pb-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A98765]">
                  <span>{selectedArticle.category}</span>
                  <span>·</span>
                  <span>{selectedArticle.date}</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] leading-tight">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-[#8E8271]">By {selectedArticle.author}</p>
              </div>

              <div className="space-y-4 text-sm text-[#1A1A1A]/80 font-light leading-relaxed">
                <p className="font-serif italic text-lg text-[#1A1A1A]">
                  "{selectedArticle.excerpt}"
                </p>
                <p>
                  When we sit before the altar of our own lives, the mind frantically searches for guarantees. We want the Major Arcana to tell us whether we will sign the contract, whether the lover will stay, whether the storm will pass by Tuesday.
                </p>
                <p>
                  Yet the cards are not mechanical slot machines of outcome; they are mirrors of consciousness. As Neha Arora teaches, an archetype only ever reflects the vibrational state currently occupying your energetic body. Shift your interior posture, and the outward mirror reorganizes itself.
                </p>
                <p>
                  Take this reflection into your evening tea ritual. Light an intention candle, breathe into your belly, and let the questions rest quietly in your hands without forcing an immediate answer.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E0D6] flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest rounded-sm hover:bg-[#A98765] transition-colors cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
