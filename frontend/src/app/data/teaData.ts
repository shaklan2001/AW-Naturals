export interface TeaData {
  id: string;
  namePart1: string;
  namePart2: string;
  shortName: string;
  description: string;
  image: string;
  showcaseImage: string;
  bgGradient: string;
  textGradient: string;
  problem: string;
  benefitTitle: string;
}

export const teaProducts: TeaData[] = [
  {
    id: 'ginger-berberis',
    namePart1: 'Ginger',
    namePart2: '& Berberis',
    shortName: 'Ginger',
    description: 'Supports digestion and metabolic balance naturally.',
    image: '/assets/hero session /ginger-tea 1.png',
    showcaseImage: '/assets/tranparent-bg-box/Ginger.webp',
    bgGradient:
      'radial-gradient(ellipse 95% 80% at 78% 42%, rgba(120, 85, 45, 0.32) 0%, transparent 52%), #0B0B0B',
    textGradient: 'from-[#C6A85B] via-[#E5D08A] to-[#C6A85B]',
    problem: 'Weight & Metabolism',
    benefitTitle: 'Metabolic Balance',
  },
  {
    id: 'marigold',
    namePart1: 'Marigold',
    namePart2: 'Premium',
    shortName: 'Marigold',
    description: 'A vibrant, antioxidant-rich boost to brighten your day.',
    image: '/assets/hero session /Merigold.png',
    showcaseImage: '/assets/tranparent-bg-box/Merigold.webp',
    bgGradient:
      'radial-gradient(ellipse 95% 80% at 78% 42%, rgba(140, 115, 35, 0.26) 0%, transparent 52%), #0B0B0B',
    textGradient: 'from-[#E0B239] via-[#F7D871] to-[#E0B239]',
    problem: 'Low Energy & Fatigue',
    benefitTitle: 'Vibrant Energy',
  },
  {
    id: 'chamomile',
    namePart1: 'Chamomile',
    namePart2: 'Bliss',
    shortName: 'Chamomile',
    description: 'Calms the nervous system for deep, restorative rest.',
    image: '/assets/hero session /Chamomile.png',
    showcaseImage: '/assets/tranparent-bg-box/Chamomile.webp',
    bgGradient:
      'radial-gradient(ellipse 95% 80% at 78% 42%, rgba(75, 115, 88, 0.34) 0%, transparent 54%), #0B0B0B',
    textGradient: 'from-[#9FBE97] via-[#C9E5C1] to-[#9FBE97]',
    problem: 'Disturbed Sleep',
    benefitTitle: 'Deep Sleep',
  }
];
