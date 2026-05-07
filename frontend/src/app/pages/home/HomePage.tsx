import { TrustStrip } from '../../components/TrustStrip';
import { ProductShowcase } from '../../components/ProductShowcase';
import { ExpertiseSection } from '../../components/ExpertiseSection';
import { BundleSection } from '../../components/BundleSection';
import { BrewingRitual } from '../../components/BrewingRitual';
import { Testimonials } from '../../components/Testimonials';
import { FaqSection } from '../../components/FaqSection';
import { WellnessQuiz } from '../wellness/components/WellnessQuiz';
import { HomeCarouselHero } from './components/HomeCarouselHero';
import { MainHero } from './components/MainHero';

export function HomePage() {
    return (
        <div className="min-h-screen bg-[#0B0B0B]">
            <MainHero />
            <TrustStrip />
            <ExpertiseSection />
            <ProductShowcase />
            <WellnessQuiz />
            <BrewingRitual />
            <HomeCarouselHero />
            <BundleSection />
            <Testimonials />
            <FaqSection />
        </div>
    );
}
