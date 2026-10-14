export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Ritual Goods' | 'Digital Readings' | 'Sessions';
  tag: string;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  image: string;
  inStock: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  spread: string;
  rating: number;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  author: string;
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'intention-candle',
    name: 'Intention Candle',
    price: 38,
    category: 'Ritual Goods',
    tag: 'Hand-Poured',
    rating: 4.9,
    reviewsCount: 142,
    description: 'Natural coconut-soy wax infused with wild vetiver, ceremonial Palo Santo, and rough-cut clear quartz crystals.',
    details: ['100% Organic Coconut Soy', '55+ Hour Clean Burn Time', 'Clear Quartz Raw Crystal Embedded', 'Smokeless Cotton Wick'],
    image: '/src/assets/images/boutique_ritual_candle_1790673095609.jpg',
    inStock: true
  },
  {
    id: 'crystal-kit',
    name: 'Crystal Kit',
    price: 46,
    category: 'Ritual Goods',
    tag: 'Consecrated',
    rating: 5.0,
    reviewsCount: 98,
    description: 'Four sacred stones curated by Neha Arora: Brazilian Amethyst, Moroccan Selenite wand, raw Pyrite chunk, and Madagascar Rose Quartz.',
    details: ['Hand-selected unpolished stones', 'Organic beige linen carrying pouch', 'Consecration ritual booklet', 'Cleansing guide'],
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'sage-bundle',
    name: 'Sage Bundle',
    price: 22,
    category: 'Ritual Goods',
    tag: 'Ethically Sourced',
    rating: 4.8,
    reviewsCount: 84,
    description: 'Ethically wild-harvested California White Sage bundled with organic purple mountain lavender and wild sweetgrass.',
    details: ['Solar dried herbs', 'Sustainably farmed & harvested', 'Pure cotton thread binding', 'Calming botanical aroma'],
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'evil-eye-bracelet',
    name: 'Evil Eye Bracelet',
    price: 54,
    category: 'Ritual Goods',
    tag: 'Amulet Protection',
    rating: 4.9,
    reviewsCount: 167,
    description: 'Dainty protection talisman featuring hand-carved Mediterranean mother of pearl and 14k gold vermeil accents on durable silk cord.',
    details: ['14k Gold Vermeil accents', 'Natural Mother of Pearl iris', 'Adjustable sliding knot closure', 'Hypoallergenic & tarnish resistant'],
    image: 'https://images.unsplash.com/photo-1611591475806-b33379c65691?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'tarot-journal',
    name: 'Tarot Journal',
    price: 32,
    category: 'Ritual Goods',
    tag: 'Editorial Edition',
    rating: 5.0,
    reviewsCount: 210,
    description: 'Linen hardcover journal embossed with subtle gold celestial foil. 240 ivory grid pages designed specifically for daily card pulls and spreads.',
    details: ['Heavy 120gsm bleeding-proof paper', 'Three ribbon bookmarks', 'Pocket for keepsake readings', 'Embossed gold foil cover'],
    image: '/src/assets/images/tarot_deck_gold_1790673081468.jpg',
    inStock: true
  },
  {
    id: 'love-reading-digital',
    name: 'Love Reading (Digital)',
    price: 45,
    category: 'Digital Readings',
    tag: 'Delivered in 48h',
    rating: 4.9,
    reviewsCount: 312,
    description: 'An in-depth 5-card relational reading recorded as a high-fidelity voice memo accompanied by a beautifully formatted 12-page PDF dossier.',
    details: ['Audio recording by Neha Arora', 'High-res card spread imagery', 'Soul connection analysis', 'Actionable heart rituals'],
    image: '/src/assets/images/hero_tarot_ambient_1790673059166.jpg',
    inStock: true
  },
  {
    id: 'career-reading-digital',
    name: 'Career Reading (Digital)',
    price: 55,
    category: 'Digital Readings',
    tag: 'Purpose & Wealth',
    rating: 4.9,
    reviewsCount: 189,
    description: 'Strategic oracle evaluation mapping your professional horizon, hidden creative talents, and seasonal timing for bold transitions.',
    details: ['Personalized PDF report', 'Focal astrological influences', 'Quarterly timing projections', 'Energetic boundary practices'],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'one-on-one-live-session',
    name: '1:1 Live Session',
    price: 150,
    category: 'Sessions',
    tag: 'Private Zoom Session',
    rating: 5.0,
    reviewsCount: 420,
    description: 'A dedicated 60-minute sacred video session with Neha Arora. Deep intuitive dive into your life questions, Celtic Cross spread, and energetic alignment.',
    details: ['60-Minute private video consultation', 'Full Celtic Cross spread', 'Live open Q&A dialogue', 'Complete session video & audio download'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    inStock: true
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'Neha has an uncanny, chillingly gentle precision. My reading untangled months of quiet grief and handed me back my agency with such dignity and grace.',
    author: 'Aria Vandeberg',
    role: 'Architectural Director',
    location: 'London & Mumbai',
    spread: 'Celtic Cross Master Spread',
    rating: 5
  },
  {
    id: 'test-2',
    quote: 'The aesthetic of OpenToSeeYourFuture feels like stepping into a serene sanctuary. The reading felt less like fortune telling and more like remembering who I was before the world got loud.',
    author: 'Mira Sen-Gupta',
    role: 'Editorial Curator',
    location: 'New York',
    spread: 'Love & Connection Spread',
    rating: 5
  },
  {
    id: 'test-3',
    quote: 'I was on the brink of walking away from my studio. The Career spread gave me clear astrological timing and unclouded vision. Three months later, everything unfolded as whispered.',
    author: 'Julian Thorne',
    role: 'Industrial Designer',
    location: 'Copenhagen',
    spread: 'Career Reading',
    rating: 5
  },
  {
    id: 'test-4',
    quote: 'The intention candle alone shifted the entire frequency of my morning ritual. Pairing it with Neha’s daily card pull is now non-negotiable for my mental equilibrium.',
    author: 'Camilla Moreau',
    role: 'Creative Consultant',
    location: 'Paris',
    spread: 'One Card Daily Pull',
    rating: 5
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'journal-1',
    title: 'The Architecture of Surrender: When The Hanged Man Appears',
    category: 'Tarot Wisdom',
    readTime: '5 min read',
    date: 'Autumn Equinox',
    excerpt: 'Why pausing when everything in modern life screams for frantic acceleration is the most courageous choice an intuitive spirit can make.',
    author: 'Neha Arora'
  },
  {
    id: 'journal-2',
    title: 'Cleansing the Vessel: Sacred Smudging & Energetic Hygiene',
    category: 'Rituals',
    readTime: '4 min read',
    date: 'New Moon in Virgo',
    excerpt: 'A delicate guide to honoring white sage, balancing smoke with water elements, and sealing your sanctuary perimeter.',
    author: 'Neha Arora'
  },
  {
    id: 'journal-3',
    title: 'Reversals as Invitations: Why Inverted Cards Hold the Deepest Medicine',
    category: 'Archetypes',
    readTime: '6 min read',
    date: 'Waxing Crescent',
    excerpt: 'An upside-down card is not bad luck; it is an internal portal directing you toward what is stirring quietly under the floorboards of your heart.',
    author: 'Neha Arora'
  }
];
