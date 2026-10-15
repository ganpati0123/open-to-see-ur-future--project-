export interface ProductGalleryImage {
  src: string;
  alt: string;
  label: string;
  kind: 'product' | 'story' | 'wear' | 'benefits';
}

export interface ProductDetailContent {
  gallery: ProductGalleryImage[];
  description: string;
  materials: { name: string; note: string }[];
  benefits: string[];
  wearGuide: string[];
  bestDays: string;
  specifications: { label: string; value: string }[];
  traditionNote: string;
}

const zodiacGallery = (sign: string): ProductGalleryImage[] => [
  {
    src: `/products/zodiac-details/${sign}-hero.png`,
    alt: `${sign} zodiac bracelet with a complimentary raw selenite plate`,
    label: 'Bracelet & gift',
    kind: 'product',
  },
  {
    src: `/products/zodiac-details/${sign}-story.png`,
    alt: `${sign} bracelet crystal materials and product story`,
    label: 'Crystal story',
    kind: 'story',
  },
  {
    src: `/products/zodiac-details/${sign}-wear.png`,
    alt: `${sign} bracelet wearing guide and specifications`,
    label: 'Wear & specs',
    kind: 'wear',
  },
  {
    src: `/products/zodiac-details/${sign}-benefits.png`,
    alt: `Traditional crystal associations for the ${sign} bracelet`,
    label: 'Crystal notes',
    kind: 'benefits',
  },
];

