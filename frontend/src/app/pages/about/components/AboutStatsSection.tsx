import { memo } from 'react';
import { ABOUT_STATS } from './aboutConstants';

export const AboutStatsSection = memo(function AboutStatsSection() {
    return (
        <section className="stats-section border-y border-white/5 overflow-hidden bg-[#09150E]/80 py-8 backdrop-blur-sm md:py-10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 text-center md:gap-10 lg:grid-cols-4 lg:gap-12">
                {ABOUT_STATS.map((stat) => (
                    <div key={stat.id} className="space-y-2 md:space-y-3">
                        <div className="font-['Gloock'] text-4xl tracking-tighter text-white md:text-5xl lg:text-6xl">
                            <span className="inline-block">{stat.num}</span>
                            <span className="font-light text-white">{stat.suffix}</span>
                        </div>
                        <div className="font-['Inter'] text-[10px] font-normal uppercase tracking-[0.22em] text-[#C6A85B]/90 md:text-[11px]">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
});
