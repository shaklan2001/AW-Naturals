import type { LucideIcon } from 'lucide-react';
import { Target, Heart } from 'lucide-react';

export type AboutStat = {
    id: string;
    num: number;
    label: string;
    suffix: string;
};

export const ABOUT_STATS: readonly AboutStat[] = [
    { id: 'years', num: 40, label: 'Years Experience', suffix: '+' },
    { id: 'infusions', num: 4, label: 'Clinical Infusions', suffix: '' },
    { id: 'additives', num: 0, label: 'Additives', suffix: '' },
    { id: 'natural', num: 100, label: 'Natural Ingredients', suffix: '%' },
] as const;

export type OrbitStep = {
    id: string;
    title: string;
    body: string;
};

export const ABOUT_ORBIT_STEPS: readonly OrbitStep[] = [
    {
        id: 'heritage-meets-diagnostics',
        title: 'Heritage Meets Diagnostics',
        body: 'Ayurgenomics and systemic protocols informed by real clinical load — not trend-chasing.',
    },
    {
        id: 'phygital-care',
        title: 'Phygital Continuity',
        body: 'In-clinic depth with digital follow-through so guidance stays consistent between visits.',
    },
    {
        id: 'quiet-luxury',
        title: 'Quiet Luxury',
        body: "Future-fit rituals: handmade, traceable, and refined for daily life — never loud for loud's sake.",
    },
    {
        id: 'prevention-first',
        title: 'Prevention First',
        body: 'Nutrition, microbiome, and genetic context shape what we build — from infusions to oral care.',
    },
] as const;

export type MissionVisionItem = {
    id: string;
    icon: LucideIcon;
    title: string;
    body: string;
};

export const ABOUT_MISSION_VISION: readonly MissionVisionItem[] = [
    {
        id: 'mission',
        icon: Target,
        title: 'Our Mission',
        body: 'Build a foundation for longevity with genuine, handmade, science-backed products — so clinical rigor from Aayurshala becomes a quiet daily practice in your own home.',
    },
    {
        id: 'vision',
        icon: Heart,
        title: 'Our Vision',
        body: 'Lead a future-fit standard for luxury wellness: transparent formulations, Ayurgenomics-informed care, and a phygital path that honors heritage while embracing modern diagnostics.',
    },
] as const;

/** Orbit geometry — SVG and CSS offset-path must stay in sync */
/** Shared body copy utility class on About legacy column */
export const ABOUT_BODY_CLASS =
    "font-['Inter'] text-[17px] md:text-[19px] text-white/70 font-light leading-relaxed";

export const ABOUT_ORBIT_LAYOUT = {
    STAGE: 1080,
    RADIUS_X: 528,
    RADIUS_Y: 136,
    ROTATION_DEG: -8,
    DURATION_SEC: 30,
    CROP_MIN_H: 440,
    CROP_MAX_H: 680,
    CROP_VW: 62,
} as const;
