import { AboutSciencePhilosophySection } from '../about/components/AboutSciencePhilosophySection';
import { SciencePhilosophyHero, SCIENCE_PAGE_HEADING_ID } from './SciencePhilosophyHero';
import { Link } from 'react-router';
import { PremiumGoldCtaLink } from '../../components/PremiumGoldCtaButton';

export function SciencePhilosophyPage() {
    return (
        <div className="min-h-screen overflow-x-clip bg-[#0B0B0B] text-white selection:bg-[#D4AF37] selection:text-black">
            <SciencePhilosophyHero />
            <AboutSciencePhilosophySection cardsOnly ariaLabelledBy={SCIENCE_PAGE_HEADING_ID} />
            <section className="relative z-10 bg-[#0B0B0B] px-6 py-16 md:py-20">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                    <p className="font-['Inter'] text-[15px] font-light leading-relaxed text-white/60 md:text-[16px]">
                        Ready to align products and care with your biology? Book a specialized consultation or reach
                        our team directly.
                    </p>
                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                        <PremiumGoldCtaLink to="/services" className="min-w-[200px] justify-center sm:inline-flex">
                            Services & programs
                        </PremiumGoldCtaLink>
                        <Link
                            to="/contact"
                            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/15 px-8 font-['Inter'] text-[14px] font-medium tracking-wide text-white/85 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
