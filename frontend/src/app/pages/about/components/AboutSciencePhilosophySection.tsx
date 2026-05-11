import { memo } from 'react';
import { ClinicalGoldText } from './clinicalGoldText';

export type AboutSciencePhilosophySectionProps = {
    /** When true, only the cream cards (used on `/science` where the page hero carries the title). */
    cardsOnly?: boolean;
    /** When `cardsOnly`, links this block to the page hero heading id for accessibility. */
    ariaLabelledBy?: string;
};

export const AboutSciencePhilosophySection = memo(function AboutSciencePhilosophySection({
    cardsOnly = false,
    ariaLabelledBy,
}: AboutSciencePhilosophySectionProps) {
    return (
        <section
            id={cardsOnly ? undefined : 'science-philosophy'}
            className={`relative z-[18] overflow-hidden bg-gradient-to-b from-[#0B0B0B] via-[#070a08] to-[#050805] ${
                cardsOnly ? 'scroll-mt-28 py-14 md:scroll-mt-32 md:py-20' : 'scroll-mt-28 py-20 md:scroll-mt-32 md:py-28'
            }`}
            aria-labelledby={cardsOnly ? ariaLabelledBy : 'science-philosophy-heading'}
            aria-label={cardsOnly && !ariaLabelledBy ? 'Ayurgenomics and Phygital approach' : undefined}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent"
                aria-hidden
            />
            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
                {!cardsOnly && (
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85 md:text-[11px] md:tracking-[0.36em]">
                            The science & philosophy
                        </p>
                        <h2
                            id="science-philosophy-heading"
                            className="mt-4 font-['Gloock'] text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight text-white md:mt-5 md:text-[clamp(2rem,3.5vw,3rem)]"
                            style={{ fontWeight: 400 }}
                        >
                            <ClinicalGoldText>Ayurgenomics</ClinicalGoldText>
                            {' · '}
                            <span className="text-white/90">Phygital care</span>
                        </h2>
                    </div>
                )}

                <div
                    className={`mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-10 ${
                        cardsOnly ? 'mt-0' : 'mt-12 md:mt-16'
                    }`}
                >
                    <article
                        className="rounded-[1.35rem] border border-white/40 p-8 shadow-[0_26px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm md:rounded-[1.5rem] md:p-10"
                        style={{
                            background:
                                'linear-gradient(145deg, rgba(242,235,218,0.95) 0%, rgba(226,214,182,0.98) 100%)',
                            boxShadow: '0 28px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        <h3 className="font-['Inter'] text-[14px] md:text-[15px] font-bold uppercase tracking-[0.2em] text-[#141210]">
                            Ayurgenomics
                        </h3>
                        <p className="mt-4 font-['Inter'] text-[15px] font-medium leading-relaxed text-[#2a2620]/85 md:text-[16px]">
                            Where classical Ayurveda meets genomic insight: we use DNA-informed health assessments
                            alongside systemic cleansing protocols, so recommendations reflect how your constitution
                            interacts with modern stressors — not generic wellness trends.
                        </p>
                    </article>
                    <article
                        className="rounded-[1.35rem] border border-white/40 p-8 shadow-[0_26px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm md:rounded-[1.5rem] md:p-10"
                        style={{
                            background:
                                'linear-gradient(145deg, rgba(242,235,218,0.95) 0%, rgba(226,214,182,0.98) 100%)',
                            boxShadow: '0 28px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        <h3 className="font-['Inter'] text-[14px] md:text-[15px] font-bold uppercase tracking-[0.2em] text-[#141210]">
                            Phygital approach
                        </h3>
                        <p className="mt-4 font-['Inter'] text-[15px] font-medium leading-relaxed text-[#2a2620]/85 md:text-[16px]">
                            Traditional methods meet modern diagnostics: in-clinic depth with digital continuity — so
                            follow-up, tracking, and education stay as rigorous as the first consultation. That same
                            standard flows into how we formulate and validate what you take home.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
});