export const PRODUCT_DETAIL_CONTENT: Record<string, ProductDetailContent> = {
  'bracelet-cancer': {
    gallery: zodiacGallery('cancer'),
    description:
      'A soft-toned Cancer zodiac bracelet pairing howlite and milky quartz with a black zodiac charm and gold-tone accents. The uploaded product details describe it as a thoughtful piece for calm, comfort, and a daily intention-setting ritual.',
    materials: [
      { name: 'Howlite', note: 'A white stone with natural grey veining.' },
      { name: 'Milky quartz', note: 'A pale, softly translucent quartz.' },
    ],
    benefits: [
      'Traditionally associated with calm and emotional balance.',
      'Chosen for a gentle, light-toned everyday look.',
      'A meaningful prompt to pause, reset, and set an intention.',
      'Includes one complimentary raw selenite plate, as shown.',
    ],
    wearGuide: [
      'Wear on the left hand if that suits your personal ritual.',
      'Set a simple intention such as peace, calm, or emotional balance.',
      'Designed for daily wear at home, work, or while travelling.',
      'Pairs with casual, office, and ethnic outfits.',
    ],
    bestDays: 'Monday or Thursday; the source guide suggests wearing it in the morning after a bath.',
    specifications: [
      { label: 'Zodiac', value: 'Cancer (Karka), 21 June – 22 July' },
      { label: 'Crystals', value: 'Howlite and milky quartz' },
      { label: 'Bead size', value: '8 mm' },
      { label: 'Bracelet length', value: '22 cm' },
      { label: 'Centre charm', value: 'Cancer zodiac charm' },
      { label: 'Fit', value: 'Stretchable elastic' },
      { label: 'Designed for', value: 'Unisex' },
      { label: 'Finish', value: 'Smooth, polished stones' },
      { label: 'Included', value: 'Bracelet and complimentary raw selenite plate' },
    ],
    traditionNote:
      'Crystal associations are presented as traditional, personal, and spiritual beliefs—not as medical advice or guaranteed outcomes.',
  },
  'bracelet-libra': {
    gallery: zodiacGallery('libra'),
    description:
      'A Libra zodiac bracelet with deep-blue lapis lazuli, white howlite, and a central Libra charm. The supplied product story highlights clarity, balance, and considered everyday styling.',
    materials: [
      { name: 'Lapis lazuli', note: 'A deep-blue natural stone with subtle tonal variation.' },
      { name: 'Howlite', note: 'A white stone with natural grey veining.' },
    ],
    benefits: [
      'Traditionally associated with clear thinking and confident decisions.',
      'Chosen as a reminder to make space for balance and self-care.',
      'Pairs polished blue and white stones with a zodiac centre charm.',
      'Includes one complimentary raw selenite plate, as shown.',
    ],
    wearGuide: [
      'Wear on the left hand if that suits your personal ritual.',
      'Set an intention such as balance, clarity, or peace.',
      'Suitable for daily wear at work, college, meetings, or while travelling.',
      'The supplied guide recommends pairing with western, office, and ethnic wear.',
    ],
    bestDays: 'Friday or Wednesday; the source guide suggests wearing it in the morning.',
    specifications: [
      { label: 'Zodiac', value: 'Libra (Tula), 23 September – 22 October' },
      { label: 'Crystals', value: 'Lapis lazuli and howlite' },
      { label: 'Bead size', value: '6 mm' },
      { label: 'Bracelet length', value: '22 cm' },
      { label: 'Centre charm', value: 'Libra zodiac charm' },
      { label: 'Fit', value: 'Stretchable elastic' },
      { label: 'Designed for', value: 'Women' },
      { label: 'Finish', value: 'Smooth, polished natural stones' },
      { label: 'Included', value: 'Bracelet and complimentary raw selenite plate' },
    ],
    traditionNote:
      'Crystal associations are presented as traditional, personal, and spiritual beliefs—not as medical advice or guaranteed outcomes.',
  },
  'bracelet-scorpio': {
    gallery: zodiacGallery('scorpio'),
    description:
      'A striking Scorpio bracelet combining glossy black obsidian with milky quartz, gold-tone accents, and a zodiac charm. The supplied product story frames it as a wearable reminder of strength and emotional balance.',
    materials: [
      { name: 'Black obsidian', note: 'A glossy, dark volcanic glass.' },
      { name: 'Milky quartz', note: 'A pale, softly translucent quartz.' },
    ],
    benefits: [
      'Traditionally associated with protection and inner strength.',
      'Chosen as a reminder to pause and find emotional balance.',
      'Contrasting black and white stones create a distinctive everyday piece.',
      'Includes one complimentary raw selenite plate, as shown.',
    ],
    wearGuide: [
      'Wear on the left hand if that suits your personal ritual.',
      'Set an intention such as confidence, focus, or success.',
      'Suitable for daily wear at work, college, while travelling, or at the gym.',
      'The supplied guide recommends pairing with western, office, and ethnic wear.',
    ],
    bestDays: 'Tuesday or Saturday; the source guide suggests wearing it in the morning.',
    specifications: [
      { label: 'Zodiac', value: 'Scorpio (Vrishchik), 23 October – 21 November' },
      { label: 'Crystals', value: 'Black obsidian and milky quartz' },
      { label: 'Bead size', value: '6 mm' },
      { label: 'Bracelet length', value: '22 cm' },
      { label: 'Centre charm', value: 'Scorpio zodiac charm' },
      { label: 'Fit', value: 'Stretchable elastic' },
      { label: 'Designed for', value: 'Women' },
      { label: 'Finish', value: 'Smooth, polished natural stones' },
      { label: 'Included', value: 'Bracelet and complimentary raw selenite plate' },
    ],
    traditionNote:
      'Crystal associations are presented as traditional, personal, and spiritual beliefs—not as medical advice or guaranteed outcomes.',
  },
  'bracelet-taurus': {
    gallery: zodiacGallery('taurus'),
    description:
      'A warm Taurus zodiac bracelet pairing sunstone and carnelian with a black zodiac charm and gold-tone accents. The supplied product story presents it as a bright, grounded piece for confidence and steady momentum.',
    materials: [
      { name: 'Sunstone', note: 'A warm peach-toned natural stone.' },
      { name: 'Carnelian', note: 'A vivid orange-red natural stone.' },
    ],
    benefits: [
      'Traditionally associated with confidence, motivation, and an optimistic outlook.',
      'Chosen as a reminder to approach daily goals with steady energy.',
      'Warm peach and orange stones bring a bright accent to everyday outfits.',
      'Includes one complimentary raw selenite plate, as shown.',
    ],
    wearGuide: [
      'Wear on the left hand if that suits your personal ritual.',
      'Set an intention such as confidence, happiness, or growth.',
      'Suitable for daily wear at work, college, or on outings.',
      'Pairs with casual, office, and ethnic outfits.',
    ],
    bestDays: 'Friday or Monday; the source guide suggests wearing it in the morning after a bath.',
    specifications: [
      { label: 'Zodiac', value: 'Taurus (Vrishabh), 20 April – 20 May' },
      { label: 'Crystals', value: 'Sunstone and carnelian' },
      { label: 'Bead size', value: '8 mm' },
      { label: 'Bracelet length', value: '22 cm' },
      { label: 'Centre charm', value: 'Taurus zodiac charm' },
      { label: 'Fit', value: 'Stretchable elastic' },
      { label: 'Designed for', value: 'Unisex' },
      { label: 'Finish', value: 'Smooth, polished natural stones' },
      { label: 'Included', value: 'Bracelet and complimentary raw selenite plate' },
    ],
    traditionNote:
      'Crystal associations are presented as traditional, personal, and spiritual beliefs—not as medical advice or guaranteed outcomes.',
  },
};
