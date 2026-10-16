import React from 'react';
import { ArrowLeft, ArrowRight, Instagram, MessageCircle, Sparkles } from 'lucide-react';

interface OfferingPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenBookSession: () => void;
}

const OFFERINGS: Record<string, { eyebrow: string; title: string; intro: string; items: string[]; action: string }> = {
  spreads: { eyebrow: 'Sacred spreads', title: 'A clearer way to listen inward.', intro: 'Choose a spread as a gentle architecture for your question. Every pull is an invitation, never a fixed prediction.', items: ['One Card Quick Pull (Free)', 'Past, Present, Future', 'Love & Connection Spread', 'Celtic Cross Master Spread'], action: 'Choose your spread' },
  guidance: { eyebrow: 'Private guidance', title: 'A quiet room for your question.', intro: 'Personal readings with Neha Arora, held with care, confidentiality, and space for your own knowing to arrive.', items: ['1:1 Live Video Consultation', 'Digital Audio Readings', 'Lunar Archetype Essays', 'Daily Cosmic Pulse'], action: 'Book a private session' },
  ethos: { eyebrow: 'Studio & ethos', title: 'Open to see your future.', intro: 'The studio is rooted in integrity, confidentiality, and deep respect for the seeker’s sacred autonomy.', items: ['Archetypal depth psychology', 'Sacred symbology', 'Intuitive clarity', 'Thoughtful ritual and reflection'], action: 'Meet the guide' },
};

export const OfferingPage: React.FC<OfferingPageProps> = ({ slug, onBack, onNavigate, onOpenBookSession }) => {
  const offering = OFFERINGS[slug] ?? OFFERINGS.ethos;
  const isGuidance = slug === 'guidance';

  return (
    <div className="min-h-[70vh] bg-[#f5f1eb] px-5 py-12 sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={onBack} className="mb-12 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#756b5d] transition-colors hover:text-[#a98765]"><ArrowLeft className="h-3.5 w-3.5" /> Back to studio</button>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.24em] text-[#a98765]"><Sparkles className="h-3.5 w-3.5" /> {offering.eyebrow}</div>
            <h1 className="max-w-3xl font-serif text-5xl leading-[.98] tracking-[-.04em] text-[#28251f] sm:text-7xl">{offering.title}</h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#625b51]">{offering.intro}</p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-[#c4a484]/35 bg-[#171628] p-8 text-[#f5f1eb] shadow-[0_24px_70px_rgba(32,26,20,.14)] sm:p-10">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-[#e6b967]/30" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-[#e6b967]/20" />
            <p className="relative text-[10px] uppercase tracking-[.2em] text-[#e6b967]">OpenToSeeYourFuture · Neha Arora</p>
            <p className="relative mt-12 font-serif text-3xl leading-tight text-[#fff8ec]">“The answer is often closer than the question.”</p>
            <div className="relative mt-10 h-px bg-[#e6b967]/30" />
            <p className="relative mt-4 text-xs leading-6 text-[#d9d0c3]/75">A considered space for reflection, ritual, and a more honest conversation with yourself.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offering.items.map((item, index) => <div key={item} className="group border-t border-[#c4a484]/50 py-5 transition-transform hover:-translate-y-1"><span className="text-[10px] text-[#a98765]">0{index + 1}</span><h2 className="mt-4 font-serif text-2xl leading-tight text-[#302b25]">{item}</h2><ArrowRight className="mt-6 h-4 w-4 text-[#a98765] transition-transform group-hover:translate-x-1" /></div>)}
        </div>
        <div className="mt-14 flex flex-wrap gap-3 border-t border-[#ded5c8] pt-8">
          <button type="button" onClick={() => isGuidance ? onOpenBookSession() : onNavigate(slug === 'spreads' ? 'spreads' : 'hero')} className="inline-flex items-center gap-2 bg-[#28251f] px-6 py-3 text-[10px] uppercase tracking-[.18em] text-[#fff8ec] transition-colors hover:bg-[#a98765]">{offering.action}<ArrowRight className="h-3.5 w-3.5" /></button>
          {isGuidance && <a href="https://api.whatsapp.com/send?text=I%20would%20like%20to%20book%20a%20private%20guidance%20session%20with%20OpenToSeeYourFuture." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#27745b] px-6 py-3 text-[10px] uppercase tracking-[.18em] text-[#27745b] transition-colors hover:bg-[#27745b] hover:text-white"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp enquiry</a>}
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 border border-[#756b5d] px-6 py-3 text-[10px] uppercase tracking-[.18em] text-[#756b5d] transition-colors hover:bg-[#756b5d] hover:text-[#fff8ec] cursor-pointer"><ArrowLeft className="h-3.5 w-3.5" /> Back to studio</button>
          <a href="https://instagram.com/opentoseeyourfuture" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#c4a484] px-6 py-3 text-[10px] uppercase tracking-[.18em] text-[#756b5d] transition-colors hover:bg-[#c4a484] hover:text-[#fff8ec]"><Instagram className="h-3.5 w-3.5" /> Follow the studio</a>
        </div>
      </div>
    </div>
  );
};

export default OfferingPage;
