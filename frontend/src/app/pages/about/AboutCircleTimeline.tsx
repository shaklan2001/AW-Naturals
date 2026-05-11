import { useRef, useState, useEffect } from 'react';
import { ABOUT_ORBIT_LAYOUT, ABOUT_ORBIT_STEPS } from './components/aboutConstants';
import { AboutOrbitCard } from './components/AboutOrbitCard';
import { buildAboutOrbitStyleBlock } from './components/aboutOrbitStyles';

const { STAGE, RADIUS_X, RADIUS_Y, ROTATION_DEG, DURATION_SEC, CROP_MIN_H, CROP_MAX_H, CROP_VW } =
    ABOUT_ORBIT_LAYOUT;
const CX = STAGE / 2;
const CY = STAGE / 2;

const orbitPath = `ellipse(${RADIUS_X}px ${RADIUS_Y}px at 50% 50%)`;

const goldText =
    'bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(198,168,91,0.28)]';

const STEP_COUNT = ABOUT_ORBIT_STEPS.length;

export function AboutCircleTimeline() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scale = `min(1, calc(100vw / ${STAGE + 64}))`;

    return (
        <section
            ref={sectionRef}
            className="relative z-[12] w-full overflow-x-clip bg-[#050a08] py-8 sm:py-12 md:py-16"
            aria-labelledby="about-orbit-heading"
        >
            <style>{buildAboutOrbitStyleBlock(orbitPath)}</style>

            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: `
                        linear-gradient(180deg, #07140f 0%, #030806 50%, #000000 100%),
                        radial-gradient(ellipse 72% 58% at 50% 48%, rgba(15, 80, 35, 0.12) 0%, transparent 58%)
                    `
                        .replace(/\s+/g, ' ')
                        .trim(),
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '160px 160px',
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-4 pt-1 text-center md:px-12 md:pb-5">
                <div className="mx-auto flex max-w-3xl flex-col items-center space-y-4 md:space-y-6">
                    <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85 md:text-[11px] md:tracking-[0.36em]">
                        Core values
                    </p>
                    <h2
                        id="about-orbit-heading"
                        className="font-['Gloock'] text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.08] tracking-tight text-white md:text-[clamp(2rem,3.5vw,3rem)]"
                        style={{ fontWeight: 400 }}
                    >
                        Our Core <span className={goldText}>Values</span>
                    </h2>
                    <p className="font-['Inter'] max-w-xl text-[15px] sm:text-[17px] md:text-[19px] font-light leading-relaxed text-white/70">
                        Where philosophy meets formulation — and every product line reflects the same clinical spine.
                    </p>
                </div>
            </div>

            {isMobile ? (
                /* Premium Mobile Vertical Timeline Stack */
                <div className="relative z-10 mx-auto mt-10 flex flex-col px-6 max-w-md w-full pb-8">
                    <div className="relative w-full flex flex-col gap-8 pl-8 border-l border-dashed border-white/20">
                        {ABOUT_ORBIT_STEPS.map((step) => (
                            <div key={step.id} className="relative w-full z-10">
                                {/* Connection dot on the dashed line */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#C6A85B] bg-[#C6A85B] z-20 shadow-[0_0_8px_rgba(198,168,91,0.5)]"
                                    style={{ left: '-37px' }}
                                />
                                
                                <article
                                    className="w-full rounded-[1.15rem] border border-white/10 px-5 py-4 shadow-[0_16px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(242,235,218,0.96) 0%, rgba(226,214,182,0.98) 100%)',
                                        boxShadow: '0 16px 36px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
                                    }}
                                >
                                    <h3
                                        className="font-['Gloock'] text-[1.2rem] leading-[1.15] tracking-tight text-[#141210]"
                                        style={{ fontWeight: 500 }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 font-['Inter'] text-[12px] font-normal leading-relaxed text-[#2a2620]/90">
                                        {step.body}
                                    </p>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Desktop Rotating Ellipse Orbit Layout */
                <div
                    className="relative z-10 mx-auto mb-1 w-full max-w-[min(100%,calc(100vw-12px))] overflow-visible sm:mb-2"
                    style={{
                        height: `clamp(${CROP_MIN_H}px, ${CROP_VW}vw, ${CROP_MAX_H}px)`,
                    }}
                >
                    <div
                        className="absolute left-1/2 top-1/2 overflow-visible"
                        style={{ transform: 'translate(-50%, -50%)' }}
                    >
                        <div
                            className="relative overflow-visible"
                            style={{
                                width: STAGE,
                                height: STAGE,
                                transform: `scale(${scale})`,
                                transformOrigin: 'center center',
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 z-20"
                                style={{
                                    transform: `rotate(${ROTATION_DEG}deg)`,
                                    transformOrigin: 'center center',
                                }}
                            >
                                <svg
                                    className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
                                    viewBox={`0 0 ${STAGE} ${STAGE}`}
                                    aria-hidden
                                >
                                    <ellipse
                                        cx={CX}
                                        cy={CY}
                                        rx={RADIUS_X}
                                        ry={RADIUS_Y}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.28)"
                                        strokeWidth="2"
                                        strokeDasharray="10 14"
                                        vectorEffect="nonScalingStroke"
                                    />
                                </svg>

                                {ABOUT_ORBIT_STEPS.map((step, i) => (
                                    <AboutOrbitCard
                                        key={step.id}
                                        step={step}
                                        phasePct={(i * 100) / STEP_COUNT}
                                        delaySec={(-DURATION_SEC * i) / STEP_COUNT}
                                        rotationDeg={ROTATION_DEG}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
