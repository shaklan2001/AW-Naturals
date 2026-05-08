import { motion } from 'motion/react';
import { ABOUT_MISSION_VISION } from './components/aboutConstants';
import { MissionVisionCardColumn } from './components/MissionVisionCardColumn';

export function AboutMissionVisionSection() {
    return (
        <section
            className="relative z-[15] overflow-hidden bg-[#0B0B0B] py-20 md:py-28"
            aria-labelledby="about-mission-vision-heading"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 text-center md:mb-16"
                >
                    <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85 md:text-[11px]">
                        Purpose & direction
                    </p>
                    <h2
                        id="about-mission-vision-heading"
                        className="mt-3 font-['Cormorant_Garamond',serif] font-semibold text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight text-[#F5F5DC] md:mt-4 md:text-[clamp(2rem,3.5vw,3rem)]"
                        style={{ fontWeight: 600 }}
                    >
                        Mission & Vision
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
                    {ABOUT_MISSION_VISION.map((item, index) => (
                        <MissionVisionCardColumn key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
