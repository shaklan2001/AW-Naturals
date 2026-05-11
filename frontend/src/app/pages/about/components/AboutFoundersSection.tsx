import { memo } from 'react';
import { ABOUT_BODY_CLASS } from './aboutConstants';
import { ABOUT_FOUNDERS } from './aboutFounders';
import { FounderPortraitCard } from './FounderPortraitCard';
import { ClinicalGoldText } from './clinicalGoldText';

export const AboutFoundersSection = memo(function AboutFoundersSection() {
    return (
        <section
            className="relative z-[20] overflow-hidden bg-[#050805] py-20 md:py-28"
            aria-labelledby="about-founders-heading"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
                <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
                    <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85 md:text-[11px] md:tracking-[0.36em]">
                        Our founders
                    </p>
                    <h2
                        id="about-founders-heading"
                        className="mt-4 font-['Gloock'] text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight text-white md:mt-5 md:text-[clamp(2rem,3.5vw,3rem)]"
                        style={{ fontWeight: 400 }}
                    >
                        A Legacy of <ClinicalGoldText>Clinical Excellence</ClinicalGoldText>
                    </h2>
                    <p className={`mt-6 ${ABOUT_BODY_CLASS}`}>
                        AW Naturals is guided by a collective{' '}
                        <strong className="font-normal text-[#F5F5DC]">40 years of healthcare expertise</strong>,
                        merging traditional wisdom with modern diagnostic precision.
                    </p>
                </div>

                <ul className="flex flex-col gap-16 md:gap-24">
                    {ABOUT_FOUNDERS.map((founder, index) => {
                        const isReversed = index % 2 === 1;
                        return (
                            <li key={founder.id}>
                                <article className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
                                    <div className={isReversed ? 'md:order-2' : 'md:order-1'}>
                                        <FounderPortraitCard
                                            imageSrc={founder.imageSrc}
                                            name={founder.name}
                                            initials={founder.initials}
                                        />
                                    </div>
                                    <div
                                        className={`text-center md:text-left ${isReversed ? 'md:order-1' : 'md:order-2'}`}
                                    >
                                        <h3
                                            className="font-['Gloock'] text-[clamp(1.65rem,3.2vw,2.25rem)] leading-tight text-[#F5F5DC]"
                                            style={{ fontWeight: 400 }}
                                        >
                                            {founder.name}
                                        </h3>
                                        <p className="mt-2 font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8a84b]/80 md:text-xs">
                                            {founder.role}
                                        </p>
                                        {founder.bio.map((paragraph, i) => (
                                            <p
                                                key={`${founder.id}-${i}`}
                                                className={`mt-5 ${ABOUT_BODY_CLASS} mx-auto max-w-xl md:mx-0`}
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
});
