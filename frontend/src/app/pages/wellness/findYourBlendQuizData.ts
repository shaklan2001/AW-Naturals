/**
 * Wellness assessment copy sourced from `Infusion quiz & their details.docx`.
 * Axis A → energy / Marigold, B → sleep / Chamomile, C → metabolism / Ginger & Berberis.
 */

export type QuizAxis = 'A' | 'B' | 'C';

export type QuizOutcomeKey = 'energy' | 'sleep' | 'metabolism' | 'mixed';

export type QuizQuestion = {
    id: string;
    title: string;
    options: Array<{ axis: QuizAxis; label: string }>;
};

export const QUIZ_HEADLINE = 'Let our experts curate your daily ritual.';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'goal',
        title: 'What is your primary wellness goal right now?',
        options: [
            {
                axis: 'A',
                label: 'I want to wake up energized and stay productive all day.',
            },
            {
                axis: 'B',
                label: 'I need to wind down and improve my sleep quality at night.',
            },
            {
                axis: 'C',
                label: 'I want to support my metabolism and feel lighter after meals.',
            },
        ],
    },
    {
        id: 'day',
        title: 'How would you describe your typical day?',
        options: [
            {
                axis: 'A',
                label: 'High-paced and demanding; I often feel drained by the afternoon.',
            },
            {
                axis: 'B',
                label: 'I carry stress into the evening, making it hard to switch off.',
            },
            {
                axis: 'C',
                label: 'I struggle with sluggishness or a “heavy” feeling after eating.',
            },
        ],
    },
    {
        id: 'timeline',
        title: 'How long have you been looking for a natural solution?',
        options: [
            { axis: 'A', label: 'Just starting to explore natural options.' },
            {
                axis: 'B',
                label: 'I’ve tried others but haven’t found the right fit.',
            },
            {
                axis: 'C',
                label: "I'm ready to commit to a structured daily wellness protocol.",
            },
        ],
    },
];

export const DOCTOR_CHOICE_LINE =
    'The Doctor’s Choice: Formulated by an MD (Ayurveda) & Clinical Nutritionist.';

export const QUIZ_OUTCOMES: Record<
    QuizOutcomeKey,
    {
        title: string;
        subtitle: string;
        doctorsNote: string;
        primaryCta: { label: string; to: string };
        secondaryLinks?: Array<{ label: string; to: string }>;
    }
> = {
    energy: {
        title: 'The “Sustained Energy” Ritual',
        subtitle: 'Predominantly energy & vitality',
        doctorsNote:
            'To break the cycle of midday fatigue, you need to stabilize your energy levels early. We suggest a morning ritual with Marigold Premium Herbal Infusion. It’s designed to help you maintain a steady, natural rhythm without the caffeine crash.',
        primaryCta: { label: 'Shop Marigold infusion', to: '/products/prod_001' },
    },
    sleep: {
        title: 'The “Nervous System Reset”',
        subtitle: 'Rest & recovery',
        doctorsNote:
            'Quality sleep is the foundation of health. If you find it hard to switch off, our Chamomile infusion provides the necessary signal to your body that it is time to rest. It’s an essential evening ritual for deep, restorative recovery.',
        primaryCta: { label: 'Shop Chamomile infusion', to: '/products/prod_002' },
    },
    metabolism: {
        title: 'The “Internal Rhythm” Protocol',
        subtitle: 'Metabolic balance',
        doctorsNote:
            'Sluggishness often stems from an overburdened digestive system. We recommend our Ginger & Berberis infusion to support your metabolism and internal balance. It is the perfect functional tea to help you feel light and active after meals.',
        primaryCta: { label: 'Shop Ginger & Berberis', to: '/products/prod_004' },
    },
    mixed: {
        title: 'The “Complete Wellness” Bundle',
        subtitle: 'Balanced profile across goals',
        doctorsNote:
            'You are looking for a total lifestyle reset. Our three-product protocol addresses three pillars of wellness: Marigold for morning energy, Ginger & Berberis for metabolic support during the day, and Chamomile for evening rest — the full protocol we suggest for a holistic transformation.',
        primaryCta: { label: 'Shop all clinical blends', to: '/products' },
        secondaryLinks: [
            { label: 'Marigold Premium', to: '/products/prod_001' },
            { label: 'Ginger & Berberis', to: '/products/prod_004' },
            { label: 'Chamomile Bliss', to: '/products/prod_002' },
        ],
    },
};

export function outcomeFromAnswers(answers: QuizAxis[]): QuizOutcomeKey {
    const counts = { A: 0, B: 0, C: 0 };
    for (const a of answers) {
        counts[a] += 1;
    }
    const pairs = Object.entries(counts) as [QuizAxis, number][];
    const max = Math.max(counts.A, counts.B, counts.C);
    const leaders = pairs.filter(([, n]) => n === max).map(([k]) => k);
    if (leaders.length !== 1) return 'mixed';
    const winner = leaders[0];
    if (winner === 'A') return 'energy';
    if (winner === 'B') return 'sleep';
    return 'metabolism';
}
