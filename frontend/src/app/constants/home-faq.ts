export type HomeFaqItem = {
    id: string;
    question: string;
    answer: string;
};

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
    {
        id: 'faq-product-results',
        question: 'How soon can I expect visible results after starting AW Naturals?',
        answer:
            'Most customers notice early shifts in energy, digestion, or sleep within 10-14 days. For deeper changes, we recommend following your protocol consistently for at least 6-8 weeks.',
    },
    {
        id: 'faq-safe-with-medicines',
        question: 'Are these formulations safe if I already take regular medicines?',
        answer:
            'Our blends are crafted for daily wellness support, but if you are on prescription medication or have an ongoing medical condition, consult your physician before starting any new supplement.',
    },
    {
        id: 'faq-how-to-choose',
        question: 'How do I choose the right formula for my body goals?',
        answer:
            'Start with the Find Your Blend assessment on our website. It maps your routine, stress, sleep, and wellness goals, then recommends a focused plan instead of random trial and error.',
    },
    {
        id: 'faq-authenticity',
        question: 'How do you ensure ingredient quality and authenticity?',
        answer:
            'We work with vetted sourcing partners, run quality checks batch-wise, and prioritize clinically aligned extraction methods so every formula keeps both purity and efficacy intact.',
    },
    {
        id: 'faq-daily-use',
        question: 'Can I use AW Naturals formulas daily for long-term wellness?',
        answer:
            'Yes, our protocols are designed for sustainable daily use. Consistency, hydration, and healthy sleep habits improve outcomes significantly over time.',
    },
];
