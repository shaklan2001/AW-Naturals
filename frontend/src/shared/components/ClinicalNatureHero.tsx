import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ArrowUpRight, Leaf } from 'lucide-react';

const SITE_GOLD = '#C9A84C';
const HOME_BG = '/assets/home_page.webp';

const heroStoryDisplay =
    "font-['Cormorant_Garamond',serif] italic font-semibold [font-size:clamp(2.5rem,7vw,5rem)] md:[font-size:clamp(6vw,7.5vw,9vw)] leading-[0.95] tracking-[-0.02em] text-[#FAF6ED] drop-shadow-xl [text-shadow:0_2px_28px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.85)]";

const storyTaglineClass =
    "font-['Inter'] text-[clamp(11px,1.5vw,14px)] font-normal uppercase leading-relaxed tracking-[0.25em] text-[#FAF6ED]/72 md:tracking-[0.3em] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]";

export type ClinicalNatureHeroProps = {
    sectionId?: string;
    variant?: 'about' | 'home';
    blendBottomColor?: string;
    contentMode?: 'clinical' | 'about-story';
    backgroundSrc?: string;
};

export function ClinicalNatureHero({
    sectionId = 'clinical-nature-hero',
    variant = 'about',
    blendBottomColor,
    contentMode = 'clinical',
    backgroundSrc,
}: ClinicalNatureHeroProps) {
    const rootRef = useRef<HTMLElement>(null);
    const blendEnd = blendBottomColor ?? '#0B0B0B';
    const isHome = variant === 'home';
    const isStory = contentMode === 'about-story';
    const bgUrl = backgroundSrc ?? (isHome ? HOME_BG : '/assets/story_bg.webp');

    /* ─── Entry fade-in animations only ─── */
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(root);
            if (!isStory) {
                gsap.fromTo(q('.cnh-h-line1'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.06 });
                gsap.fromTo(q('.cnh-h-line2'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.05, ease: 'power2.out', delay: 0.14 });
                gsap.fromTo(q('.cnh-aside-left'), { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.95, ease: 'power2.out', delay: 0.22 });
                gsap.fromTo(q('.cnh-aside-right'), { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.95, ease: 'power2.out', delay: 0.22 });
                gsap.fromTo(q('.cnh-cta-wrap'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.3 });
            } else {
                const eyebrow = q('.cnh-about-eyebrow');
                if (eyebrow.length) gsap.fromTo(eyebrow, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out', delay: 0.04 });
                gsap.fromTo(q('.cnh-story-part1'), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.15, ease: 'power3.out', delay: 0.08 });
                gsap.fromTo(q('.cnh-story-part2'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.15, ease: 'power3.out', delay: 0.08 });
                gsap.fromTo(q('.cnh-story-tagline'), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', delay: 0.32 });
            }
        }, root);
        return () => ctx.revert();
    }, [variant, contentMode, backgroundSrc, isStory]);

    /* Only the very bottom edge fades to black to merge into next section */
    const bottomFade = `linear-gradient(to bottom, transparent 60%, ${blendEnd} 100%)`;

    return (
        <section
            ref={rootRef}
            id={sectionId}
            data-variant={variant}
            data-content={contentMode}
            style={{ backgroundColor: blendEnd }}
            className={`cnh-root relative z-[15] flex min-h-[100svh] w-full flex-col overflow-x-clip overflow-y-clip ${isHome ? 'cnh-root--home' : ''
                }`}
        >
            {/* ── BG image ── */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={bgUrl}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover ${isHome
                            ? 'object-[50%_92%] sm:object-[50%_80%] lg:object-[50%_92%] xl:object-bottom'
                            : 'object-[center_70%]'
                        }`}
                />
            </div>

            {/* ── About hero: cool blue wash + light blur so headline stays legible ── */}
            {isStory && (
                <div
                    className="pointer-events-none absolute inset-0 z-[7] backdrop-blur-[4px] sm:backdrop-blur-[6px]"
                    style={{
                        background:
                            'linear-gradient(165deg, rgba(15, 27, 46, 0.4) 0%, rgba(12, 22, 38, 0.32) 42%, rgba(8, 11, 18, 0.52) 100%), radial-gradient(ellipse 95% 65% at 50% 32%, rgba(36, 72, 112, 0.14) 0%, transparent 62%)',
                    }}
                    aria-hidden
                />
            )}

            {/* ── Minimal bottom-only fade to merge into next section ── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[11]"
                style={{ height: '28vh', background: bottomFade }}
                aria-hidden
            />

            {/* ════════════════════════
                ABOUT-STORY variant
            ════════════════════════ */}
            {isStory && (
                <div className="relative z-10 flex min-h-[100svh] w-full flex-1 flex-col items-center justify-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 md:px-12 md:pt-36">
                    <p className="cnh-about-eyebrow mb-6 text-center font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]/90 md:mb-8 md:text-[11px] md:tracking-[0.4em]">
                        About AW Naturals
                    </p>
                    <div className="mx-auto flex w-full max-w-[min(100%,860px)] flex-col items-center text-center lg:max-w-[900px]">
                        <h1 className={`${heroStoryDisplay} flex flex-col items-center gap-y-2 md:gap-y-4`}>
                            <span className="cnh-story-part1 block will-change-transform">
                                The Intersection of{' '}
                                <span style={{ color: SITE_GOLD }}>Heritage</span>
                            </span>
                            <span className="cnh-story-part2 block will-change-transform">
                                and{' '}
                                <span style={{ color: SITE_GOLD }}>Human Potential.</span>
                            </span>
                        </h1>
                        <p className={`cnh-story-tagline ${storyTaglineClass} mt-10 max-w-2xl px-2 sm:mt-14 will-change-transform`}>
                            Philosophy · formulation expertise · forty years of clinical care
                            <span className="mt-3 block text-[#C9A84C]/80">
                                distilled into every ritual we craft.
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* ════════════════════════
                HOME / CLINICAL variant
            ════════════════════════ */}
            {!isStory && (
                <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-between px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 md:px-10 md:pb-20 md:pt-36">

                    {/* Left aside — absolute, vertically centered */}
                    <aside
                        className="cnh-aside-left pointer-events-none absolute left-5 top-1/2 z-[5] hidden max-w-[11rem] -translate-y-1/2 md:block lg:left-10 lg:max-w-[14rem]"
                        aria-hidden
                    >
                        <p
                            className="whitespace-pre-line font-['Inter'] text-[11px] font-semibold leading-relaxed tracking-wide md:text-xs"
                            style={{ color: SITE_GOLD }}
                        >
                            {`Doctor Formulated | Nutritionist Approved\n40+ Years of Expertise`}
                        </p>
                    </aside>

                    {/* Right aside — absolute, vertically centered */}
                    <aside
                        className="cnh-aside-right absolute right-5 top-1/2 z-[5] hidden -translate-y-1/2 md:block lg:right-10"
                    >
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex max-w-[11rem] flex-col items-end gap-1.5 text-right text-[11px] font-semibold leading-snug md:text-xs" style={{ color: SITE_GOLD }}>
                                <Leaf className="h-[15px] w-[15px] shrink-0" style={{ color: SITE_GOLD }} strokeWidth={1.5} aria-hidden />
                                <p>Caffeine Free. Every Sip.</p>
                            </div>
                            {/* Circular arrow button — gold */}
                            <Link
                                to="/products"
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                                style={{ backgroundColor: SITE_GOLD, color: '#0A1F14' }}
                                aria-label="Shop products"
                            >
                                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                            </Link>
                        </div>
                    </aside>

                    {/* Heading — pushed to the top area (above the product box in image) */}
                    <div className="mx-auto w-full max-w-4xl px-2 text-center sm:px-4">
                        <h1 className="font-['Noto_Serif',serif] text-[#FAF6ED] drop-shadow-xl">
                            <span
                                className="cnh-h-line1 block font-normal leading-tight tracking-tight"
                                style={{ fontSize: 'clamp(1.1rem,3.8vw,1.7rem)', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                            >
                                Elevating Your Daily Rituals for
                            </span>
                            <span
                                className="cnh-h-line2 mt-1 block font-bold leading-[1.05] tracking-tight md:mt-2"
                                style={{ fontSize: 'clamp(2.9rem,10.8vw,5rem)', textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}
                            >
                                Ultimate Well-Being
                            </span>
                        </h1>
                    </div>

                    {/* Spacer so CTA stays at bottom */}
                    <div className="flex-1" />

                    {/* Bottom gold CTA */}
                    <div className="cnh-cta-wrap z-[6] flex justify-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 rounded-full font-['Inter'] text-sm font-semibold tracking-wide transition-all duration-300 hover:brightness-110 sm:text-base"
                            style={{
                                backgroundColor: SITE_GOLD,
                                color: '#0A1F14',
                                padding: '14px 44px',
                                boxShadow: `0 8px 30px rgba(201,168,76,0.45), 0 0 0 1px rgba(201,168,76,0.3)`,
                            }}
                        >
                            Shop the Collection
                            <span aria-hidden className="translate-x-0.5">→</span>
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
