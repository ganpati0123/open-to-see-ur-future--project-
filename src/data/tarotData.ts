export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number | string;
  element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit';
  keywordsUpright: string[];
  keywordsReversed: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  guidance: string;
  symbol: string; // descriptive icon/symbol motif
}

export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
}

export interface TarotSpread {
  id: string;
  title: string;
  subtitle: string;
  cardCount: number;
  duration: string;
  isPremium?: boolean;
  tag: string;
  description: string;
  positions: SpreadPosition[];
}

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: 'one-card',
    title: 'One Card Pull',
    subtitle: 'Daily Clarity & Instant Guidance',
    cardCount: 1,
    duration: '3 Mins',
    isPremium: false,
    tag: 'Complimentary',
    description: 'A focused single inquiry offering an immediate cosmic pulse, clear focal point, and intentional thought for today.',
    positions: [
      {
        index: 1,
        name: 'The Focal Whisper',
        description: 'The core energy surrounding your intention at this exact moment.'
      }
    ]
  },
  {
    id: 'three-card',
    title: 'Past, Present, Future',
    subtitle: 'Timeline & Horizon Alignment',
    cardCount: 3,
    duration: '8 Mins',
    isPremium: false,
    tag: 'Most Popular',
    description: 'Trace the unbroken thread of your current situation. See where you emerged, where your feet are planted, and where the current momentum leads.',
    positions: [
      {
        index: 1,
        name: 'The Root (Past)',
        description: 'Underlying foundation, past lessons, and energies releasing their grip.'
      },
      {
        index: 2,
        name: 'The Anchor (Present)',
        description: 'Current atmosphere, conscious feelings, and immediate choices.'
      },
      {
        index: 3,
        name: 'The Horizon (Future)',
        description: 'Potential unfolding outcome if you maintain current vibrational direction.'
      }
    ]
  },
  {
    id: 'love-connection',
    title: 'Love & Connection',
    subtitle: 'Heart Resonance & Relational Clarity',
    cardCount: 5,
    duration: '15 Mins',
    isPremium: false,
    tag: 'Deep Emotional',
    description: 'An intimate five-point mirror examining the energetic bridge between your heart center, another soul, and shared destiny.',
    positions: [
      {
        index: 1,
        name: 'Your Emotional Core',
        description: 'What your soul truly seeks and current feelings within connection.'
      },
      {
        index: 2,
        name: 'The Other Energetic Mirror',
        description: 'Their conscious or subconscious vibration towards you.'
      },
      {
        index: 3,
        name: 'The Shared Thread',
        description: 'The energetic chord joining both parties; what exists between you.'
      },
      {
        index: 4,
        name: 'The Hidden Knot',
        description: 'Unspoken fear, generational patterns, or obstacle to overcome.'
      },
      {
        index: 5,
        name: 'The Harmonious Path',
        description: 'Highest evolutionary potential for this union or emotional truth.'
      }
    ]
  },
  {
    id: 'celtic-cross',
    title: 'Celtic Cross',
    subtitle: 'The Master 10-Card Oracle',
    cardCount: 10,
    duration: '25 Mins',
    isPremium: true,
    tag: 'Premium Master Spread',
    description: 'The definitive architectural reading. A multi-layered revelation tracing subconscious foundations, external forces, hopes, fears, and ultimate resolution.',
    positions: [
      { index: 1, name: 'The Heart of the Matter', description: 'Core situation and present active catalyst.' },
      { index: 2, name: 'The Crossing Obstacle', description: 'Immediate opposing force or balancing energy.' },
      { index: 3, name: 'The Subconscious Root', description: 'Deep primal drives and ancestral memory.' },
      { index: 4, name: 'The Recent Past', description: 'Events just passed that still color your perspective.' },
      { index: 5, name: 'The Conscious Crown', description: 'What you mentally aspire to and highest potential.' },
      { index: 6, name: 'The Imminent Next Step', description: 'What approaches in the immediate coming cycle.' },
      { index: 7, name: 'Your Inner Stance', description: 'How you see yourself and the posture you adopt.' },
      { index: 8, name: 'The External Mirror', description: 'Environmental pressures, other people, and surroundings.' },
      { index: 9, name: 'Hopes & Vulnerabilities', description: 'Secret expectations and tender subconscious fears.' },
      { index: 10, name: 'The Culmination', description: 'Ultimate evolutionary resolution and highest guidance.' }
    ]
  }
];

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: '0-the-fool',
    name: '0 · The Fool',
    arcana: 'major',
    number: '0',
    element: 'Air',
    keywordsUpright: ['Innocence', 'Leap of Faith', 'Pure Beginnings', 'Originality'],
    keywordsReversed: ['Recklessness', 'Hesitation', 'Fear of Unknown', 'Impulsivity'],
    uprightMeaning: 'Step courageously off the precipice with an open heart. The universe cushions every soul that dares to trust wonder over calculated certainty.',
    reversedMeaning: 'Notice where ungrounded rashness masks a deeper unwillingness to prepare, or conversely where fear freezes your spirit.',
    guidance: 'Release the heavy armor of what you think you should know. Step forward lightly.',
    symbol: 'White Rose & Cliff Edge'
  },
  {
    id: '1-the-magician',
    name: 'I · The Magician',
    arcana: 'major',
    number: 'I',
    element: 'Air',
    keywordsUpright: ['Manifestation', 'Focused Will', 'Resourcefulness', 'Alchemical Power'],
    keywordsReversed: ['Scattered Energy', 'Manipulation', 'Untapped Potential', 'Doubt'],
    uprightMeaning: 'As above, so below. All four elemental implements lie upon your altar. You possess every tool required to convert subtle intention into tangible form.',
    reversedMeaning: 'Align your inner voice with your spoken words. Beware of speaking promises you do not yet have the discipline to root.',
    guidance: 'Your focused breath is an engine of transformation. Direct your gaze upon your highest creation.',
    symbol: 'Infinity & Ouroboros'
  },
  {
    id: '2-the-high-priestess',
    name: 'II · The High Priestess',
    arcana: 'major',
    number: 'II',
    element: 'Water',
    keywordsUpright: ['Intuition', 'Sacred Mystery', 'Subconscious', 'Divine Feminine'],
    keywordsReversed: ['Ignored Gut', 'Superficiality', 'Secrets Revealed', 'Withdrawal'],
    uprightMeaning: 'Sit between the black and white pillars of Boaz and Jachin. What cannot be spoken aloud can nonetheless be felt with immaculate precision.',
    reversedMeaning: 'You have been dismissing the subtle whisper of your gut in search of external consensus. Turn back inward.',
    guidance: 'Silence is not absence; it is the sacred chamber where truth finishes speaking.',
    symbol: 'Pomegranate & Crescent Veil'
  },
  {
    id: '3-the-empress',
    name: 'III · The Empress',
    arcana: 'major',
    number: 'III',
    element: 'Earth',
    keywordsUpright: ['Abundance', 'Fertility', 'Sensory Grace', 'Nurturance'],
    keywordsReversed: ['Creative Block', 'Smothering', 'Neglect of Self', 'Scarcity'],
    uprightMeaning: 'A season of ripe harvest and effortless flowering. Allow life to nourish you without feeling you must constantly prove your worthiness to receive.',
    reversedMeaning: 'Replenish your physical vessel before attempting to bear fruit for others. Return to softness.',
    guidance: 'You do not struggle to bloom; like the wild flora, you expand when rested in rich soil.',
    symbol: 'Golden Wheat & Twelve Stars'
  },
  {
    id: '4-the-emperor',
    name: 'IV · The Emperor',
    arcana: 'major',
    number: 'IV',
    element: 'Fire',
    keywordsUpright: ['Structure', 'Sovereignty', 'Stability', 'Protective Order'],
    keywordsReversed: ['Rigidity', 'Tyranny', 'Chaos', 'Loss of Authority'],
    uprightMeaning: 'Anchor your realm with calm, benevolent boundaries. Construct a perimeter that allows vulnerable growth to flourish under wise stewardship.',
    reversedMeaning: 'Examine where stubborn control has stifled flexibility or where lack of routine breeds quiet panic.',
    guidance: 'True authority does not shout. Build systems that outlive your current emotional turbulence.',
    symbol: 'Stone Throne & Aries Ram'
  },
  {
    id: '5-the-hierophant',
    name: 'V · The Hierophant',
    arcana: 'major',
    number: 'V',
    element: 'Earth',
    keywordsUpright: ['Sacred Tradition', 'Spiritual lineage', 'Mentorship', 'Ethical Center'],
    keywordsReversed: ['Dogma', 'Rebellion', 'Outgrown Beliefs', 'Unconventional Path'],
    uprightMeaning: 'Connect with established wisdom and time-tested teachings. Learn the sacred rules deeply so you may understand their true mystical purpose.',
    reversedMeaning: 'A religious or societal container that once kept you safe now limits your expansion. Author your own theology.',
    guidance: 'Respect the lineage, but remember the master points you back to the master within you.',
    symbol: 'Triple Cross & Crossed Keys'
  },
  {
    id: '6-the-lovers',
    name: 'VI · The Lovers',
    arcana: 'major',
    number: 'VI',
    element: 'Air',
    keywordsUpright: ['Sacred Union', 'Value Alignment', 'Soul Harmony', 'Choice'],
    keywordsReversed: ['Misalignment', 'Inner Conflict', 'Codependency', 'Disharmony'],
    uprightMeaning: 'Beyond romantic enchantment lies an alchemical meeting of mirrors. Choose the path that honors both your vulnerability and truth.',
    reversedMeaning: 'Ask yourself whether you are seeking completeness in another that you have not yet cultivated within yourself.',
    guidance: 'When you choose love over convenience, every cell in your reality shifts into harmony.',
    symbol: 'Archangel Raphael & Twin Trees'
  },
  {
    id: '7-the-chariot',
    name: 'VII · The Chariot',
    arcana: 'major',
    number: 'VII',
    element: 'Water',
    keywordsUpright: ['Victory', 'Harnessed Will', 'Direction', 'Determination'],
    keywordsReversed: ['Lack of Direction', 'Aggression', 'Burnout', 'Obstacles'],
    uprightMeaning: 'Yoke the dark and light sphinxes through pure mental focus and unwavering resolve. Triumphant momentum awaits forward movement.',
    reversedMeaning: 'You cannot steer a chariot at breakneck speeds on unpaved terrain without breaking the wheels. Slow down and calibrate.',
    guidance: 'Willpower without devotion is mere muscle; willpower rooted in purpose moves mountains.',
    symbol: 'Twin Sphinxes & Star Canopy'
  },
  {
    id: '8-strength',
    name: 'VIII · Strength',
    arcana: 'major',
    number: 'VIII',
    element: 'Fire',
    keywordsUpright: ['Gentle Mastery', 'Compassion', 'Courage', 'Patience'],
    keywordsReversed: ['Raw Self-Doubt', 'Forcefulness', 'Weakness', 'Impatience'],
    uprightMeaning: 'The maiden closes the lion’s jaw not with iron chains, but with calm, tender touch. Befriend your instinctual nature rather than punishing it.',
    reversedMeaning: 'When insecurity strikes, notice if you attempt to overpower situations through sheer frustration. Choose gentleness.',
    guidance: 'Kindness toward your own shadow is the most invincible weapon you will ever wield.',
    symbol: 'Leminscate & Gentle Lion'
  },
  {
    id: '9-the-hermit',
    name: 'IX · The Hermit',
    arcana: 'major',
    number: 'IX',
    element: 'Earth',
    keywordsUpright: ['Soul Solitude', 'Inner Lantern', 'Contemplation', 'Quiet Truth'],
    keywordsReversed: ['Isolation', 'Loneliness', 'Withdrawal', 'Ignoring Wisdom'],
    uprightMeaning: 'Step away from the clamor of the market square. Ascend the quiet peak carrying the six-pointed lantern of accumulated inner knowledge.',
    reversedMeaning: 'Do not mistake bitter withdrawal for holy retreat. Return to the circle when you have rested.',
    guidance: 'The lantern in your hand only lights the very next step. That is all you need to reach safety.',
    symbol: 'Solitary Lantern & Staff'
  },
  {
    id: '10-wheel-of-fortune',
    name: 'X · Wheel of Fortune',
    arcana: 'major',
    number: 'X',
    element: 'Fire',
    keywordsUpright: ['Cycles', 'Karmic Turning', 'Destiny', 'Serendipity'],
    keywordsReversed: ['Resistance to Change', 'Bad Luck', 'Repeating Loops', 'Delay'],
    uprightMeaning: 'The celestial wheel spins eternally. Stay rooted at the motionless hub while circumstances rotate along the outer rim.',
    reversedMeaning: 'Accept the dip in the cycle as compost for the rising tide. Clinging to the past prolongs the descent.',
    guidance: 'What goes down must ascend. Welcome the turn with equanimity.',
    symbol: 'Sphinx & Alchemical Wheel'
  },
  {
    id: '11-justice',
    name: 'XI · Justice',
    arcana: 'major',
    number: 'XI',
    element: 'Air',
    keywordsUpright: ['Truth', 'Equilibrium', 'Karmic Clarity', 'Integrity'],
    keywordsReversed: ['Bias', 'Unfairness', 'Dishonesty', 'Avoided Consequence'],
    uprightMeaning: 'The scales balance precisely without malice or favor. The double-edged sword cuts through illusion to reveal unvarnished reality.',
    reversedMeaning: 'Be rigorously honest with yourself about your own role in the present situation.',
    guidance: 'Act as though the universal mirror will reflect your choices tenfold—because it will.',
    symbol: 'Scales of Truth & Upright Sword'
  },
  {
    id: '12-the-hanged-man',
    name: 'XII · The Hanged Man',
    arcana: 'major',
    number: 'XII',
    element: 'Water',
    keywordsUpright: ['Surrender', 'New Perspective', 'Suspension', 'Enlightenment'],
    keywordsReversed: ['Stalling', 'Useless Martyrdom', 'Stubbornness', 'Ego Grip'],
    uprightMeaning: 'Suspend the frantic urge to act. In the stillness of upside-down surrender, a golden halo of profound insight illuminates what was hidden.',
    reversedMeaning: 'Notice if you are playing the suffering martyr to avoid making an uncomfortable adult decision.',
    guidance: 'Give up the battle. The surrender itself is the liberation you prayed for.',
    symbol: 'Living Tree & Halo of Stillness'
  },
  {
    id: '13-death',
    name: 'XIII · Death',
    arcana: 'major',
    number: 'XIII',
    element: 'Water',
    keywordsUpright: ['Transformation', 'Rebirth', 'Ending a Cycle', 'Pruning'],
    keywordsReversed: ['Decay', 'Fear of Release', 'Lingering Ghosts', 'Stagnation'],
    uprightMeaning: 'The sacred reaper clears away dry leaves so delicate shoots may drink the morning sunlight. Mourn with reverence, then welcome the rebirth.',
    reversedMeaning: 'Holding onto a corpse will not bring breath back into its lungs. Bow, let go, and let life recreate itself.',
    guidance: 'Every death in the spiritual world is simply an initiation into a higher octave of being.',
    symbol: 'Mystic Black Banner & Dawn Sun'
  },
  {
    id: '14-temperance',
    name: 'XIV · Temperance',
    arcana: 'major',
    number: 'XIV',
    element: 'Fire',
    keywordsUpright: ['Alchemy', 'Divine Balance', 'Patience', 'Moderate Synthesis'],
    keywordsReversed: ['Excess', 'Imbalance', 'Impatience', 'Clashing Forces'],
    uprightMeaning: 'Pour the water between the gold and silver chalices without spilling a drop. You are blending opposites into a higher elixir of life.',
    reversedMeaning: 'Extreme reactions and swinging between deprivation and overindulgence will drain your vital energy.',
    guidance: 'The middle path is not boring; it is the eye of the hurricane where creative power is concentrated.',
    symbol: 'Angel Pouring Twin Chalices'
  },
  {
    id: '15-the-devil',
    name: 'XV · The Devil',
    arcana: 'major',
    number: 'XV',
    element: 'Earth',
    keywordsUpright: ['Attachment', 'Illusion of Bondage', 'Shadow Work', 'Material Lure'],
    keywordsReversed: ['Breaking Free', 'Reclaimed Freedom', 'Shedding Shame', 'Awakening'],
    uprightMeaning: 'Look closely at the chains around your neck: they are loose enough to lift over your head at any second. Name the fear that keeps you bound.',
    reversedMeaning: 'The illusion is shattering. You are stepping out of toxic codependency and reclaiming your sovereignty.',
    guidance: 'Your shadow does not want to destroy you; it only wants your conscious recognition.',
    symbol: 'Inverted Pentagram & Loose Chains'
  },
  {
    id: '16-the-tower',
    name: 'XVI · The Tower',
    arcana: 'major',
    number: 'XVI',
    element: 'Fire',
    keywordsUpright: ['Sudden Awakening', 'Shattered Illusion', 'Liberation', 'Flash of Truth'],
    keywordsReversed: ['Disaster Averted', 'Fear of Collapse', 'Delayed Inevitability', 'Trauma'],
    uprightMeaning: 'A bolt of lightning strikes the crown of false security. What falls was built upon ego and compromise; what remains is eternal and unshakable.',
    reversedMeaning: 'Do not rebuild the crumbling wall. Allow the cleansing storm to finish its liberating work.',
    guidance: 'The destruction is not your punishment; it is your long-delayed emancipation.',
    symbol: 'Lightning Crown & Stone Foundation'
  },
  {
    id: '17-the-star',
    name: 'XVII · The Star',
    arcana: 'major',
    number: 'XVII',
    element: 'Air',
    keywordsUpright: ['Hope', 'Inspiration', 'Serenity', 'Spiritual Renewal'],
    keywordsReversed: ['Despair', 'Discouragement', 'Lost Faith', 'Exhaustion'],
    uprightMeaning: 'After the tempest, the evening air turns fragrant and calm. Kneel by the holy pool, pour crystal waters, and trust the constellation overhead.',
    reversedMeaning: 'When hope feels distant, remember that stars shine brightest during the darkest hour of the night. Rest your spirit.',
    guidance: 'Your future is being painted with grace. Keep your vessel receptive.',
    symbol: 'Eight-Pointed Star & Living Spring'
  },
  {
    id: '18-the-moon',
    name: 'XVIII · The Moon',
    arcana: 'major',
    number: 'XVIII',
    element: 'Water',
    keywordsUpright: ['Subconscious Depths', 'Illusions', 'Dreamscapes', 'Psychic Currents'],
    keywordsReversed: ['Dispelling Fear', 'Clarity Returning', 'Unmasking Deception', 'Paranoia'],
    uprightMeaning: 'The path winds between twin towers in dim twilight while the lobster emerges from the deep ocean. Trust intuition, not anxious projections.',
    reversedMeaning: 'The fog is lifting. Secrets and self-deceptions will soon be laid bare in clear morning light.',
    guidance: 'Honor your dreams tonight. They contain the map your rational waking mind cannot decipher.',
    symbol: 'Crescent Moon & Primal Ocean'
  },
  {
    id: '19-the-sun',
    name: 'XIX · The Sun',
    arcana: 'major',
    number: 'XIX',
    element: 'Fire',
    keywordsUpright: ['Joy', 'Vitality', 'Radiance', 'Unfiltered Success'],
    keywordsReversed: ['Temporary Cloudiness', 'Overlooked Blessings', 'Ego Flare', 'Burnout'],
    uprightMeaning: 'Pure solar warmth illuminates every corner of your world. Ride the white horse with the freedom of a newborn child in sunflower meadows.',
    reversedMeaning: 'The sun is still blazing above the overcast clouds. Open your blinds and let yourself feel warmth.',
    guidance: 'You were born to shine without apology. Radiate your authentic warmth.',
    symbol: 'Solar Crest & Golden Sunflowers'
  },
  {
    id: '20-judgement',
    name: 'XX · Judgement',
    arcana: 'major',
    number: 'XX',
    element: 'Fire',
    keywordsUpright: ['Higher Calling', 'Soul Awakening', 'Absolution', 'Karmic Reckoning'],
    keywordsReversed: ['Self-Doubt', 'Ignoring Call', 'Harsh Blame', 'Stagnant Repentance'],
    uprightMeaning: 'The celestial trumpet sounds across the valley. Rise from the old sarcophagus of who you used to be. Forgive all, and step into purpose.',
    reversedMeaning: 'Stop punishing yourself for decisions made by a younger version of you who had less awareness.',
    guidance: 'You have been summoned to step into your sacred gifts. Answer the call without hesitation.',
    symbol: 'Gabriel’s Horn & Open Coffin'
  },
  {
    id: '21-the-world',
    name: 'XXI · The World',
    arcana: 'major',
    number: 'XXI',
    element: 'Earth',
    keywordsUpright: ['Wholeness', 'Completion', 'Cosmic Cosmic Integration', 'Triumph'],
    keywordsReversed: ['Incomplete Cycle', 'Lack of Closure', 'Shortcut Seeking', 'Delays'],
    uprightMeaning: 'The green laurel wreath encircles the dancer in cosmic harmony. An epic cycle completes in radiant wholeness. Celebrate your journey.',
    reversedMeaning: 'Tie up the loose ends before jumping into the next chapter. Honor the closing ceremony.',
    guidance: 'You are whole, complete, and exactly where your soul planned to stand today.',
    symbol: 'Laurel Wreath & Four Guardians'
  }
];

