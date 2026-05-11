import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ClinicalNatureHero } from '@/shared/components/ClinicalNatureHero';
import { AboutCircleTimeline } from './AboutCircleTimeline';
import { AboutMissionVisionSection } from './AboutMissionVisionSection';
import { AboutJourneyCtaSection } from './components/AboutJourneyCtaSection';
import { AboutLegacySection } from './components/AboutLegacySection';
import { AboutFoundersSection } from './components/AboutFoundersSection';
import { AboutSynergySection } from './components/AboutSynergySection';
import { AboutQuoteSection } from './components/AboutQuoteSection';
import { AboutStatsSection } from './components/AboutStatsSection';
import { AboutSciencePhilosophySection } from './components/AboutSciencePhilosophySection';

export function AboutPage() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#science-philosophy') {
            const el = document.getElementById('science-philosophy');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.hash]);

    return (
        <div
            className="about-container min-h-screen overflow-x-clip bg-[#0B0B0B] text-white selection:bg-[#D4AF37] selection:text-black"
        >
            <div className="relative z-10 w-full">
                <ClinicalNatureHero
                    variant="about"
                    contentMode="about-story"
                    backgroundSrc="/assets/about_bg.webp"
                    sectionId="about-clinical-hero"
                />

                <AboutLegacySection />
                <AboutFoundersSection />
                <AboutSynergySection />
                <AboutSciencePhilosophySection />
                <AboutCircleTimeline />
                <AboutStatsSection />
                <AboutQuoteSection />
                <AboutMissionVisionSection />
                <AboutJourneyCtaSection />
            </div>
        </div>
    );
}
