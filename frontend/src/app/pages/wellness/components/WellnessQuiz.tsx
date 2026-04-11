import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { SITE_CONTAINER_CLASS } from '../../../constants/site-layout';
import { cn } from '../../../components/ui/utils';

type RitualCard = {
    key: string;
    label: string;
    title: string;
    description: string;
    cta: string;
    to: string;
    featured?: boolean;
    image: ReactNode;
};

const RITUAL_CARDS: RitualCard[] = [
    {
        key: 'brewing-quiz',
        label: 'Brewing Rituals — Find Your Blend',
        title: 'Find Your Perfect Blend',
        description:
            'Energy? Balance? Sleep? Take the 3-question quiz to find your ritual. Next page will show your results.',
        cta: 'Find Your Blend',
        to: '/find-your-blend',
        featured: true,
        image: (
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#f3f3f1] flex items-center justify-center">
                <ImageWithFallback
                    src="/assets/confuse_1.webp"
                    alt="Choose your blend illustration"
                    className="h-full w-auto object-contain"
                />
            </div>
        ),
    },
    {
        key: 'oral-skin',
        label: 'Oral Care & Skin Care Rituals',
        title: 'Oral Care & Skin Care',
        description:
            'Daily Purification. Transform daily hygiene into a spa ritual. Expert oral care and chemical-free skincare.',
        cta: 'Shop Rituals',
        to: '/products?category=Oral%20Care%20Line',
        image: (
            <ImageWithFallback
                src="/assets/soap_bar.png"
                alt="Botanical face bar for daily skin care"
                className="aspect-[3/2] w-full object-cover"
            />
        ),
    },
    {
        key: 'night-ritual',
        label: 'The Night Ritual',
        title: 'The Night Ritual',
        description:
            'Decompress. Restore. Reconnect. End your day with a grounding foot massage, meticulously crafted oil for deep, restorative sleep.',
        cta: 'Shop The Night Oil',
        to: '/products?category=Oral%20Care%20Line',
        image: (
            <ImageWithFallback
                src="/assets/night_oil.png"
                alt="Botanical foot massage oil for evening ritual"
                className="aspect-[3/2] w-full object-cover"
            />
        ),
    },
];

function RitualCtaButton({ to, children, centered }: { to: string; children: string; centered?: boolean }) {
    return (
        <Link
            to={to}
            className={cn(
                'inline-flex h-11 items-center justify-center rounded-xl px-6 font-[\'Inter\'] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all duration-300 hover:brightness-110',
                centered ? 'mx-auto' : 'w-fit'
            )}
            style={{ background: 'linear-gradient(135deg, #C6A85B 0%, #d4b06a 50%, #b8964a 100%)' }}
        >
            {children}
        </Link>
    );
}

/** Home-page ritual categories — quiz, oral/skin care, and night oil. */
export function WellnessQuiz() {
    return (
        <section className="relative overflow-hidden bg-[#0B0B0B] py-24">
            <div className={SITE_CONTAINER_CLASS}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14 text-center md:mb-16"
                >
                    <h2 className="font-['Cormorant_Garamond',serif] text-[40px] font-semibold leading-tight text-white md:text-[52px]">
                        Curated Daily Rituals
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
                    {RITUAL_CARDS.map((card, index) => (
                        <motion.article
                            key={card.key}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.1 }}
                            className="flex flex-col"
                        >
                            <p className="mb-4 font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                {card.label}
                            </p>

                            <div
                                className={cn(
                                    'flex flex-1 flex-col rounded-2xl bg-[#141414] overflow-hidden transition-all duration-300',
                                    card.featured 
                                        ? 'border border-[#C6A85B] shadow-[0_0_20px_rgba(198,168,91,0.12)]' 
                                        : 'border border-white/5'
                                )}
                            >
                                <div className="w-full overflow-hidden">
                                    {card.image}
                                </div>

                                <div className="flex flex-1 flex-col px-6 py-6 items-start text-left">
                                    <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-white text-[26px] leading-tight">
                                        {card.title}
                                    </h3>

                                    <p className="mt-4 font-['Inter'] text-[14px] font-light leading-relaxed text-white/60">
                                        {card.description}
                                    </p>

                                    <div className="mt-auto pt-7">
                                        <RitualCtaButton to={card.to} centered={false}>
                                            {card.cta}
                                        </RitualCtaButton>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
