import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Layers, Sparkles, Compass, Shield, CheckCircle2 } from 'lucide-react';
import { TAROT_SPREADS, TarotSpread } from '../data/tarotData';
import { playChimeSound } from '../utils/audio';

interface SpreadDetailPageProps {
  spreadId: string;
  onStartReading: (spread: TarotSpread) => void;
  onBack: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenBookSession: () => void;
}

const SPREAD_DETAILS: Record<string, {
  accent: string;
  whenToUse: string[];
  ritualPrep: string;
  questionPrompts: string[];
  philosophy: string;
}> = {
  'one-card': {
    accent: '#C4A484',
    whenToUse: [
      'Morning daily alignment before checking your phone',
      'Instant focal clarity when making a singular decision',
      'Evening contemplation to synthesize today’s emotional tone',
      'A quiet anchor during moments of high overwhelm',
    ],
    ritualPrep: 'Close your eyes. Inhale for four counts, pause for four, and exhale completely. Set a focused, single intention rather than a multifaceted problem.',
    questionPrompts: [
      '“What is the most honest energy I need to witness within myself today?”',
      '“What wisdom is calling for my quiet attention right now?”',
      '“Where can I release resistance and allow grace to enter?”',
    ],
    philosophy: 'A single card acts like a laser beam into the subconscious. It does not burden you with complex storylines; it offers one pristine mirror to hold up to your day.',
  },
  'three-card': {
    accent: '#e6b967',
    whenToUse: [
      'Understanding the narrative arc of your current situation',
      'Seeing how past patterns are subtly sculpting present reactions',
      'Gauging the natural momentum and outcome if no changes are made',
      'Periodic check-ins during seasonal transitions or new ventures',
    ],
    ritualPrep: 'Light a candle or incense. Place your hands over your heart and acknowledge the timeline of your journey—honoring both the lessons behind you and the road ahead.',
    questionPrompts: [
      '“What roots from my past are still bearing fruit—or casting shade—in my present?”',
      '“Where are my feet currently planted, and what choice requires courage?”',
      '“What horizon is naturally beckoning if I remain aligned with my highest truth?”',
    ],
    philosophy: 'Time in tarot is not a rigid linear highway; it is a tapestry. By perceiving past roots and present anchors together, the future ceases to be a mystery and becomes an informed creation.',
  },
  'love-connection': {
    accent: '#d48372',
    whenToUse: [
      'Relational cross-roads with a romantic partner, kindred friend, or soul tie',
      'Understanding unexpressed thoughts or energetic blocks between two people',
      'Healing after a misunderstanding or boundary rupture',
      'Inviting conscious union and deep vulnerability into your life',
    ],
    ritualPrep: 'Breathe into your heart space (Anahata chakra). Hold compassion for both yourself and the other soul. Detach from needing a specific outcome.',
    questionPrompts: [
      '“What truth is my heart whispering that my mind has been reluctant to admit?”',
      '“What energetic mirror is this connection holding up for my soul’s growth?”',
      '“How can we honor each other’s sovereignty while deepening intimacy?”',
    ],
    philosophy: 'Connections are sacred alchemical cauldrons. This five-point spread illuminates not only where two hearts touch, but the unseen knot that asks for forgiveness and conscious elevation.',
  },
  'celtic-cross': {
    accent: '#b892ff',
    whenToUse: [
      'Life’s most pivotal crossroads (career leaps, deep life transitions, soul crisis)',
      'A comprehensive, 360-degree audit of your internal and external cosmos',
      'When simpler spreads leave lingering questions or deeper knots',
      'Annual birthday or New Moon master readings with profound depth',
    ],
    ritualPrep: 'Create an uninterrupted sacred space for 20-30 minutes. Journal your core question clearly. Keep water and a journal nearby for post-reading integration.',
    questionPrompts: [
      '“What is the central crux of my life’s current season, and what hides beneath the surface?”',
      '“What external forces and inner unconscious fears are intersecting in my reality?”',
      '“What is the highest evolutionary synthesis of this monumental chapter?”',
    ],
    philosophy: 'The Celtic Cross is the crown jewel of Western hermetic tarot. Spanning ten archetypal chambers, it maps conscious aspiration against subconscious root, environment, and ultimate realization.',
  },
};

