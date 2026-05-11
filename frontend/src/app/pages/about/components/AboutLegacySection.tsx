import { memo } from 'react';
import { LegacyTrustTiltVisual } from './LegacyTrustTiltVisual';
import { ClinicalGoldText } from './clinicalGoldText';
import { ABOUT_BODY_CLASS } from './aboutConstants';

export const AboutLegacySection = memo(function AboutLegacySection() {
    return (
        <section className="legacy-section relative z-10 w-full overflow-hidden rounded-t-[2rem] bg-gradient-to-b from-[#050705] via-[#0B0B0B] to-[#051009] shadow-[0_8px_40px_rgba(0,0,0,0.35)] md:rounded-t-[2.5rem]">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black/30 via-black/5 to-transparent md:h-32"
                aria-hidden
            />
            <div className="legacy-section-inner relative z-[2] pt-12 md:pt-16">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 px-6 pb-12 pt-2 md:grid-cols-2 md:items-center md:gap-14 md:px-12 md:pb-16 md:pt-4 lg:gap-16 lg:pb-20">
                    <div className="relative order-2 flex justify-center md:order-1 md:justify-end md:self-center">
                        <div className="legacy-visual-wrap sticky top-24 w-full max-w-[520px] pt-2 pb-1 md:top-28 md:pt-0 md:pb-0">
                            <LegacyTrustTiltVisual />
                        </div>
                    </div>

                    <div className="order-1 flex flex-col justify-start space-y-8 pb-6 text-center md:order-2 md:space-y-10 md:pb-10 md:pl-2 md:text-left lg:pl-6">
                        <p className="legacy-text-element font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85 md:text-[11px] md:tracking-[0.36em]">
                            About AW Naturals
                        </p>
                        <h2
                            className="legacy-text-element font-['Gloock'] text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight text-white md:text-[clamp(2rem,3.5vw,3rem)]"
                            style={{ fontWeight: 400 }}
                        >
                            <ClinicalGoldText>Quiet Luxury</ClinicalGoldText>
                            <br className="hidden sm:block" />
                            Clinically distilled
                        </h2>
                        <p className={`legacy-text-element ${ABOUT_BODY_CLASS} mx-auto max-w-xl md:mx-0`}>
                            AW Naturals is a high-end lifestyle wellness brand born from the clinical corridors of
                            Aayurshala Wellness. Founded on the principle of{' '}
                            <strong className="font-normal text-[#F5F5DC]">Quiet Luxury</strong>, we believe that true
                            well-being is found in the meticulous details of daily life. Our mission is to build a
                            foundation for longevity by providing genuine, handmade, and science-backed products that
                            empower you to live a future-fit life.
                        </p>
                        <p className={`legacy-text-element ${ABOUT_BODY_CLASS} mx-auto max-w-xl md:mx-0`}>
                            Every formulation carries the same rigor you would expect in a clinical setting —
                            traceable botanicals, precise guidance, and zero compromise on purity — so what you use at
                            home reflects the standards we uphold in practice.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
});
