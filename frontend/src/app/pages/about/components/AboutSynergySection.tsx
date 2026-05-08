import { memo } from 'react';
import { ABOUT_BODY_CLASS } from './aboutConstants';
import { ClinicalGoldText } from './clinicalGoldText';

export const AboutSynergySection = memo(function AboutSynergySection() {
    return (
        <section
            className="relative z-[16] bg-[#0B0B0B] py-20 md:py-28"
            aria-labelledby="about-synergy-heading"
        >
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                <div className="mx-auto max-w-3xl text-center md:max-w-4xl">
                    <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85 md:text-[11px]">
                        Why the 40-year synergy matters
                    </p>
                    <h2
                        id="about-synergy-heading"
                        className="mt-4 font-['Cormorant_Garamond',serif] font-semibold text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight text-[#F5F5DC] md:mt-5 md:text-[clamp(2rem,3.5vw,3rem)]"
                        style={{ fontWeight: 600 }}
                    >
                        A <ClinicalGoldText>360-degree</ClinicalGoldText> lens on prevention
                    </h2>
                    <p className={`mt-6 ${ABOUT_BODY_CLASS}`}>
                        The combination of Dr. Rasal’s specialized medical cleansing and Kanika Tyagi’s mastery of
                        clinical nutrition creates a 360-degree approach to prevention.
                    </p>
                    <p className={`mt-5 ${ABOUT_BODY_CLASS}`}>
                        While many brands focus only on the surface, our founders use their combined four decades of
                        experience to look at your gut microbiome, genetic tendencies, and nutritional gaps. This ensures
                        that our upcoming products—from the Oil Pulling Oil to our Immunity blends—are not just "natural,"
                        but are clinically engineered to make you truly fit for the future.
                    </p>
                    <p className={`mt-8 font-['Cormorant_Garamond',serif] font-semibold text-[1.25rem] italic tracking-wide text-[#c8a84b]/90`}>
                        "Decades of Experience. One Vision for the Future."
                    </p>
                </div>
            </div>
        </section>
    );
});
