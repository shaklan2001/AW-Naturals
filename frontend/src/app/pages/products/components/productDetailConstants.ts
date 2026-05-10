export const DEFAULT_PRODUCT_EXTRA = {
    benefits: [
        'Premium botanical support for your daily wellness ritual',
        'Designed for bioavailability and gentle daily use',
        'Crafted with quality-tested plant extracts',
    ],
    benefitsDescription:
        'Each AW Naturals formulation is thoughtfully crafted using clinically studied botanicals to deliver real, measurable results for your daily wellness.',
    doctorNote:
        'This product is part of our clinical botanical line. Individual responses vary; consult your healthcare provider for personalized guidance.',
    ingredients: ['Premium botanical blend', 'Traditional plant extracts', 'Natural synergists'],
} as const;

export type ProductDetailExtra = {
    benefits: string[];
    benefitsDescription: string;
    doctorNote: string;
    ingredients: string[];
};

export const LEGACY_PRODUCT_DETAILS: Record<string, ProductDetailExtra> = {
    'marigold-premium': {
        benefits: [
            'Sustained natural energy without caffeine jitters',
            'Supports healthy cortisol levels',
            'Rich in antioxidants and flavonoids',
            'Enhances mental alertness and focus',
            'Promotes cardiovascular health',
        ],
        benefitsDescription:
            'Marigold Premium is a precision-blended botanical adaptogen designed to restore and sustain your natural energy. Backed by traditional wisdom and modern phytotherapy, it works with your body — not against it — to keep you vitalized through every part of your day.',
        doctorNote:
            "Marigold Premium contains adaptogenic compounds that support your body's natural energy production. The blend works by optimizing cortisol regulation, helping you maintain steady vitality throughout the day without the crash associated with stimulants.",
        ingredients: ['Marigold flowers', 'Ashwagandha root', 'Holy basil', 'Gotu kola', 'Natural flavors'],
    },
    'chamomile-bliss': {
        benefits: [
            'Promotes deep, restorative sleep',
            'Reduces nighttime anxiety and restlessness',
            'Supports natural melatonin production',
            'Gentle on the digestive system',
            'Non-habit forming sleep support',
        ],
        benefitsDescription:
            'Chamomile Bliss is a carefully composited sleep ritual in a cup. Crafted from calming botanicals with centuries of traditional use, it gently guides your nervous system into a state of deep, natural rest — without dependency or morning grogginess.',
        doctorNote:
            "The apigenin-rich formulation in Chamomile Bliss promotes GABA receptor activation, facilitating your body's natural sleep cycle.",
        ingredients: ['German chamomile', 'Passionflower', 'Lemon balm', 'Lavender', 'Valerian root'],
    },
    'ginger-berberis': {
        benefits: [
            'Supports healthy metabolism and digestion',
            'Natural thermogenic properties',
            'Reduces inflammation',
            'Balances blood sugar levels',
            'Promotes gut health',
        ],
        benefitsDescription:
            'Ginger & Berberis is a powerhouse digestive and metabolic tonic, combining two of nature\'s most researched thermogenic plants. Together, they ignite digestive fire, ease inflammation, and bring the body back to a state of balanced, efficient vitality.',
        doctorNote:
            "This synergistic blend combines ginger's thermogenic properties with berberis's metabolic support.",
        ingredients: ['Organic ginger root', 'Berberis aristata', 'Cinnamon bark', 'Fennel seed', 'Turmeric'],
    },
};

/** Maps storefront product ids (e.g. API `prod_001`) to legacy slug keys for rich copy. */
const PRODUCT_ID_TO_LEGACY_KEY: Record<string, string> = {
    prod_001: 'marigold-premium',
    prod_002: 'chamomile-bliss',
    prod_004: 'ginger-berberis',
};

export function getProductDetailExtra(productId: string): ProductDetailExtra {
    const legacyKey = PRODUCT_ID_TO_LEGACY_KEY[productId];
    if (legacyKey && LEGACY_PRODUCT_DETAILS[legacyKey]) {
        return LEGACY_PRODUCT_DETAILS[legacyKey];
    }
    return LEGACY_PRODUCT_DETAILS[productId] ?? DEFAULT_PRODUCT_EXTRA;
}
