import { memo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ClinicalGoldText } from './clinicalGoldText';

export const AboutJourneyCtaSection = memo(function AboutJourneyCtaSection() {
    return (
        <section className="cta-section relative z-20 mx-auto flex max-w-4xl flex-col items-center bg-[#0B0B0B] px-6 py-32 pb-28 text-center md:py-40 md:pb-32">
            <h2 className="mb-12 font-['Gloock'] text-5xl leading-tight text-[#F5F5DC] md:mb-16 md:text-7xl lg:text-8xl">
                Your Journey To <br />
                <ClinicalGoldText>Clinical Wellness</ClinicalGoldText>
            </h2>
            <Link to="/find-your-blend">
                <button
                    type="button"
                    className="group relative overflow-hidden rounded-full px-6 py-3.5 sm:px-12 sm:py-4 font-['Inter'] text-sm sm:text-[18px] tracking-[0.02em] text-[#0B0B0B] transition-all duration-300"
                    style={{ fontWeight: 500, background: 'linear-gradient(90deg, #C6A85B, #E5D08A)' }}
                >
                    <div
                        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ boxShadow: '0 0 24px rgba(212,175,55,0.4)' }}
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 2, ease: 'linear' }}
                        className="pointer-events-none absolute left-0 top-0 z-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                            width: '40%',
                            height: '100%',
                            transform: 'skewX(-20deg)',
                        }}
                    />
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                        Find Your Wellness Blend
                        <svg
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </span>
                </button>
            </Link>
        </section>
    );
});
