export interface Product {
  id: string;
  name: string;
  price: number;
  currency?: 'USD' | 'INR';
  category:
    | 'Ritual Goods'
    | 'Digital Readings'
    | 'Sessions'
    | 'Zodiac Bracelets'
    | 'Crystal Tealight Holders'
    | 'Crystal Figurines'
    | 'Selenite Plates'
    | 'Gemstone Trees'
    | 'Selenite Towers'
    | 'Zubi Stones';
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

export const PRODUCT_CATEGORIES = [
  { id: 'zodiac-bracelets', label: 'Zodiac Bracelets' },
  { id: 'crystal-tealight-holders', label: 'Crystal Tealight Holders' },
  { id: 'crystal-figurines', label: 'Crystal Figurines' },
  { id: 'selenite-plates', label: 'Selenite Plates' },
  { id: 'gemstone-trees', label: 'Gemstone Trees' },
  { id: 'selenite-towers', label: 'Selenite Towers' },
  { id: 'zubi-stones', label: 'Zubi Stones' },
  { id: 'ritual-goods', label: 'Ritual Goods' },
  { id: 'digital-readings', label: 'Digital Readings' },
  { id: 'sessions', label: 'Sessions' },
] as const;

const UPLOADED_PRODUCTS_DATA: Product[] = [
  {
    id: 'crystal-tealight-holders',
    name: 'Crystal Tealight Holders',
    price: 750,
    currency: 'INR',
    category: 'Crystal Tealight Holders',
    tag: 'Hand-Finished',
    rating: 5,
    reviewsCount: 0,
    description: 'A colorful set of small crystal tealight holders, photographed in a warm studio setting.',
    details: ['Set of decorative tealight holders', 'Warm, polished crystal colors', 'Use with a suitable tealight candle'],
    image: '/products/tealight-holders.png',
    inStock: true,
  },
  {
    id: 'crystal-angels',
    name: 'Carved Crystal Angels',
    price: 800,
    currency: 'INR',
    category: 'Crystal Figurines',
    tag: 'Colorful Set',
    rating: 5,
    reviewsCount: 0,
    description: 'A bright collection of small carved angel figurines in an assortment of colors.',
    details: ['Assorted color selection', 'Carved angel-shaped figures', 'Decorative crystal collection'],
    image: '/products/crystal-angels.png',
    inStock: true,
  },
  {
    id: 'black-ganesha',
    name: 'Black Ganesha Figurine',
    price: 800,
    currency: 'INR',
    category: 'Crystal Figurines',
    tag: 'Carved Figurine',
    rating: 5,
    reviewsCount: 0,
    description: 'A dark, polished Ganesha figurine with a smooth carved finish.',
    details: ['Ganesha-inspired carved design', 'Polished dark finish', 'Display-ready decorative piece'],
    image: '/products/black-ganesha.png',
    inStock: true,
  },
  {
    id: 'amethyst-ganesha',
    name: 'Amethyst Ganesha Figurine',
    price: 800,
    currency: 'INR',
    category: 'Crystal Figurines',
    tag: 'Purple Crystal',
    rating: 5,
    reviewsCount: 0,
    description: 'A purple crystal Ganesha figurine photographed against a natural, leafy backdrop.',
    details: ['Purple crystal finish', 'Ganesha-inspired carved design', 'Display-ready decorative piece'],
    image: '/products/amethyst-ganesha.png',
    inStock: true,
  },
  {
    id: 'seven-chakra-selenite-plate',
    name: 'Seven Chakra Selenite Plate',
    price: 700,
    currency: 'INR',
    category: 'Selenite Plates',
    tag: 'Seven Chakra Design',
    rating: 5,
    reviewsCount: 0,
    description: 'A round selenite plate with a delicately engraved seven-chakra pattern.',
    details: ['Engraved chakra motif', 'Smooth round plate', 'Decorative crystal accessory'],
    image: '/products/seven-chakra-selenite-plate.png',
    inStock: true,
  },
  {
    id: 'green-gemstone-tree',
    name: 'Green Gemstone Tree',
    price: 850,
    currency: 'INR',
    category: 'Gemstone Trees',
    tag: 'Hand-Assembled',
    rating: 5,
    reviewsCount: 0,
    description: 'A green gemstone tree sculpture with a natural wood-style trunk and a compact display base.',
    details: ['Green gemstone-style leaves', 'Sculptural branch design', 'Display-ready base'],
    image: '/products/green-gemstone-tree.png',
    inStock: true,
  },
  {
    id: 'selenite-towers',
    name: 'Selenite Tower',
    price: 750,
    currency: 'INR',
    category: 'Selenite Towers',
    tag: 'Selenite Collection',
    rating: 5,
    reviewsCount: 0,
    description: 'A selection of translucent selenite towers presented in a clean, bright display.',
    details: ['Translucent tower shapes', 'Multiple sizes shown', 'Decorative crystal display'],
    image: '/products/selenite-towers.png',
    inStock: true,
  },
  {
    id: 'zubi-prosperity-stones',
    name: 'Zubi Prosperity Stones',
    price: 600,
    currency: 'INR',
    category: 'Zubi Stones',
    tag: 'Engraved Pair',
    rating: 5,
    reviewsCount: 0,
    description: 'A pair of deep-green oval stones with gold-toned engraved symbols and markings.',
    details: ['Two engraved oval stones', 'Gold-toned markings', 'Display-ready presentation'],
    image: '/products/zubi-prosperity-stones.png',
    inStock: true,
  },
  {
    id: 'seven-chakra-gemstone-tree',
    name: 'Seven Chakra Gemstone Tree',
    price: 850,
    currency: 'INR',
    category: 'Gemstone Trees',
    tag: 'Seven Chakra Colors',
    rating: 5,
    reviewsCount: 0,
    description: 'A sculptural gemstone tree arranged in a spectrum of bright chakra-inspired colors.',
    details: ['Multicolor gemstone-style leaves', 'Sculptural branch design', 'Display-ready base'],
    image: '/products/seven-chakra-gemstone-tree.png',
    inStock: true,
  },
  {
    id: 'affirmation-selenite-plate',
    name: 'Affirmation Selenite Plate',
    price: 720,
    currency: 'INR',
    category: 'Selenite Plates',
    tag: 'Engraved Affirmation',
    rating: 5,
    reviewsCount: 0,
    description: 'A pale round selenite plate engraved with a short affirmation.',
    details: ['Engraved affirmation', 'Smooth round profile', 'Decorative crystal accessory'],
    image: '/products/affirmation-selenite-plate.png',
    inStock: true,
  },
  {
    id: 'zodiac-selenite-plate',
    name: 'Zodiac Selenite Plate',
    price: 720,
    currency: 'INR',
    category: 'Selenite Plates',
    tag: 'Celestial Engraving',
    rating: 5,
    reviewsCount: 0,
    description: 'A round selenite plate with an engraved zodiac-inspired celestial wheel.',
    details: ['Zodiac-inspired engraving', 'Smooth round profile', 'Decorative crystal accessory'],
    image: '/products/zodiac-selenite-plate.png',
    inStock: true,
  },
  {
    id: 'bracelet-aries',
    name: 'Aries Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Aries',
    rating: 5,
    reviewsCount: 0,
    description: 'A polished orange-and-dark bead bracelet from the zodiac collection.',
    details: ['Aries zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-aries.png',
    inStock: true,
  },
  {
    id: 'bracelet-taurus',
    name: 'Taurus Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Taurus',
    rating: 5,
    reviewsCount: 0,
    description: 'A warm, earth-toned bead bracelet from the zodiac collection.',
    details: ['Taurus zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-taurus.png',
    inStock: true,
  },
  {
    id: 'bracelet-gemini',
    name: 'Gemini Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Gemini',
    rating: 5,
    reviewsCount: 0,
    description: 'A green bead bracelet from the zodiac collection.',
    details: ['Gemini zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-gemini.png',
    inStock: true,
  },
  {
    id: 'bracelet-cancer',
    name: 'Cancer Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Cancer',
    rating: 5,
    reviewsCount: 0,
    description: 'A light-colored bead bracelet from the zodiac collection.',
    details: ['Cancer zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-cancer.png',
    inStock: true,
  },
  {
    id: 'bracelet-leo',
    name: 'Leo Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Leo',
    rating: 5,
    reviewsCount: 0,
    description: 'A golden-brown bead bracelet from the zodiac collection.',
    details: ['Leo zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-leo.png',
    inStock: true,
  },
  {
    id: 'bracelet-virgo',
    name: 'Virgo Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Virgo',
    rating: 5,
    reviewsCount: 0,
    description: 'A warm orange-and-cream bead bracelet from the zodiac collection.',
    details: ['Virgo zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-virgo.png',
    inStock: true,
  },
  {
    id: 'bracelet-scorpio',
    name: 'Scorpio Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Scorpio',
    rating: 5,
    reviewsCount: 0,
    description: 'A black-and-white bead bracelet from the zodiac collection.',
    details: ['Scorpio zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-scorpio.png',
    inStock: true,
  },
  {
    id: 'bracelet-sagittarius',
    name: 'Sagittarius Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Sagittarius',
    rating: 5,
    reviewsCount: 0,
    description: 'A blue-and-black bead bracelet from the zodiac collection.',
    details: ['Sagittarius zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-sagittarius.png',
    inStock: true,
  },
  {
    id: 'bracelet-capricorn',
    name: 'Capricorn Zodiac Bracelet',
    price: 1200,
    currency: 'INR',
    category: 'Zodiac Bracelets',
    tag: 'Capricorn',
    rating: 5,
    reviewsCount: 0,
    description: 'A dark bead bracelet from the zodiac collection.',
    details: ['Capricorn zodiac design', 'Polished round beads', 'Stretch bracelet style'],
    image: '/products/bracelet-capricorn.png',
    inStock: true,
  },
];

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
  },
  ...UPLOADED_PRODUCTS_DATA,
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