// Helper to generate representative 56 Minor Arcana
const SUITS = [
  { suit: 'wands' as const, element: 'Fire' as const, theme: 'Willpower, Passion, Inspiration' },
  { suit: 'cups' as const, element: 'Water' as const, theme: 'Emotion, Relationship, Intuition' },
  { suit: 'swords' as const, element: 'Air' as const, theme: 'Mind, Truth, Conflict, Clarity' },
  { suit: 'pentacles' as const, element: 'Earth' as const, theme: 'Body, Wealth, Material Foundation' }
];

const CARD_RANKS = [
  { name: 'Ace', num: '1', uprightKey: 'New Seed', revKey: 'Blocked Start' },
  { name: 'Two', num: '2', uprightKey: 'Balance & Duality', revKey: 'Imbalance' },
  { name: 'Three', num: '3', uprightKey: 'Expansion & Growth', revKey: 'Delay' },
  { name: 'Four', num: '4', uprightKey: 'Stability & Root', revKey: 'Stagnation' },
  { name: 'Five', num: '5', uprightKey: 'Challenge & Friction', revKey: 'Reconciliation' },
  { name: 'Six', num: '6', uprightKey: 'Harmony & Sweet Reward', revKey: 'Clinging' },
  { name: 'Seven', num: '7', uprightKey: 'Assessment & Strategy', revKey: 'Doubt' },
  { name: 'Eight', num: '8', uprightKey: 'Mastery & Momentum', revKey: 'Burnout' },
  { name: 'Nine', num: '9', uprightKey: 'Culmination & Resilience', revKey: 'Exhaustion' },
  { name: 'Ten', num: '10', uprightKey: 'Full Cycle & Completion', revKey: 'Burden' },
  { name: 'Page', num: 'Page', uprightKey: 'Curious Messenger', revKey: 'Childish Gossip' },
  { name: 'Knight', num: 'Knight', uprightKey: 'Active Pursuer', revKey: 'Hasty Impatience' },
  { name: 'Queen', num: 'Queen', uprightKey: 'Mature Embodiment', revKey: 'Emotional Overwhelm' },
  { name: 'King', num: 'King', uprightKey: 'Mastery & Stewardship', revKey: 'Rigid Authority' }
];

export const MINOR_ARCANA: TarotCard[] = SUITS.flatMap((s) =>
  CARD_RANKS.map((r) => ({
    id: `${s.suit}-${r.name.toLowerCase()}`,
    name: `${r.name} of ${s.suit.charAt(0).toUpperCase() + s.suit.slice(1)}`,
    arcana: 'minor',
    suit: s.suit,
    number: r.num,
    element: s.element,
    keywordsUpright: [r.uprightKey, `${s.theme.split(',')[0]} Focus`, 'Sacred Alignment'],
    keywordsReversed: [r.revKey, 'Recalibration', 'Inner Reflection'],
    uprightMeaning: `The energetic current of ${s.suit} brings ${r.uprightKey.toLowerCase()} into your physical field. Channel this energy with reverence and disciplined intention.`,
    reversedMeaning: `In reverse, this card asks you to pause and heal inner tensions around ${s.theme.toLowerCase()}. Resolve internal resistance before outward movement.`,
    guidance: `Trust that every phase of ${s.suit} brings you closer to your center. Breathe into this moment.`,
    symbol: `${s.suit.charAt(0).toUpperCase() + s.suit.slice(1)} Sacred Emblem`
  }))
);

export const ALL_78_TAROT_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];