export const SpreadDetailPage: React.FC<SpreadDetailPageProps> = ({
  spreadId,
  onStartReading,
  onBack,
  onNavigate,
  onOpenBookSession,
}) => {
  const spread = TAROT_SPREADS.find((s) => s.id === spreadId) || TAROT_SPREADS[0];
  const detail = SPREAD_DETAILS[spread.id] || SPREAD_DETAILS['one-card'];

  const handleLaunchSpread = () => {
    playChimeSound();
    onStartReading(spread);
  };

  return (
    <div className="min-h-screen bg-[#080914] text-[#f5f0e7] px-4 py-10 sm:px-6 lg:px-10 selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
      <div className="max-w-5xl mx-auto">
        {/* Back navigation */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a8a9bf] hover:text-[#e6b967] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to studio</span>
        </button>

        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[#e6b967]/25 bg-gradient-to-br from-[#111326] via-[#0d0e1c] to-[#151128] p-8 sm:p-12 lg:p-14 shadow-[0_0_80px_rgba(89,55,181,0.22)]">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-[#e6b967]/15 pointer-events-none" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full border border-[#e6b967]/10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#e6b967] font-medium">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e6b967]/30 bg-[#e6b967]/10">
                <Sparkles className="w-3 h-3" />
                {spread.tag}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {spread.cardCount} {spread.cardCount === 1 ? 'Card' : 'Cards'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {spread.duration}
              </span>
            </div>

            <h1 className="mt-5 font-serif text-4xl sm:text-6xl text-[#f5f0e7] leading-[1.05] tracking-tight">
              {spread.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#e6b967]/90 font-serif italic">
              {spread.subtitle}
            </p>

            <p className="mt-6 text-sm sm:text-base text-[#c7c8d8] leading-relaxed max-w-2xl font-light">
              {spread.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleLaunchSpread}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#e6b967] text-[#080914] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all hover:bg-[#d8a74e] hover:shadow-[0_0_30px_rgba(230,185,103,0.4)] cursor-pointer"
              >
                <span>Draw {spread.title} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenBookSession}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#e6b967]/40 text-[#f5f0e7] text-xs uppercase tracking-[0.18em] rounded-sm transition-colors hover:bg-[#e6b967]/10 cursor-pointer"
              >
                <span>Book 1:1 with Neha</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spread Architecture & Positions */}
        <div className="mt-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#e6b967] font-medium">
            <Compass className="w-4 h-4" />
            <span>Architecture of the Spread</span>
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#f5f0e7]">
            The Card Positions Explained
          </h2>
          <p className="mt-2 text-sm text-[#a8a9bf] max-w-xl">
            Each position serves as an intentional gateway. Observe where the card falls to decipher the layer of consciousness it is reflecting.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spread.positions.map((pos) => (
              <div
                key={pos.index}
                className="relative rounded-2xl border border-[#e6b967]/20 bg-[#111326]/75 p-6 backdrop-blur-md transition-all hover:border-[#e6b967]/50 hover:bg-[#111326]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#e6b967] font-semibold">
                    Position #{pos.index}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#a8a9bf]">
                    Chamber
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-[#f5f0e7]">
                  {pos.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#c7c8d8]/80 font-light">
                  {pos.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* When to consult & Ritual Preparation */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* When to use */}
          <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/70 p-7">
            <h3 className="font-serif text-2xl text-[#f5f0e7] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#e6b967]" />
              Ideal Timing for this Spread
            </h3>
            <ul className="mt-5 space-y-3">
              {detail.whenToUse.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#c7c8d8] leading-relaxed">
                  <span className="text-[#e6b967] mt-0.5">✦</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Question Prompts */}
          <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/70 p-7">
            <h3 className="font-serif text-2xl text-[#f5f0e7] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e6b967]" />
              Sacred Inquiry Prompts
            </h3>
            <p className="mt-2 text-xs text-[#a8a9bf]">
              Holding a clear, soulful question deepens the resonance of the pull:
            </p>
            <div className="mt-4 space-y-2.5">
              {detail.questionPrompts.map((prompt, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#e6b967]/15 bg-[#080914]/60 p-3 text-xs italic text-[#e6b967]/90 leading-relaxed"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ritual Preparation Note */}
        <div className="mt-8 rounded-2xl border border-[#e6b967]/25 bg-gradient-to-r from-[#171628] via-[#111326] to-[#171628] p-7">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e6b967]">
            <Shield className="w-4 h-4" />
            <span>Preparation by Neha Arora</span>
          </div>
          <p className="mt-3 text-sm text-[#f5f0e7] leading-relaxed font-serif italic">
            &ldquo;{detail.ritualPrep}&rdquo;
          </p>
          <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-[#e6b967]/15 pt-5">
            <span className="text-xs text-[#a8a9bf]">
              Ready to witness what the cards reveal?
            </span>
            <button
              type="button"
              onClick={handleLaunchSpread}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#e6b967] text-[#080914] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d8a74e] cursor-pointer"
            >
              <span>Begin Card Pull</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
