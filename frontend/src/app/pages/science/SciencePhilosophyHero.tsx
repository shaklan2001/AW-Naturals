import { memo } from 'react';
import { Link } from 'react-router';
import { ClinicalGoldText } from '../about/components/clinicalGoldText';

/** Shared with `AboutSciencePhilosophySection` `cardsOnly` for `aria-labelledby`. */
export const SCIENCE_PAGE_HEADING_ID = 'science-page-heading';

export const SciencePhilosophyHero = memo(function SciencePhilosophyHero() {
    return (
        <section
            className="relative z-[16] min-h-[min(52vh,520px)] w-full overflow-hidden pt-28 pb-16 sm:pt-32 md:min-h-[min(48vh,560px)] md:pt-36 md:pb-20"
            aria-labelledby={SCIENCE_PAGE_HEADING_ID}
        >
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/story_bg.webp"
                    alt=""
                    className="h-full w-full object-cover object-[center_35%] opacity-[0.45]"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#050807]/95 via-[#0B0B0B]/88 to-[#0B0B0B]"
                    aria-hidden
                />
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(15,61,46,0.35),transparent_55%)]"
                    aria-hidden
                />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:max-w-6xl md:px-10">
                <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/90 md:text-[11px] md:tracking-[0.36em]">
                    Science & philosophy
                </p>
                <h1
                    id={SCIENCE_PAGE_HEADING_ID}
                    className="mb-6 mt-5 whitespace-nowrap font-['Cormorant_Garamond',serif] font-semibold text-[clamp(1.55rem,5.2vw,4.5rem)] leading-[1.08] tracking-tight text-[#F5F5DC] md:mt-6"
                >
                    <ClinicalGoldText>Ayurgenomics</ClinicalGoldText>
                    <span className="text-white/90">{' & Phygital\u00A0care'}</span>
                </h1>
                <p className="mx-auto max-w-2xl font-['Inter'] text-[16px] font-light leading-relaxed text-white/70 md:text-[18px]">
                    How traditional Ayurvedic methods meet modern diagnostics — the clinical lens that shapes every AW
                    Naturals formulation and consultation pathway.
                </p>
                <p className="mx-auto mt-4 max-w-2xl font-['Inter'] text-[14px] font-light leading-relaxed text-white/50 md:text-[15px]">
                    For the brand story, founders, and quiet-luxury philosophy, visit{' '}
                    <Link to="/about" className="text-[#D4AF37] underline decoration-[#D4AF37]/40 underline-offset-4 transition-colors hover:text-[#E5C75A]">
                        About us
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
});
